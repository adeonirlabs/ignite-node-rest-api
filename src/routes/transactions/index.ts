import crypto from 'node:crypto'
import type { FastifyInstance } from 'fastify'

import { database } from '~/database.ts'

import type { CreateTransactionRequest } from './types.ts'
import { createTransactionSchema } from './types.ts'

export const transactions = async (app: FastifyInstance) => {
  app.post<{ Body: CreateTransactionRequest }>('/', async (request, reply) => {
    const { title, amount, type } = createTransactionSchema.parse(request.body)

    await database('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: amount * (type === 'income' ? 1 : -1),
      type,
    })

    return reply.status(201).send()
  })
}
