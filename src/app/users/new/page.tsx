'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Shield,
  Camera,
} from 'lucide-react'

export default function NewUserPage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/users"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white">
              Ajouter un utilisateur
            </h1>
            <p className="text-[10px] text-zinc-400">
              Utilisateurs &gt; Ajouter un utilisateur
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Container matching Reference #28 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Col: Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-red-500" />
              <span>Informations personnelles</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Youssef"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="El Idrissi"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                defaultValue="youssef.elidrissi@maalalcars.com"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Téléphone
              </label>
              <input
                type="text"
                defaultValue="+212 6 12 34 56 78"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Photo de profil
              </label>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 font-bold text-zinc-300 text-sm">
                  YE
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  <Camera className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Changer la photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Informations du compte & Options */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span>Informations du compte</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Rôle <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Vendeur</option>
                <option>Gestionnaire</option>
                <option>Administrateur</option>
                <option>Comptable</option>
                <option>Assistante</option>
                <option>Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Statut
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                <option>Actif</option>
                <option>Inactif</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                defaultValue="••••••••••••"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Confirmer le mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                defaultValue="••••••••••••"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Options Checkboxes */}
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-semibold text-zinc-300 pb-0.5">
                Options
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#18181f] border border-[#24242e] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0"
                />
                <span className="text-[11px] text-zinc-200">Envoyer un email d&apos;invitation</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#18181f] border border-[#24242e] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0"
                />
                <span className="text-[11px] text-zinc-200">Exiger le changement de mot de passe à la première connexion</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/users"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Enregistrer l&apos;utilisateur
          </button>
        </div>
      </div>
    </div>
  )
}
