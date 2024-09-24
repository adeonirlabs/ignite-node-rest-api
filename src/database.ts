import type { Knex } from 'knex'
import knex from 'knex'

import { env } from '~/env.ts'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
}

export const database = knex(config)
