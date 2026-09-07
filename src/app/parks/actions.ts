'use server'

import { revalidatePath } from 'next/cache'
import { parkRepository } from '@/repositories/park.repository'

export async function createParkAction(formData: FormData) {
  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const code = (formData.get('code') as string) || undefined
  const address = (formData.get('address') as string) || null
  const phone = (formData.get('phone') as string) || null
  const managerName = (formData.get('managerName') as string) || null
  const capacity = parseInt(formData.get('capacity') as string, 10) || 30

  if (!name || !city) {
    throw new Error('Le nom du parc et la ville sont obligatoires')
  }

  await parkRepository.create({
    name,
    city,
    code,
    address,
    phone,
    managerName,
    capacity,
    isActive: true,
  })

  revalidatePath('/parks')
  revalidatePath('/vehicles')
  revalidatePath('/stock')
}

export async function updateParkAction(parkId: string, formData: FormData) {
  const name = (formData.get('name') as string) || undefined
  const city = (formData.get('city') as string) || undefined
  const address = (formData.get('address') as string) || null
  const phone = (formData.get('phone') as string) || null
  const managerName = (formData.get('managerName') as string) || null
  const capacity = parseInt(formData.get('capacity') as string, 10) || undefined

  await parkRepository.update(parkId, {
    name,
    city,
    address,
    phone,
    managerName,
    capacity,
  })

  revalidatePath('/parks')
  revalidatePath('/vehicles')
  revalidatePath('/stock')
}

export async function transferVehicleAction(vehicleId: string, targetParkId: string) {
  await parkRepository.transferVehicle(vehicleId, targetParkId)

  revalidatePath('/parks')
  revalidatePath(`/vehicles/${vehicleId}`)
  revalidatePath('/vehicles')
  revalidatePath('/stock')
}
