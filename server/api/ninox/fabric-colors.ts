import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const fabricId = query.fabricId;
    const searchTerm = query.search || '';
    const page = parseInt(query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    // Get environment variables from Nuxt runtime config
    const config = useRuntimeConfig();
    const NINOX_API_TOKEN = config.ninoxApiKey;
    const NINOX_TEAM_ID = config.ninoxTeamId;
    const NINOX_DATABASE_ID = config.ninoxDatabaseId;
    
    if (!fabricId) {
      return {
        success: false,
        error: 'Fabric ID is required'
      };
    }
    
    // First, get the fabric details to find the collection name
    const fabricResponse = await axios.get(
      `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Fabrics/records/${fabricId}`,
      {
        headers: {
          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    const fabricData = fabricResponse.data;
    const collectionName = fabricData.fields['Public Name'] || '';
    
    console.log('Found fabric collection name:', collectionName);
    
    if (!collectionName) {
      return { 
        success: true,
        colors: [], 
        hasMore: false,
        message: 'No collection name found for this fabric'
      };
    }
    
    // Build the query for finding colors by collection
    let searchQuery;
    if (searchTerm) {
      searchQuery = `
        let searchTerm := "${searchTerm}";
        let colours := (select 'Fabric-Colours')[
          'Collection Name' = "${collectionName}"
        ];
        colours.'Colour-ID'
      `;
    } else {
      searchQuery = `
        let colours := (select 'Fabric-Colours')['Collection Name' = "${collectionName}"];
        colours.'Colour-ID'
      `;
    }
    
    console.log('Executing color search query:', searchQuery);
    
    // Get color IDs matching our criteria
    const colorIdsResponse = await axios.post(
      `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`,
      { query: searchQuery },
      {
        headers: {
          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    const colorIds = colorIdsResponse.data || [];
    console.log(`Found ${colorIds.length} color IDs matching criteria`);
    
    // Apply pagination to the IDs first to reduce API calls
    const paginatedColorIds = colorIds.slice(offset, offset + limit);
    const hasMore = colorIds.length > offset + limit;
    
    // Fetch detailed records for the paginated IDs
    const colors = [];
    for (const colorId of paginatedColorIds) {
      try {
        const colorResponse = await axios.post(
          `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Fabric-Colours/record`,
          { 
            filters: { 
              "O": colorId
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
        
        if (colorResponse.data) {
          const fields = colorResponse.data.fields || {};
          
          // Map the fields to our expected structure
          const colorData = {
            id: colorResponse.data.id,
            fields: {
              'Color Name': fields['Color Name'] || '',
              'Color Hex': fields['Color Hex'] || '',
              'Collection Name': fields['Collection Name'] || '',
              'Color Category': fields['Color Category'] || '',
              'Color Specific': fields['Color (Specific)'] || '',
              'Color ID': fields['Colour-ID'] || colorResponse.data.id
            }
          };
          
          colors.push(colorData);
        }
      } catch (err) {
        console.error(`Error fetching record for Color ID ${colorId}:`, err);
      }
    }
    
    return {
      success: true,
      colors: colors,
      hasMore: hasMore,
      total: colorIds.length
    };
    
  } catch (error) {
    console.error('Error fetching fabric colors:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to fetch fabric colors'
    };
  }
});