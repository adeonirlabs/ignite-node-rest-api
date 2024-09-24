import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'bun:test'
import request from 'supertest'

import { app } from '~/app.ts'
import { database } from '~/database.ts'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await database.migrate.rollback()
    await database.migrate.latest()
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

    const getListResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(getListResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: -100,
        type: 'expense',
      }),
    ])
  })

  test('if user can get a transaction by id', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 500,
        type: 'income',
      })
      .expect(201)

    const cookies = createResponse.get('Set-Cookie')

    const getListResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || [])
      .expect(200)

    const transactionId = getListResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies || [])
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 500,
        type: 'income',
      })
    )
  })

  test('if user can get the summary', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 500,
        type: 'income',
      })
      .expect(201)

    const cookies = createResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies || [])
      .send({
        title: 'New transaction',
        amount: 200,
        type: 'expense',
      })
      .expect(201)

    const getSummaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(getSummaryResponse.body.summary).toEqual({
      amount: 300,
    })
  })

  test('if user can update a transaction', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 500,
        type: 'income',
      })
      .expect(201)

    const cookies = createResponse.get('Set-Cookie')

    const getListResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || [])
      .expect(200)

    const transactionId = getListResponse.body.transactions[0].id

    await request(app.server)
      .put(`/transactions/${transactionId}`)
      .set('Cookie', cookies || [])
      .send({
        title: 'Updated transaction',
        amount: 300,
      })
      .expect(204)

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies || [])
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Updated transaction',
        amount: 300,
      })
    )
  })
})
