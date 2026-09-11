import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import prisma from '@/lib/db'
import { exchangeService } from '@/services/exchange.service'
import { exchangeRepository } from '@/repositories/exchange.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { vehicleStateMachine } from '@/services/vehicle-state-machine.service'
import {
  canTransitionVehicleStatus,
  validateExchangeFinancials,
  toMinorUnits,
} from '@/domain/vehicle'

describe('REPRISE / ÉCHANGE Acquisition Workflow & Domain Rules', () => {
  let inStockVehicleId1: string
  let inStockVehicleId2: string
  let inStockVehicleId3: string
  let reservedVehicleId: string
  let workshopVehicleId: string
  let soldVehicleId: string
  let testUserId: string

  const createdVehicleIds: string[] = []

  beforeAll(async () => {
    // 1. Create a test user for handledBy
    const user = await prisma.user.upsert({
      where: { email: 'exchange-tester@maalalcars.ma' },
      update: {},
      create: {
        email: 'exchange-tester@maalalcars.ma',
        name: 'Agent Reprise Test',
        passwordHash: 'dummyhash',
        role: {
          connectOrCreate: {
            where: { name: 'Directeur Commercial' },
            create: { name: 'Directeur Commercial' },
          },
        },
      },
    })
    testUserId = user.id

    // 2. Create in-stock vehicles
    const v1 = await prisma.vehicle.create({
      data: {
        code: 'TEST-ECH-STK-01',
        vin: 'TESTECHVIN0000001',
        brand: 'BMW',
        model: 'X5',
        year: 2022,
        colorExterior: 'Noir',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 45000,
        purchasePrice: 500000,
        targetSalePrice: 550000,
        status: 'IN_STOCK',
      },
    })
    inStockVehicleId1 = v1.id
    createdVehicleIds.push(v1.id)

    const v2 = await prisma.vehicle.create({
      data: {
        code: 'TEST-ECH-STK-02',
        vin: 'TESTECHVIN0000002',
        brand: 'Mercedes-Benz',
        model: 'GLC',
        year: 2021,
        colorExterior: 'Gris',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 55000,
        purchasePrice: 400000,
        targetSalePrice: 450000,
        status: 'IN_STOCK',
      },
    })
    inStockVehicleId2 = v2.id
    createdVehicleIds.push(v2.id)

    const v3 = await prisma.vehicle.create({
      data: {
        code: 'TEST-ECH-STK-03',
        vin: 'TESTECHVIN0000003',
        brand: 'Volkswagen',
        model: 'Touareg',
        year: 2020,
        colorExterior: 'Blanc',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 70000,
        purchasePrice: 350000,
        targetSalePrice: 390000,
        status: 'IN_STOCK',
      },
    })
    inStockVehicleId3 = v3.id
    createdVehicleIds.push(v3.id)

    // 3. Create a reserved vehicle
    const vRes = await prisma.vehicle.create({
      data: {
        code: 'TEST-ECH-RES-01',
        vin: 'TESTECHVIN0000RES',
        brand: 'Audi',
        model: 'Q5',
        year: 2023,
        colorExterior: 'Bleu',
        fuelType: 'HYBRIDE',
        transmission: 'AUTOMATIQUE',
        mileage: 20000,
        purchasePrice: 480000,
        targetSalePrice: 520000,
        status: 'RESERVED',
      },
    })
    reservedVehicleId = vRes.id
    createdVehicleIds.push(vRes.id)

    await prisma.reservation.create({
      data: {
        code: 'RES-TEST-ECH-01',
        vehicleId: reservedVehicleId,
        depositAmount: 20000,
        paymentMethod: 'VIREMENT',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 86400000 * 7),
        status: 'ACTIVE',
        clientName: 'Client Réservation Test',
      },
    })

    // 4. Create a vehicle in repair/workshop
    const vRep = await prisma.vehicle.create({
      data: {
        code: 'TEST-ECH-REP-01',
        vin: 'TESTECHVIN0000REP',
        brand: 'Porsche',
        model: 'Macan',
        year: 2021,
        colorExterior: 'Noir',
        fuelType: 'ESSENCE',
        transmission: 'AUTOMATIQUE',
        mileage: 60000,
        purchasePrice: 580000,
        targetSalePrice: 650000,
        status: 'WORKSHOP',
      },
    })
    workshopVehicleId = vRep.id
    createdVehicleIds.push(vRep.id)

    await prisma.repair.create({
      data: {
        code: 'REP-TEST-ECH-01',
        vehicleId: workshopVehicleId,
        repairType: 'MECANIQUE',
        status: 'EN_COURS',
        startedAt: new Date(),
        estimatedAmount: 15000,
      },
    })

    // 5. Create a sold vehicle
    const vSold = await prisma.vehicle.create({
      data: {
        code: 'TEST-ECH-SLD-01',
        vin: 'TESTECHVIN0000SLD',
        brand: 'Range Rover',
        model: 'Velar',
        year: 2020,
        colorExterior: 'Gris',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 85000,
        purchasePrice: 420000,
        targetSalePrice: 470000,
        status: 'SOLD',
      },
    })
    soldVehicleId = vSold.id
    createdVehicleIds.push(vSold.id)
  })

  afterAll(async () => {
    // Cleanup created records
    try {
      await prisma.vehicleExchange.deleteMany({
        where: {
          code: { startsWith: 'ECH-' },
        },
      })
      await prisma.reservation.deleteMany({
        where: { code: 'RES-TEST-ECH-01' },
      })
      await prisma.repair.deleteMany({
        where: { code: 'REP-TEST-ECH-01' },
      })
      await prisma.archiveRecord.deleteMany({
        where: { entityCode: { startsWith: 'TEST-ECH-' } },
      })
      await prisma.vehicleStatusHistory.deleteMany({
        where: { vehicleId: { in: createdVehicleIds } },
      })
      await prisma.purchase.deleteMany({
        where: { vehicleId: { in: createdVehicleIds } },
      })
      await prisma.vehicle.deleteMany({
        where: {
          id: { in: createdVehicleIds },
        },
      })
      await prisma.vehicle.deleteMany({
        where: {
          vin: { startsWith: 'TESTECHVIN' },
        },
      })
    } catch {
      // ignore cleanup errors
    }
  })

  // =========================================================================
  // Test A: Vehicle-for-vehicle exchange with no soulte
  // =========================================================================
  it('A. Vehicle-for-vehicle exchange with no soulte succeeds and satisfies equation', async () => {
    const valCheck = validateExchangeFinancials({
      incomingVehicleValueDH: 500000,
      outgoingVehicleValueDH: 500000,
      direction: 'NONE',
      soulteAmountDH: 0,
    })
    expect(valCheck.isValid).toBe(true)

    const result = await exchangeService.executeExchange({
      outgoingVehicleId: inStockVehicleId1,
      outgoingVehicleValueDH: 500000,
      incomingVehicleValueDH: 500000,
      direction: 'NONE',
      soulteAmountDH: 0,
      handledById: testUserId,
      incomingVehicle: {
        brand: 'Audi',
        model: 'Q8 Test A',
        year: 2023,
        vin: 'TESTECHVININC001A',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 15000,
        colorExterior: 'Gris Nardo',
        fiscalPower: 12,
      },
      supplier: {
        supplierName: 'Fournisseur Test A',
        supplierCity: 'Casablanca',
      },
    })

    expect(result.incomingVehicle.id).toBeDefined()
    expect(result.incomingVehicle.status).toBe('IN_STOCK')
    expect(result.outgoingVehicle.status).toBe('ECHANGE')
    expect(result.exchange.cashAdjustmentDirection).toBe('NONE')
    expect(result.exchange.cashAdjustmentAmount).toBe(0)

    createdVehicleIds.push(result.incomingVehicle.id)
  })

  // =========================================================================
  // Test B: MAALAL CARS pays soulte (COMPANY_TO_SUPPLIER)
  // =========================================================================
  it('B. MAALAL CARS pays soulte: incoming (650k) = outgoing (550k) + soulte (100k)', async () => {
    const valCheck = validateExchangeFinancials({
      incomingVehicleValueDH: 650000,
      outgoingVehicleValueDH: 550000,
      direction: 'COMPANY_TO_SUPPLIER',
      soulteAmountDH: 100000,
    })
    expect(valCheck.isValid).toBe(true)

    const result = await exchangeService.executeExchange({
      outgoingVehicleId: inStockVehicleId2,
      outgoingVehicleValueDH: 550000,
      incomingVehicleValueDH: 650000,
      direction: 'COMPANY_TO_SUPPLIER',
      soulteAmountDH: 100000,
      soultePaymentMethod: 'VIREMENT',
      handledById: testUserId,
      incomingVehicle: {
        brand: 'Mercedes-Benz',
        model: 'GLE Test B',
        year: 2023,
        vin: 'TESTECHVININC001B',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 22000,
        colorExterior: 'Noir',
        fiscalPower: 11,
      },
      supplier: {
        supplierName: 'Auto Exclusive SARL',
        supplierCity: 'Rabat',
      },
    })

    expect(result.exchange.cashAdjustmentDirection).toBe('COMPANY_TO_SUPPLIER')
    expect(result.exchange.cashAdjustmentAmount).toBe(toMinorUnits(100000))
    expect(result.incomingVehicle.purchasePrice).toBe(650000)

    createdVehicleIds.push(result.incomingVehicle.id)
  })

  // =========================================================================
  // Test C: Supplier pays soulte (SUPPLIER_TO_COMPANY)
  // =========================================================================
  it('C. Supplier pays soulte: incoming (380k) = outgoing (420k) - soulte (40k)', async () => {
    const valCheck = validateExchangeFinancials({
      incomingVehicleValueDH: 380000,
      outgoingVehicleValueDH: 420000,
      direction: 'SUPPLIER_TO_COMPANY',
      soulteAmountDH: 40000,
    })
    expect(valCheck.isValid).toBe(true)

    const result = await exchangeService.executeExchange({
      outgoingVehicleId: inStockVehicleId3,
      outgoingVehicleValueDH: 420000,
      incomingVehicleValueDH: 380000,
      direction: 'SUPPLIER_TO_COMPANY',
      soulteAmountDH: 40000,
      soultePaymentMethod: 'CHEQUE',
      handledById: testUserId,
      incomingVehicle: {
        brand: 'Audi',
        model: 'A6 Test C',
        year: 2022,
        vin: 'TESTECHVININC001C',
        fuelType: 'HYBRIDE',
        transmission: 'AUTOMATIQUE',
        mileage: 38000,
        colorExterior: 'Argent',
        fiscalPower: 10,
      },
      supplier: {
        supplierName: 'Particulier Karim T.',
        supplierCity: 'Marrakech',
      },
    })

    expect(result.exchange.cashAdjustmentDirection).toBe('SUPPLIER_TO_COMPANY')
    expect(result.exchange.cashAdjustmentAmount).toBe(toMinorUnits(40000))
    expect(result.incomingVehicle.purchasePrice).toBe(380000)

    createdVehicleIds.push(result.incomingVehicle.id)
  })

  // =========================================================================
  // Test D: Invalid financial equation is rejected
  // =========================================================================
  it('D. Invalid financial equation is rejected by domain validator and service', async () => {
    // 650 000 != 550 000 + 50 000 (diff 50k)
    const check = validateExchangeFinancials({
      incomingVehicleValueDH: 650000,
      outgoingVehicleValueDH: 550000,
      direction: 'COMPANY_TO_SUPPLIER',
      soulteAmountDH: 50000,
    })
    expect(check.isValid).toBe(false)
    expect(check.errorMessage).toContain('Incohérence financière')

    await expect(
      exchangeService.executeExchange({
        outgoingVehicleId: inStockVehicleId1,
        outgoingVehicleValueDH: 550000,
        incomingVehicleValueDH: 650000,
        direction: 'COMPANY_TO_SUPPLIER',
        soulteAmountDH: 50000,
        incomingVehicle: {
          brand: 'BMW',
          model: 'X7',
          year: 2024,
          vin: 'TESTECHVININV000D',
          fuelType: 'DIESEL',
          transmission: 'AUTOMATIQUE',
          mileage: 5000,
          colorExterior: 'Bleu',
        },
      })
    ).rejects.toThrow(/Incohérence financière/i)
  })

  // =========================================================================
  // Test E: Reserved vehicle cannot be used as outgoing exchange vehicle
  // =========================================================================
  it('E. Reserved vehicle cannot be used as outgoing exchange vehicle', async () => {
    await expect(
      exchangeService.executeExchange({
        outgoingVehicleId: reservedVehicleId,
        outgoingVehicleValueDH: 480000,
        incomingVehicleValueDH: 480000,
        direction: 'NONE',
        soulteAmountDH: 0,
        incomingVehicle: {
          brand: 'Lexus',
          model: 'RX',
          year: 2023,
          vin: 'TESTECHVINRES000E',
          fuelType: 'HYBRIDE',
          transmission: 'AUTOMATIQUE',
          mileage: 12000,
          colorExterior: 'Blanc',
        },
      })
    ).rejects.toThrow(/réservation active|disponible en stock/i)
  })

  // =========================================================================
  // Test F: Repair vehicle cannot be used
  // =========================================================================
  it('F. Repair vehicle in workshop cannot be used as outgoing exchange vehicle', async () => {
    await expect(
      exchangeService.executeExchange({
        outgoingVehicleId: workshopVehicleId,
        outgoingVehicleValueDH: 580000,
        incomingVehicleValueDH: 580000,
        direction: 'NONE',
        soulteAmountDH: 0,
        incomingVehicle: {
          brand: 'Jaguar',
          model: 'F-Pace',
          year: 2022,
          vin: 'TESTECHVINREP000F',
          fuelType: 'DIESEL',
          transmission: 'AUTOMATIQUE',
          mileage: 30000,
          colorExterior: 'Noir',
        },
      })
    ).rejects.toThrow(/réparation en cours|disponible en stock/i)
  })

  // =========================================================================
  // Test G: Sold vehicle cannot be used
  // =========================================================================
  it('G. Sold vehicle cannot be used as outgoing exchange vehicle', async () => {
    await expect(
      exchangeService.executeExchange({
        outgoingVehicleId: soldVehicleId,
        outgoingVehicleValueDH: 420000,
        incomingVehicleValueDH: 420000,
        direction: 'NONE',
        soulteAmountDH: 0,
        incomingVehicle: {
          brand: 'Volvo',
          model: 'XC90',
          year: 2021,
          vin: 'TESTECHVINSLD000G',
          fuelType: 'DIESEL',
          transmission: 'AUTOMATIQUE',
          mileage: 45000,
          colorExterior: 'Gris',
        },
      })
    ).rejects.toThrow(/disponible en stock/i)
  })

  // =========================================================================
  // Test H: Already exchanged vehicle cannot be used
  // =========================================================================
  it('H. Already exchanged vehicle cannot be used in a second exchange as outgoing', async () => {
    // inStockVehicleId1 was already exchanged in Test A
    await expect(
      exchangeService.executeExchange({
        outgoingVehicleId: inStockVehicleId1,
        outgoingVehicleValueDH: 500000,
        incomingVehicleValueDH: 500000,
        direction: 'NONE',
        soulteAmountDH: 0,
        incomingVehicle: {
          brand: 'Maserati',
          model: 'Levante',
          year: 2022,
          vin: 'TESTECHVINSEC000H',
          fuelType: 'ESSENCE',
          transmission: 'AUTOMATIQUE',
          mileage: 28000,
          colorExterior: 'Bleu',
        },
      })
    ).rejects.toThrow(/disponible en stock|déjà été cédé/i)
  })

  // =========================================================================
  // Test I: Successful exchange archives outgoing vehicle
  // =========================================================================
  it('I. Successful exchange transitions outgoing vehicle to ECHANGE, sets archivedAt and creates ArchiveRecord', async () => {
    const outgoing = await prisma.vehicle.findUnique({
      where: { id: inStockVehicleId1 },
    })
    expect(outgoing).not.toBeNull()
    expect(outgoing?.status).toBe('ECHANGE')
    expect(outgoing?.archivedAt).not.toBeNull()

    const archiveRecord = await prisma.archiveRecord.findFirst({
      where: {
        entityId: inStockVehicleId1,
        archivedReason: 'REPRISE',
      },
    })
    expect(archiveRecord).not.toBeNull()
  })

  // =========================================================================
  // Test J: Incoming vehicle enters stock
  // =========================================================================
  it('J. Newly acquired vehicle enters active stock with status IN_STOCK and archivedAt=null', async () => {
    const incoming = await prisma.vehicle.findFirst({
      where: { vin: 'TESTECHVININC001A' },
    })
    expect(incoming).not.toBeNull()
    expect(incoming?.status).toBe('IN_STOCK')
    expect(incoming?.archivedAt).toBeNull()
  })

  // =========================================================================
  // Test K: Dashboard stock count updates correctly (no double-counting)
  // =========================================================================
  it('K. countByStatus() counts incoming in inStock, excludes outgoing from active stock, and counts outgoing in archived', async () => {
    const counts = await vehicleRepository.countByStatus()

    // Total must strictly equal inStock + reserved + workshop
    expect(counts.total).toBe(counts.inStock + counts.reserved + counts.workshop)

    // Verify inStockVehicleId1 (ECHANGE) is NOT in active inventory
    const activeList = await vehicleRepository.getAll({ status: 'Tous' })
    const foundOutgoing = activeList.find((v) => v.id === inStockVehicleId1)
    expect(foundOutgoing).toBeUndefined()

    // But it IS in archived list
    const archivedList = await vehicleRepository.getAll({ status: 'ARCHIVED' })
    const foundInArchive = archivedList.find((v) => v.id === inStockVehicleId1)
    expect(foundInArchive).toBeDefined()
    expect(foundInArchive?.status).toBe('ECHANGE')
  })

  // =========================================================================
  // Test L: Cross-reference works in both directions
  // =========================================================================
  it('L. Cross-reference works in both directions between incoming and outgoing vehicles', async () => {
    const incoming = await prisma.vehicle.findFirst({
      where: { vin: 'TESTECHVININC001A' },
    })
    expect(incoming).not.toBeNull()

    // 1. Query from incoming vehicle perspective
    const exchangeForIncoming = await exchangeService.getExchangeForVehicle(incoming!.id)
    expect(exchangeForIncoming).not.toBeNull()
    expect(exchangeForIncoming?.type).toBe('INCOMING')
    if (exchangeForIncoming && exchangeForIncoming.type === 'INCOMING') {
      expect(exchangeForIncoming.exchange.outgoingVehicle.id).toBe(inStockVehicleId1)
    }

    // 2. Query from outgoing vehicle perspective
    const exchangeForOutgoing = await exchangeService.getExchangeForVehicle(inStockVehicleId1)
    expect(exchangeForOutgoing).not.toBeNull()
    expect(exchangeForOutgoing?.type).toBe('OUTGOING')
    if (exchangeForOutgoing && exchangeForOutgoing.type === 'OUTGOING') {
      expect(exchangeForOutgoing.exchange.incomingVehicle.id).toBe(incoming!.id)
    }

    // 3. Verify repository direct relational queries
    const byIncoming = await exchangeRepository.getByIncomingVehicleId(incoming!.id)
    expect(byIncoming?.outgoingVehicleId).toBe(inStockVehicleId1)

    const byOutgoing = await exchangeRepository.getByOutgoingVehicleId(inStockVehicleId1)
    expect(byOutgoing?.incomingVehicleId).toBe(incoming!.id)
  })

  // =========================================================================
  // Test M: Audit events are created
  // =========================================================================
  it('M. Audit activity logs are recorded for both incoming and outgoing vehicles', async () => {
    const incoming = await prisma.vehicle.findFirst({
      where: { vin: 'TESTECHVININC001A' },
    })

    const incomingAudit = await prisma.activityLog.findFirst({
      where: {
        action: 'VEHICLE_ACQUIRED_BY_REPRISE',
        entityId: incoming!.id,
      },
    })
    expect(incomingAudit).not.toBeNull()
    expect(incomingAudit?.details).toContain('Véhicule acquis par reprise')

    const outgoingAudit = await prisma.activityLog.findFirst({
      where: {
        action: 'VEHICLE_EXITED_BY_REPRISE',
        entityId: inStockVehicleId1,
      },
    })
    expect(outgoingAudit).not.toBeNull()
    expect(outgoingAudit?.details).toContain('Véhicule sorti du parc par reprise')
  })

  // =========================================================================
  // Test N: Transaction rolls back if exchange creation fails
  // =========================================================================
  it('N. Transaction rolls back completely if any internal operation fails', async () => {
    // Create a temporary fresh vehicle in stock
    const tempVehicle = await prisma.vehicle.create({
      data: {
        code: 'TEST-ECH-ROLLBACK-01',
        vin: 'TESTECHVINROLLBACK1',
        brand: 'Hyundai',
        model: 'Tucson Rollback',
        year: 2022,
        colorExterior: 'Gris',
        fuelType: 'DIESEL',
        transmission: 'MANUELLE',
        mileage: 30000,
        purchasePrice: 200000,
        targetSalePrice: 230000,
        status: 'IN_STOCK',
      },
    })
    createdVehicleIds.push(tempVehicle.id)

    // Attempt an exchange with a duplicate VIN that will violate unique constraint on vehicle creation
    await expect(
      exchangeService.executeExchange({
        outgoingVehicleId: tempVehicle.id,
        outgoingVehicleValueDH: 200000,
        incomingVehicleValueDH: 200000,
        direction: 'NONE',
        soulteAmountDH: 0,
        incomingVehicle: {
          brand: 'Toyota',
          model: 'RAV4 Duplicate',
          year: 2023,
          vin: 'TESTECHVININC001A', // Already exists! Unique constraint violation
          fuelType: 'HYBRIDE',
          transmission: 'AUTOMATIQUE',
          mileage: 10000,
          colorExterior: 'Blanc',
        },
      })
    ).rejects.toThrow()

    // Assert that tempVehicle status was rolled back and is STILL IN_STOCK (not ECHANGE, not archived)
    const freshTemp = await prisma.vehicle.findUnique({
      where: { id: tempVehicle.id },
    })
    expect(freshTemp?.status).toBe('IN_STOCK')
    expect(freshTemp?.archivedAt).toBeNull()

    // Assert no exchange record exists for tempVehicle
    const exchangeExists = await prisma.vehicleExchange.findFirst({
      where: { outgoingVehicleId: tempVehicle.id },
    })
    expect(exchangeExists).toBeNull()
  })

  // =========================================================================
  // Test O: Exchanged vehicle cannot be sold or reserved again
  // =========================================================================
  it('O. Exchanged vehicle is blocked from being sold, reserved, or transitioned', async () => {
    // 1. Domain state machine invariants
    expect(canTransitionVehicleStatus('ECHANGE', 'SOLD')).toBe(false)
    expect(canTransitionVehicleStatus('ECHANGE', 'RESERVED')).toBe(false)
    expect(canTransitionVehicleStatus('ECHANGE', 'IN_STOCK')).toBe(false)
    expect(canTransitionVehicleStatus('ECHANGE', 'WORKSHOP')).toBe(false)

    // 2. State machine service transition rejection
    await expect(
      vehicleStateMachine.transitionVehicleStatus(inStockVehicleId1, 'RESERVED')
    ).rejects.toThrow(/Transition de statut non autorisée/i)

    await expect(
      vehicleStateMachine.transitionVehicleStatus(inStockVehicleId1, 'IN_STOCK')
    ).rejects.toThrow(/Transition de statut non autorisée/i)
  })
})
