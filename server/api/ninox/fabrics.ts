import { defineEventHandler, getQuery, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  // Get query parameters for pagination
  const query = getQuery(event);
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const productType = query.productType ? String(query.productType) : null;
  
  // Get request body for search term
  const body = await readBody(event);
  const searchTerm = body.search ? String(body.search) : '';
  
  // Get environment variables from Nuxt runtime config
  const config = useRuntimeConfig();
  const NINOX_API_TOKEN = config.ninoxApiKey;
  const NINOX_TEAM_ID = config.ninoxTeamId;
  const NINOX_DATABASE_ID = config.ninoxDatabaseId;
  
  console.log('Searching fabrics with term:', searchTerm);
  console.log('For product type:', productType);
  
  try {
    // Query to get fabrics based on product type and search term
    let fabricsQuery = '';
    
    if (productType) {
      // Filter fabrics based on product type and search term
      fabricsQuery = `
        let searchTerm := "${searchTerm}"; 
        let fabrics := (select Fabrics)[
                contains(upper('Public Name'), upper(searchTerm))
            
        ];
        fabrics.'Fabric ID'
      `;
    } else if (searchTerm) {
      // Filter fabrics based on search term only
      fabricsQuery = `
        let searchTerm := "${searchTerm}"; 
        let fabrics := (select Fabrics)[
            contains(upper('Public Name'), upper(searchTerm))
        ];
        fabrics.'Fabric ID'
      `;
    } else {

      fabricsQuery = `
        let fabrics := (select Fabrics);
        fabrics.'Fabric ID'
      `;
    }
    
    console.log('Executing search query for fabric IDs:', fabricsQuery);
    
    // Make the API request to get matching fabric IDs
    const response = await axios.post(
      `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`,
      { query: fabricsQuery },
      {
        headers: {
          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const fabricIds = response.data || [];
    console.log(`Found ${fabricIds.length} fabric IDs matching criteria`);
    
    // If we found IDs, fetch the complete records
    if (fabricIds.length > 0) {
      const fabricsData = [];
      
      // Fetch each fabric record
      for (const fabricId of fabricIds) {
        try {
          const recordResponse = await axios.post(
            `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Fabrics/record`,
            { 
              filters: { 
                "X1": fabricId
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
          
          // Log the raw response to see the actual data structure
          console.log('Raw Ninox Response:', JSON.stringify(recordResponse.data, null, 2));
          
          if (recordResponse.data) {
            // First check if we have a valid response with fields
            const fields = recordResponse.data.fields || {};
            
            // Map the Ninox fields to our expected structure with null checks
            const fabricData = {
              id: recordResponse.data.id,
              fields: {
                'Fabric Name': fields['Public Name'] || '',
                'Fabric Type': fields['Transparancy'] || '',
                'Product Type': fields['Products'] || '',
                'Color Hex': fields['Color Hex'] || '',
                'Image URL': fields['Image'] || ''
              }
            };
            
            // Log the mapped data
            console.log('Mapped fabric data:', fabricData);
            
            // Only push if we have at least a name
            if (fabricData.fields['Fabric Name']) {
              fabricsData.push(fabricData);
            } else {
              console.warn(`Skipping fabric ID ${fabricId} due to missing name`);
            }
          }
        } catch (err) {
          console.error(`Error fetching record for Fabric ID ${fabricId}:`, err);
          console.error('Full error details:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
          });
        }
      }
      
      console.log(`Successfully fetched data for ${fabricsData.length} fabrics`);
      console.log(fabricsData);
      
      // Sort fabrics by name
      const sortedResults = fabricsData.sort((a, b) => {
        try {
          const nameA = a.fields['Fabric Name'] || '';
          const nameB = b.fields['Fabric Name'] || '';
          return nameA.localeCompare(nameB);
        } catch (err) {
          console.error('Error sorting fabrics:', err);
          return 0;
        }
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedResults = sortedResults.slice(startIndex, endIndex);
      
      return { 
        success: true, 
        fabrics: paginatedResults,
        pagination: {
          total: sortedResults.length,
          page,
          limit,
          totalPages: Math.ceil(sortedResults.length / limit)
        }
      };
    } else {
      // No fabrics found
      return { 
        success: true, 
        fabrics: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          totalPages: 0
        },
        message: searchTerm ? 'No fabrics found matching your search. Try a different term.' : 'No fabrics found for the selected product type.'
      };
    }
  } catch (error) {
    console.error('Error searching fabrics:', error);
    const errorMessage = (error as Error).message || 'Failed to fetch fabrics';
    
    return {
      success: false,
      error: errorMessage
    };
  }
});
