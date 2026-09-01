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
  id: z.string().cuid(),
})

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
})
