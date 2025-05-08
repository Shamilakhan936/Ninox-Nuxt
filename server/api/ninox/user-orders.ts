// server/api/ninox/user-orders.ts
export default defineEventHandler(async (event) => {
  try {
    // Get runtime config for Ninox API credentials
    const config = useRuntimeConfig();
    const NINOX_API_TOKEN = config.ninoxApiKey;
    const NINOX_TEAM_ID = config.ninoxTeamId;
    const NINOX_DATABASE_ID = config.ninoxDatabaseId;
    
    // Verify we have the necessary config values
    if (!NINOX_API_TOKEN || !NINOX_TEAM_ID || !NINOX_DATABASE_ID) {
      console.error("Missing Ninox API configuration");
      return {
        statusCode: 500,
        body: { error: 'Ninox API configuration is incomplete' }
      };
    }
    
    // Get the email from the request body
    const body = await readBody(event);
    const userEmail = body?.email;
    
    if (!userEmail) {
      console.log("No email provided in request");
      return {
        statusCode: 400,
        body: { error: 'Email is required' }
      };
    }
    
    console.log(`Finding customer with email: ${userEmail}`);
    
    // Table IDs
    const customersTableId = "A"; // Customers table ID
    const ordersTableId = "I"; // Orders table ID
    const orderItemsTableId = "J"; // Order Items table ID
    
    try {
   
      const customerQuery = `
        let email := "${userEmail}";
        let customer := (select Customers where 'Email Address' = email);
      customer.'Customer ID'
      `;

      const customerQueryResponse = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: customerQuery
        })
      });
      
      console.log("Customer lookup response:", customerQueryResponse);
      
      // Check if we found a customer
      if (!customerQueryResponse || !Array.isArray(customerQueryResponse) || customerQueryResponse.length === 0) {
        console.log("No customer found with email:", userEmail);
        return { orders: [] }; // Return empty orders if no customer found
      }
      
      const customerId = customerQueryResponse[0];
      console.log(`Found customer ID: ${customerId}`);
      
      // Step 2: Get orders for this customer (using field ID 'K')
      const ordersQuery = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `(select Orders where CustomerID = "${customerId}")`
        })
      });
      
      console.log("Orders query response:", ordersQuery ? `Found ${Array.isArray(ordersQuery) ? ordersQuery.length : 0} orders` : "No orders found");
      
      // If we got order IDs, fetch details for each
      if (ordersQuery && Array.isArray(ordersQuery) && ordersQuery.length > 0) {
        console.log(`Found ${ordersQuery.length} orders for customer ${customerId}`);
        console.log(ordersQuery);
        
        const orders = [];
        
        for (const orderId of ordersQuery) {
          try {
            // Fetch order details
            const orderResponse = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${ordersTableId}/records/${orderId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!orderResponse || !orderResponse.fields) {
              continue; // Skip this order if no data returned
            }
            
            // Format the order
            const formattedOrder = {
              id: orderId,
              createdAt: orderResponse.fields['Date Order Created'] || orderResponse.createdAt,
              status: orderResponse.fields['Status'] || 1,
              total: orderResponse.fields['Total'] || 0,
              shipping: {
                method: orderResponse.fields['Shipping Method'] || 'Standard',
                estimatedDate: orderResponse.fields['Estimated Ship Date'] || null,
                trackingNumber: orderResponse.fields['Tracking Number'] || null
              },
              items: [] // We'll add items in the next step
            };
            
            // Try to fetch order items
            try {
              const itemsQuery = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  query: `(select 'Order Items' where Orders = "${orderId}").id`
                })
              });
              
              if (itemsQuery && Array.isArray(itemsQuery) && itemsQuery.length > 0) {
                // We have item IDs, fetch details for each
                for (const itemId of itemsQuery) {
                  const itemResponse = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/${orderItemsTableId}/records/${itemId}`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (itemResponse && itemResponse.fields) {
                    formattedOrder.items.push({
                      id: itemId,
                      productType: itemResponse.fields['Product Type'] || 'Unknown',
                      width: itemResponse.fields['Width'] || 0,
                      height: itemResponse.fields['Height'] || 0,
                      quantity: itemResponse.fields['Qty'] || 1,
                      fabric: itemResponse.fields['Fabric selection'] || 'N/A',
                      motorized: itemResponse.fields['Is Motorized'] === 2, // Assuming 2 means "Yes"
                      status: itemResponse.fields['Status'] || 1
                    });
                  }
                }
              }
            } catch (itemsError) {
              console.error(`Error fetching items for order ${orderId}:`, itemsError);
            }
            
            // Add the order to our results
            orders.push(formattedOrder);
          } catch (orderError) {
            console.error(`Error processing order ${orderId}:`, orderError);
          }
        }
        
        console.log(`Successfully processed ${orders.length} orders`);
        return { orders };
      } else {
        console.log(`No orders found for customer ${customerId}`);
        return { orders: [] };
      }
      
    } catch (ninoxError) {
      console.error('Error querying Ninox API:', ninoxError);
      
      // Return empty orders if there's an error
      return { orders: [] };
    }
    
  } catch (error) {
    console.error('Error in user-orders endpoint:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch orders', message: error.message }
    };
  }
});