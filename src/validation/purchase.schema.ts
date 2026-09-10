import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const purchaseStatuses = ['DRAFT', 'CONFIRMED', 'DELIVERED', 'CANCELLED'] as const
export const purchasePaymentMethods = ['VIREMENT', 'CHEQUE', 'ESPECES', 'EFFET'] as const

export const purchaseCreateSchema = z.object({
  code: z.string().optional(),
  purchaseDate: z.coerce.date().default(() => new Date()),
  vehicleId: z.string().min(1, 'Véhicule requis'),
  sellerContactId: z.string().nullable().optional(),
  supplierContactId: z.string().nullable().optional(),
  supplierName: z.string().nullable().optional(),
  supplierPhone: z.string().nullable().optional(),
  supplierCin: z.string().nullable().optional(),
  supplierAddress: z.string().nullable().optional(),
  supplierCity: z.string().nullable().optional(),
  commissionerId: z.string().nullable().optional(),
  commissionerName: z.string().nullable().optional(),
  commissionerPhone: z.string().nullable().optional(),
  commissionerCin: z.string().nullable().optional(),
  commissionerAddress: z.string().nullable().optional(),
  commissionerCity: z.string().nullable().optional(),
  commissionPaidById: z.string().nullable().optional(),
  handledById: z.string().nullable().optional(),
  purchasePrice: positiveMoneySchema.refine((val) => val > 0, "Le prix d'achat doit être supérieur à 0"),
  commissionAmount: positiveMoneySchema.default(0),
  paymentMethod: z.enum(purchasePaymentMethods).default('VIREMENT'),
  status: z.enum(purchaseStatuses).default('CONFIRMED'),
  invoiceNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export const purchaseUpdateSchema = purchaseCreateSchema.partial()

export type PurchaseCreateInput = z.infer<typeof purchaseCreateSchema>
export type PurchaseUpdateInput = z.infer<typeof purchaseUpdateSchema>
