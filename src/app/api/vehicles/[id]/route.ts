import { NextResponse } from 'next/server'
import { vehicleService } from '@/services/vehicle.service'
import { vehicleUpdateSchema } from '@/validation/vehicle.schema'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
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
    const body = await request.json()
    const validated = vehicleUpdateSchema.parse(body)
    const updated = await vehicleService.updateVehicle(id, validated)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('API Vehicle PATCH error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
