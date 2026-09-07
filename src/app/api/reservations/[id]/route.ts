import { NextResponse } from 'next/server'
import { reservationService } from '@/services/reservation.service'
import { reservationUpdateSchema } from '@/validation/reservation.schema'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const reservation = await reservationService.getReservationDetails(id)
    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation introuvable' },
        { status: 404 }
      )
    }
    return NextResponse.json(reservation)
  } catch (error: unknown) {
    console.error('API Reservation GET error:', error)
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
      const cancelled = await reservationService.cancelReservation(id)
      return NextResponse.json(cancelled)
    }

    const validated = reservationUpdateSchema.parse(body)
    const updated = await reservationService.updateReservation(id, validated)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('API Reservation PATCH error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur mise à jour' },
      { status: 400 }
    )
  }
}
