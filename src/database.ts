import type { Knex } from 'knex'
import knex from 'knex'

import { env } from '~/env.ts'

const isTestEnvironment = process.env.NODE_ENV === 'test'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: isTestEnvironment
    ? { filename: ':memory:' }
    : { filename: env.DATABASE_URL },
  useNullAsDefault: true,
}

export const database = knex(config)
