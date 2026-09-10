import React from 'react'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Car,
  Plus,
  Phone,
  User,
  ExternalLink,
  CheckCircle2,
  Boxes,
  Edit3,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Currency } from '@/components/shared/currency'
import { parkRepository } from '@/repositories/park.repository'
import { createParkAction, updateParkAction } from './actions'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    action?: string
    editParkId?: string
  }>
}

export default async function ParksPage({ searchParams }: Props) {
  const params = await searchParams
  const isAddingPark = params.action === 'new'

  const parks = await parkRepository.getAll()
  const parkToEdit = params.editParkId ? parks.find((p) => p.id === params.editParkId) : null

  const totalCapacity = parks.reduce((acc, p) => acc + p.capacity, 0)
  const totalOccupancy = parks.reduce((acc, p) => acc + p.totalVehicles, 0)
  const globalOccupancyRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0
  const totalStockValue = parks.reduce((acc, p) => acc + p.totalStockValue, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parcs Automobiles — Gestion Multi-Sites"
        subtitle="Supervision du réseau de parcs, gestion des capacités et répartition du stock (Casablanca, Fès et futures agences)"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Parcs Automobiles' }]}
        primaryAction={{
          label: 'Nouveau Parc',
          href: '/parks?action=new',
          icon: Plus,
        }}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Parcs Actifs en Réseau"
          value={parks.length}
          trend={{ value: 'Multi-sites', direction: 'neutral', label: 'opérationnels' }}
          icon={Building2}
          iconColor="cyan"
        />

        <StatCard
          title="Véhicules Répartis"
          value={totalOccupancy}
          trend={{ value: `${globalOccupancyRate}% occupé`, direction: 'up', label: 'taux global' }}
          icon={Car}
          iconColor="green"
        />

        <StatCard
          title="Capacité d'Accueil Totale"
          value={`${totalCapacity} places`}
          trend={{ value: `${totalCapacity - totalOccupancy} places libres`, direction: 'neutral', label: 'disponibles' }}
          icon={Boxes}
          iconColor="purple"
        />

        <StatCard
          title="Valeur Totale en Parcs"
          value={<Currency amount={totalStockValue} />}
          trend={{ value: 'Immobilisé en stock', direction: 'neutral', label: 'valorisation' }}
          icon={Building2}
          iconColor="red"
        />
      </div>

      {/* Modal / Form: Ajouter un nouveau parc */}
      {isAddingPark && (
        <div className="rounded-2xl border border-red-500/30 bg-[#121216] p-6 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#222228] pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ouvrir &amp; Déclarer un Nouveau Parc Automobile
                </h3>
                <p className="text-xs text-zinc-400">
                  Renseignez les détails du nouveau site pour y affecter des véhicules et gérer son inventaire
                </p>
              </div>
            </div>
            <Link
              href="/parks"
              className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#282834]"
            >
              Fermer
            </Link>
          </div>

          <form action={createParkAction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom du Parc *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ex: Parc Tanger — Malabata"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ville d&apos;Implantation *</label>
              <input
                type="text"
                name="city"
                required
                placeholder="Ex: Tanger, Marrakech, Rabat..."
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Code Parc (Optionnel)</label>
              <input
                type="text"
                name="code"
                placeholder="Ex: PRK-TAN-01 (Auto-généré si vide)"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Adresse Physique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="Ex: Boulevard Sidi Maârouf, Secteur Car..."
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Téléphone Contact</label>
              <input
                type="text"
                name="phone"
                placeholder="+212 5 XX XX XX XX"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Responsable / Régisseur</label>
              <input
                type="text"
                name="managerName"
                placeholder="Ex: Mehdi Bennani"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Capacité Maximale (Voitures, max 1000)
              </label>
              <input
                type="number"
                name="capacity"
                defaultValue={30}
                min={1}
                max={1000}
                placeholder="Ex: 50 (max 1000)"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-0.5 block">Limite autorisée : 1 à 1000 places</span>
            </div>

            <div className="sm:col-span-2 lg:col-span-2 flex items-end justify-end gap-2 pt-2">
              <Link
                href="/parks"
                className="px-4 py-2 rounded-xl border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-400"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-500 shadow-md transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Créer et Activer le Parc</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal / Form: Modifier un parc existant */}
      {parkToEdit && (
        <div className="rounded-2xl border border-amber-500/30 bg-[#121216] p-6 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#222228] pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Modifier le Parc : {parkToEdit.name}</span>
                  <span className="font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {parkToEdit.code}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Mettez à jour les coordonnées, le responsable et la capacité d&apos;accueil (limitée à 1 000 places)
                </p>
              </div>
            </div>
            <Link
              href="/parks"
              className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#282834]"
            >
              Fermer
            </Link>
          </div>

          <form action={updateParkAction.bind(null, parkToEdit.id)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nom du Parc *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={parkToEdit.name}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ville d&apos;Implantation *</label>
              <input
                type="text"
                name="city"
                required
                defaultValue={parkToEdit.city}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Code Parc (Non modifiable)</label>
              <input
                type="text"
                disabled
                defaultValue={parkToEdit.code}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c]/50 px-3 text-xs text-zinc-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Adresse Physique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                defaultValue={parkToEdit.address}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Téléphone Contact</label>
              <input
                type="text"
                name="phone"
                defaultValue={parkToEdit.phone || ''}
                placeholder="+212 5 XX XX XX XX"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Responsable / Régisseur</label>
              <input
                type="text"
                name="managerName"
                defaultValue={parkToEdit.managerName || ''}
                placeholder="Ex: Mehdi Bennani"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Capacité Maximale (Voitures, max 1000)
              </label>
              <input
                type="number"
                name="capacity"
                defaultValue={parkToEdit.capacity}
                min={1}
                max={1000}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 mt-0.5 block">Limite autorisée : 1 à 1000 places</span>
            </div>

            <div className="sm:col-span-2 lg:col-span-2 flex items-end justify-end gap-2 pt-2">
              <Link
                href="/parks"
                className="px-4 py-2 rounded-xl border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 text-xs font-bold text-white hover:bg-amber-500 shadow-md transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Enregistrer les Modifications</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Parks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parks.map((park) => {
          const isFull = park.occupancyRate >= 90

          return (
            <div
              key={park.id}
              className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm hover:border-zinc-700 transition-all flex flex-col justify-between space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-500 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                      {park.code}
                    </span>
                    <span className="rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-bold">
                      📍 {park.city}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white pt-1">{park.name}</h3>
                  {park.address && (
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      <span>{park.address}</span>
                    </p>
                  )}
                </div>

                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5">
                  Opérationnel
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-2 rounded-xl bg-[#16161c] border border-[#202028] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Occupation du site</span>
                  <span className="font-mono font-bold text-white">
                    {park.totalVehicles} / {park.capacity} places ({park.occupancyRate}%)
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isFull
                        ? 'bg-red-500'
                        : park.occupancyRate > 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(park.occupancyRate, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span>En stock : <strong className="text-emerald-400">{park.inStockCount}</strong></span>
                  <span>Réservés : <strong className="text-amber-400">{park.reservedCount}</strong></span>
                  <span>Places libres : <strong className="text-zinc-200">{Math.max(park.capacity - park.totalVehicles, 0)}</strong></span>
                </div>
              </div>

              {/* Financial & Manager Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-[#1e1e24]">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Valeur en Stock</span>
                  <Currency amount={park.totalStockValue} className="text-sm font-bold text-cyan-400 font-mono" />
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Responsable</span>
                  <span className="font-semibold text-zinc-200 flex items-center justify-end gap-1">
                    <User className="h-3 w-3 text-zinc-400" />
                    <span>{park.managerName || 'Non assigné'}</span>
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#222228]">
                {park.phone && (
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-zinc-500" />
                    <span>{park.phone}</span>
                  </span>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <Link
                    href={`/parks?editParkId=${park.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2e2e38] bg-[#181820] text-zinc-300 hover:text-white hover:border-amber-500/50 text-xs font-semibold transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                    <span>Modifier</span>
                  </Link>

                  <Link
                    href={`/vehicles?parkId=${park.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold transition-all"
                  >
                    <Car className="h-3.5 w-3.5" />
                    <span>Voir les véhicules ({park.totalVehicles})</span>
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
