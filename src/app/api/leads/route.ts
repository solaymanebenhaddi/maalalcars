import { NextResponse } from 'next/server'
import { leadService } from '@/services/lead.service'
import { leadCreateSchema } from '@/validation/lead.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const source = searchParams.get('source') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const leads = await leadService.listLeads({ status, source, search })
    return NextResponse.json(leads)
  } catch (error: unknown) {
    console.error('API Leads GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = leadCreateSchema.parse(body)
    const lead = await leadService.createLead(validated)
    return NextResponse.json(lead, { status: 201 })
  } catch (error: unknown) {
    console.error('API Leads POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
