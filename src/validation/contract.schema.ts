import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const contractStatuses = ['DRAFT', 'ACTIVE', 'EXPIRING_SOON', 'TERMINATED'] as const
export const signatureStatuses = ['DRAFT', 'SENT', 'SIGNED', 'REJECTED'] as const

export const contractCreateSchema = z.object({
  code: z.string().optional(),
  title: z.string().min(1, 'Titre requis'),
  type: z.string().min(1, 'Type de contrat requis'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  amountHT: positiveMoneySchema.default(0),
  status: z.enum(contractStatuses).default('ACTIVE'),
  signatureStatus: z.enum(signatureStatuses).default('SIGNED'),
  terms: z.string().nullable().optional(),
  partyContactId: z.string().nullable().optional(),
})

export const contractUpdateSchema = contractCreateSchema.partial()

export type ContractCreateInput = z.infer<typeof contractCreateSchema>
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>
