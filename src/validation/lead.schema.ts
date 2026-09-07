import { z } from 'zod'
import { moroccanPhoneSchema, positiveMoneySchema } from './common'

export const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CONVERTED', 'LOST'] as const
export const leadSources = ['Google Ads', 'Facebook Ads', 'Instagram', 'Site web', 'Parrainage', 'Walk-in', 'Autre'] as const

export const leadCreateSchema = z.object({
  code: z.string().optional(),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide').nullable().optional().or(z.literal('')),
  phone: moroccanPhoneSchema,
  source: z.string().min(1, 'Source requise'),
  interestType: z.string().default("Achat d'un véhicule"),
  estimatedBudget: positiveMoneySchema.nullable().optional(),
  status: z.enum(leadStatuses).default('QUALIFIED'),
  tags: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  campaignId: z.string().nullable().optional(),
  assignedToId: z.string().nullable().optional(),
})

export const leadUpdateSchema = leadCreateSchema.partial()

export type LeadCreateInput = z.infer<typeof leadCreateSchema>
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>
