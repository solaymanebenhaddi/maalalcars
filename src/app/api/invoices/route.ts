import { NextResponse } from 'next/server'
import { invoiceService } from '@/services/invoice.service'
import { invoiceCreateSchema } from '@/validation/invoice.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const invoices = await invoiceService.listInvoices({ status, search })
    return NextResponse.json(invoices)
  } catch (error: unknown) {
    console.error('API Invoices GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = invoiceCreateSchema.parse(body)
    const invoice = await invoiceService.createInvoice(validated)
    return NextResponse.json(invoice, { status: 201 })
  } catch (error: unknown) {
    console.error('API Invoices POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
