import type { Knex } from 'knex'
import knex from 'knex'

import { env } from '~/env.ts'

const isTestEnvironment = process.env.NODE_ENV === 'test'
const isProductionEnvironment = process.env.NODE_ENV === 'production'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: (() => {
    if (isTestEnvironment) {
      return { filename: ':memory:' }
    }
    if (isProductionEnvironment) {
      return env.DATABASE_URL
    }
    return { filename: env.DATABASE_URL }
  })(),
  useNullAsDefault: true,
}

export const database = knex(config)
