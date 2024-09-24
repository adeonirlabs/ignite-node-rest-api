import fastify from 'fastify'

import { database } from '~/database.js'
import { env } from '~/env.ts'

const app = fastify()

app.get('/', async () => {
  return await database.select('*').into('transactions')
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running on ${env.BASE_URL}`)
  })
