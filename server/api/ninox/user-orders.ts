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
      
      // Step 2: Get orders for this customer
      const ordersQuery = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NINOX_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `let orders := (select Orders where CustomerID = "${customerId}"); 
          orders.'Order ID'
          `
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
            // Approach based on clients.ts - post to /record endpoint instead of using query
            const orderResponse = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Orders/record`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                filters: {
                  "F": orderId 
                  
                }
              }),
              query: {
                style: 'object',
                dateStyle: 'iso',
                choiceStyle: 'text'
              }
            });
            
            console.log(`Order ${orderId} details:`, orderResponse);
            
            if (!orderResponse || !orderResponse.fields) {
              console.log(`No details found for order ${orderId}, skipping`);
              continue;
            }
            
            // Format the order with the correct field access pattern
            const formattedOrder = {
              id: orderId,
              createdAt: orderResponse.fields['Date Order Created'] || new Date().toISOString(),
              status: orderResponse.fields['Status'] || 1,
              total: orderResponse.fields['Total'] || 0,
              shipping: {
                method: orderResponse.fields['Shipping Method'] || 'Standard',
                estimatedDate: orderResponse.fields['Estimated Ship Date'] || null,
                trackingNumber: orderResponse.fields['Tracking Number'] || null
              },
              items: [] // We'll add items in the next step
            };
            
            // Get order items - use the query endpoint to find items by Order ID
            try {
              const itemsQueryStr = `
                let items := (select 'Order Items' where 'Parent Order Id' = "${orderId}");
                items.'Order Item Id'
              `;
              
              const itemIdsResponse = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/query`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  query: itemsQueryStr
                })
              });
              
              console.log(`Item IDs for order ${orderId}:`, itemIdsResponse);
              
              // If we have item IDs, get each item's details
              if (itemIdsResponse && Array.isArray(itemIdsResponse) && itemIdsResponse.length > 0) {
                for (const itemId of itemIdsResponse) {
                  try {
                    // Use record endpoint with POST method and filters like we do for orders
                    const itemResponse = await $fetch(`https://api.ninox.com/v1/teams/${NINOX_TEAM_ID}/databases/${NINOX_DATABASE_ID}/tables/Order Items/record`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${NINOX_API_TOKEN}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        filters: {
                          "H1": itemId  // Filter by Order Item Id field
                        }
                      }),
                      query: {
                        style: 'object',
                        dateStyle: 'iso',
                        choiceStyle: 'text'
                      }
                    });
                    
                    console.log(`Item ${itemId} details:`, itemResponse);
                    
                    if (itemResponse && itemResponse.fields) {
                      formattedOrder.items.push({
                        id: itemId,
                        productType: itemResponse.fields['Product Type'] || 'Unknown',
                        width: itemResponse.fields['Width'] || 0,
                        height: itemResponse.fields['Height'] || 0,
                        quantity: itemResponse.fields['Qty'] || 1,
                        fabric: itemResponse.fields['Fabric Selection'] || 'N/A',
                        motorized: itemResponse.fields['Is Motorized'] === 'Yes', // Updated to handle string value
                        status: itemResponse.fields['Status'] || 1,
                        // Add new fields from the API response
                        mountLocation: itemResponse.fields['Mount Location'] || 'Inside',
                        style: itemResponse.fields['Style'] || null,
                        control: itemResponse.fields['Control'] || null,
                        rollDirection: itemResponse.fields['Roll Direction'] || null,
                        hardwareColor: itemResponse.fields['Hardware Color'] || null,
                        controlPosition: itemResponse.fields['Control Position'] || null,
                        includesRemote: itemResponse.fields['Includes Remote?'] || false
                      });
                    }
                  } catch (itemError) {
                    console.error(`Error fetching details for item ${itemId}:`, itemError);
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
        console.log(orders);
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