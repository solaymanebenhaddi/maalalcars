import { NextResponse } from 'next/server'
import { vehicleService } from '@/services/vehicle.service'
import { getServerSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Une liste d\'identifiants de véhicules valide est requise' },
        { status: 400 }
      )
    }

    const result = await vehicleService.deleteMultipleVehicles(ids, session.id)

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} véhicule(s) supprimé(s), ${result.archivedCount} archivé(s).`,
      ...result,
    })
  } catch (error: unknown) {
    console.error('API Vehicles Bulk Delete error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la suppression groupée' },
      { status: 500 }
    )
  }
}
