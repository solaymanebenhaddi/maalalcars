import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/session'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireApiAuth()
  if (auth instanceof NextResponse) return auth

  try {
    const flags = await prisma.featureFlag.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    const flagMap: Record<string, boolean> = {}
    for (const flag of flags) {
      flagMap[flag.key] = flag.enabled
    }

    return NextResponse.json({
      flags: flagMap,
    })
  } catch (error: unknown) {
    console.error('API Features GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 },
    )
  }
}
