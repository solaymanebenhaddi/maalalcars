import { NextResponse } from 'next/server'
import { contactService } from '@/services/contact.service'
import { contactCreateSchema } from '@/validation/contact.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || undefined
  const segment = searchParams.get('segment') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const contacts = await contactService.listContacts({ role, segment, search })
    return NextResponse.json(contacts)
  } catch (error: unknown) {
    console.error('API Contacts GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = contactCreateSchema.parse(body)
    const contact = await contactService.createContact(validated)
    return NextResponse.json(contact, { status: 201 })
  } catch (error: unknown) {
    console.error('API Contacts POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
