import { NextResponse } from 'next/server'
import { vehicleService } from '@/services/vehicle.service'
import { vehicleCreateSchema } from '@/validation/vehicle.schema'

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
    const body = await request.json()
    const validated = vehicleCreateSchema.parse(body)
    const vehicle = await vehicleService.createVehicle(validated)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error: unknown) {
    console.error('API Vehicles POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
