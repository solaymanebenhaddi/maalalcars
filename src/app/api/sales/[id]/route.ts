import { NextResponse } from 'next/server'
import { saleService } from '@/services/sale.service'
import { saleUpdateSchema } from '@/validation/sale.schema'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const sale = await saleService.getSaleDetails(id)
    if (!sale) {
      return NextResponse.json({ error: 'Vente introuvable' }, { status: 404 })
    }
    return NextResponse.json(sale)
  } catch (error: unknown) {
    console.error('API Sale GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const body = await request.json()
    const validated = saleUpdateSchema.parse(body)

    if (validated.status === 'DELIVERED') {
      const activeUser = await getActiveUserRole()
      if (!isSuperAdminRole(activeUser.role)) {
        return NextResponse.json(
          {
            error: 'Accès refusé : Seul le Super Admin est autorisé à valider définitivement la vente et la livraison.',
          },
          { status: 403 }
        )
      }
    }

    const updated = await saleService.updateSale(id, validated)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    console.error('API Sale PATCH error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
