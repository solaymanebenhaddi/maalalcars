'use client'

import React from 'react'
import Link from 'next/link'
import { Car, X, CheckCircle2 } from 'lucide-react'
import { VehicleTaxonomySelector } from './vehicle-taxonomy-selector'
import { VehicleCustomsSelector } from './vehicle-customs-selector'
import { VehicleColorPicker } from '@/components/ui/vehicle-color-picker'
import { MoroccanPlateInput } from '@/components/ui'

export interface VehicleEditFormProps {
  vehicle: {
    id: string
    code: string
    vin: string
    matricule?: string | null
    brand: string
    model: string
    version?: string | null
    year: number
    colorExterior: string
    colorInterior?: string | null
    fuelType: string
    transmission: string
    bodyType?: string | null
    mileage: number
    purchasePrice?: number | null
    targetSalePrice?: number | null
    description?: string | null
    customsStatus?: string | null
    customsYear?: number | null
    parkId?: string | null
  }
  parks: Array<{
    id: string
    name: string
    city: string
    capacity: number
    totalVehicles: number
  }>
  action: (formData: FormData) => Promise<void>
  cancelHref: string
}

export function VehicleEditForm({ vehicle, parks, action, cancelHref }: VehicleEditFormProps) {
  return (
    <div className="rounded-2xl border border-blue-500/30 bg-[#121216] p-6 shadow-2xl space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222228] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Modifier la Fiche Véhicule</span>
              <span className="font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                {vehicle.code}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Ajustez la marque, modèle, finition, couleurs, statut de dédouanement et caractéristiques techniques
            </p>
          </div>
        </div>

        <Link
          href={cancelHref}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#282834] text-zinc-400 hover:text-white text-xs hover:bg-[#181820] transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          <span>Fermer</span>
        </Link>
      </div>

      <form action={action} className="space-y-6">
        {/* 1. Taxonomie Automobile : Marque -> Modèle -> Version */}
        <div className="rounded-xl border border-[#242430] bg-[#16161c] p-4">
          <VehicleTaxonomySelector
            initialBrand={vehicle.brand}
            initialModel={vehicle.model}
            initialVersion={vehicle.version || undefined}
          />
        </div>

        {/* 2. Origine & Dédouanement : WW Maroc vs Dédouanée */}
        <div className="rounded-xl border border-[#242430] bg-[#16161c] p-4">
          <VehicleCustomsSelector
            initialStatus={(vehicle.customsStatus as 'MAROC' | 'DEDOUANEE') || 'MAROC'}
            initialYear={vehicle.customsYear || undefined}
          />
        </div>

        {/* 3. Immatriculation Marocaine (xxxxxx | x | xx) */}
        <div className="rounded-xl border border-[#242430] bg-[#16161c] p-4">
          <MoroccanPlateInput
            name="matricule"
            defaultValue={vehicle.matricule}
          />
        </div>

        {/* 4. Couleurs Intérieure & Extérieure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-[#242430] bg-[#16161c] p-4">
          <VehicleColorPicker
            name="colorExterior"
            label="Couleur Extérieure"
            mode="exterior"
            required
            defaultValue={vehicle.colorExterior}
          />

          <VehicleColorPicker
            name="colorInterior"
            label="Couleur Intérieure"
            mode="interior"
            defaultValue={vehicle.colorInterior || 'Standard'}
          />
        </div>

        {/* 5. Caractéristiques Techniques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              VIN (Numéro de Châssis - 17 car.) *
            </label>
            <input
              type="text"
              name="vin"
              required
              minLength={17}
              maxLength={17}
              defaultValue={vehicle.vin}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono uppercase focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Année de Mise en Circulation *
            </label>
            <input
              type="number"
              name="year"
              required
              min={1990}
              max={new Date().getFullYear() + 1}
              defaultValue={vehicle.year}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Kilométrage (km) *</label>
            <input
              type="number"
              name="mileage"
              required
              defaultValue={vehicle.mileage}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Carburant *</label>
            <select
              name="fuelType"
              required
              defaultValue={vehicle.fuelType}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="DIESEL">Diesel</option>
              <option value="ESSENCE">Essence</option>
              <option value="HYBRIDE">Hybride</option>
              <option value="HYBRIDE_RECHARGEABLE">Hybride Rechargeable</option>
              <option value="ELECTRIQUE">Électrique</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Boîte de vitesses *</label>
            <select
              name="transmission"
              required
              defaultValue={vehicle.transmission}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="AUTOMATIQUE">Automatique</option>
              <option value="MANUELLE">Manuelle</option>
              <option value="SEMI_AUTO">Semi-automatique</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Type Carrosserie</label>
            <select
              name="bodyType"
              defaultValue={vehicle.bodyType || 'SUV'}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="SUV">SUV</option>
              <option value="Berline">Berline</option>
              <option value="4x4 & Pick-up">4x4 & Pick-up</option>
              <option value="Citadine">Citadine</option>
              <option value="Coupé">Coupé</option>
              <option value="Utilitaire">Utilitaire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Prix d’Achat Initial (MAD)</label>
            <input
              type="number"
              name="purchasePrice"
              defaultValue={vehicle.purchasePrice || 0}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-emerald-400 font-mono font-bold focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Prix de Vente Cible (MAD) *</label>
            <input
              type="number"
              name="targetSalePrice"
              required
              defaultValue={vehicle.targetSalePrice || 0}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-cyan-400 font-mono font-bold focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Parc Automobile d&apos;Affectation
            </label>
            <select
              name="parkId"
              defaultValue={vehicle.parkId || ''}
              className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Aucun parc affecté (Showroom par défaut) --</option>
              {parks.map((p) => (
                <option key={p.id} value={p.id}>
                  📍 {p.city} — {p.name} ({p.totalVehicles}/{p.capacity} places)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Description &amp; Remarques</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={vehicle.description || ''}
              placeholder="Remarques éventuelles sur l'état, équipements ou historique..."
              className="w-full rounded-lg border border-[#282834] bg-[#16161c] p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222228]">
          <Link
            href={cancelHref}
            className="px-5 py-2.5 rounded-xl border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Annuler
          </Link>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Enregistrer les Modifications du Véhicule</span>
          </button>
        </div>
      </form>
    </div>
  )
}
