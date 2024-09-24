import fastify from 'fastify'

import { database } from '~/database.js'
import { env } from '~/env.ts'

const app = fastify()

app.get('/', async () => {
  const tables = await database.select('*').from('sqlite_schema')
  return tables
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running on ${env.BASE_URL}`)
  })
