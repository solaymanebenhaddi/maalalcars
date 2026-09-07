import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
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
      details: flags,
    })
  } catch (error: unknown) {
    console.error('API Features GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
