export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const response = await $fetch(`http://localhost:3001/api/customers/${id}`, {
      method: 'PUT',
      body
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update customer'
    })
  }
}) 