export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const response = await $fetch(`http://localhost:3001/api/fabrics/${id}`, {
      method: 'GET'
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch fabric'
    })
  }
}) 