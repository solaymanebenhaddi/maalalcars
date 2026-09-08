'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  AlertCircle,
  File,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ChevronDown,
} from 'lucide-react'
import { useConfirm } from '@/components/modals/confirm-dialog'
import { WheelSpinner } from '@/components/ui/wheel-spinner'
import {
  DocumentCategory,
  getDocumentTypesByCategory,
  getDocumentTypeLabel,
} from '@/domain/document'

export interface DocumentItem {
  id: string
  code?: string
  title: string
  type: string
  category: string
  fileUrl: string
  fileSize: number
  mimeType: string
  issueDate: string | Date
  expiryDate?: string | Date | null
  purchaseId?: string | null
  saleId?: string | null
  repairId?: string | null
  vehicleId?: string | null
}

interface DocumentManagerProps {
  category?: DocumentCategory | 'TOUS'
  vehicleId?: string | null
  purchaseId?: string | null
  saleId?: string | null
  repairId?: string | null
  initialDocuments?: DocumentItem[]
  title?: string
  subtitle?: string
  compact?: boolean
  allowUpload?: boolean
  onDocumentsUpdated?: () => void
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Ko'
  const k = 1024
  if (bytes < k) return `${bytes} B`
  if (bytes < k * k) return `${(bytes / k).toFixed(1)} Ko`
  return `${(bytes / (k * k)).toFixed(2)} Mo`
}

function getFileIcon(mimeType: string, url: string) {
  if (mimeType.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
    return <FileText className="h-5 w-5 text-rose-400" />
  }
  if (
    mimeType.startsWith('image/') ||
    /\.(webp|jpg|jpeg|png|gif|avif)$/i.test(url)
  ) {
    return <ImageIcon className="h-5 w-5 text-cyan-400" />
  }
  return <File className="h-5 w-5 text-indigo-400" />
}

