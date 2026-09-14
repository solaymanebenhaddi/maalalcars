import { NextResponse } from 'next/server'
import { vehicleService } from '@/services/vehicle.service'
import { vehicleCreateSchema } from '@/validation/vehicle.schema'
import { getActiveUserRole } from '@/lib/auth-roles'
import { approvalService } from '@/services/approval.service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand') || undefined
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const vehicles = await vehicleService.listVehicles({ brand, status, search })
    return NextResponse.json(vehicles)
  } catch (error: unknown) {
    console.error('API Vehicles GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const validated = vehicleCreateSchema.parse(body)

    const result = await approvalService.requestMutation(
      {
        actionType: 'CREATE',
        entityType: 'Vehicle',
        entityLabel: `${validated.brand} ${validated.model} (${validated.matricule || validated.vin})`,
        requestedData: validated,
        targetUrl: '/vehicles',
        reason: body.reason || 'Demande d’ajout d’un nouveau véhicule au parc',
      },
      {
        userId: activeUser.id,
        userRole: activeUser.role,
        userName: activeUser.name,
      },
      async () => {
        return await vehicleService.createVehicle(validated, activeUser.id)
      }
    )

    return NextResponse.json(
      result.appliedImmediately ? result.data : result,
      { status: result.appliedImmediately ? 201 : 202 }
    )
  } catch (error: unknown) {
    console.error('API Vehicles POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
