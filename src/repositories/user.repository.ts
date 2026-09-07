import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const userRepository = {
  async getAll(params: { roleId?: string; isActive?: boolean; search?: string } = {}) {
    const where: Prisma.UserWhereInput = {
      archivedAt: null,
    }

    if (params.roleId) where.roleId = params.roleId
    if (params.isActive !== undefined) where.isActive = params.isActive

    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { email: { contains: params.search } },
        { phone: { contains: params.search } },
      ]
    }

    return prisma.user.findMany({
      where,
      include: {
        role: {
          include: { permissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: { permissions: true },
        },
        activityLogs: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },

  async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: { permissions: true },
        },
      },
    })
  },

  async getRoles() {
    return prisma.role.findMany({
      include: {
        permissions: true,
        _count: { select: { users: true } },
      },
    })
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: { role: true },
    })
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    })
  },
}
