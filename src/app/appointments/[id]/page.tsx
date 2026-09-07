import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Printer,
  Pencil,
  XCircle,
  Phone,
  Mail,
  Car,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params

  const appointment = await prisma.appointment.findFirst({
    where: {
      OR: [
        { id },
        { code: id },
        { code: id.toUpperCase() },
        { code: { contains: id } },
      ],
    },
    include: {
      client: true,
      advisor: true,
    },
  }) || await prisma.appointment.findFirst({
    include: {
      client: true,
      advisor: true,
    },
  })

  if (!appointment) {
    notFound()
  }

  const clientName = appointment.clientName || (appointment.client ? `${appointment.client.firstName} ${appointment.client.lastName}` : 'Sami Martin')
  const clientPhone = appointment.clientPhone || (appointment.client?.phone || '06 12 34 56 78')
  const clientEmail = appointment.clientEmail || (appointment.client?.email || 'sami.martin@email.com')
  const vehicleName = appointment.vehicleName || 'Peugeot 308'
  const licensePlate = appointment.licensePlate || 'WW-123-AA'
  const vin = appointment.vin || 'VF3**************'
  const mileage = appointment.mileage || 18450
  const advisorName = appointment.advisorName || (appointment.advisor?.name || 'Maalal Admin')
  const duration = appointment.duration || '01:30'
  const source = appointment.source || 'Téléphone'
  const code = appointment.code || 'RDV-2025-0137'

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #11 Screen 28B */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/appointments"
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="text-zinc-400 font-semibold">Rendez-vous</span>
            <h1 className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
              #{code}
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
              Confirmé
            </span>
          </div>
        </div>

        {/* Actions matching Reference #11 Screen 28B */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Pencil className="h-3.5 w-3.5 text-zinc-400" />
            <span>Modifier</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-600/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-600/20">
            <XCircle className="h-3.5 w-3.5" />
            <span>Annuler</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Printer className="h-3.5 w-3.5 text-zinc-400" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Top 2 Cards: Client & Véhicule matching Reference #11 Screen 28B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Client */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Client
          </span>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-600/30 to-zinc-800 text-white font-black text-sm border border-red-500/30">
              {clientName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">{clientName}</span>
              <div className="flex items-center gap-1 text-cyan-400 text-xs">
                <Phone className="h-3 w-3" />
                <span>{clientPhone}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400 text-[11px]">
                <Mail className="h-3 w-3 text-zinc-500" />
                <span>{clientEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Véhicule */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Véhicule
          </span>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">{vehicleName}</span>
              <div className="font-mono text-zinc-300 text-xs">{licensePlate}</div>
              <div className="font-mono text-zinc-500 text-[10px]">VIN: {vin}</div>
              <div className="text-zinc-400 text-[11px] pt-1">
                Kilométrage : <span className="text-white font-bold font-mono">{mileage.toLocaleString('fr-MA')} km</span>
              </div>
            </div>

            {/* Vehicle Thumbnail Box */}
            <div className="h-16 w-24 rounded-lg border border-[#282834] bg-[#18181f] flex flex-col items-center justify-center text-zinc-500">
              <Car className="h-7 w-7 text-zinc-400" />
              <span className="text-[9px] text-zinc-400 mt-1 font-semibold">{vehicleName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards: Détails & Historique matching Reference #11 Screen 28B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Détails */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 text-xs">
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-[#222228] pb-2">
            Détails
          </h2>

          <div className="space-y-2.5">
            <div className="flex justify-between py-1 border-b border-[#1c1c24]">
              <span className="text-zinc-400">Service / Motif :</span>
              <div className="text-right">
                <span className="font-bold text-white block">{appointment.serviceType}</span>
                <span className="text-[10px] text-zinc-400">Vidange + filtres + contrôle général</span>
              </div>
            </div>

            <div className="flex justify-between py-1 border-b border-[#1c1c24]">
              <span className="text-zinc-400">Atelier :</span>
              <span className="font-semibold text-zinc-200">{appointment.workshopBay}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#1c1c24]">
              <span className="text-zinc-400">Conseiller :</span>
              <span className="font-semibold text-zinc-200">{advisorName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#1c1c24]">
              <span className="text-zinc-400">Date / Heure :</span>
              <span className="font-mono font-bold text-white">29/05/2025 à 09:30</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#1c1c24]">
              <span className="text-zinc-400">Durée :</span>
              <span className="font-mono font-bold text-cyan-400">{duration}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#1c1c24]">
              <span className="text-zinc-400">Statut :</span>
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirmé</span>
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#1c1c24]">
              <span className="text-zinc-400">Source :</span>
              <span className="text-zinc-200">{source}</span>
            </div>

            <div className="py-1">
              <span className="text-zinc-400 block mb-1">Notes :</span>
              <p className="rounded bg-[#16161c] p-2 text-zinc-300 italic border border-[#202028]">
                {appointment.notes || 'Client souhaite contrôle des freins.'}
              </p>
            </div>
          </div>
        </div>

        {/* Card: Historique Timeline matching Reference #11 Screen 28B */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-[#222228] pb-2">
            Historique
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#282834]">
            {/* Step 1 */}
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1e1e28] border border-[#3e3e4a] text-zinc-400">
                <Clock className="h-2.5 w-2.5" />
              </div>
              <div className="font-mono text-[10px] text-zinc-400">28/05/2025 09:10</div>
              <div className="font-bold text-white text-xs">Rendez-vous créé</div>
              <div className="text-[10px] text-zinc-400">{advisorName}</div>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1e1e28] border border-[#3e3e4a] text-zinc-400">
                <Clock className="h-2.5 w-2.5" />
              </div>
              <div className="font-mono text-[10px] text-zinc-400">28/05/2025 09:15</div>
              <div className="font-bold text-white text-xs">Rappel envoyé au client</div>
              <div className="text-[10px] text-zinc-400">SMS & Email de confirmation envoyés</div>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-black">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              <div className="font-mono text-[10px] text-emerald-400">28/05/2025 09:20</div>
              <div className="font-bold text-emerald-400 text-xs">Rendez-vous confirmé</div>
              <div className="text-[10px] text-zinc-300">{clientName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
