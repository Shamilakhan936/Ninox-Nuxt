export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Build query parameters for backend
    const params = new URLSearchParams()
    
    // Add any query parameters
    if (query.page) {
      params.append('page', query.page as string)
    }
    if (query.limit) {
      params.append('limit', query.limit as string)
    }
    
    const queryString = params.toString()
    const url = `http://localhost:3001/api/users${queryString ? '?' + queryString : ''}`
    
    const response = await $fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error: any) {
    console.error('Users GET error:', error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.message || error.statusMessage || 'Failed to fetch users'
    })
  }
}) 