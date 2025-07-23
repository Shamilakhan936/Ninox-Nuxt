export default defineEventHandler(async (event) => {
  try {
    const orderId = getRouterParam(event, 'id')
    
    const response = await $fetch(`http://localhost:3001/api/orders/${orderId}?withItems=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error: any) {
    console.error('Order details GET error:', error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.message || error.statusMessage || 'Failed to fetch order details'
    })
  }
}) 