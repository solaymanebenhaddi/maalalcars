'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  UploadCloud,
  ArrowLeft,
  X,
  Plus,
} from 'lucide-react'

export default function DocumentUploadPage() {
  const [associatedType, setAssociatedType] = useState('vehicle')
  const [tags, setTags] = useState(['contrat', 'vente', 'signature'])
  const [newTag, setNewTag] = useState('')

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()])
      }
      setNewTag('')
    }
  }

  const removeTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t))
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-sm sm:text-base font-black text-white">
            Téléverser un document
          </h1>
        </div>
      </div>

      {/* Main Container matching Reference #17 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        {/* Dropzone Area */}
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2e2e3e] bg-[#16161c] p-8 text-center hover:border-red-500/50 transition-colors cursor-pointer group">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#202028] text-zinc-400 group-hover:text-red-400 group-hover:bg-red-500/10 transition-colors">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-white">
            Déposez votre fichier ici
          </h3>
          <p className="text-[11px] text-zinc-400">
            ou cliquez pour parcourir vos fichiers
          </p>
          <p className="mt-2 text-[10px] text-zinc-500">
            Formats acceptés : PDF, JPG, PNG, DOC, DOCX (Max. 10 Mo)
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-[#202028] pb-2">
            Informations du document
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Nom du document <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Contrat de vente.pdf"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Date du document <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                defaultValue="2025-05-30"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Date d&apos;expiration
              </label>
              <input
                type="date"
                placeholder="jj/mm/aaaa"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Type de document <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>Ventes</option>
                <option>Administratif</option>
                <option>Assurance</option>
                <option>Achats</option>
                <option>Technique</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500">
                <option>Ventes</option>
                <option>Véhicules</option>
                <option>Clients</option>
                <option>Contrats</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Référence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="CONTR-2025-046"
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                Description
              </label>
              <input
                type="text"
                defaultValue="Contrat de vente signé par le client."
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Associé à Radio Options */}
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] font-semibold text-zinc-300">
              Associé à <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="assoc"
                  checked={associatedType === 'vehicle'}
                  onChange={() => setAssociatedType('vehicle')}
                  className="accent-red-600"
                />
                <span>Véhicule</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="assoc"
                  checked={associatedType === 'client'}
                  onChange={() => setAssociatedType('client')}
                  className="accent-red-600"
                />
                <span>Client</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="assoc"
                  checked={associatedType === 'dossier'}
                  onChange={() => setAssociatedType('dossier')}
                  className="accent-red-600"
                />
                <span>Dossier</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="assoc"
                  checked={associatedType === 'other'}
                  onChange={() => setAssociatedType('other')}
                  className="accent-red-600"
                />
                <span>Autre</span>
              </label>
            </div>
          </div>

          {/* Selected entity dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
              Véhicule <span className="text-red-500">*</span>
            </label>
            <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
              <option>Toyota Land Cruiser 2023 (VR-A 4.0L Essence)</option>
              <option>BMW X5 xDrive30d 2021</option>
              <option>Mercedes-Benz GLC 200 2022</option>
              <option>Audi Q7 45 TDI 2020</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[11px] font-semibold text-zinc-300">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-[#20202a] border border-[#2e2e3e] px-2.5 py-1 text-xs text-zinc-300"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Ajouter un tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="h-7 w-28 rounded-md border border-[#282834] bg-[#18181f] px-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTag.trim() && !tags.includes(newTag.trim())) {
                      setTags([...tags, newTag.trim()])
                      setNewTag('')
                    }
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#202028] pt-4">
          <Link
            href="/documents"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Annuler
          </Link>

          <button className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            Téléverser le document
          </button>
        </div>
      </div>
    </div>
  )
}
