export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const response = await $fetch(`http://localhost:3001/api/customers/${id}`, {
      method: 'DELETE'
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete customer'
    })
  }
}) 