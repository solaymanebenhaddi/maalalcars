import { NextResponse } from 'next/server'
import { paymentService } from '@/services/payment.service'
import { paymentCreateSchema } from '@/validation/payment.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || undefined
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const payments = await paymentService.listPayments({ type, status, search })
    return NextResponse.json(payments)
  } catch (error: unknown) {
    console.error('API Payments GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = paymentCreateSchema.parse(body)
    const payment = await paymentService.createPayment(validated)
    return NextResponse.json(payment, { status: 201 })
  } catch (error: unknown) {
    console.error('API Payments POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
