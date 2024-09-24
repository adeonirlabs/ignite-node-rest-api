import { afterAll, beforeAll, describe, test } from 'bun:test'
import request from 'supertest'

import { app } from '~/app.ts'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('if user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 100,
        type: 'expense',
      })
      .expect(201)
  })
})
