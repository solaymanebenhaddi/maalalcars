import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import { AuditFilterInput } from '@/validation/approval.schema'

export interface LogMutationParams {
  action: string
  entityType: string
  entityId?: string | null
  entityLabel?: string | null
  details?: string | null
  beforeData?: unknown
  afterData?: unknown
  approvalRequestId?: string | null
  userId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
}

export const auditService = {
  /**
   * Records an immutable activity log entry
   */
  async log(params: LogMutationParams) {
    try {
      const beforeString =
        params.beforeData !== undefined && params.beforeData !== null
          ? typeof params.beforeData === 'string'
            ? params.beforeData
            : JSON.stringify(params.beforeData)
          : null

      const afterString =
        params.afterData !== undefined && params.afterData !== null
          ? typeof params.afterData === 'string'
            ? params.afterData
            : JSON.stringify(params.afterData)
          : null

      return await prisma.activityLog.create({
        data: {
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId ?? null,
          entityLabel: params.entityLabel ?? null,
          details: params.details ?? null,
          beforeData: beforeString,
          afterData: afterString,
          approvalRequestId: params.approvalRequestId ?? null,
          userId: params.userId ?? null,
          ipAddress: params.ipAddress ?? null,
          userAgent: params.userAgent ?? null,
        },
      })
    } catch (err) {
      console.error('Failed to write audit log:', err)
      return null
    }
  },

  /**
   * Retrieves paginated activity logs with multi-criteria filters
   */
  async listLogs(filters: AuditFilterInput = { page: 1, limit: 25 }) {
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(100, Math.max(1, filters.limit || 25))
    const skip = (page - 1) * limit

    const where: Prisma.ActivityLogWhereInput = {}

    if (filters.action) {
      where.action = filters.action
    }

    if (filters.entityType) {
      where.entityType = filters.entityType
    }

    if (filters.userId) {
      where.userId = filters.userId
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom)
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo)
        to.setHours(23, 59, 59, 999)
        where.createdAt.lte = to
      }
    }

    if (filters.search && filters.search.trim()) {
      const query = filters.search.trim()
      where.OR = [
        { details: { contains: query } },
        { action: { contains: query } },
        { entityLabel: { contains: query } },
        { entityType: { contains: query } },
        { user: { name: { contains: query } } },
        { user: { email: { contains: query } } },
      ]
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
          approvalRequest: {
            select: {
              id: true,
              requestNumber: true,
              status: true,
              actionType: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ])

    return {
      items: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    }
  },

  /**
   * Aggregates key audit metrics for the dashboard
   */
  async getStats() {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [todayCount, todayUpdates, approvedRequestsToday, rejectedRequestsToday, activeUsersToday] =
      await Promise.all([
        // 1. Actions aujourd'hui
        prisma.activityLog.count({
          where: { createdAt: { gte: startOfToday } },
        }),
        // 2. Modifications aujourd'hui
        prisma.activityLog.count({
          where: {
            createdAt: { gte: startOfToday },
            action: { contains: 'UPDATE' },
          },
        }),
        // 3. Demandes approuvées aujourd'hui
        prisma.approvalRequest.count({
          where: {
            status: 'APPROVED',
            reviewedAt: { gte: startOfToday },
          },
        }),
        // 4. Demandes rejetées aujourd'hui
        prisma.approvalRequest.count({
          where: {
            status: 'REJECTED',
            reviewedAt: { gte: startOfToday },
          },
        }),
        // 5. Utilisateurs actifs aujourd'hui
        prisma.activityLog
          .groupBy({
            by: ['userId'],
            where: {
              createdAt: { gte: startOfToday },
              userId: { not: null },
            },
          })
          .then((res) => res.length),
      ])

    return {
      actionsToday: todayCount,
      updatesToday: todayUpdates,
      approvedToday: approvedRequestsToday,
      rejectedToday: rejectedRequestsToday,
      activeUsersToday,
    }
  },

  /**
   * Formats activity logs into a downloadable CSV string
   */
  async exportCsv(filters: Partial<AuditFilterInput> = {}) {
    const result = await this.listLogs({ ...filters, limit: 1000, page: 1 })
    const rows = result.items

    const headers = [
      'Date et Heure',
      'Utilisateur',
      'Email',
      'Rôle',
      'Action',
      'Entité',
      'Libellé Entité',
      'Détails',
      'Demande Liée',
      'Adresse IP',
    ]

    const csvLines = [headers.join(',')]

    for (const log of rows) {
      const line = [
        `"${new Date(log.createdAt).toLocaleString('fr-FR')}"`,
        `"${(log.user?.name || 'Système').replace(/"/g, '""')}"`,
        `"${(log.user?.email || '').replace(/"/g, '""')}"`,
        `"${(log.user?.role?.name || '').replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.entityType.replace(/"/g, '""')}"`,
        `"${(log.entityLabel || log.entityId || '').replace(/"/g, '""')}"`,
        `"${(log.details || '').replace(/"/g, '""')}"`,
        `"${(log.approvalRequest?.requestNumber || '').replace(/"/g, '""')}"`,
        `"${(log.ipAddress || '').replace(/"/g, '""')}"`,
      ]
      csvLines.push(line.join(','))
    }

    return csvLines.join('\n')
  },
}
