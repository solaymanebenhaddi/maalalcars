import { z } from 'zod'
import { moroccanPhoneSchema, cinRegex, iceRegex, positiveMoneySchema } from './common'

export const contactTypes = ['INDIVIDUAL', 'COMPANY'] as const
export const contactRoles = ['BUYER', 'SELLER', 'COMMISSIONER', 'SUPPLIER', 'CLIENT', 'PROSPECT'] as const
export const contactSegments = ['VIP', 'FIDELE', 'PROSPECT_CHAUD', 'PROSPECT_FROID', 'FOURNISSEUR', 'STANDARD'] as const
export const contactStatuses = ['ACTIVE', 'INACTIVE', 'BLOCKED'] as const

export const contactBaseSchema = z.object({
  code: z.string().optional(),
  type: z.enum(contactTypes).default('INDIVIDUAL'),
  role: z.enum(contactRoles).default('CLIENT'),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  cin: z
    .string()
    .regex(cinRegex, 'CIN invalide (ex: BE123456)')
    .nullable()
    .optional()
    .or(z.literal('')),
  ice: z
    .string()
    .regex(iceRegex, "L'ICE doit comporter 15 chiffres")
    .nullable()
    .optional()
    .or(z.literal('')),
  rc: z.string().nullable().optional(),
  email: z.string().email('Email invalide').nullable().optional().or(z.literal('')),
  phone: moroccanPhoneSchema,
  phoneSecondary: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().default('Casablanca'),
  postalCode: z.string().nullable().optional(),
  segment: z.enum(contactSegments).default('STANDARD'),
  rating: z.coerce.number().min(0).max(5).default(5.0),
  totalVolume: positiveMoneySchema.default(0),
  currentDebt: positiveMoneySchema.default(0),
  status: z.enum(contactStatuses).default('ACTIVE'),
  notes: z.string().nullable().optional(),
})

export const contactCreateSchema = contactBaseSchema.refine(
  (data) => {
    if (data.type === 'INDIVIDUAL') {
      return !!(data.lastName || data.firstName)
    }
    if (data.type === 'COMPANY') {
      return !!data.companyName
    }
    return true
  },
  {
    message: 'Le nom est requis pour un particulier, et la raison sociale pour une entreprise.',
    path: ['type'],
  },
)

export const contactUpdateSchema = contactBaseSchema.partial()

export const contactFilterSchema = z.object({
  role: z.string().optional(),
  segment: z.string().optional(),
  status: z.string().optional(),
  city: z.string().optional(),
  search: z.string().optional(),
})

export type ContactCreateInput = z.infer<typeof contactCreateSchema>
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>
