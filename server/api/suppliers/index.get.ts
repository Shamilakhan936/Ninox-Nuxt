export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('http://localhost:3001/api/suppliers', {
      method: 'GET'
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch suppliers from backend'
    })
  }
}) 