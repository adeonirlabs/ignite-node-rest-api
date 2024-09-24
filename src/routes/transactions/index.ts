import crypto from 'node:crypto'
import type { FastifyInstance } from 'fastify'

import { database } from '~/database.ts'

import type {
  CreateTransactionRequest,
  GetTransactionRequest,
} from './types.ts'
import { createTransactionSchema, getTransactionSchema } from './types.ts'

export const transactions = async (app: FastifyInstance) => {
  app.get('/', async (_, reply) => {
    const transactions = await database('transactions').select()

    return reply.send({ transactions })
  })

  app.get<{ Params: GetTransactionRequest }>('/:id', async (request, reply) => {
    const { id } = getTransactionSchema.parse(request.params)
    const transaction = await database('transactions').where('id', id).first()

    return reply.send({ transaction })
  })

  app.get('/summary', async (_, reply) => {
    const summary = await database('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return reply.send({ summary })
  })

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
