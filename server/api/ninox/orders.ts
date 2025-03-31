import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const config = useRuntimeConfig();
  const NINOX_API_TOKEN = config.ninoxApiKey;
  const NINOX_TEAM_ID = config.ninoxTeamId;
  const NINOX_DATABASE_ID = config.ninoxDatabaseId;
  
  // Table IDs
  const ORDERS_TABLE = 'Orders';
  const CUSTOMERS_TABLE = 'Customers';
  const ORDER_ITEMS_TABLE = 'Order Items';

  if (method === 'POST') {
    try {
      // For testing, let's use a simple body that specifies if we're using an existing customer
      const body = await readBody(event);
      console.log('Received request body:', JSON.stringify(body, null, 2));

      let customerId;
      
      // Test with both scenarios - new and existing customer
      if (body.useExistingCustomer) {
        // Use existing customer ID
        customerId = body.customerId; // This should be a valid customer ID from your database
      } else {
        // Create new customer
        const newCustomerBody = [{
          fields: {
            'First Name': 'Test',
            'Last Name': 'Customer',
            'Email Address': 'test@example.com',
            'Phone Number': '1234567890',
            'Customer ID': Math.floor(Math.random() * 100000).toString()
          }
        }];

        const customerResponse = await axios.post(
          `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${CUSTOMERS_TABLE}/records`,
          newCustomerBody,
          {
            headers: {
              'Authorization': `Bearer ${NINOX_API_TOKEN}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log('Customer creation response:', JSON.stringify(customerResponse.data, null, 2));
        customerId = customerResponse.data[0].id;
      }

      // Create order with proper customer relationship
      const orderBody = [{
        fields: {
          'Status': 1,
          'Date Order Created': new Date().toISOString().split('T')[0],
          'Customer': customerId  // Direct ID approach
        }
      }];

      console.log('Sending order data:', JSON.stringify(orderBody, null, 2));

      const orderResponse = await axios.post(
        `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${ORDERS_TABLE}/records`,
        orderBody,
        {
          headers: {
            'Authorization': `Bearer ${NINOX_API_TOKEN}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Order creation response:', JSON.stringify(orderResponse.data, null, 2));
      const orderId = orderResponse.data[0].id;

      // Create Order Items related to the Order
      // We'll create a test order item
      const orderItemBody = [{
        fields: {
          'Orders': orderId,  // Direct ID approach for relation
          'Product Type': 'Roller Shades',
          'Width': 1000,
          'Height': 1200,
          'Qty': 1,
          'Order Item Id': Math.floor(Math.random() * 900000000 + 100000000).toString(),
          'Control Position': 'Left'
        }
      }];

      console.log('Sending order item data:', JSON.stringify(orderItemBody, null, 2));

      const orderItemResponse = await axios.post(
        `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${ORDER_ITEMS_TABLE}/records`,
        orderItemBody,
        {
          headers: {
            'Authorization': `Bearer ${NINOX_API_TOKEN}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Order item creation response:', JSON.stringify(orderItemResponse.data, null, 2));

      return {
        success: true,
        data: {
          customer: customerId,
          order: orderResponse.data[0],
          orderItem: orderItemResponse.data[0]
        },
        message: 'Order and Order Items created successfully'
      };

    } catch (error) {
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return {
        success: false,
        error: error.response?.data || error.message || 'Internal server error'
      };
    }
  }

  return { success: false, error: 'Method not supported' };
});