export function DocumentManager({
  category = 'TOUS',
  vehicleId,
  purchaseId,
  saleId,
  repairId,
  initialDocuments = [],
  title,
  subtitle,
  compact = false,
  allowUpload = true,
  onDocumentsUpdated,
}: DocumentManagerProps) {
  const router = useRouter()
  const { confirm } = useConfirm()

  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<DocumentCategory | 'TOUS'>(category)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Upload Modal State
  const defaultCategory: DocumentCategory = category !== 'TOUS' ? category : 'Achats'
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>(defaultCategory)
  const availableTypes = getDocumentTypesByCategory(uploadCategory)
  const [selectedType, setSelectedType] = useState(availableTypes[0]?.value || 'AUTRE')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customTitle, setCustomTitle] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  // Sync if initialDocuments change
  const [prevInitialDocs, setPrevInitialDocs] = useState(initialDocuments)
  if (initialDocuments !== prevInitialDocs) {
    setPrevInitialDocs(initialDocuments)
    setDocuments(initialDocuments)
  }

  const handleCategoryChange = (newCat: DocumentCategory) => {
    setUploadCategory(newCat)
    const types = getDocumentTypesByCategory(newCat)
    const firstType = types[0]?.value || 'AUTRE'
    setSelectedType(firstType)
    setCustomTitle(getDocumentTypeLabel(firstType))
  }

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType)
    if (!customTitle || customTitle === getDocumentTypeLabel(selectedType)) {
      setCustomTitle(getDocumentTypeLabel(newType))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!customTitle) {
        setCustomTitle(getDocumentTypeLabel(selectedType))
      }
    }
  }

  const handleOpenUpload = () => {
    setError(null)
    setSuccessMessage(null)
    const initCat = category !== 'TOUS' ? category : 'Achats'
    setUploadCategory(initCat)
    const types = getDocumentTypesByCategory(initCat)
    const firstType = types[0]?.value || 'AUTRE'
    setSelectedType(firstType)
    setCustomTitle(getDocumentTypeLabel(firstType))
    setSelectedFile(null)
    setExpiryDate('')
    setIsUploadModalOpen(true)
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier à téléverser')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', selectedType)
      formData.append('category', uploadCategory)
      formData.append('title', customTitle.trim() || getDocumentTypeLabel(selectedType))
      if (vehicleId) formData.append('vehicleId', vehicleId)
      if (purchaseId) formData.append('purchaseId', purchaseId)
      if (saleId) formData.append('saleId', saleId)
      if (repairId) formData.append('repairId', repairId)
      if (expiryDate) formData.append('expiryDate', expiryDate)

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Échec du téléversement du document')
      }

      setDocuments((prev) => [data, ...prev])
      setSuccessMessage('Document enregistré avec succès !')
      setIsUploadModalOpen(false)
      setSelectedFile(null)

      if (onDocumentsUpdated) {
        onDocumentsUpdated()
      } else {
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (doc: DocumentItem) => {
    const confirmed = await confirm({
      title: 'Supprimer ce document',
      description: `Êtes-vous sûr de vouloir supprimer définitivement « ${doc.title} » ? Cette action est irréversible.`,
      confirmText: 'Supprimer définitivement',
      cancelText: 'Conserver',
      variant: 'danger',
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
      setSuccessMessage('Document supprimé avec succès')

      if (onDocumentsUpdated) {
        onDocumentsUpdated()
      } else {
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    }
  }

  const displayedDocuments = documents.filter((doc) => {
    if (selectedCategoryFilter === 'TOUS') return true
    return doc.category === selectedCategoryFilter
  })

  const categoryColorClass = {
    Achats: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Ventes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Réparations: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Administratif: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    TOUS: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20',
  }[category] || 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20'

  return (
    <div className="space-y-4">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202028] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>{title || `Documents & Justificatifs (${category})`}</span>
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${categoryColorClass}`}>
              {documents.length} fichier{documents.length > 1 ? 's' : ''}
            </span>
          </div>
          {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>

        {allowUpload && (
          <button
            type="button"
            onClick={handleOpenUpload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Ajouter un document</span>
          </button>
        )}
      </div>

      {/* Category filter pills if TOUS */}
      {category === 'TOUS' && (
        <div className="flex flex-wrap items-center gap-1.5 pb-2">
          {(['TOUS', 'Achats', 'Ventes', 'Réparations', 'Administratif'] as const).map((cat) => {
            const count = cat === 'TOUS' ? documents.length : documents.filter((d) => d.category === cat).length
            const isSelected = selectedCategoryFilter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-[#181820] text-zinc-400 hover:text-white hover:bg-[#20202a] border border-[#24242e]'
                }`}
              >
                <span>{cat === 'TOUS' ? 'Tous les documents' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-red-700 text-white' : 'bg-[#22222c] text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-zinc-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Documents List / Grid */}
      {displayedDocuments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#282834] bg-[#14141a]/60 p-6 text-center space-y-2">
          <FileText className="h-8 w-8 text-zinc-600 mx-auto" />
          <p className="text-xs font-semibold text-zinc-400">
            {selectedCategoryFilter === 'TOUS'
              ? 'Aucun document téléversé pour ce dossier'
              : `Aucun document dans la catégorie « ${selectedCategoryFilter} »`}
          </p>
          <p className="text-[11px] text-zinc-500">
            Téléversez les pièces justificatives (Carte Grise, Contrat, CIN, Devis, Facture) pour assurer la conformité du dossier.
          </p>
          {allowUpload && (
            <button
              type="button"
              onClick={handleOpenUpload}
              className="mt-2 text-xs font-bold text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Téléverser le premier document</span>
            </button>
          )}
        </div>
      ) : (
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-3`}>
          {displayedDocuments.map((doc) => {
            const dateStr = doc.issueDate
              ? new Date(doc.issueDate).toLocaleDateString('fr-MA', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : ''

            return (
              <div
                key={doc.id}
                className="group relative rounded-xl border border-[#242430] bg-[#16161c] p-3.5 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#202028] border border-[#2c2c38]">
                        {getFileIcon(doc.mimeType, doc.fileUrl)}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors" title={doc.title}>
                          {doc.title}
                        </h5>
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          {doc.code || 'DOC-REF'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {category === 'TOUS' && doc.category && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                          doc.category === 'Achats'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : doc.category === 'Ventes'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : doc.category === 'Réparations'
                            ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                            : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                        }`}
                      >
                        {doc.category}
                      </span>
                    )}
                    <span className="rounded-md bg-[#202028] px-2 py-0.5 text-[10px] font-bold text-zinc-300 border border-[#2c2c3a]">
                      {getDocumentTypeLabel(doc.type)}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {formatFileSize(doc.fileSize)}
                    </span>
                    {dateStr && (
                      <span className="text-[10px] text-zinc-500">
                        • {dateStr}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div className="flex items-center justify-between border-t border-[#22222c] pt-2.5 mt-1">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Consulter</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href={doc.fileUrl}
                      download
                      className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Télécharger le fichier"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(doc)}
                      className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Supprimer ce document"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[#2a2a38] bg-[#121216] shadow-2xl p-6 text-white space-y-5 animate-in fade-in zoom-in-95 duration-150 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#22222e] pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Téléverser un document ({category})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Sélectionnez le type et déposez le fichier justificatif correspondant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
                className="rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Category Selection if TOUS */}
              {category === 'TOUS' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Dossier d&apos;affectation *
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={uploadCategory}
                      onChange={(e) => handleCategoryChange(e.target.value as DocumentCategory)}
                      required
                      className="h-10 w-full appearance-none rounded-lg border border-[#282834] bg-[#16161c] pl-3 pr-8 text-xs text-white focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Achats">Achats & Approvisionnement (Fournisseur / Semsar)</option>
                      <option value="Ventes">Ventes & Cessions (Client / Facturation)</option>
                      <option value="Réparations">Réparations & Atelier (Mécanique / Carrosserie)</option>
                      <option value="Administratif">Administratif & Assurance (Carte Grise / Vignette)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
                  </div>
                </div>
              )}

              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Type de document *
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    required
                    className="h-10 w-full appearance-none rounded-lg border border-[#282834] bg-[#16161c] pl-3 pr-8 text-xs text-white focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    {availableTypes.map((dt) => (
                      <option key={dt.value} value={dt.value} className="bg-[#16161c] text-white">
                        {dt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-zinc-400" />
                </div>
              </div>

              {/* Title / Libellé */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Titre du document *
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                  placeholder="Ex: Carte Grise Toyota Land Cruiser"
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none font-medium"
                />
              </div>

              {/* File Dropzone / Picker */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Fichier correspondant (PDF, JPG, PNG, WEBP, DOCX) *
                </label>
                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2e2e3e] bg-[#16161e] p-5 text-center hover:border-red-500/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202028] text-zinc-400 mb-2">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  {selectedFile ? (
                    <div className="text-xs">
                      <span className="font-bold text-emerald-400 block">{selectedFile.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Taille : {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-400">
                      <span className="font-semibold text-white">Cliquez pour choisir</span> ou glissez un fichier
                      <p className="text-[10px] text-zinc-500 mt-0.5">PDF ou Image jusqu&apos;à 25 Mo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expiry Date (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Date d&apos;expiration (Optionnel)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22222e]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="h-9 px-4 rounded-lg border border-[#282834] bg-[#16161c] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="h-9 px-5 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-950/40 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <WheelSpinner size={16} />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Enregistrer le document</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
