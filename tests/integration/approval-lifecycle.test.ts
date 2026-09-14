import { describe, it, expect, beforeAll } from 'vitest'
import prisma from '@/lib/db'
import { approvalService } from '@/services/approval.service'

describe('Approval & Audit Lifecycle Integration Tests', () => {
  let superAdminUser: { id: string; role: { name: string } }
  let regularUser: { id: string; role: { name: string } }
  let testVehicle: { id: string; brand: string; model: string; targetSalePrice: number; status: string }

  beforeAll(async () => {
    // 1. Resolve or create Super Admin
    const superAdminRole = await prisma.role.upsert({
      where: { name: 'Super Admin' },
      update: {},
      create: {
        name: 'Super Admin',
        description: 'Super Administrateur avec pouvoirs exclusifs',
      },
    })

    superAdminUser = await prisma.user.upsert({
      where: { email: 'integration-superadmin@maalalcars.com' },
      update: { roleId: superAdminRole.id },
      create: {
        email: 'integration-superadmin@maalalcars.com',
        name: 'Super Admin Test',
        passwordHash: 'dummyhash',
        roleId: superAdminRole.id,
        isActive: true,
      },
      include: { role: true },
    })

    // 2. Resolve or create Regular User (Vendeur)
    const vendeurRole = await prisma.role.upsert({
      where: { name: 'Vendeur' },
      update: {},
      create: {
        name: 'Vendeur',
        description: 'Vendeur commercial',
      },
    })

    regularUser = await prisma.user.upsert({
      where: { email: 'integration-vendeur@maalalcars.com' },
      update: { roleId: vendeurRole.id },
      create: {
        email: 'integration-vendeur@maalalcars.com',
        name: 'Vendeur Test',
        passwordHash: 'dummyhash',
        roleId: vendeurRole.id,
        isActive: true,
      },
      include: { role: true },
    })

    // 3. Create dedicated unique test vehicle for isolated testing
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    testVehicle = await prisma.vehicle.create({
      data: {
        code: `TST-APPR-${uniqueSuffix}`.substring(0, 30),
        vin: `VINAPPR${uniqueSuffix}`.substring(0, 17).padEnd(17, 'X'),
        brand: 'Mercedes-Benz',
        model: 'Classe C',
        year: 2023,
        colorExterior: 'Gris',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 30000,
        purchasePrice: 280000,
        targetSalePrice: 500000,
        status: 'IN_STOCK',
      },
    })
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
