import type { FastifyReply, FastifyRequest } from 'fastify'

export const checkSessionId = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ error: 'Não autorizado' })
  }
}