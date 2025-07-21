export default defineEventHandler(async (event) => {
    try {
      const body = await readBody(event)
      
      const response = await $fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      })
      
      return response
    } catch (error: any) {
      console.error('User creation error:', error)
      throw createError({
        statusCode: error.status || error.statusCode || 500,
        statusMessage: error.message || error.statusMessage || 'Failed to create user'
      })
    }
  })