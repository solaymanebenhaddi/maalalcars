import { NextResponse } from 'next/server'
import { workshopService } from '@/services/workshop.service'
import { workshopOrderCreateSchema } from '@/validation/workshop.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const priority = searchParams.get('priority') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const orders = await workshopService.listOrders({ status, priority, search })
    return NextResponse.json(orders)
  } catch (error: unknown) {
    console.error('API Workshop GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = workshopOrderCreateSchema.parse(body)
    const order = await workshopService.createOrder(validated)
    return NextResponse.json(order, { status: 201 })
  } catch (error: unknown) {
    console.error('API Workshop POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
