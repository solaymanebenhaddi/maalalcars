import prisma from '@/lib/db'
import { isSuperAdminRole } from '@/lib/auth-roles'
import { auditService } from './audit.service'
import { vehicleUpdateSchema } from '@/validation/vehicle.schema'
import {
  ApprovalStatus,
  computeFieldDiff,
  detectEntityConflict,
  generateRequestNumber,
} from '@/domain/approval'
import { ApprovalFilterInput, CreateApprovalRequestInput } from '@/validation/approval.schema'
import { Prisma } from '@prisma/client'

export interface RequestMutationContext {
  userId: string
  userRole: string
  userName?: string
  ipAddress?: string
  userAgent?: string
}

export const approvalService = {
  /**
   * Universal entry point for mutations:
   * - If Super Admin: executes immediately and logs audit trail.
   * - If non-Super Admin: creates a pending ApprovalRequest.
   */
  async requestMutation<T = unknown>(
    input: CreateApprovalRequestInput,
    context: RequestMutationContext,
    directExecutor?: () => Promise<T>,
  ): Promise<{
    appliedImmediately: boolean
    status: ApprovalStatus
    requestId?: string
    requestNumber?: string
    data?: T
  }> {
    const isSuperAdmin = isSuperAdminRole(context.userRole)

    // 1. Super Admin: Execute immediately
    if (isSuperAdmin) {
      let result: T | undefined
      if (directExecutor) {
        result = await directExecutor()
      }

      // Generate audit log for immediate mutation
      await auditService.log({
        action: `${input.entityType.toUpperCase()}_${input.actionType}`,
        entityType: input.entityType,
        entityId: input.entityId,
        entityLabel: input.entityLabel,
        details:
          input.reason || `Action ${input.actionType} exécutée immédiatement par Super Admin`,
        afterData: input.requestedData,
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      })

      return {
        appliedImmediately: true,
        status: 'APPROVED',
        data: result,
      }
    }

    // 2. Non-Super Admin: Create ApprovalRequest
    let beforeSnapshot: Record<string, unknown> | null = null
    let entityUpdatedAt: Date | null = null

    // Snapshot existing entity if applicable
    if (input.entityId) {
      if (input.entityType === 'Vehicle') {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id: input.entityId },
        })
        if (vehicle) {
          beforeSnapshot = vehicle as unknown as Record<string, unknown>
          entityUpdatedAt = vehicle.updatedAt
        }
      } else if (input.entityType === 'Sale') {
        const sale = await prisma.sale.findUnique({
          where: { id: input.entityId },
        })
        if (sale) {
          beforeSnapshot = sale as unknown as Record<string, unknown>
          entityUpdatedAt = sale.updatedAt
        }
      }
    }

    // Sequence count for human readable request number: REQ-2026-XXXXX
    const totalRequestsCount = await prisma.approvalRequest.count()
    const requestNumber = generateRequestNumber(totalRequestsCount + 1)

    const beforeString = beforeSnapshot ? JSON.stringify(beforeSnapshot) : null
    const requestedString =
      typeof input.requestedData === 'string'
        ? input.requestedData
        : JSON.stringify(input.requestedData)

    const request = await prisma.approvalRequest.create({
      data: {
        requestNumber,
        actionType: input.actionType,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        entityLabel: input.entityLabel ?? null,
        status: 'PENDING',
        beforeData: beforeString,
        requestedData: requestedString,
        entityUpdatedAt,
        targetUrl: input.targetUrl ?? null,
        reason: input.reason ?? null,
        requestedByUserId: context.userId,
      },
    })

    // Log request creation
    await auditService.log({
      action: 'REQUEST_SUBMITTED',
      entityType: input.entityType,
      entityId: input.entityId,
      entityLabel: input.entityLabel,
      details: `Demande ${requestNumber} soumise par ${context.userName || 'un utilisateur'} (${input.actionType})`,
      beforeData: beforeString,
      afterData: requestedString,
      approvalRequestId: request.id,
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    })

    return {
      appliedImmediately: false,
      status: 'PENDING',
      requestId: request.id,
      requestNumber: request.requestNumber,
    }
  },

  /**
   * Approves an ApprovalRequest (strictly Super Admin only)
   */
  async approveRequest(params: {
    requestId: string
    superAdminUserId: string
    superAdminRole: string
    overrideConflict?: boolean
    ipAddress?: string
    userAgent?: string
  }) {
    if (!isSuperAdminRole(params.superAdminRole)) {
      throw new Error('Seul le Super Admin a le privilège d’approuver une demande de modification.')
    }

    const request = await prisma.approvalRequest.findUnique({
      where: { id: params.requestId },
      include: { requestedBy: true },
    })

    if (!request) {
      throw new Error('Demande d’approbation introuvable.')
    }

    if (
      request.status !== 'PENDING' &&
      !(request.status === 'CONFLICTED' && params.overrideConflict)
    ) {
      throw new Error(
        `Cette demande ne peut pas être approuvée (Statut actuel: ${request.status}).`,
      )
    }

    const requestedData = JSON.parse(request.requestedData || '{}')
    const beforeData = request.beforeData ? JSON.parse(request.beforeData) : null

    // Conflict Check
    if (request.entityId && !params.overrideConflict) {
      let currentEntity: Record<string, unknown> | null = null
      if (request.entityType === 'Vehicle') {
        currentEntity = (await prisma.vehicle.findUnique({
          where: { id: request.entityId },
        })) as unknown as Record<string, unknown>
      }

      if (currentEntity && beforeData) {
        const conflict = detectEntityConflict({
          beforeSnapshot: beforeData,
          currentEntity,
          requestedChanges: requestedData,
        })

        if (conflict.hasConflict) {
          await prisma.approvalRequest.update({
            where: { id: request.id },
            data: {
              status: 'CONFLICTED',
              conflictDetails: JSON.stringify(conflict.conflictFields),
            },
          })

          throw new Error(
            'Conflit détecté : Les données de cet élément ont été modifiées depuis la soumission de la demande. Veuillez inspecter les différences.',
          )
        }
      }
    }

    // Apply the actual mutation in database
    await prisma.$transaction(async (tx) => {
      // 1. Vehicle Mutations
      if (request.entityType === 'Vehicle') {
        if (request.actionType === 'CREATE') {
          const count = await tx.vehicle.count()
          const code = `V-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

          await tx.vehicle.create({
            data: {
              code,
              vin: requestedData.vin,
              matricule: requestedData.matricule || null,
              brand: requestedData.brand,
              model: requestedData.model,
              version: requestedData.version || null,
              year: Number(requestedData.year) || new Date().getFullYear(),
              colorExterior: requestedData.colorExterior,
              colorInterior: requestedData.colorInterior || null,
              fuelType: requestedData.fuelType || 'DIESEL',
              transmission: requestedData.transmission || 'AUTOMATIQUE',
              mileage: Number(requestedData.mileage) || 0,
              purchasePrice: Number(requestedData.purchasePrice) || 0,
              targetSalePrice: Number(requestedData.targetSalePrice) || 0,
              status: 'IN_STOCK',
              location: requestedData.location || 'Casablanca Showroom',
              description: requestedData.description || null,
              parkId: requestedData.parkId || null,
            },
          })
        } else if (request.actionType === 'UPDATE' && request.entityId) {
          const validatedUpdate = vehicleUpdateSchema.parse(requestedData)
          await tx.vehicle.update({
            where: { id: request.entityId },
            data: validatedUpdate,
          })
        } else if (request.actionType === 'DELETE' && request.entityId) {
          await tx.vehicle.update({
            where: { id: request.entityId },
            data: {
              archivedAt: new Date(),
              status: 'ARCHIVED',
            },
          })
        }
      }

      // 2. Mark Approval Request as APPROVED
      await tx.approvalRequest.update({
        where: { id: request.id },
        data: {
          status: 'APPROVED',
          reviewedByUserId: params.superAdminUserId,
          reviewedAt: new Date(),
        },
      })
    })

    // Write Audit Log entry
    await auditService.log({
      action: `${request.entityType.toUpperCase()}_${request.actionType}_APPROVED`,
      entityType: request.entityType,
      entityId: request.entityId,
      entityLabel: request.entityLabel,
      details: `Demande ${request.requestNumber} approuvée par Super Admin (Demandée initialement par ${request.requestedBy.name})`,
      beforeData: request.beforeData,
      afterData: request.requestedData,
      approvalRequestId: request.id,
      userId: params.superAdminUserId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    })

    return { success: true, requestNumber: request.requestNumber }
  },

  /**
   * Rejects an ApprovalRequest with mandatory reason (strictly Super Admin only)
   */
  async rejectRequest(params: {
    requestId: string
    superAdminUserId: string
    superAdminRole: string
    rejectionReason: string
    ipAddress?: string
    userAgent?: string
  }) {
    if (!isSuperAdminRole(params.superAdminRole)) {
      throw new Error('Seul le Super Admin a le privilège de rejeter une demande.')
    }

    if (!params.rejectionReason || params.rejectionReason.trim().length < 5) {
      throw new Error('Le motif du rejet est obligatoire et doit comporter au moins 5 caractères.')
    }

    const request = await prisma.approvalRequest.findUnique({
      where: { id: params.requestId },
      include: { requestedBy: true },
    })

    if (!request) {
      throw new Error('Demande d’approbation introuvable.')
    }

    if (request.status !== 'PENDING' && request.status !== 'CONFLICTED') {
      throw new Error(`Cette demande ne peut pas être rejetée (Statut actuel: ${request.status}).`)
    }

    const updated = await prisma.approvalRequest.update({
      where: { id: request.id },
      data: {
        status: 'REJECTED',
        reviewedByUserId: params.superAdminUserId,
        reviewedAt: new Date(),
        rejectionReason: params.rejectionReason.trim(),
      },
    })

    // Write audit log
    await auditService.log({
      action: `${request.entityType.toUpperCase()}_${request.actionType}_REJECTED`,
      entityType: request.entityType,
      entityId: request.entityId,
      entityLabel: request.entityLabel,
      details: `Demande ${request.requestNumber} rejetée par Super Admin. Motif: ${params.rejectionReason.trim()}`,
      beforeData: request.beforeData,
      afterData: request.requestedData,
      approvalRequestId: request.id,
      userId: params.superAdminUserId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    })

    return { success: true, request: updated }
  },

  /**
   * Cancels a pending request (User self-service)
   */
  async cancelRequest(requestId: string, userId: string) {
    const request = await prisma.approvalRequest.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      throw new Error('Demande introuvable.')
    }

    if (request.requestedByUserId !== userId) {
      throw new Error('Vous ne pouvez annuler que vos propres demandes.')
    }

    if (request.status !== 'PENDING' && request.status !== 'CONFLICTED') {
      throw new Error('Seules les demandes en attente peuvent être annulées.')
    }

    return await prisma.approvalRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    })
  },

  /**
   * Returns live counts of pending requests for badges and widgets
   */
  async getPendingCounts() {
    const [totalPending, urgents, creations, updates, deletions, sales] = await Promise.all([
      prisma.approvalRequest.count({ where: { status: 'PENDING' } }),
      prisma.approvalRequest.count({
        where: {
          status: 'PENDING',
          actionType: { in: ['DELETE', 'PRICE_CHANGE'] },
        },
      }),
      prisma.approvalRequest.count({
        where: { status: 'PENDING', actionType: 'CREATE' },
      }),
      prisma.approvalRequest.count({
        where: { status: 'PENDING', actionType: 'UPDATE' },
      }),
      prisma.approvalRequest.count({
        where: { status: 'PENDING', actionType: 'DELETE' },
      }),
      prisma.approvalRequest.count({
        where: { status: 'PENDING', actionType: 'SALE' },
      }),
    ])

    return {
      totalPending,
      urgents,
      creations,
      updates,
      deletions,
      sales,
    }
  },

  /**
   * Lists requests with filters and pagination
   */
  async listRequests(filters: ApprovalFilterInput = { page: 1, limit: 20 }) {
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(100, Math.max(1, filters.limit || 20))
    const skip = (page - 1) * limit

    const where: Prisma.ApprovalRequestWhereInput = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.actionType) {
      where.actionType = filters.actionType
    }

    if (filters.entityType) {
      where.entityType = filters.entityType
    }

    if (filters.requestedByUserId) {
      where.requestedByUserId = filters.requestedByUserId
    }

    if (filters.search && filters.search.trim()) {
      const query = filters.search.trim()
      where.OR = [
        { requestNumber: { contains: query } },
        { entityLabel: { contains: query } },
        { reason: { contains: query } },
        { requestedBy: { name: { contains: query } } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.approvalRequest.findMany({
        where,
        include: {
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: { select: { name: true } },
            },
          },
          reviewedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.approvalRequest.count({ where }),
    ])

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    }
  },

  /**
   * Retrieves single request details including computed field diffs
   */
  async getRequestById(id: string) {
    const request = await prisma.approvalRequest.findUnique({
      where: { id },
      include: {
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: { select: { name: true } },
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!request) return null

    const beforeData = request.beforeData ? JSON.parse(request.beforeData) : null
    const requestedData = request.requestedData ? JSON.parse(request.requestedData) : null

    // Compute field differences
    const fieldDiffs = computeFieldDiff(beforeData, requestedData)

    return {
      ...request,
      beforeDataParsed: beforeData,
      requestedDataParsed: requestedData,
      fieldDiffs,
    }
  },

  /**
   * Retrieves any active pending request for a specific entity (e.g. for vehicle banner)
   */
  async getPendingRequestForEntity(entityType: string, entityId: string) {
    return await prisma.approvalRequest.findFirst({
      where: {
        entityType,
        entityId,
        status: { in: ['PENDING', 'CONFLICTED'] },
      },
      include: {
        requestedBy: {
          select: {
            id: true,
            name: true,
            role: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}
