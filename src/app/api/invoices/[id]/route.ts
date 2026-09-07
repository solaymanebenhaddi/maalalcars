import { NextResponse } from 'next/server'
import { invoiceService } from '@/services/invoice.service'
import { invoiceUpdateSchema } from '@/validation/invoice.schema'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const invoice = await invoiceService.getInvoiceDetails(id)
    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })
    }
    return NextResponse.json(invoice)
  } catch (error: unknown) {
    console.error('API Invoice GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const body = await request.json()
    const validated = invoiceUpdateSchema.parse(body)
    const updated = await invoiceService.updateInvoice(id, validated)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('API Invoice PATCH error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
