import { z } from 'zod'

export interface Transaction {
  id: string
  sessionId?: string
  title: string
  amount: number
  type: 'expense' | 'income'
  createdAt: string
  updatedAt: string
}

export const createTransactionSchema = z.object({
  title: z.string().min(3, 'Título é obrigatório'),
  amount: z.number().positive('Valor é obrigatório'),
  type: z.enum(['expense', 'income'], { message: 'Tipo é obrigatório' }),
})

export type CreateTransactionRequest = z.infer<typeof createTransactionSchema>

export const transactionParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export type TransactionParamsRequest = z.infer<typeof transactionParamsSchema>

export const updateTransactionSchema = z.object({
  title: z.string().min(3, 'Título é obrigatório'),
  amount: z.number().positive('Valor é obrigatório'),
})

export type UpdateTransactionRequest = z.infer<typeof updateTransactionSchema>
