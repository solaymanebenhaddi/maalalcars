import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getActiveUserRole } from '@/lib/auth-roles'

export async function GET() {
  const active = await getActiveUserRole()
  return NextResponse.json(active)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { role } = body // 'super_admin' | 'vendeur'

    const cookieStore = await cookies()
    if (role === 'vendeur') {
      cookieStore.set('maalal_active_role', 'vendeur', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    } else {
      cookieStore.set('maalal_active_role', 'super_admin', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
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
