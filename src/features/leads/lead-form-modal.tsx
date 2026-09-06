'use client'

import React, { useState } from 'react'
import { X, UploadCloud, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  isOpen: boolean
  onClose: () => void
  campaigns?: Array<{ id: string; name: string }>
  advisors?: Array<{ id: string; name: string }>
}

export function LeadFormModal({ isOpen, onClose, campaigns = [], advisors = [] }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    source: 'Google Ads',
    campaignId: '',
    interestType: "Achat d'un véhicule",
    estimatedBudget: '',
    assignedToId: '',
    tags: 'SUV, Diesel, Automatique',
    notes: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email || undefined,
          source: formData.source,
          campaignId: formData.campaignId || undefined,
          interestType: formData.interestType,
          estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : undefined,
          assignedToId: formData.assignedToId || undefined,
          tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
          notes: formData.notes || undefined,
        }),
      })

      if (res.ok) {
        onClose()
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Erreur lors de la création du lead')
      }
    } catch (err) {
      console.error('Submit lead error:', err)
      alert('Erreur réseau')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#282834] bg-[#121216] p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222228] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/20 text-red-500">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nouveau Lead</h2>
              <p className="text-xs text-zinc-400">Enregistrement d’une opportunité commerciale et qualification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-[#1c1c24] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body matching Screen 2 */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Informations principales */}
          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-zinc-300">
              Informations principales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Yanis"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Bennani"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  placeholder="06 98 76 54 32"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="yanis.bennani@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Source *</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Site web">Site web</option>
                  <option value="Parrainage">Parrainage</option>
                  <option value="Walk-in">Visite Showroom (Walk-in)</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Campagne</label>
                <select
                  value={formData.campaignId}
                  onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="">Aucune campagne associée</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Intérêt</label>
                <select
                  value={formData.interestType}
                  onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Achat d'un véhicule">Achat d’un véhicule</option>
                  <option value="Vente / Reprise">Vente / Reprise de véhicule</option>
                  <option value="Entretien & Atelier">Entretien & Atelier SAV</option>
                  <option value="Demande de Financement">Demande de Financement / Crédit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Montant estimé (DH)</label>
                <input
                  type="number"
                  placeholder="240000"
                  value={formData.estimatedBudget}
                  onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Assigné à</label>
                <select
                  value={formData.assignedToId}
                  onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="">Non assigné</option>
                  {advisors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="SUV, Diesel, Automatique"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Informations complémentaires */}
          <div className="space-y-4 pt-2 border-t border-[#222228]">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-zinc-300">
              Informations complémentaires
            </h3>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Message / Commentaires</label>
              <textarea
                rows={3}
                placeholder="Je suis intéressé par un SUV automatique, budget autour de 240 000 DH. Disponible en semaine après 18h."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Fichier joint</label>
              <div className="rounded-xl border border-dashed border-[#333340] bg-[#16161c] p-6 text-center hover:border-red-500/50 cursor-pointer transition-colors">
                <UploadCloud className="mx-auto h-8 w-8 text-zinc-500 mb-2" />
                <span className="text-zinc-300 font-semibold block">Cliquez pour uploader ou glissez déposez un fichier</span>
                <span className="text-[10px] text-zinc-500">PDF, PNG, JPG jusqu’à 10MB</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222228]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2.5 font-bold text-zinc-300 hover:text-white hover:bg-[#202028]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2.5 font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
