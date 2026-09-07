import { NextResponse } from 'next/server'
import { purchaseService } from '@/services/purchase.service'
import { purchaseCreateSchema } from '@/validation/purchase.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const purchases = await purchaseService.listPurchases({ status, search })
    return NextResponse.json(purchases)
  } catch (error: unknown) {
    console.error('API Purchases GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = purchaseCreateSchema.parse(body)
    const purchase = await purchaseService.createPurchase(validated)
    return NextResponse.json(purchase, { status: 201 })
  } catch (error: unknown) {
    console.error('API Purchases POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
