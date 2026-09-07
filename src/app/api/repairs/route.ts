import { NextResponse } from 'next/server'
import { repairService } from '@/services/repair.service'
import { repairCreateSchema } from '@/validation/repair.schema'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const vehicleId = searchParams.get('vehicleId') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const repairs = await repairService.listRepairs({ status, vehicleId, search })
    return NextResponse.json(repairs)
  } catch (error: unknown) {
    console.error('API Repairs GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = repairCreateSchema.parse(body)
    const repair = await repairService.createRepair(validated)
    return NextResponse.json(repair, { status: 201 })
  } catch (error: unknown) {
    console.error('API Repairs POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Validation échouée' },
      { status: 400 }
    )
  }
}
