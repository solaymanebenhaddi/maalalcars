'use server'

import { revalidatePath } from 'next/cache'
import { parkRepository } from '@/repositories/park.repository'
import { parkCreateSchema, parkUpdateSchema } from '@/validation/park.schema'

export async function createParkAction(formData: FormData) {
  const name = (formData.get('name') as string) || ''
  const city = (formData.get('city') as string) || ''
  const code = (formData.get('code') as string) || undefined
  const address = (formData.get('address') as string) || ''
  const phone = (formData.get('phone') as string) || null
  const managerName = (formData.get('managerName') as string) || null
  const rawCapacity = formData.get('capacity') as string
  const capacity = rawCapacity ? parseInt(rawCapacity, 10) : 30

  const validation = parkCreateSchema.safeParse({
    name: name.trim(),
    city: city.trim(),
    code,
    address: address.trim(),
    phone,
    managerName,
    capacity,
    isActive: true,
  })

  if (!validation.success) {
    const errorMsg = validation.error.issues[0]?.message || 'Données du parc invalides'
    throw new Error(errorMsg)
  }

  await parkRepository.create(validation.data)

  revalidatePath('/parks')
  revalidatePath('/vehicles')
  revalidatePath('/stock')
}

export async function updateParkAction(parkId: string, formData: FormData) {
  const name = (formData.get('name') as string) || undefined
  const city = (formData.get('city') as string) || undefined
  const address = (formData.get('address') as string) || undefined
  const phone = (formData.get('phone') as string) || null
  const managerName = (formData.get('managerName') as string) || null
  const rawCapacity = formData.get('capacity') as string
  const capacity = rawCapacity ? parseInt(rawCapacity, 10) : undefined

  const payload: Record<string, unknown> = {}
  if (name !== undefined) payload.name = name.trim()
  if (city !== undefined) payload.city = city.trim()
  if (address !== undefined) payload.address = address.trim()
  if (phone !== null) payload.phone = phone
  if (managerName !== null) payload.managerName = managerName
  if (capacity !== undefined) payload.capacity = capacity

  const validation = parkUpdateSchema.safeParse(payload)
  if (!validation.success) {
    const errorMsg = validation.error.issues[0]?.message || 'Données du parc invalides'
    throw new Error(errorMsg)
  }

  await parkRepository.update(parkId, validation.data)

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
