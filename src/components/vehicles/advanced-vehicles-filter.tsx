'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react'

interface AdvancedVehiclesFilterProps {
  availableBrands: string[]
  currentBrand?: string
  currentStatus?: string
  currentFuelType?: string
  currentSearch?: string
}

export function AdvancedVehiclesFilter({
  availableBrands,
  currentBrand = '',
  currentStatus = '',
  currentFuelType = '',
  currentSearch = '',
}: AdvancedVehiclesFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Local filter states
  const [brand, setBrand] = useState(currentBrand)
  const [status, setStatus] = useState(currentStatus)
  const [fuelType, setFuelType] = useState(currentFuelType)
  const [search, setSearch] = useState(currentSearch)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '')

  const activeFiltersCount = [
    brand && brand !== 'Toutes',
    status && status !== 'Tous',
    fuelType && fuelType !== 'Tous',
    search,
    minPrice,
    maxPrice,
    transmission,
  ].filter(Boolean).length

  const handleApply = () => {
    const params = new URLSearchParams()
    if (brand && brand !== 'Toutes') params.set('brand', brand)
    if (status && status !== 'Tous') params.set('status', status)
    if (fuelType && fuelType !== 'Tous') params.set('fuelType', fuelType)
    if (search.trim()) params.set('search', search.trim())
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (transmission) params.set('transmission', transmission)

    router.push(`/vehicles${params.toString() ? `?${params.toString()}` : ''}`)
    setIsOpen(false)
  }

  const handleReset = () => {
    setBrand('')
    setStatus('')
    setFuelType('')
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setTransmission('')
    router.push('/vehicles')
    setIsOpen(false)
  }

  return (
    <div>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
          isOpen || activeFiltersCount > 0
            ? 'border-red-500/40 bg-red-500/10 text-red-400'
            : 'border-[#282834] bg-[#14141a] text-zinc-300 hover:text-white hover:border-zinc-700'
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Filtres Avancés</span>
        {activeFiltersCount > 0 && (
          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Slide-out / Dropdown Panel */}
      {isOpen && (
        <div className="mt-3 rounded-2xl border border-[#282834] bg-[#121216] p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-red-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Filtrer le parc automobile
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Réinitialiser</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Mot-clé */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Mot-clé (Marque, Modèle, VIN, Matricule)
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* 2. Marque */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Marque</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Toutes les marques</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Carburant */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Carburant</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Tous les carburants</option>
                <option value="DIESEL">Diesel</option>
                <option value="ESSENCE">Essence</option>
                <option value="HYBRIDE">Hybride</option>
                <option value="ELECTRIQUE">Électrique</option>
              </select>
            </div>

            {/* 4. Transmission */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Boîte de vitesses</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Toutes les boîtes</option>
                <option value="AUTOMATIQUE">Automatique</option>
                <option value="MANUELLE">Manuelle</option>
                <option value="SEMI_AUTO">Semi-automatique</option>
              </select>
            </div>

            {/* 5. Fourchette Prix Min */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Prix Vente Min (MAD)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Ex: 200 000"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* 6. Fourchette Prix Max */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Prix Vente Max (MAD)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Ex: 800 000"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202028]">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-[#2e2e38] bg-[#16161c] text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-500 shadow-md transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Appliquer les filtres</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
