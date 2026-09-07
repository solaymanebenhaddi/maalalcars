import { NextResponse } from 'next/server'
import { saleService } from '@/services/sale.service'
import { saleCreateSchema } from '@/validation/sale.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const sales = await saleService.listSales({ status, search })
    return NextResponse.json(sales)
  } catch (error: unknown) {
    console.error('API Sales GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = saleCreateSchema.parse(body)
    const sale = await saleService.createSale(validated)
    return NextResponse.json(sale, { status: 201 })
  } catch (error: unknown) {
    console.error('API Sales POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
