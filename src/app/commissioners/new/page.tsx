'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Briefcase,
  User,
  Building,
  Save,
  MapPin,
  Percent,
} from 'lucide-react'
import { MoroccanCityCombobox } from '@/components/ui/moroccan-city-combobox'

export default function NewCommissionerPage() {
  const router = useRouter()
  const [city, setCity] = useState('Casablanca')
  const [address, setAddress] = useState('')
  const [type, setType] = useState<'INDIVIDUAL' | 'COMPANY'>('INDIVIDUAL')
  const [status, setStatus] = useState('Actif')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Small delay to simulate action feedback
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/commissioners/list')
    }, 400)
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/commissioners/list"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour à la liste</span>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">
              Nouveau commissionnaire / courtier
            </h1>
            <p className="text-[11px] text-zinc-400">
              Enregistrez un intermédiaire d&apos;achat ou de vente avec son adresse et sa ville
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        {/* Section 1: Type & Informations Personnelles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#202028] pb-3">
            <h2 className="text-xs font-bold text-white flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-red-600/20 text-red-500 font-mono text-[10px]">
                1
              </div>
              <span>Informations d&apos;identité</span>
            </h2>
            {/* Type selector toggle */}
            <div className="flex items-center gap-1 bg-[#181820] border border-[#262632] rounded-lg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setType('INDIVIDUAL')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  type === 'INDIVIDUAL'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="h-3 w-3" />
                <span>Particulier (Semsar)</span>
              </button>
              <button
                type="button"
                onClick={() => setType('COMPANY')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  type === 'COMPANY'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Building className="h-3 w-3" />
                <span>Cabinet / Société</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                {type === 'INDIVIDUAL' ? 'Nom complet' : 'Raison sociale'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={type === 'INDIVIDUAL' ? 'Ex: Yassine Benali' : 'Ex: Atlas Courtage Auto SARL'}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                {type === 'INDIVIDUAL' ? 'Numéro CIN' : 'Numéro ICE / RC'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={type === 'INDIVIDUAL' ? 'Ex: BE123456' : 'Ex: 002145678000045'}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Téléphone principal <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ex: +212 6 61 23 45 67"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Adresse email
              </label>
              <input
                type="email"
                placeholder="Ex: courtier@gmail.com"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Localisation - Adresse & Ville (Moroccan Cities Combobox) */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold text-white flex items-center gap-2 border-b border-[#202028] pb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-amber-600/20 text-amber-500 font-mono text-[10px]">
              2
            </div>
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            <span>Localisation & Coordonnées géographiques</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Adresse postale / Quartier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: 45, Boulevard Zerktouni, Maârif"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Ville du Maroc <span className="text-red-500">*</span>
              </label>
              <MoroccanCityCombobox
                value={city}
                onChange={(selected) => setCity(selected)}
                placeholder="Sélectionner ou chercher la ville..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: Modalités de Commission & Statut */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold text-white flex items-center gap-2 border-b border-[#202028] pb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-600/20 text-purple-400 font-mono text-[10px]">
              3
            </div>
            <Briefcase className="h-3.5 w-3.5 text-purple-400" />
            <span>Modalités financières & Statut</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1 flex items-center justify-between">
                <span>Commission standard (%)</span>
                <Percent className="h-3 w-3 text-zinc-500" />
              </label>
              <input
                type="number"
                step="0.1"
                defaultValue={1.5}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-purple-400 font-bold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Forfait moyen par véhicule (DH)
              </label>
              <input
                type="number"
                defaultValue={3000}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Statut du commissionnaire <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500"
              >
                <option value="Actif">Actif</option>
                <option value="En attente">En attente de validation</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
              Notes & Spécialités (ex: Véhicules neufs importés, berlines premium, SUV...)
            </label>
            <textarea
              rows={2}
              placeholder="Informations utiles sur le courtier, canaux d'approvisionnement..."
              className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/commissioners/list"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer le commissionnaire'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
