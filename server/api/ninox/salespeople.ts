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
  
  console.log('Searching salespeople with term:', searchTerm);
  
  try {
    // Query to get salespeople
    const searchQuery = `
      let searchTerm := "${searchTerm}"; 
      let staff := (select Staff)[
          contains(upper('First Name'), upper(searchTerm))
      ];
      staff.'Staff ID'
    
    `;
    
    console.log('Executing search query for staff IDs:', searchQuery);
    
    // Make the API request to get matching staff IDs
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
    
    const staffIds = response.data || [];
    console.log(`Found ${staffIds.length} staff IDs`, staffIds);
    
    // If we found IDs, fetch the complete records
    if (staffIds.length > 0) {
      const staffData = [];
      
      // Fetch each staff record using the correct field ID
      for (const staffId of staffIds) {
        try {
          const recordResponse = await axios.post(
            `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Staff/record`,
            { 
              filters: { 
                "L": staffId  
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
            // Log the first staff member's field names to help identify structure
            if (staffData.length === 0) {
              console.log('First staff fields:', Object.keys(recordResponse.data.fields || {}));
              console.log('Sample staff data:', JSON.stringify(recordResponse.data.fields, null, 2));
            }
            
            // Include staff regardless of status - we'll handle filtering in the frontend if needed
            // This ensures we don't miss staff members due to differences in status field names
            staffData.push({
              id: recordResponse.data.id || '',
              fields: recordResponse.data.fields || {}
            });
            console.log(`Successfully fetched staff member with ID: ${staffId}`);
          }
        } catch (err) {
          console.error(`Error fetching record for Staff ID ${staffId}:`, err.message);
        }
      }
      
      console.log(`Successfully fetched data for ${staffData.length} staff members`);
      
      // Sort staff by name
      const sortedResults = staffData.sort((a, b) => {
        try {
          const nameA = `${a.fields['First Name'] || ''} ${a.fields['Last Name'] || ''}`.trim().toLowerCase();
          const nameB = `${b.fields['First Name'] || ''} ${b.fields['Last Name'] || ''}`.trim().toLowerCase();
          return nameA.localeCompare(nameB);
        } catch (err) {
          console.error('Error sorting staff:', err);
          return 0;
        }
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedResults = sortedResults.slice(startIndex, endIndex);
      
      return { 
        success: true, 
        salespeople: paginatedResults,
        pagination: {
          total: sortedResults.length,
          page,
          limit,
          totalPages: Math.ceil(sortedResults.length / limit)
        }
      };
    } else {
      // No staff found
      return { 
        success: true, 
        salespeople: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          totalPages: 0
        },
        message: searchTerm ? 'No salespeople found matching your search. Try a different term.' : 'No salespeople found in the system.'
      };
    }
  } catch (error) {
    console.error('Error searching salespeople:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch salespeople';
    
    return {
      success: false,
      error: errorMessage
    };
  }
});
