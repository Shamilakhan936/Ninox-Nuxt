export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Build query parameters for backend
    const params = new URLSearchParams()
    
    // Add search parameter if provided
    if (query.search) {
      params.append('search', query.search as string)
    }
    
    // Add pagination parameters if provided
    if (query.page) {
      params.append('page', query.page as string)
    }
    
    if (query.limit) {
      params.append('limit', query.limit as string)
    }
    
    const url = params.toString() 
      ? `http://localhost:3001/api/customers?${params}`
      : 'http://localhost:3001/api/customers'
    
    const response = await $fetch(url, {
      method: 'GET'
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch customers from backend'
    })
  }
}) 