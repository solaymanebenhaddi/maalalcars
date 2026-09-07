import prisma from '@/lib/db'

export const auditService = {
  async log(params: {
    action: string
    entityType: string
    entityId?: string
    details?: string
    userId?: string
    ipAddress?: string
  }) {
    try {
      return await prisma.activityLog.create({
        data: {
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          details: params.details,
          userId: params.userId,
          ipAddress: params.ipAddress,
        },
      })
    } catch (err) {
      console.error('Failed to write audit log:', err)
      return null
    }
  },
}
