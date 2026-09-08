import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { PageHeader } from '@/components/shared/page-header'
import { Save, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ vehicleId?: string }>
}

async function createReservationAction(formData: FormData) {
  'use server'

  const vehicleId = formData.get('vehicleId') as string
  const contactId = formData.get('contactId') as string
  const depositAmount = parseFloat(formData.get('depositAmount') as string) || 0
  const paymentMethod = formData.get('paymentMethod') as string
  const expiryDays = parseInt(formData.get('expiryDays') as string, 10) || 7
  const salespersonName = formData.get('salespersonName') as string
  const notes = formData.get('notes') as string

  const count = await prisma.reservation.count()
  const code = `RES-2026-${String(count + 1).padStart(4, '0')}`

  const startDate = new Date()
  const expiryDate = new Date(startDate.getTime() + expiryDays * 24 * 60 * 60 * 1000)

  const reservation = await prisma.reservation.create({
    data: {
      code,
      vehicleId,
      contactId,
      depositAmount,
      paymentMethod,
      startDate,
      expiryDate,
      salespersonName,
      notes,
      status: 'ACTIVE',
    },
  })

  // Update vehicle status to RESERVED
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status: 'RESERVED' },
  })

  // Log status change
  await prisma.vehicleStatusHistory.create({
    data: {
      vehicleId,
      oldStatus: 'IN_STOCK',
      newStatus: 'RESERVED',
      reason: `Réservation ${code} - Acompte de ${depositAmount} DH`,
      changedBy: salespersonName || 'Admin Maalal',
    },
  })

  redirect(`/reservations/${reservation.id}`)
}

export default async function NewReservationPage({ searchParams }: Props) {
  const { vehicleId } = await searchParams

  const [vehicles, contacts, personnelList] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: 'IN_STOCK', archivedAt: null },
      orderBy: { brand: 'asc' },
    }),
    prisma.contact.findMany({
      where: { archivedAt: null },
      orderBy: { lastName: 'asc' },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: { select: { name: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Nouvelle Réservation"
        subtitle="Bloquer un véhicule pour un client avec encaissement d’un acompte"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Réservations', href: '/reservations' },
          { label: 'Nouvelle Réservation' },
        ]}
      />

      <form action={createReservationAction} className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Sélectionner le Véhicule *</label>
            <select
              name="vehicleId"
              required
              defaultValue={vehicleId || ''}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">-- Choisir un véhicule en stock --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) — {v.targetSalePrice.toLocaleString()} DH ({v.matricule || v.vin})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Bénéficiaire *</label>
            <select
              name="contactId"
              required
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">-- Choisir un client --</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} {c.companyName} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Montant Acompte (DH) *</label>
            <input
              type="number"
              name="depositAmount"
              required
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Mode de Règlement Acompte</label>
            <select
              name="paymentMethod"
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="VIREMENT">Virement bancaire</option>
              <option value="CHEQUE">Chèque bancaire</option>
              <option value="ESPECES">Espèces</option>
              <option value="CARTE">Carte bancaire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Durée de Validité Réservation</label>
            <select
              name="expiryDays"
              defaultValue="7"
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="3">3 jours (Express)</option>
              <option value="7">7 jours (Standard)</option>
              <option value="15">15 jours (Accord crédit)</option>
              <option value="30">30 jours (Dossier LLD / Financement)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Acompte Reçu Par (Personnel Agence) *
            </label>
            <select
              name="salespersonName"
              required
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">-- Sélectionner le collaborateur ayant encaissé l&apos;acompte --</option>
              {personnelList.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} {p.role?.name ? `(${p.role.name})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Conditions Particulières / Notes</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Ex: Acompte déductible à la livraison, sous réserve d’acceptation dossier crédit..."
              className="w-full rounded-lg border border-[#282834] bg-[#16161c] p-3 text-xs text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#222228] pt-4">
          <Link
            href="/reservations"
            className="flex h-10 items-center gap-1.5 rounded-lg border border-[#282834] bg-[#16161c] px-4 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Annuler</span>
          </Link>

          <button
            type="submit"
            className="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Valider la réservation</span>
          </button>
        </div>
      </form>
    </div>
  )
}
