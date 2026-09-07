import { NextResponse } from 'next/server'
import { repairService } from '@/services/repair.service'
import { repairCompleteSchema, repairUpdateSchema } from '@/validation/repair.schema'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const repair = await repairService.getRepairDetails(id)
    if (!repair) {
      return NextResponse.json(
        { error: 'Réparation introuvable' },
        { status: 404 }
      )
    }
    return NextResponse.json(repair)
  } catch (error: unknown) {
    console.error('API Repair GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const body = await request.json()

    if (body.action === 'cancel') {
      const cancelled = await repairService.cancelRepair(id)
      return NextResponse.json(cancelled)
    }

    if (body.action === 'complete' || body.status === 'TERMINEE') {
      const validated = repairCompleteSchema.parse(body)
      const completed = await repairService.completeRepair(id, validated)
      return NextResponse.json(completed)
    }

    // Default update
    const validated = repairUpdateSchema.parse(body)
    const updated = await repairService.completeRepair(id, {
      finalAmount: validated.finalAmount || 0,
      paidById: validated.paidById,
      completedAt: validated.completedAt || new Date(),
      notes: validated.notes,
    })
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('API Repair PATCH error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur mise à jour' },
      { status: 400 }
    )
  }
}
