import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/session'
import { vehicleService } from '@/services/vehicle.service'
import { vehicleUpdateSchema } from '@/validation/vehicle.schema'
import { getActiveUserRole } from '@/lib/auth-roles'
import { approvalService } from '@/services/approval.service'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireApiAuth()
  if (auth instanceof NextResponse) return auth

  const { id } = await context.params
  try {
    const vehicle = await vehicleService.getVehicleDetails(id)
    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule introuvable' }, { status: 404 })
    }
    return NextResponse.json(vehicle)
  } catch (error: unknown) {
    console.error('API Vehicle GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const validated = vehicleUpdateSchema.parse(body)

    const existing = await vehicleService.getVehicleDetails(id)
    const entityLabel = existing ? `${existing.brand} ${existing.model} (${existing.matricule || existing.vin})` : `Véhicule ${id}`

    const result = await approvalService.requestMutation(
      {
        actionType: 'UPDATE',
        entityType: 'Vehicle',
        entityId: id,
        entityLabel,
        requestedData: validated,
        targetUrl: `/vehicles/${id}`,
        reason: body.changeReason || 'Mise à jour des informations du véhicule',
      },
      {
        userId: activeUser.id,
        userRole: activeUser.role,
        userName: activeUser.name,
      },
      async () => {
        return await vehicleService.updateVehicle(id, validated, activeUser.id)
      }
    )

    return NextResponse.json(result, { status: result.appliedImmediately ? 200 : 202 })
  } catch (error: unknown) {
    console.error('API Vehicle PATCH error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const activeUser = await getActiveUserRole()
    if (!activeUser || activeUser.role === 'Invité') {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const existing = await vehicleService.getVehicleDetails(id)
    const entityLabel = existing ? `${existing.brand} ${existing.model} (${existing.matricule || existing.vin})` : `Véhicule ${id}`

    const result = await approvalService.requestMutation(
      {
        actionType: 'DELETE',
        entityType: 'Vehicle',
        entityId: id,
        entityLabel,
        requestedData: { action: 'DELETE' },
        targetUrl: `/vehicles/${id}`,
        reason: 'Demande de suppression du véhicule',
      },
      {
        userId: activeUser.id,
        userRole: activeUser.role,
        userName: activeUser.name,
      },
      async () => {
        return await vehicleService.deleteVehicle(id, activeUser.id)
      }
    )

    return NextResponse.json({ success: true, ...result }, { status: result.appliedImmediately ? 200 : 202 })
  } catch (error: unknown) {
    console.error('API Vehicle DELETE error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
