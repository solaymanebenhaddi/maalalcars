import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const invoiceTypes = ['VENTE', 'ACOMPTE', 'AVOIR', 'PROFORMA'] as const
export const invoiceStatuses = ['DRAFT', 'SENT', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'] as const

export const invoiceLineSchema = z.object({
  description: z.string().min(1, 'Description requise'),
  quantity: z.coerce.number().int().min(1).default(1),
  unitPriceHT: positiveMoneySchema,
  taxRate: z.coerce.number().default(20.0),
  totalHT: positiveMoneySchema.optional(),
  totalTTC: positiveMoneySchema.optional(),
})

export const invoiceCreateSchema = z.object({
  code: z.string().optional(),
  type: z.enum(invoiceTypes).default('VENTE'),
  issueDate: z.coerce.date().default(() => new Date()),
  dueDate: z.coerce.date(),
  contactId: z.string().min(1, 'Client requis'),
  saleId: z.string().nullable().optional(),
  taxRate: z.coerce.number().default(20.0),
  paymentMethod: z.string().default('VIREMENT'),
  notes: z.string().nullable().optional(),
  terms: z.string().nullable().optional(),
  lines: z.array(invoiceLineSchema).min(1, 'Au moins une ligne de facture est requise'),
})

export const invoiceUpdateSchema = invoiceCreateSchema.partial()

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>
export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>
