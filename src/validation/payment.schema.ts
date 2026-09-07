import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const paymentTypes = ['INFLOW', 'OUTFLOW', 'COMMISSION'] as const
export const paymentStatuses = ['PAID', 'PENDING', 'OVERDUE', 'CANCELLED'] as const
export const paymentMethodTypes = ['VIREMENT', 'ESPECES', 'CHEQUE', 'CARTE', 'EFFET'] as const

export const paymentCreateSchema = z.object({
  code: z.string().optional(),
  type: z.enum(paymentTypes),
  amount: positiveMoneySchema.refine((val) => val > 0, 'Le montant doit être supérieur à 0'),
  paymentDate: z.coerce.date().default(() => new Date()),
  paymentMethod: z.enum(paymentMethodTypes).default('VIREMENT'),
  referenceNumber: z.string().nullable().optional(),
  status: z.enum(paymentStatuses).default('PAID'),
  dueDate: z.coerce.date().nullable().optional(),
  receivedBy: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  receiptUrl: z.string().nullable().optional(),
  contactId: z.string().nullable().optional(),
  saleId: z.string().nullable().optional(),
  purchaseId: z.string().nullable().optional(),
  invoiceId: z.string().nullable().optional(),
})

export const paymentUpdateSchema = paymentCreateSchema.partial()

export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>
