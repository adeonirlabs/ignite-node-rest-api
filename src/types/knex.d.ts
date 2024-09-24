import type { Knex } from 'knex'

import type { Transaction } from '~/routes/transactions/types.ts'

declare module 'knex/types/tables.js' {
  interface Tables {
    transactions: Transaction
  }
}
