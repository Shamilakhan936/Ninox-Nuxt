export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const fabricId = query.fabricId as string
    const search = query.search as string
    
    // Build query parameters for backend
    const params = new URLSearchParams()
    if (fabricId) {
      params.append('fabricId', fabricId)
    }
    if (search) {
      params.append('search', search)
    }
    
    const response = await $fetch(`http://localhost:3001/api/fabric-colours?${params}`, {
      method: 'GET'
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch fabric colours from backend'
    })
  }
}) 