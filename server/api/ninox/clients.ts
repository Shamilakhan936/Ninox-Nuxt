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
      
      // Fetch each client record using the correct endpoint format
      for (const clientId of clientIds) {
        try {
          // Get the client record using the POST /record endpoint
          const recordResponse = await axios.post(
            `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Customers/record`,
            { 
              filters: { 
                "Customer ID": clientId  // Use the field name as it appears in Ninox
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
            // Create a complete client object
            clientsData.push({
              id: recordResponse.data.id || '',
              fields: recordResponse.data.fields || {}
            });
            console.log(`Successfully fetched client with Customer ID: ${clientId}`);
          }
        } catch (err) {
          console.error(`Error fetching record for Customer ID ${clientId}:`, err.message);
          
          // Log detailed error information if available
          if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Response data:', err.response.data);
          }
        }
      }
      
      console.log(`Successfully fetched data for ${clientsData.length} clients`);
      
      // If we couldn't find any clients with the detailed approach, try a different field ID
      if (clientsData.length === 0) {
        console.log("No clients found with 'Customer ID' field, trying alternative field names...");
        
        // Try with different field IDs based on schema
        const possibleFieldNames = ['K', 'Customer ID', 'CustomerID', 'ID', 'customer_id'];
        
        for (const fieldName of possibleFieldNames) {
          for (const clientId of clientIds) {
            try {
              console.log(`Trying with field name: ${fieldName} = ${clientId}`);
              
              const recordResponse = await axios.post(
                `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Customers/record`,
                { 
                  filters: { 
                    [fieldName]: clientId
                  } 
                },
                {
                  headers: {
                    'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                    'Content-Type': 'application/json',
                  }
                }
              );
              
              if (recordResponse.data) {
                clientsData.push({
                  id: recordResponse.data.id || '',
                  fields: recordResponse.data.fields || {}
                });
                console.log(`Success with field name: ${fieldName}`);
                
                // If we found a working field name, use it for all remaining records
                for (let j = clientIds.indexOf(clientId) + 1; j < clientIds.length; j++) {
                  try {
                    const nextResponse = await axios.post(
                      `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Customers/record`,
                      { 
                        filters: { 
                          [fieldName]: clientIds[j]
                        } 
                      },
                      {
                        headers: {
                          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                          'Content-Type': 'application/json',
                        }
                      }
                    );
                    
                    if (nextResponse.data) {
                      clientsData.push({
                        id: nextResponse.data.id || '',
                        fields: nextResponse.data.fields || {}
                      });
                    }
                  } catch (innerErr) {
                    console.error(`Error with field name ${fieldName} for ID ${clientIds[j]}:`, innerErr.message);
                  }
                }
                
                // Break out of both loops since we found a working field name
                break;
              }
            } catch (fieldErr) {
              console.error(`Failed with field name ${fieldName}:`, fieldErr.message);
            }
          }
          
          // If we found clients with this field name, stop trying others
          if (clientsData.length > 0) {
            break;
          }
        }
      }
      
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
