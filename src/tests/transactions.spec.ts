import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
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

  test('if user can get all transactions', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 100,
        type: 'expense',
      })
      .expect(201)

    const cookies = createResponse.get('Set-Cookie')

    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(listResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: -100,
        type: 'expense',
      }),
    ])
  })
})
