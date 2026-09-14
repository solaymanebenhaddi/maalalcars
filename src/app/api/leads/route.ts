import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/session'
import { leadService } from '@/services/lead.service'
import { leadCreateSchema } from '@/validation/lead.schema'

export async function GET(request: Request) {
  const auth = await requireApiAuth()
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const source = searchParams.get('source') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const leads = await leadService.listLeads({ status, source, search })
    return NextResponse.json(leads)
  } catch (error: unknown) {
    console.error('API Leads GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAuth()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const validated = leadCreateSchema.parse(body)
    const lead = await leadService.createLead(validated)
    return NextResponse.json(lead, { status: 201 })
  } catch (error: unknown) {
    console.error('API Leads POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Validation échouée' },
      { status: 400 },
    )
  }
}
