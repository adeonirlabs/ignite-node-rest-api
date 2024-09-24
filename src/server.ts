import cookie from '@fastify/cookie'
import fastify from 'fastify'

import { env } from '~/env.ts'
import { transactions } from '~/routes/transactions/index.ts'

const app = fastify()

app.register(cookie)

app.register(transactions, { prefix: '/transactions' })

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running on ${env.BASE_URL}`)
  })
