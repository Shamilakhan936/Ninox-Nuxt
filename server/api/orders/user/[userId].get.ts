export default defineEventHandler(async (event) => {
    try {
      const userId = getRouterParam(event, 'userId')
      const query = getQuery(event)
      
      // Build query parameters
      const params = new URLSearchParams()
      params.append('userId', userId)
      
      if (query.page) params.append('page', query.page as string)
      if (query.limit) params.append('limit', query.limit as string)
      if (query.orderNumber) params.append('orderNumber', query.orderNumber as string)
      if (query.dateFrom) params.append('dateFrom', query.dateFrom as string)
      if (query.dateTo) params.append('dateTo', query.dateTo as string)
      
      const queryString = params.toString()
      const url = `http://localhost:3001/api/orders/user/${userId}${queryString ? '?' + queryString : ''}`
      
      const response = await $fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      return response
    } catch (error: any) {
      console.error('User orders GET error:', error)
      throw createError({
        statusCode: error.status || error.statusCode || 500,
        statusMessage: error.message || error.statusMessage || 'Failed to fetch user orders'
      })
    }
  })