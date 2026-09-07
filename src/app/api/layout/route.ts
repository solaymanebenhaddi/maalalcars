import { NextResponse } from 'next/server'
import { getActiveUserRole } from '@/lib/auth-roles'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getActiveUserRole()
    if (!user || user.role === 'Invité' || !user.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const [vehicleCount, parkCount, activeReservationCount, parks] = await Promise.all([
      prisma.vehicle.count({ where: { archivedAt: null } }),
      prisma.park.count(),
      prisma.reservation.count({ where: { status: { in: ['ACTIVE', 'EXPIRING'] } } }),
      prisma.park.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { vehicles: { where: { archivedAt: null } } } },
        },
        orderBy: { name: 'asc' },
      }),
    ])

    return NextResponse.json({
      user: { name: user.name, email: user.email, role: user.role },
      counts: { vehicles: vehicleCount, parks: parkCount, activeReservations: activeReservationCount },
      parks: parks.map((p) => ({ id: p.id, name: p.name, vehicleCount: p._count.vehicles })),
    })
  } catch (error: unknown) {
    console.error('API Layout GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
