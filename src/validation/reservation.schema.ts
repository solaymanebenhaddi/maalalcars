import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const reservationStatuses = [
  'ACTIVE',
  'EXPIRING',
  'EXPIRED',
  'CANCELLED',
  'CONVERTED',
  'EXPIREE',
  'ANNULEE',
  'CONVERTIE_EN_VENTE',
] as const

export const reservationCreateSchema = z
  .object({
    code: z.string().optional(),
    vehicleId: z.string().min(1, 'Véhicule requis'),
    contactId: z.string().nullable().optional(),

    // Client snapshot columns (MVP without CRM)
    clientName: z.string().nullable().optional(),
    clientPhone: z.string().nullable().optional(),
    clientCin: z.string().nullable().optional(),
    clientAddress: z.string().nullable().optional(),

    depositAmount: positiveMoneySchema.default(0),
    paymentMethod: z.string().default('ESPECES'),
    startDate: z.coerce.date().default(() => new Date()),
    expiryDate: z.coerce.date(),
    salespersonName: z.string().nullable().optional(),
    status: z.enum(reservationStatuses).default('ACTIVE'),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => Boolean(data.contactId || (data.clientName && data.clientName.trim().length > 0)),
    {
      message: 'Veuillez renseigner au moins un contact existant ou le nom du client',
      path: ['clientName'],
    }
  )

export const reservationUpdateSchema = z.object({
  code: z.string().optional(),
  vehicleId: z.string().optional(),
  contactId: z.string().nullable().optional(),
  clientName: z.string().nullable().optional(),
  clientPhone: z.string().nullable().optional(),
  clientCin: z.string().nullable().optional(),
  clientAddress: z.string().nullable().optional(),
  depositAmount: positiveMoneySchema.optional(),
  paymentMethod: z.string().optional(),
  startDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  salespersonName: z.string().nullable().optional(),
  status: z.enum(reservationStatuses).optional(),
  notes: z.string().nullable().optional(),
})

export type ReservationCreateInput = z.infer<typeof reservationCreateSchema>
export type ReservationUpdateInput = z.infer<typeof reservationUpdateSchema>
