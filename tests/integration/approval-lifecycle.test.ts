import { describe, it, expect, beforeEach } from 'vitest'
import prisma from '@/lib/db'
import { approvalService } from '@/services/approval.service'

describe('Approval & Audit Lifecycle Integration Tests', () => {
  let superAdminUser: { id: string; role: { name: string } }
  let regularUser: { id: string; role: { name: string } }
  let testVehicle: { id: string; brand: string; model: string; targetSalePrice: number; status: string }

  beforeEach(async () => {
    // 1. Resolve Super Admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: { name: 'Super Admin' } },
      include: { role: true },
    })
    if (!superAdmin) throw new Error('Super Admin not found in test DB')
    superAdminUser = superAdmin

    // 2. Resolve Regular User (Vendeur or Commercial)
    const vendeur = await prisma.user.findFirst({
      where: { role: { name: { in: ['Vendeur', 'Gestionnaire'] } } },
      include: { role: true },
    })
    if (!vendeur) throw new Error('Regular user not found in test DB')
    regularUser = vendeur

    // 3. Resolve or create active test vehicle
    const vehicle = await prisma.vehicle.findFirst({
      where: { archivedAt: null, status: 'IN_STOCK' },
    })
    if (!vehicle) throw new Error('Test vehicle not found in DB')
    testVehicle = vehicle
  })

  it('verifies non-Super-Admin mutation creates a PENDING ApprovalRequest without altering live vehicle', async () => {
    const originalPrice = testVehicle.targetSalePrice
    const requestedPrice = originalPrice + 15000

    // Non-Super-Admin requests price update
    const result = await approvalService.requestMutation(
      {
        actionType: 'UPDATE',
        entityType: 'Vehicle',
        entityId: testVehicle.id,
        entityLabel: `${testVehicle.brand} ${testVehicle.model}`,
        requestedData: { targetSalePrice: requestedPrice },
        targetUrl: `/vehicles/${testVehicle.id}`,
        reason: 'Ajustement commercial suite demande client',
      },
      {
        userId: regularUser.id,
        userRole: regularUser.role.name,
        userName: 'Test Vendeur',
      }
    )

    expect(result.appliedImmediately).toBe(false)
    expect(result.status).toBe('PENDING')
    expect(result.requestNumber).toMatch(/^REQ-\d{4}-\d{5}$/)
    expect(result.requestId).toBeDefined()

    // Verify Vehicle in DB is UNCHANGED
    const freshVehicle = await prisma.vehicle.findUnique({
      where: { id: testVehicle.id },
    })
    expect(freshVehicle?.targetSalePrice).toBe(originalPrice)

    // Now Super Admin approves the request
    const approvalResult = await approvalService.approveRequest({
      requestId: result.requestId!,
      superAdminUserId: superAdminUser.id,
      superAdminRole: superAdminUser.role.name,
    })

    expect(approvalResult.success).toBe(true)

    // Verify Vehicle in DB is NOW UPDATED
    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id: testVehicle.id },
    })
    expect(updatedVehicle?.targetSalePrice).toBe(requestedPrice)

    // Verify Audit Logs are generated: both submission and approval
    const logs = await prisma.activityLog.findMany({
      where: { approvalRequestId: result.requestId },
      orderBy: { createdAt: 'asc' },
    })
    expect(logs.length).toBeGreaterThanOrEqual(2)
    expect(logs.some((l) => l.action === 'REQUEST_SUBMITTED')).toBe(true)
    expect(logs.some((l) => l.action === 'VEHICLE_UPDATE_APPROVED' && l.userId === superAdminUser.id)).toBe(true)

    // Reset vehicle price back to original
    await prisma.vehicle.update({
      where: { id: testVehicle.id },
      data: { targetSalePrice: originalPrice },
    })
  })

  it('verifies non-Super-Admin cannot approve requests', async () => {
    // Create pending request
    const req = await approvalService.requestMutation(
      {
        actionType: 'UPDATE',
        entityType: 'Vehicle',
        entityId: testVehicle.id,
        requestedData: { mileage: 80000 },
      },
      {
        userId: regularUser.id,
        userRole: regularUser.role.name,
      }
    )

    // Non-Super-Admin attempts approval
    await expect(
      approvalService.approveRequest({
        requestId: req.requestId!,
        superAdminUserId: regularUser.id,
        superAdminRole: regularUser.role.name,
      })
    ).rejects.toThrow('Seul le Super Admin')
  })

  it('verifies rejection does not alter entity and records mandatory rejection reason', async () => {
    // Request deletion
    const req = await approvalService.requestMutation(
      {
        actionType: 'DELETE',
        entityType: 'Vehicle',
        entityId: testVehicle.id,
        requestedData: { action: 'DELETE' },
        reason: 'Erreur de saisie supposée',
      },
      {
        userId: regularUser.id,
        userRole: regularUser.role.name,
      }
    )

    // Super Admin rejects with reason
    const rejectionReason = "Le véhicule est physiquement en stock à Casablanca. Ne pas supprimer."
    const rejectResult = await approvalService.rejectRequest({
      requestId: req.requestId!,
      superAdminUserId: superAdminUser.id,
      superAdminRole: superAdminUser.role.name,
      rejectionReason,
    })

    expect(rejectResult.success).toBe(true)
    expect(rejectResult.request.status).toBe('REJECTED')
    expect(rejectResult.request.rejectionReason).toBe(rejectionReason)

    // Verify Vehicle remains ACTIVE in DB (not archived)
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: testVehicle.id },
    })
    expect(vehicle?.archivedAt).toBeNull()
    expect(vehicle?.status).toBe('IN_STOCK')

    // Verify rejection audit log exists
    const rejectAudit = await prisma.activityLog.findFirst({
      where: {
        approvalRequestId: req.requestId,
        action: 'VEHICLE_DELETE_REJECTED',
      },
    })
    expect(rejectAudit).toBeDefined()
    expect(rejectAudit?.details).toContain(rejectionReason)
  })
})
