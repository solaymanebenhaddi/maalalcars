import { NextResponse } from 'next/server'
import { reservationService } from '@/services/reservation.service'
import { reservationCreateSchema } from '@/validation/reservation.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const reservations = await reservationService.listReservations({ status, search })
    return NextResponse.json(reservations)
  } catch (error: unknown) {
    console.error('API Reservations GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = reservationCreateSchema.parse(body)
    const reservation = await reservationService.createReservation(validated)
    return NextResponse.json(reservation, { status: 201 })
  } catch (error: unknown) {
    console.error('API Reservations POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
