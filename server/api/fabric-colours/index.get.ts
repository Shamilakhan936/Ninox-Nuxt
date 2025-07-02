export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('http://localhost:3001/api/fabric-colours', {
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