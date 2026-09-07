'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Phone,
  KeyRound,
} from 'lucide-react'

export default function UserDetailPage() {
  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/users"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux utilisateurs</span>
        </Link>
      </div>

      {/* Main Container matching Reference #28 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* User Header Profile Card */}
        <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/20 border-2 border-red-500 text-red-500 font-black text-lg">
              YB
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Yassine Benali
                </h1>
                <span className="text-xs text-zinc-400 font-medium">(Vendeur)</span>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Actif
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-zinc-500" />
                  <span className="font-mono text-zinc-300">yassine@maalalcars.com</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-zinc-500" />
                  <span className="font-mono text-zinc-300">+33 6 98 76 54 32</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400 border-t md:border-t-0 md:border-l border-[#24242e] pt-3 md:pt-0 md:pl-4">
            <div>
              <div>Membre depuis : <span className="font-mono text-zinc-200">12/03/2024</span></div>
              <div>Dernière connexion : <span className="font-mono text-zinc-200">Hier, 17:30</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Rôle &amp; permissions</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Activité</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Sécurité</button>
        </div>

        {/* 2 Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Col: Informations générales */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations générales
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Nom complet</span>
                <span className="font-semibold text-white">Yassine Benali</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Email</span>
                <span className="font-mono text-zinc-200">yassine@maalalcars.com</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Téléphone</span>
                <span className="font-mono text-zinc-200">+33 6 98 76 54 32</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Rôle</span>
                <span className="text-zinc-200">Vendeur</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Statut</span>
                <span className="text-emerald-400 font-bold">Actif</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Membre depuis</span>
                <span className="font-mono text-zinc-200">12/03/2024</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Dernière connexion</span>
                <span className="font-mono text-zinc-200">Hier, 17:30</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Fuseau horaire</span>
                <span className="text-zinc-200">Europe/Paris (Africa/Casablanca)</span>
              </div>
            </div>
          </div>

          {/* Right Col: Statistiques */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Statistiques
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#121216] border border-[#22222c] text-center">
                <div className="text-[10px] text-zinc-400">Ventes réalisées</div>
                <div className="font-mono font-black text-white text-lg mt-1">48</div>
                <div className="text-[9px] text-cyan-400 font-semibold">Ce mois</div>
              </div>

              <div className="p-3 rounded-xl bg-[#121216] border border-[#22222c] text-center">
                <div className="text-[10px] text-zinc-400">Chiffre d&apos;affaires</div>
                <div className="font-mono font-black text-emerald-400 text-base mt-1">218 450 €</div>
                <div className="text-[9px] text-emerald-400 font-semibold">Ce mois</div>
              </div>

              <div className="p-3 rounded-xl bg-[#121216] border border-[#22222c] text-center">
                <div className="text-[10px] text-zinc-400">Clients créés</div>
                <div className="font-mono font-black text-white text-lg mt-1">36</div>
                <div className="text-[9px] text-cyan-400 font-semibold">Ce mois</div>
              </div>
            </div>

            {/* Activité récente */}
            <div className="space-y-2 pt-2">
              <h4 className="text-[11px] font-bold text-white">Activité récente</h4>

              <div className="space-y-2 text-[10px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-zinc-300">Connexion réussie (IP: 192.168.1.45)</span>
                  </div>
                  <span className="font-mono text-zinc-500">Hier, 17:30</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="text-zinc-300">Facture créée FAC-2025-0156</span>
                  </div>
                  <span className="font-mono text-zinc-500">Hier, 16:22</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-zinc-300">Vente enregistrée : Toyota Land Cruiser</span>
                  </div>
                  <span className="font-mono text-zinc-500">Hier, 15:10</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-zinc-300">Paiement reçu : 12 450 €</span>
                  </div>
                  <span className="font-mono text-zinc-500">Hier, 14:05</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end pt-3 border-t border-[#202028]">
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <KeyRound className="h-3.5 w-3.5" />
            <span>Réinitialiser le mot de passe</span>
          </button>
        </div>
      </div>
    </div>
  )
}
