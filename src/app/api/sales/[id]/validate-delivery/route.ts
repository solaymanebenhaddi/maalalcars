import { NextResponse } from 'next/server'
import { saleService } from '@/services/sale.service'
import { getActiveUserRole, isSuperAdminRole } from '@/lib/auth-roles'

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const activeUser = await getActiveUserRole()

    if (!isSuperAdminRole(activeUser.role)) {
      return NextResponse.json(
        {
          error: 'Accès refusé : Seul le Super Admin est autorisé à valider définitivement la vente, livrer le véhicule et l’archiver.',
        },
        { status: 403 }
      )
    }

    const result = await saleService.validateSaleAndDeliver(
      id,
      activeUser.role,
      activeUser.id
    )

    return NextResponse.json({
      success: true,
      message: 'Vente validée et livraison effectuée par le Super Admin. Véhicule archivé hors stock.',
      sale: result.sale,
      vehicle: result.vehicle,
    })
  } catch (error: unknown) {
    console.error('API Sale validate-delivery error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la validation' },
      { status: 500 }
    )
  }
}
