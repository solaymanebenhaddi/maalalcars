import React from 'react'
import { prisma } from '@/lib/db'
import { UsersDashboardClient, UserItem, UsersDashboardStats } from '@/features/users/users-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const [users, rolesCount, activitiesCount] = await Promise.all([
    prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.role.count(),
    prisma.activityLog.count(),
  ])

  const formattedUsers: UserItem[] = users.map((u, index) => {
    const rawName = u.name?.trim() || u.email.split('@')[0]
    const parts = rawName.split(' ')
    const avatar =
      parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : rawName.slice(0, 2).toUpperCase()

    return {
      id: u.id,
      index: index + 1,
      name: u.name || u.email,
      avatar,
      email: u.email,
      role: u.role?.name || 'Utilisateur',
      status: u.isActive ? 'Actif' : 'Inactif',
      statusColor: u.isActive
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
      lastLogin: new Date(u.updatedAt || u.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }
  })

  const stats: UsersDashboardStats = {
    activeUsers: users.filter((u) => u.isActive).length,
    pendingInvitations: 0,
    definedRoles: rolesCount,
    recentActivity: activitiesCount,
  }

  return <UsersDashboardClient initialUsers={formattedUsers} initialStats={stats} />
}
