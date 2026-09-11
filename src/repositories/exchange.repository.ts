import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export interface CreateExchangeInput {
  incomingVehicleId: string
  outgoingVehicleId: string
  incomingVehicleValue: number // minor units (centimes)
  outgoingVehicleValue: number // minor units (centimes)
  cashAdjustmentDirection: 'NONE' | 'COMPANY_TO_SUPPLIER' | 'SUPPLIER_TO_COMPANY'
  cashAdjustmentAmount?: number // minor units (centimes)
  paymentMethod?: string | null
  handledById?: string | null
  supplierName?: string | null
  supplierPhone?: string | null
  supplierCin?: string | null
  supplierAddress?: string | null
  supplierCity?: string | null
  notes?: string | null
}

export const exchangeRepository = {
  async create(data: CreateExchangeInput, tx?: Prisma.TransactionClient) {
    const client = tx || prisma
    const count = await client.vehicleExchange.count()
    const code = `ECH-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    return client.vehicleExchange.create({
      data: {
        code,
        incomingVehicleId: data.incomingVehicleId,
        outgoingVehicleId: data.outgoingVehicleId,
        incomingVehicleValue: data.incomingVehicleValue,
        outgoingVehicleValue: data.outgoingVehicleValue,
        cashAdjustmentDirection: data.cashAdjustmentDirection,
        cashAdjustmentAmount: data.cashAdjustmentAmount || 0,
        paymentMethod: data.paymentMethod || null,
        handledById: data.handledById || null,
        supplierName: data.supplierName || null,
        supplierPhone: data.supplierPhone || null,
        supplierCin: data.supplierCin || null,
        supplierAddress: data.supplierAddress || null,
        supplierCity: data.supplierCity || 'Casablanca',
        notes: data.notes || null,
      },
      include: {
        incomingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
        outgoingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
        handledBy: {
          select: { id: true, name: true, phone: true },
        },
      },
    })
  },

  async getById(id: string) {
    return prisma.vehicleExchange.findUnique({
      where: { id },
      include: {
        incomingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
            purchases: { take: 1 },
          },
        },
        outgoingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
        handledBy: {
          select: { id: true, name: true, phone: true },
        },
      },
    })
  },

  async getByIncomingVehicleId(incomingVehicleId: string) {
    return prisma.vehicleExchange.findUnique({
      where: { incomingVehicleId },
      include: {
        incomingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
        outgoingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
        handledBy: {
          select: { id: true, name: true, phone: true },
        },
      },
    })
  },

  async getByOutgoingVehicleId(outgoingVehicleId: string) {
    return prisma.vehicleExchange.findUnique({
      where: { outgoingVehicleId },
      include: {
        incomingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
        outgoingVehicle: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
        handledBy: {
          select: { id: true, name: true, phone: true },
        },
      },
    })
  },

  async getAll() {
    return prisma.vehicleExchange.findMany({
      include: {
        incomingVehicle: {
          select: {
            id: true,
            code: true,
            brand: true,
            model: true,
            year: true,
            matricule: true,
            purchasePrice: true,
            status: true,
          },
        },
        outgoingVehicle: {
          select: {
            id: true,
            code: true,
            brand: true,
            model: true,
            year: true,
            matricule: true,
            purchasePrice: true,
            status: true,
          },
        },
        handledBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}
