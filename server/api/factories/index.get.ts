export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('http://localhost:3001/api/factories', {
      method: 'GET'
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch factories from backend'
    })
  }
}) 