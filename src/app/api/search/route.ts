import { NextResponse } from 'next/server'
import { systemRepository } from '@/repositories/system.repository'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  try {
    const results = await systemRepository.globalSearch(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('API Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
