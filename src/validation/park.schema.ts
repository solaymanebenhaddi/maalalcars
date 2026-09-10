import { z } from 'zod'

export const parkCapacitySchema = z.coerce
  .number({ message: 'La capacité doit être un nombre valide' })
  .int('La capacité doit être un nombre entier')
  .min(1, 'La capacité minimale est de 1 place')
  .max(1000, 'La capacité maximale d\'un parc ne peut pas dépasser 1000 places')

export const parkCreateSchema = z.object({
  name: z.string().min(1, 'Le nom du parc est obligatoire'),
  city: z.string().min(1, 'La ville est obligatoire'),
  code: z.string().optional(),
  address: z.string().min(1, 'L\'adresse physique est obligatoire'),
  phone: z.string().nullable().optional(),
  managerName: z.string().nullable().optional(),
  capacity: parkCapacitySchema.default(40),
  isActive: z.boolean().optional().default(true),
})

export const parkUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  code: z.string().optional(),
  address: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
  managerName: z.string().nullable().optional(),
  capacity: parkCapacitySchema.optional(),
  isActive: z.boolean().optional(),
})

export type ParkCreateInput = z.infer<typeof parkCreateSchema>
export type ParkUpdateInput = z.infer<typeof parkUpdateSchema>
