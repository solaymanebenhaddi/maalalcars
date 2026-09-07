import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const userCreateSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().nullable().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  roleId: z.string().min(1, 'Rôle requis'),
  isActive: z.boolean().default(true),
})

export const userUpdateSchema = z.object({
  email: z.string().email('Adresse email invalide').optional(),
  name: z.string().min(2).optional(),
  phone: z.string().nullable().optional(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
