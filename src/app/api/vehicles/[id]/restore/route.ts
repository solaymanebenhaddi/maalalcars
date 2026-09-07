import { NextResponse } from 'next/server'
import { vehicleService } from '@/services/vehicle.service'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const activeUser = await getActiveUserRole()

    if (!isSuperAdminRole(activeUser.role)) {
      return NextResponse.json(
        { error: 'Seul le Super Admin est autorisé à restaurer un véhicule des archives.' },
        { status: 403 }
      )
    }

    const restored = await vehicleService.restoreVehicle(
      id,
      activeUser.role,
      activeUser.id,
      'Restauration par le Super Admin'
    )

    return NextResponse.json({ success: true, vehicle: restored })
  } catch (error: unknown) {
    console.error('API Vehicle Restore error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la restauration' },
      { status: 500 }
    )
  }
}
