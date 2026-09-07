import { NextResponse } from 'next/server'
import { financeRepository } from '@/repositories/finance.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'

export async function GET() {
  try {
    const finance = await financeRepository.getFinancialOverview()
    const vehicles = await vehicleRepository.countByStatus()

    return NextResponse.json({
      finance,
      vehicles,
    })
  } catch (error: unknown) {
    console.error('API Dashboard stats GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
