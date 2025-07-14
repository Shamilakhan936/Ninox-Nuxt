export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const search = query.search as string
    const productType = query.productType as string
    
    // Build query parameters for backend
    const params = new URLSearchParams()
    if (search) {
      params.append('search', search)
    }
    if (productType) {
      params.append('productType', productType)
    }
    
    const response = await $fetch(`http://localhost:3001/api/fabrics?${params}`, {
      method: 'GET'
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch fabrics from backend'
    })
  }
}) 