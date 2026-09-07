'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'

interface RoleItem {
  id: string
  name: string
  desc: string
  count: number
}

const ROLES: RoleItem[] = [
  { id: 'admin', name: 'Administrateur', desc: 'Accès complet à toutes les fonctionnalités', count: 4 },
  { id: 'manager', name: 'Gestionnaire', desc: 'Gestion des opérations et des utilisateurs', count: 6 },
  { id: 'seller', name: 'Vendeur', desc: 'Gestion des ventes et des clients', count: 8 },
  { id: 'accountant', name: 'Comptable', desc: 'Gestion financière et comptable', count: 2 },
  { id: 'assistant', name: 'Assistant(e)', desc: 'Support administratif et documents', count: 2 },
  { id: 'marketing', name: 'Marketing', desc: 'Gestion marketing et communications', count: 2 },
]

interface PermissionRow {
  module: string
  view: 'allowed' | 'limited' | 'forbidden'
  create: 'allowed' | 'limited' | 'forbidden'
  edit: 'allowed' | 'limited' | 'forbidden'
  delete: 'allowed' | 'limited' | 'forbidden'
  export: 'allowed' | 'limited' | 'forbidden'
}

const MANAGER_PERMISSIONS: PermissionRow[] = [
  { module: 'Dashboard', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Véhicules', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Stock', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Réservations', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Ventes', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Paiements', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Régularisations', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Dépenses', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Contacts', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Factures', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Documents', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Rapports', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  { module: 'Utilisateurs', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'forbidden', export: 'allowed' },
  { module: 'Paramètres', view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
]

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('manager')

  const renderIcon = (status: 'allowed' | 'limited' | 'forbidden') => {
    if (status === 'allowed') {
      return <Check className="h-4 w-4 text-emerald-400 mx-auto" />
    }
    if (status === 'limited') {
      return <AlertCircle className="h-4 w-4 text-amber-400 mx-auto" />
    }
    return <X className="h-4 w-4 text-red-500 mx-auto" />
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/users"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux utilisateurs</span>
        </Link>

        <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>Nouveau rôle</span>
        </button>
      </div>

      {/* Main Container matching Reference #28 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Rôles &amp; permissions
          </h1>
          <p className="text-xs text-zinc-400">
            Définition des profils d&apos;accès et contrôle granulaire des autorisations par module
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Rôles disponibles */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Rôles disponibles
            </h3>

            <div className="space-y-2">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-500/60 bg-red-500/10 shadow-sm'
                        : 'border-[#24242e] bg-[#16161c] hover:border-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{r.name}</span>
                      <span className="font-mono text-[10px] text-zinc-400 font-semibold">{r.count} utilisateurs</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">{r.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right 2 Columns: Permissions Matrix */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">
                Permissions — {ROLES.find(r => r.id === selectedRole)?.name}
              </h3>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3 text-center">Voir</th>
                    <th className="py-2.5 px-3 text-center">Créer</th>
                    <th className="py-2.5 px-3 text-center">Modifier</th>
                    <th className="py-2.5 px-3 text-center">Supprimer</th>
                    <th className="py-2.5 px-3 text-center">Exporter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {MANAGER_PERMISSIONS.map((perm) => (
                    <tr key={perm.module} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-2 px-3 font-semibold text-white">{perm.module}</td>
                      <td className="py-2 px-3 text-center">{renderIcon(perm.view)}</td>
                      <td className="py-2 px-3 text-center">{renderIcon(perm.create)}</td>
                      <td className="py-2 px-3 text-center">{renderIcon(perm.edit)}</td>
                      <td className="py-2 px-3 text-center">{renderIcon(perm.delete)}</td>
                      <td className="py-2 px-3 text-center">{renderIcon(perm.export)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend matching Reference #28 Screen 3 */}
            <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#202028] text-[10px]">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-zinc-300">Autorisé</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-zinc-300">Limité</span>
              </div>
              <div className="flex items-center gap-1.5">
                <X className="h-3.5 w-3.5 text-red-500" />
                <span className="text-zinc-300">Non autorisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
