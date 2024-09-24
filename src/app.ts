import cookie from '@fastify/cookie'
import fastify from 'fastify'

import { transactions } from '~/routes/transactions/index.ts'

export const app = fastify()

app.register(cookie)

app.register(transactions, { prefix: '/transactions' })
