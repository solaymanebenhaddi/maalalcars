import { z } from 'zod'

export const approvalActionTypeEnum = z.enum([
  'CREATE',
  'UPDATE',
  'DELETE',
  'ARCHIVE',
  'RESTORE',
  'STATUS_CHANGE',
  'SALE',
  'RESERVATION',
  'REPAIR',
  'EXCHANGE',
  'PRICE_CHANGE',
  'COMMISSION_CHANGE',
  'DOCUMENT_CHANGE',
  'PAYMENT_CHANGE',
])

export const approvalStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'EXPIRED',
  'CONFLICTED',
])

export const createApprovalRequestSchema = z.object({
  actionType: approvalActionTypeEnum,
  entityType: z.string().min(1, "Le type d'entité est requis"),
  entityId: z.string().optional().nullable(),
  entityLabel: z.string().optional().nullable(),
  requestedData: z.union([z.record(z.string(), z.unknown()), z.string(), z.array(z.unknown())]),
  targetUrl: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
})

export type CreateApprovalRequestInput = z.infer<typeof createApprovalRequestSchema>

export const approveRequestSchema = z.object({
  requestId: z.string().min(1, "L'identifiant de la demande est requis"),
  overrideConflict: z.boolean().optional().default(false),
})

export type ApproveRequestInput = z.infer<typeof approveRequestSchema>

export const rejectRequestSchema = z.object({
  requestId: z.string().min(1, "L'identifiant de la demande est requis"),
  rejectionReason: z
    .string()
    .min(5, 'Le motif du rejet est obligatoire et doit comporter au moins 5 caractères'),
})

export type RejectRequestInput = z.infer<typeof rejectRequestSchema>

export const approvalFilterSchema = z.object({
  status: approvalStatusEnum.optional(),
  entityType: z.string().optional(),
  actionType: approvalActionTypeEnum.optional(),
  search: z.string().optional(),
  requestedByUserId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type ApprovalFilterInput = z.infer<typeof approvalFilterSchema>

export const auditFilterSchema = z.object({
  search: z.string().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
  userId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
})

export type AuditFilterInput = z.infer<typeof auditFilterSchema>
