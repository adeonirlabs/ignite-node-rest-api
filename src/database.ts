import type { Knex } from 'knex'
import knex from 'knex'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite',
  },
  useNullAsDefault: true,
}

export const database = knex(config)
