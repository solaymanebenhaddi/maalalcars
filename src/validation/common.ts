import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
})

export const sortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc'),
})

export const idSchema = z.object({
  id: z.string().min(1, 'Identifiant requis'),
})

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
})

// Validations spécifiques au contexte marocain
export const moroccanPhoneRegex = /^(?:(?:\+|00)212|0)[5-7]\d{8}$/
export const cinRegex = /^[A-Z]{1,2}\d{5,7}$/
export const iceRegex = /^\d{15}$/
export const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i

export const moroccanPhoneSchema = z
  .string()
  .regex(moroccanPhoneRegex, 'Numéro de téléphone marocain invalide (ex: 0661234567 ou +212661234567)')

export const cinSchema = z
  .string()
  .regex(cinRegex, 'CIN marocain invalide (ex: BE123456 ou A123456)')

export const iceSchema = z
  .string()
  .regex(iceRegex, "L'ICE doit comporter exactement 15 chiffres")

export const positiveMoneySchema = z.coerce.number().min(0, 'Le montant doit être positif')
