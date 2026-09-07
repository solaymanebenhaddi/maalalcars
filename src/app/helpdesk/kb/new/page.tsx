'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  Bold,
  Italic,
  List,
  Link2,
  Code,
} from 'lucide-react'

export default function ArticleEditorPage() {
  const router = useRouter()
  const [title, setTitle] = useState('Comment suivre ma commande ?')
  const [category, setCategory] = useState('Commandes')
  const [summary, setSummary] = useState(
    'Guide étape par étape pour permettre aux clients de suivre leur commande.'
  )
  const [content, setContent] = useState(
    `Pour suivre votre commande en quelques étapes simples :

1. Connectez-vous à votre compte sur notre plateforme.
2. Allez dans la section "Mes commandes".
3. Cliquez sur la commande que vous souhaitez vérifier.
4. Vous verrez le suivi en temps réel et les informations de livraison.`
  )
  const [status, setStatus] = useState('Publié')
  const [visibility, setVisibility] = useState('Public')
  const [tags, setTags] = useState('commandes, suivi, livraison')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      router.push('/helpdesk/kb')
    }, 500)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/helpdesk/kb"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Base de connaissances</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Support</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Éditeur d&apos;article</span>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <div className="border-b border-[#222228] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-red-500" />
                <span>Éditeur d&apos;article / FAQ</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Rédigez, mettez en forme et publiez des guides d&apos;assistance pour vos clients.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/helpdesk/kb"
                className="rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
              >
                {isSaving ? 'Enregistrement...' : 'Publier l’article'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Article Fields & Content (span-8) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Titre de l&apos;article <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Commandes">Commandes</option>
                    <option value="Livraison">Livraison</option>
                    <option value="Paiements">Paiements</option>
                    <option value="Retours & remboursements">Retours &amp; remboursements</option>
                    <option value="Produits">Produits</option>
                    <option value="Compte & profil">Compte &amp; profil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Résumé
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Toolbar & Rich Content Editor */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-400">
                  Contenu de l&apos;article
                </label>
                <div className="rounded-lg border border-[#282834] bg-[#18181f] overflow-hidden">
                  <div className="flex items-center gap-1 p-1.5 border-b border-[#282834] bg-[#141418]">
                    <button type="button" className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white">
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white">
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white">
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white">
                      <Link2 className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white">
                      <Code className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={9}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent p-3 text-xs text-white focus:outline-none leading-relaxed font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Right: Meta & Settings (span-4) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c] space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-1.5">
                  Paramètres de publication
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Statut
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Publié">Publié</option>
                    <option value="Brouillon">Brouillon</option>
                    <option value="Archivé">Archivé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Visibilité
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Public">Public (Clients &amp; Équipes)</option>
                    <option value="Interne">Interne uniquement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Mots-clés / Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Aperçu statistiques */}
              <div className="p-3 rounded-lg border border-[#202028] bg-[#16161c] space-y-2 text-xs">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Statistiques d&apos;impact</span>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Vues totales</span>
                  <span className="font-mono font-bold text-white">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Taux d&apos;utilité</span>
                  <span className="font-mono font-bold text-emerald-400">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Dernière mise à jour</span>
                  <span className="font-mono text-[10px] text-zinc-400">12/06/2025 à 14:22</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
