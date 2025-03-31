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
      const body = await readBody(event);
      console.log('Received order request:', JSON.stringify(body, null, 2));

      // STEP 1: Handle customer creation or selection
      let customerId;
      
      if (body.isExistingCustomer) {
        // Use existing customer
        customerId = body.selectedCustomerId;
        console.log(`Using existing customer with ID: ${customerId}`);
      } else {
        // Create new customer
        const customerID = Math.floor(Math.random() * 100000).toString();
        
        const newCustomerBody = [{
          fields: {
            'First Name': body.customerFirstName,
            'Last Name': body.customerLastName,
            'Email Address': body.customerEmail,
            'Phone Number': body.customerPhone,
            'Company': body.company || '',
            'Customer ID': customerID
          }
        }];

        console.log('Creating new customer:', JSON.stringify(newCustomerBody, null, 2));
        
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

      // STEP 2: Create the main order
      const orderBody = [{
        fields: {
          'Status': 1, // New order status
          'Date Order Created': new Date().toISOString().split('T')[0], // today's date
          'Customer': customerId, // Direct ID for relationship
          // 'Salesperson': body.selectedSalespersonId || null, // Add salesperson relationship
          'Fulfillment': body.installationRequired ? 1 : 3, // 1 for installation, 3 for pickup/delivery
          'Customer Location': body.installationRequired ? body.installationAddress : body.country,
          'Notes': body.specialInstructions || ''
        }
      }];

      console.log('Creating order:', JSON.stringify(orderBody, null, 2));
      
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

      // STEP 3: Create order items
      if (body.items && body.items.length > 0) {
        // Map order items to Ninox format
        const orderItems = body.items.map(item => ({
          fields: {
            'Orders': orderId, // Direct ID for relationship to order
            'Status': 1, // New item status
            'Product Type': item.productType,
            'Width': Number(item.width),
            'Height': Number(item.height),
            'Qty': Number(item.quantity),
            'Order Item Id': Math.floor(Math.random() * 900000000 + 100000000).toString(),
            // 'Is Motorized': item.isMotorized ? 2 : 1, // 1 for No, 2 for Yes
            // 'Control Side': item.controlSide || null, // Make sure this matches your Ninox field name exactly
            'Fabric': item.fabricId || null, // Make sure this matches your Ninox field name for fabric selection
            // 'Chain Type': item.chainType || null,
            // 'Motor Type': item.motorType || null,
            // 'Notes': item.notes || ''
          }
        }));

        console.log('Creating order items:', JSON.stringify(orderItems, null, 2));
        
        const orderItemsResponse = await axios.post(
          `https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${ORDER_ITEMS_TABLE}/records`,
          orderItems,
          {
            headers: {
              'Authorization': `Bearer ${NINOX_API_TOKEN}`,
              'Content-Type': 'application/json',
            }
          }
        );

        console.log('Order items creation response:', JSON.stringify(orderItemsResponse.data, null, 2));

        return {
          success: true,
          data: {
            order: orderResponse.data[0],
            orderItems: orderItemsResponse.data,
            customerId: customerId
          },
          message: 'Order created successfully with items'
        };
      } else {
        return {
          success: true,
          data: {
            order: orderResponse.data[0],
            customerId: customerId
          },
          message: 'Order created successfully but no items were added'
        };
      }
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return {
        success: false,
        error: error.response?.data || error.message || 'Failed to create order'
      };
    }
  }

  return { success: false, error: 'Method not supported' };
});