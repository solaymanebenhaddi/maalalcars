import prisma from '@/lib/db'

export interface CreateParkInput {
  name: string
  city: string
  code?: string
  address: string
  phone?: string | null
  managerName?: string | null
  capacity?: number
  isActive?: boolean
}

export interface UpdateParkInput {
  name?: string
  city?: string
  address?: string
  phone?: string | null
  managerName?: string | null
  capacity?: number
  isActive?: boolean
}

export const parkRepository = {
  async getAll(includeInactive = false) {
    const parks = await prisma.park.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        vehicles: {
          select: {
            id: true,
            status: true,
            purchasePrice: true,
            targetSalePrice: true,
            archivedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return parks.map((park) => {
      const activeVehicles = park.vehicles.filter((v) => v.status !== 'ARCHIVED' && !v.archivedAt && v.status !== 'SOLD')
      const inStockCount = activeVehicles.filter((v) => v.status === 'IN_STOCK').length
      const reservedCount = activeVehicles.filter((v) => v.status === 'RESERVED').length
      const totalVehicles = activeVehicles.length
      const occupancyRate = park.capacity > 0 ? Math.round((totalVehicles / park.capacity) * 100) : 0
      const totalStockValue = activeVehicles
        .reduce((sum, v) => sum + (v.targetSalePrice || v.purchasePrice || 0), 0)

      return {
        ...park,
        totalVehicles,
        inStockCount,
        reservedCount,
        occupancyRate,
        totalStockValue,
      }
    })
  },

  async getById(id: string) {
    return prisma.park.findUnique({
      where: { id },
      include: {
        vehicles: {
          include: {
            photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
            reservations: {
              where: { status: 'ACTIVE' },
              include: { contact: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },

  async create(data: CreateParkInput) {
    let code = data.code
    if (!code) {
      const count = await prisma.park.count()
      const cityPrefix = data.city.slice(0, 3).toUpperCase()
      code = `PRK-${cityPrefix}-${String(count + 1).padStart(2, '0')}`
    }

    const capacity = Math.min(Math.max(data.capacity || 40, 1), 1000)

    return prisma.park.create({
      data: {
        code,
        name: data.name,
        city: data.city,
        address: data.address,
        phone: data.phone || null,
        managerName: data.managerName || null,
        capacity,
        isActive: data.isActive ?? true,
      },
    })
  },

  async update(id: string, data: UpdateParkInput) {
    const updateData = { ...data }
    if (updateData.capacity !== undefined) {
      updateData.capacity = Math.min(Math.max(updateData.capacity, 1), 1000)
    }

    return prisma.park.update({
      where: { id },
      data: updateData,
    })
  },

  async delete(id: string) {
    // Soft delete / deactivate or delete if no vehicles
    const park = await prisma.park.findUnique({
      where: { id },
      include: { vehicles: true },
    })

    if (!park) throw new Error('Parc non trouvé')
    if (park.vehicles.length > 0) {
      return prisma.park.update({
        where: { id },
        data: { isActive: false },
      })
    }

    return prisma.park.delete({
      where: { id },
    })
  },

  async transferVehicle(vehicleId: string, targetParkId: string) {
    const targetPark = await prisma.park.findUnique({ where: { id: targetParkId } })
    if (!targetPark) throw new Error('Parc de destination introuvable')

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        parkId: targetParkId,
        location: targetPark.name,
      },
    })
  },
}
