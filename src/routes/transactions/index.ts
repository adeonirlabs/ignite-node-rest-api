import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'

import { database } from '~/database.ts'

import type {
  CreateTransactionRequest,
  TransactionParamsRequest,
  UpdateTransactionRequest,
} from './types.ts'
import {
  createTransactionSchema,
  transactionParamsSchema,
  updateTransactionSchema,
} from './types.ts'

import { checkSessionId } from '~/middlewares/session-id.ts'

export const transactions = async (app: FastifyInstance) => {
  app.post<{ Body: CreateTransactionRequest }>('/', async (request, reply) => {
    const { title, amount, type } = createTransactionSchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
    }

    await database('transactions').insert({
      id: randomUUID(),
      sessionId,
      title,
      amount: amount * (type === 'income' ? 1 : -1),
      type,
    })

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return reply.status(201).send()
  })

  app.get('/', { preHandler: [checkSessionId] }, async (request, reply) => {
    const { sessionId } = request.cookies

    const transactions = await database('transactions')
      .where('sessionId', sessionId)
      .select()

    return reply.send({ transactions })
  })

  app.get<{ Params: TransactionParamsRequest }>(
    '/:id',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const { id } = transactionParamsSchema.parse(request.params)

      const transaction = await database('transactions')
        .where({ id, sessionId })
        .first()

      return reply.send({ transaction })
    }
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const summary = await database('transactions')
        .where('sessionId', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return reply.send({ summary })
    }
  )

  app.put<{ Params: TransactionParamsRequest; Body: UpdateTransactionRequest }>(
    '/:id',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const { id } = transactionParamsSchema.parse(request.params)
      const { title, amount } = updateTransactionSchema.parse(request.body)

      const transaction = await database('transactions')
        .where({ id, sessionId })
        .first()

      if (!transaction) {
        return reply.status(404).send({ message: 'Transaction not found' })
      }

      await database('transactions')
        .where({ id, sessionId })
        .update({
          title,
          amount: amount * (transaction.type === 'income' ? 1 : -1),
        })

      return reply.status(204).send()
    }
  )

  app.delete<{ Params: TransactionParamsRequest }>(
    '/:id',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const { id } = transactionParamsSchema.parse(request.params)

      await database('transactions').where({ id, sessionId }).delete()

      return reply.status(204).send()
    }
  )
}
