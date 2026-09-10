import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const saleStatuses = [
  'NEW',
  'NEGOTIATION',
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PREPARATION',
  'DELIVERED',
  'CANCELLED',
] as const

export const paymentMethods = ['VIREMENT', 'ESPECES', 'CHEQUE', 'CARTE', 'EFFET'] as const

export const saleCreateSchema = z
  .object({
    code: z.string().optional(),
    saleDate: z.coerce.date().default(() => new Date()),
    vehicleId: z.string().min(1, 'Véhicule requis'),

    // Buyer - optional contactId OR snapshot
    buyerContactId: z.string().nullable().optional(),
    buyerName: z.string().nullable().optional(),
    buyerPhone: z.string().nullable().optional(),
    buyerCin: z.string().nullable().optional(),
    buyerAddress: z.string().nullable().optional(),
    buyerCity: z.string().nullable().optional(),

    // Commissioner
    commissionerId: z.string().nullable().optional(),
    commissionerName: z.string().nullable().optional(),
    commissionerPhone: z.string().nullable().optional(),
    commissionerCin: z.string().nullable().optional(),
    commissionerAddress: z.string().nullable().optional(),
    commissionerCity: z.string().nullable().optional(),
    commissionPaidById: z.string().nullable().optional(),

    // Commercial & Staff
    salespersonId: z.string().nullable().optional(),
    receivedById: z.string().nullable().optional(),
    reservationId: z.string().nullable().optional(),

    // Financial
    salePrice: positiveMoneySchema.refine((val) => val > 0, 'Le prix de vente doit être supérieur à 0'),
    taxRate: z.coerce.number().default(20.0),
    commissionAmount: positiveMoneySchema.default(0),
    discountAmount: positiveMoneySchema.default(0),
    additionalFees: positiveMoneySchema.default(0),
    advanceAmount: positiveMoneySchema.default(0),
    amountReceivedAtSale: positiveMoneySchema.default(0),

    status: z.enum(saleStatuses).default('CONFIRMED'),
    paymentMethod: z.enum(paymentMethods).default('VIREMENT'),
    expectedDeliveryDate: z.coerce.date().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => Boolean(data.buyerContactId || (data.buyerName && data.buyerName.trim().length > 0)),
    {
      message: 'Veuillez renseigner au moins un acheteur existant ou le nom de l’acheteur',
      path: ['buyerName'],
    }
  )

export const saleUpdateSchema = z.object({
  code: z.string().optional(),
  saleDate: z.coerce.date().optional(),
  vehicleId: z.string().optional(),
  buyerContactId: z.string().nullable().optional(),
  buyerName: z.string().nullable().optional(),
  buyerPhone: z.string().nullable().optional(),
  buyerCin: z.string().nullable().optional(),
  buyerAddress: z.string().nullable().optional(),
  commissionerId: z.string().nullable().optional(),
  commissionerName: z.string().nullable().optional(),
  commissionerPhone: z.string().nullable().optional(),
  commissionerCin: z.string().nullable().optional(),
  commissionerAddress: z.string().nullable().optional(),
  commissionPaidById: z.string().nullable().optional(),
  salespersonId: z.string().nullable().optional(),
  receivedById: z.string().nullable().optional(),
  reservationId: z.string().nullable().optional(),
  salePrice: positiveMoneySchema.optional(),
  taxRate: z.coerce.number().optional(),
  commissionAmount: positiveMoneySchema.optional(),
  discountAmount: positiveMoneySchema.optional(),
  additionalFees: positiveMoneySchema.optional(),
  advanceAmount: positiveMoneySchema.optional(),
  amountReceivedAtSale: positiveMoneySchema.optional(),
  status: z.enum(saleStatuses).optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
  expectedDeliveryDate: z.coerce.date().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export const saleFilterSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type SaleCreateInput = z.infer<typeof saleCreateSchema>
export type SaleUpdateInput = z.infer<typeof saleUpdateSchema>
