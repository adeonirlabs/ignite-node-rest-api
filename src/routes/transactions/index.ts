import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'

import { database } from '~/database.ts'

import type {
  CreateTransactionRequest,
  GetTransactionRequest,
} from './types.ts'
import { createTransactionSchema, getTransactionSchema } from './types.ts'

import { checkSessionId } from '~/middlewares/session-id.ts'

export const transactions = async (app: FastifyInstance) => {
  app.get('/', { preHandler: [checkSessionId] }, async (request, reply) => {
    const { sessionId } = request.cookies

    const transactions = await database('transactions')
      .where('sessionId', sessionId)
      .select()

    return reply.send({ transactions })
  })

  app.get<{ Params: GetTransactionRequest }>(
    '/:id',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const { id } = getTransactionSchema.parse(request.params)
      const { sessionId } = request.cookies

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
}
