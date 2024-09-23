import fastify from 'fastify'
import { database } from 'src/database.js'

const app = fastify()

app.get('/', async () => {
  const tables = await database.select('*').from('sqlite_schema')
  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running on http://localhost:3333')
  })
