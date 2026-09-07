import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Printer,
  ChevronDown,
  Phone,
  Mail,
  Clock,
} from 'lucide-react'
import { Currency } from '@/components/shared/currency'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WorkshopOrderDetailPage({ params }: Props) {
  const { id } = await params

  const order = await prisma.workshopOrder.findFirst({
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
      vehicle: true,
      technician: true,
    },
  }) || await prisma.workshopOrder.findFirst({
    include: {
      client: true,
      vehicle: true,
      technician: true,
    },
  })

  if (!order) {
    notFound()
  }

  const clientName = order.client ? `${order.client.firstName} ${order.client.lastName}` : 'Jean Dupont'
  const vehicleName = order.vehicleName || (order.vehicle ? `${order.vehicle.brand} ${order.vehicle.model}` : 'BMW Série 3')
  const licensePlate = order.licensePlate || (order.vehicle ? order.vehicle.matricule : 'WW-123-AA')
  const mileage = order.mileage || 98450
  const technicianName = order.technicianName || order.technician?.name || 'Yassine Benali'
  const spentDuration = order.spentDuration || '1h45'
  const estimatedDuration = order.estimatedDuration || '2h30'
  const progressPercent = order.progressPercent || 68

  return (
    <div className="space-y-5 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb & Title matching Reference #10 Screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-1">
            <Link href="/workshop" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Atelier</span>
            </Link>
            <span>/</span>
            <Link href="/workshop/orders" className="hover:text-white">
              Ordres de travail
            </Link>
            <span>/</span>
            <span className="text-white font-mono">{order.code}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-black font-mono tracking-tight text-white">
              {order.code}
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
              En cours
            </span>
            <span className="text-zinc-400 text-[11px]">
              Créé le {new Date(order.scheduledDate).toLocaleDateString('fr-MA')} à 09:12
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Printer className="h-3.5 w-3.5 text-zinc-400" />
            <span>Imprimer</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <span>Plus d’actions</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 3 Top Information Cards matching Reference #10 Screen 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Informations client */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider">
            Informations client
          </span>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e1e28] text-white font-bold text-xs border border-[#2e2e3a]">
              JD
            </div>
            <div>
              <span className="font-bold text-white text-xs block">{clientName}</span>
              <div className="flex items-center gap-1 text-cyan-400 text-[11px] mt-0.5">
                <Phone className="h-3 w-3" />
                <span>06 12 34 56 78</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] pt-1 border-t border-[#1e1e26]">
            <Mail className="h-3 w-3 text-zinc-500" />
            <span>jean.dupont@email.com</span>
          </div>
        </div>

        {/* Card 2: Véhicule */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider">
            Véhicule
          </span>
          <div>
            <span className="font-bold text-white text-xs block">{vehicleName}</span>
            <span className="text-zinc-400 text-[11px]">320d 190 ch</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e1e26]">
            <span className="text-zinc-400">Immatriculation :</span>
            <span className="font-mono font-bold text-white">{licensePlate}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Kilométrage :</span>
            <span className="font-mono font-bold text-zinc-200">{mileage.toLocaleString('fr-MA')} km</span>
          </div>
        </div>

        {/* Card 3: Intervention */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider">
            Intervention
          </span>
          <div>
            <span className="font-bold text-white text-xs block">{order.serviceType}</span>
            <span className="text-zinc-400 text-[11px]">Forfait constructeur</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e1e26]">
            <span className="text-zinc-400">Échéance :</span>
            <span className="font-mono font-semibold text-zinc-300">24/05/2025</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Priorité :</span>
            <span className="text-amber-400 font-semibold">Moyenne</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Tabs & Dual Panel matching Reference #10 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-3 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1">
            <span>Description</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white">Tâches</button>
          <Link href="/workshop/parts" className="text-zinc-400 hover:text-white">
            Pièces (4)
          </Link>
          <button className="text-zinc-400 hover:text-white">Fichiers (2)</button>
          <button className="text-zinc-400 hover:text-white">Historique</button>
        </div>

        {/* Dual Panel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Description & Checklist (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Contrôle et remplacement des éléments selon le plan d’entretien constructeur.
            </p>

            <div className="space-y-2.5">
              <span className="font-bold text-white text-xs block">Points clés :</span>
              <ul className="space-y-2">
                {[
                  'Vidange huile moteur',
                  'Remplacement filtre à huile',
                  'Remplacement filtre à air',
                  'Contrôle niveaux, freins, éclairage',
                  'Diagnostic électronique',
                ].map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel: Affectation Card (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3.5">
            <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider">
              Affectation
            </span>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 block">Technicien</span>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-red-400 font-bold text-xs border border-red-500/30">
                  YB
                </div>
                <span className="font-bold text-white text-xs">{technicianName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#22222a]">
              <div>
                <span className="text-zinc-500 block">Poste</span>
                <span className="font-semibold text-zinc-200">Poste 2</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Début prévu</span>
                <span className="font-mono text-zinc-300">22/05/2025 10:00</span>
              </div>
            </div>

            <div className="pt-1 border-t border-[#22222a] text-[11px]">
              <span className="text-zinc-500 block">Durée estimée</span>
              <span className="font-mono font-bold text-cyan-400">{estimatedDuration}</span>
            </div>
          </div>
        </div>

        {/* Bottom Progression & Summary Bar matching Reference #10 Screen 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#222228] items-center">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-zinc-500" />
            <div>
              <span className="text-[10px] text-zinc-400 block">Temps passé</span>
              <span className="font-mono font-bold text-white">{spentDuration}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Avancement</span>
              <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#202028] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block">Montant TTC</span>
            <span className="font-mono font-black text-white text-base sm:text-lg">
              <Currency amount={order.totalTTC} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
