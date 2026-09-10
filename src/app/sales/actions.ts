'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { saleService } from '@/services/sale.service'
import { paymentMethods } from '@/validation/sale.schema'

type PaymentMethodType = (typeof paymentMethods)[number]

function isRedirectError(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      ((error as { digest: string }).digest.startsWith('NEXT_REDIRECT') ||
        (error as { digest: string }).digest.startsWith('NEXT_NOT_FOUND'))
  )
}

export async function updateSaleAction(saleId: string, formData: FormData) {
  try {
    const salePriceRaw = formData.get('salePrice') as string
    const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : undefined
    const advanceAmountRaw = formData.get('advanceAmount') as string
    const advanceAmount = advanceAmountRaw ? parseFloat(advanceAmountRaw) : undefined
    const rawPaymentMethod = formData.get('paymentMethod') as string
    const paymentMethod = paymentMethods.includes(rawPaymentMethod as PaymentMethodType)
      ? (rawPaymentMethod as PaymentMethodType)
      : undefined
    const expectedDeliveryDateRaw = formData.get('expectedDeliveryDate') as string
    const expectedDeliveryDate = expectedDeliveryDateRaw ? new Date(expectedDeliveryDateRaw) : undefined
    const notes = (formData.get('notes') as string) || undefined
    const buyerName = (formData.get('buyerName') as string) || undefined
    const buyerPhone = (formData.get('buyerPhone') as string) || undefined
    const buyerCin = (formData.get('buyerCin') as string) || undefined
    const buyerAddress = (formData.get('buyerAddress') as string) || undefined

    await saleService.updateSale(saleId, {
      salePrice,
      advanceAmount,
      paymentMethod,
      expectedDeliveryDate,
      notes,
      buyerName,
      buyerPhone,
      buyerCin,
      buyerAddress,
    })

    revalidatePath(`/sales/${saleId}`)
    revalidatePath('/sales')
    redirect(`/sales/${saleId}?success=${encodeURIComponent('Dossier de vente mis à jour avec succès.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la vente.'
    redirect(`/sales/${saleId}?action=edit&error=${encodeURIComponent(message)}`)
  }
}
