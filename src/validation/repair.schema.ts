import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const repairTypes = [
  'MECANIQUE',
  'CARROSSERIE',
  'ELECTRICITE',
  'PNEUMATIQUES',
  'CLIMATISATION',
  'ENTRETIEN',
  'NETTOYAGE',
  'AUTRE',
] as const

export const repairStatuses = ['EN_COURS', 'TERMINEE', 'ANNULEE'] as const

export const repairCreateSchema = z.object({
  code: z.string().optional(),
  vehicleId: z.string().min(1, 'Véhicule requis'),
  repairType: z.string().min(1, 'Type de réparation requis'),
  description: z.string().nullable().optional(),
  garageName: z.string().nullable().optional(),
  startedAt: z.coerce.date().default(() => new Date()),
  estimatedAmount: positiveMoneySchema.nullable().optional(),
  paidById: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export const repairCompleteSchema = z.object({
  finalAmount: positiveMoneySchema,
  paidById: z.string().nullable().optional(),
  completedAt: z.coerce.date().default(() => new Date()),
  notes: z.string().nullable().optional(),
})

export const repairUpdateSchema = repairCreateSchema.partial().extend({
  status: z.enum(repairStatuses).optional(),
  finalAmount: positiveMoneySchema.nullable().optional(),
  paidById: z.string().nullable().optional(),
  completedAt: z.coerce.date().nullable().optional(),
})

export type RepairCreateInput = z.infer<typeof repairCreateSchema>
export type RepairCompleteInput = z.infer<typeof repairCompleteSchema>
export type RepairUpdateInput = z.infer<typeof repairUpdateSchema>
