import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { systemRepository } from '@/repositories/system.repository'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function createLeadAction(formData: FormData) {
  'use server'

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const email = (formData.get('email') as string) || null
  const source = formData.get('source') as string
  const campaignId = (formData.get('campaignId') as string) || null
  const interestType = (formData.get('interestType') as string) || "Achat d'un véhicule"
  const estimatedBudgetStr = formData.get('estimatedBudget') as string
  const estimatedBudget = estimatedBudgetStr ? parseFloat(estimatedBudgetStr) : null
  const assignedToId = (formData.get('assignedToId') as string) || null
  const tagsStr = formData.get('tags') as string
  const tags = tagsStr ? JSON.stringify(tagsStr.split(',').map((t) => t.trim())) : null
  const notes = (formData.get('notes') as string) || null

  const count = await prisma.lead.count()
  const code = `LEAD-2026-${String(count + 1).padStart(4, '0')}`

  await prisma.lead.create({
    data: {
      code,
      firstName,
      lastName,
      phone,
      email,
      source,
      campaignId,
      interestType,
      estimatedBudget,
      assignedToId,
      tags,
      notes,
      status: 'NEW',
    },
  })

  redirect('/leads')
}

export default async function NewLeadPage() {
  const [campaigns, advisors] = await Promise.all([
    systemRepository.getCampaigns(),
    prisma.user.findMany({ where: { isActive: true }, select: { id: true, name: true } }),
  ])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Nouveau Lead"
        subtitle="Enregistrement d’une opportunité commerciale et qualification"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Leads', href: '/leads' },
          { label: 'Nouveau' },
        ]}
        actions={
          <Link
            href="/leads"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#16161c] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux leads</span>
          </Link>
        }
      />

      {/* Form Card matching Screen 2 */}
      <form
        action={createLeadAction}
        className="rounded-2xl border border-[#222228] bg-[#121216] p-6 sm:p-8 shadow-sm space-y-6 text-xs"
      >
        {/* Section 1: Informations principales */}
        <div className="space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-zinc-300 border-b border-[#222228] pb-2">
            Informations principales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Prénom *</label>
              <input
                type="text"
                name="firstName"
                required
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Nom *</label>
              <input
                type="text"
                name="lastName"
                required
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Téléphone *</label>
              <input
                type="tel"
                name="phone"
                required
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Source *</label>
              <select
                name="source"
                defaultValue="Google Ads"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Google Ads">Google Ads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Instagram">Instagram</option>
                <option value="Site web">Site web</option>
                <option value="Parrainage">Parrainage</option>
                <option value="Walk-in">Visite Showroom (Walk-in)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Campagne</label>
              <select
                name="campaignId"
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
                name="interestType"
                defaultValue="Achat d'un véhicule"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Achat d'un véhicule">Achat d’un véhicule</option>
                <option value="Vente / Reprise">Vente / Reprise</option>
                <option value="Entretien & Atelier">Entretien & Atelier</option>
                <option value="Financement">Financement / Crédit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Montant estimé (DH)</label>
              <input
                type="number"
                name="estimatedBudget"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Assigné à</label>
              <select
                name="assignedToId"
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
                name="tags"
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Informations complémentaires */}
        <div className="space-y-4 pt-2 border-t border-[#222228]">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-zinc-300 border-b border-[#222228] pb-2">
            Informations complémentaires
          </h3>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Message / Commentaires</label>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-white focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222228]">
          <Link
            href="/leads"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-5 py-2.5 font-bold text-zinc-300 hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2.5 font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Enregistrer le lead</span>
          </button>
        </div>
      </form>
    </div>
  )
}
