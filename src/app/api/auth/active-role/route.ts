import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'
import { getServerSession } from '@/lib/session'

export async function GET() {
  const sessionUser = await getServerSession()
  if (!sessionUser) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  const active = await getActiveUserRole()
  return NextResponse.json(active)
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    if (!isSuperAdminRole(sessionUser.role.name)) {
      return NextResponse.json(
        { error: 'Seul le Super Admin peut changer de perspective de rôle' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { role } = body // 'super_admin' | 'vendeur'

    const cookieStore = await cookies()
    if (role === 'vendeur') {
      cookieStore.set('maalal_active_role', 'vendeur', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    } else {
      cookieStore.delete('maalal_active_role')
    }

    const updated = await getActiveUserRole()
    return NextResponse.json({ success: true, active: updated })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du changement de rôle' },
      { status: 400 }
    )
  }
}
