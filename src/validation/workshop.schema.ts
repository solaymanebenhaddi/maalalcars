import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const workshopPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
export const workshopStatuses = ['PLANNED', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CANCELLED'] as const

export const workshopOrderCreateSchema = z.object({
  code: z.string().optional(),
  vehicleId: z.string().min(1, 'Véhicule requis'),
  clientId: z.string().nullable().optional(),
  technicianId: z.string().nullable().optional(),
  serviceType: z.string().min(1, 'Type de service requis'),
  priority: z.enum(workshopPriorities).default('MEDIUM'),
  status: z.enum(workshopStatuses).default('IN_PROGRESS'),
  scheduledDate: z.coerce.date().default(() => new Date()),
  completedDate: z.coerce.date().nullable().optional(),
  partsCostHT: positiveMoneySchema.default(0),
  laborCostHT: positiveMoneySchema.default(0),
  taxRate: z.coerce.number().default(20.0),
  notes: z.string().nullable().optional(),
  partsList: z.string().nullable().optional(),
})

export const workshopOrderUpdateSchema = workshopOrderCreateSchema.partial()

export type WorkshopOrderCreateInput = z.infer<typeof workshopOrderCreateSchema>
export type WorkshopOrderUpdateInput = z.infer<typeof workshopOrderUpdateSchema>
