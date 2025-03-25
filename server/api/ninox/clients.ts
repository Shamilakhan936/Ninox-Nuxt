import { defineEventHandler, getQuery, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  // Get query parameters for pagination
  const query = getQuery(event);
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  
  // Get request body for search term
  const body = await readBody(event);
  const searchTerm = body.search ? String(body.search) : '';
  
  // Get environment variables from Nuxt runtime config
  const config = useRuntimeConfig();
  const NINOX_API_TOKEN = config.ninoxApiKey;
  const NINOX_TEAM_ID = config.ninoxTeamId;
  const NINOX_DATABASE_ID = config.ninoxDatabaseId;
  
  console.log('Searching clients with term:', searchTerm);
  
  // If we don't have a search term, return an empty result
  if (!searchTerm || searchTerm.length < 3) {
    return { 
      success: true, 
      clients: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 0
      },
      message: 'Please enter at least 3 characters to search'
    };
  }
  
  try {
    // First, get the IDs of matching clients
    const searchQuery = `
    let searchTerm := "${searchTerm}"; 
    let cust := (select Customers)[
        contains(upper('First Name'), upper(searchTerm))
    ];
    cust.'Customer ID'
    `;
    
    console.log('Executing search query for client IDs:', searchQuery);
    
    // Make the API request to get matching customer IDs
    const response = await axios.post(
      `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`,
      { query: searchQuery },
      {
        headers: {
          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const clientIds = response.data || [];
    console.log(`Found ${clientIds.length} client IDs matching "${searchTerm}"`, clientIds);
    
    // If we found IDs, fetch the complete records
    if (clientIds.length > 0) {
      const clientsData = [];
      
      // Fetch each client record using the correct field ID 'K'
      for (const clientId of clientIds) {
        try {
          const recordResponse = await axios.post(
            `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Customers/record`,
            { 
              filters: { 
                "K": clientId  // Using the correct field ID from the start
              } 
            },
            {
              headers: {
                'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              params: {
                style: 'object',
                dateStyle: 'iso',
                choiceStyle: 'text'
              }
            }
          );
          
          if (recordResponse.data) {
            // Log the first client's field names to help identify where email is stored
            if (clientsData.length === 0) {
              console.log('First client fields:', Object.keys(recordResponse.data.fields || {}))
              console.log('Sample client data (first 3 fields):', 
                Object.entries(recordResponse.data.fields || {})
                  .slice(0, 3)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')
              )
            }
            
            clientsData.push({
              id: recordResponse.data.id || '',
              fields: recordResponse.data.fields || {}
            });
            console.log(`Successfully fetched client with ID: ${clientId}`);
          }
        } catch (err) {
          console.error(`Error fetching record for ID ${clientId}:`, err.message);
        }
      }
      
      console.log(`Successfully fetched data for ${clientsData.length} clients`);
      
      // Sort clients by name
      const sortedResults = clientsData.sort((a, b) => {
        try {
          const nameA = `${a.fields['First Name'] || ''} ${a.fields['Last Name'] || ''}`.trim().toLowerCase();
          const nameB = `${b.fields['First Name'] || ''} ${b.fields['Last Name'] || ''}`.trim().toLowerCase();
          return nameA.localeCompare(nameB);
        } catch (err) {
          console.error('Error sorting clients:', err);
          return 0;
        }
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedResults = sortedResults.slice(startIndex, endIndex);
      
      return { 
        success: true, 
        clients: paginatedResults,
        pagination: {
          total: sortedResults.length,
          page,
          limit,
          totalPages: Math.ceil(sortedResults.length / limit)
        }
      };
    } else {
      // No clients found
      return { 
        success: true, 
        clients: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          totalPages: 0
        },
        message: 'No clients found matching your search. Try a different term.'
      };
    }
  } catch (error) {
    console.error('Error searching clients:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch clients';
    
    return {
      success: false,
      error: errorMessage
    };
  }
});
