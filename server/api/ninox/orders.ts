import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  // Handle different HTTP methods
  const method = event.node.req.method;
  
  // Get environment variables from Nuxt runtime config
  const config = useRuntimeConfig();
  const NINOX_API_TOKEN = config.ninoxApiKey;
  const NINOX_TEAM_ID = config.ninoxTeamId;
  const NINOX_DATABASE_ID = config.ninoxDatabaseId;
  
  console.log('API Token (first few chars):', NINOX_API_TOKEN ? NINOX_API_TOKEN.substring(0, 5) + '...' : 'undefined');
  console.log('Team ID:', NINOX_TEAM_ID);
  console.log('Database ID:', NINOX_DATABASE_ID);
  
  // Update to the correct orders table ID
  const ordersTableId = 'A';
  
  if (method === 'POST') {
    try {
      const body = await readBody(event);
      console.log('Received order request:', JSON.stringify(body, null, 2));
      
      // Format the request body in Ninox's expected format
      const requestBody = [{
        _upsert: true,  // Create new record or update if exists
        fields: {
          "Customer Name": body.customerName,
          "Phone Number": body.phoneNumber,
          "Email": body.email,
          "Product Type": body.productType,
          "Material": body.material,
          "Width (mm)": body.width,
          "Drop (mm)": body.drop,
          "Quantity": body.quantity,
          "Control Side": body.controlSide,
          "Chain Type": body.chainType,
          "Notes": body.notes,
          "Order Date": new Date().toISOString(),
          "Status": "New"  // Default status for new orders
        }
      }];
      
      // If a client ID was provided, link this order to that client
      if (body.clientId) {
        requestBody[0].fields["Client"] = body.clientId;
      }
      
      console.log('Sending to Ninox:', JSON.stringify(requestBody, null, 2));
      console.log('Request URL:', `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${ordersTableId}/records`);
      
      try {
        const response = await axios.post(
          `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${ordersTableId}/records`, 
          requestBody, 
          {
            headers: {
              'Authorization': `Bearer ${NINOX_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log('Ninox response:', JSON.stringify(response.data, null, 2));
        
        return { 
          success: true, 
          data: response.data,
          message: 'Order created successfully' 
        };
      } catch (axiosError) {
        // Extract detailed error information from axios error
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Ninox API error response:');
          console.error('Status:', axiosError.response.status);
          console.error('Headers:', JSON.stringify(axiosError.response.headers, null, 2));
          console.error('Data:', JSON.stringify(axiosError.response.data, null, 2));
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error('Ninox API no response:', axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Ninox API request setup error:', axiosError.message);
        }
        
        // Re-throw to be caught by the outer catch
        throw axiosError;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response) {
        return { 
          success: false, 
          error: `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}` 
        };
      }
      return { 
        success: false, 
        error: error.message || 'Internal server error' 
      };
    }
  }

  return { success: false, error: 'Method not supported' };
});