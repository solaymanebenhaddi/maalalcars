import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const expenseStatuses = ['PAID', 'PENDING_APPROVAL', 'REJECTED'] as const
export const expensePaymentMethods = ['CARTE', 'VIREMENT', 'ESPECES', 'CHEQUE'] as const

export const expenseCreateSchema = z.object({
  code: z.string().optional(),
  categoryId: z.string().min(1, 'Catégorie requise'),
  vehicleId: z.string().nullable().optional(),
  label: z.string().min(1, 'Libellé requis'),
  amountHT: positiveMoneySchema.default(0),
  taxRate: z.coerce.number().default(20.0),
  taxAmount: positiveMoneySchema.default(0),
  amountTTC: positiveMoneySchema.refine((val) => val > 0, 'Le montant TTC doit être supérieur à 0'),
  expenseDate: z.coerce.date().default(() => new Date()),
  supplierName: z.string().nullable().optional(),
  paymentMethod: z.enum(expensePaymentMethods).default('CARTE'),
  paidBy: z.string().nullable().optional(),
  status: z.enum(expenseStatuses).default('PAID'),
  isRecurring: z.boolean().default(false),
  receiptUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export const expenseUpdateSchema = expenseCreateSchema.partial()

export type ExpenseCreateInput = z.infer<typeof expenseCreateSchema>
export type ExpenseUpdateInput = z.infer<typeof expenseUpdateSchema>
