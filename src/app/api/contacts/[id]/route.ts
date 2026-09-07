import { NextResponse } from 'next/server'
import { contactService } from '@/services/contact.service'
import { contactUpdateSchema } from '@/validation/contact.schema'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const contact = await contactService.getContactDetails(id)
    if (!contact) {
      return NextResponse.json({ error: 'Contact introuvable' }, { status: 404 })
    }
    return NextResponse.json(contact)
  } catch (error: unknown) {
    console.error('API Contact GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const body = await request.json()
    const validated = contactUpdateSchema.parse(body)
    const updated = await contactService.updateContact(id, validated)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('API Contact PATCH error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
