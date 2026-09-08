'use client'

import React, { useState } from 'react'
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  File,
  Image as ImageIcon,
  ChevronDown,
} from 'lucide-react'
import { WheelSpinner } from '@/components/ui/wheel-spinner'
import {
  DocumentCategory,
  getDocumentTypesByCategory,
  getDocumentTypeLabel,
  validateDocumentUpload,
} from '@/domain/document'

export interface UploadedDocSummary {
  id: string
  code?: string
  title: string
  type: string
  category: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

interface DocumentFormUploaderProps {
  category: DocumentCategory
  title?: string
  subtitle?: string
  fieldName?: string
  vehicleId?: string | null
  purchaseId?: string | null
  saleId?: string | null
  repairId?: string | null
  onDocumentsChange?: (documents: UploadedDocSummary[]) => void
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
    return <FileText className="h-4 w-4 text-rose-400" />
  }
  if (
    mimeType.startsWith('image/') ||
    /\.(webp|jpg|jpeg|png|gif|avif)$/i.test(url)
  ) {
    return <ImageIcon className="h-4 w-4 text-cyan-400" />
  }
  return <File className="h-4 w-4 text-indigo-400" />
}

export function DocumentFormUploader({
  category,
  title,
  subtitle,
  fieldName = 'vehicleDocumentsData',
  vehicleId,
  purchaseId,
  saleId,
  repairId,
  onDocumentsChange,
}: DocumentFormUploaderProps) {
  const [documents, setDocuments] = useState<UploadedDocSummary[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const availableTypes = getDocumentTypesByCategory(category)
  const [selectedType, setSelectedType] = useState(availableTypes[0]?.value || 'AUTRE')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customTitle, setCustomTitle] = useState(getDocumentTypeLabel(availableTypes[0]?.value || 'AUTRE'))

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType)
    if (!customTitle || customTitle === getDocumentTypeLabel(selectedType)) {
      setCustomTitle(getDocumentTypeLabel(newType))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateDocumentUpload({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
      })
      if (!validation.valid) {
        setError(validation.error || 'Fichier invalide')
        setSelectedFile(null)
        return
      }
      setError(null)
      setSelectedFile(file)
      if (!customTitle) {
        setCustomTitle(getDocumentTypeLabel(selectedType))
      }
    }
  }

  const handleUploadDocument = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier à téléverser')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', selectedType)
      formData.append('category', category)
      formData.append('title', customTitle.trim() || getDocumentTypeLabel(selectedType))
      if (vehicleId) formData.append('vehicleId', vehicleId)
      if (purchaseId) formData.append('purchaseId', purchaseId)
      if (saleId) formData.append('saleId', saleId)
      if (repairId) formData.append('repairId', repairId)

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Échec du téléversement du document')
      }

      const updated = [
        ...documents,
        {
          id: data.id,
          code: data.code,
          title: data.title,
          type: data.type,
          category: data.category,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
        },
      ]

      setDocuments(updated)
      setSelectedFile(null)
      setSuccessMessage(`« ${data.title} » ajouté avec succès !`)

      // Reset next default type
      const nextIndex = Math.min(documents.length + 1, availableTypes.length - 1)
      const nextType = availableTypes[nextIndex]?.value || availableTypes[0]?.value || 'AUTRE'
      setSelectedType(nextType)
      setCustomTitle(getDocumentTypeLabel(nextType))

      if (onDocumentsChange) {
        onDocumentsChange(updated)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléversement')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDocument = (docId: string) => {
    const updated = documents.filter((d) => d.id !== docId)
    setDocuments(updated)
    if (onDocumentsChange) {
      onDocumentsChange(updated)
    }
  }

  return (
    <div className="rounded-xl border border-[#242430] bg-[#141418] p-4 space-y-4">
      {/* Hidden input containing document IDs for parent form submission */}
      <input
        type="hidden"
        name={fieldName}
        value={JSON.stringify(documents.map((d) => d.id))}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#202028] pb-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {title || `Documents & Justificatifs (${category})`}
          </span>
          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
            {documents.length} pièce{documents.length > 1 ? 's' : ''}
          </span>
        </div>
        {subtitle && <p className="text-[11px] text-zinc-400 hidden sm:block">{subtitle}</p>}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Document Control Box */}
      <div className="rounded-xl border border-[#282834] bg-[#16161c] p-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. Type selector */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Type de document *
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                disabled={isUploading}
                className="h-9 w-full appearance-none rounded-lg border border-[#2e2e3a] bg-[#121216] pl-2.5 pr-7 text-xs text-white focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
              >
                {availableTypes.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#16161c] text-white">
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-zinc-400" />
            </div>
          </div>

          {/* 2. Custom Title */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Titre / Libellé de la pièce *
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              disabled={isUploading}
              placeholder="Ex: Carte Grise Barrée"
              className="h-9 w-full rounded-lg border border-[#2e2e3a] bg-[#121216] px-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* 3. File Input & Upload Action */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Fichier (PDF, Image, Doc max 25 Mo) *
            </label>
            <div className="flex items-center gap-2">
              <label className="relative flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border border-dashed border-[#343444] bg-[#121216] px-3 text-xs text-zinc-300 hover:border-cyan-500 hover:text-white transition-colors cursor-pointer truncate">
                <UploadCloud className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <span className="truncate">
                  {selectedFile ? selectedFile.name : 'Choisir le fichier'}
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleUploadDocument}
                disabled={isUploading || !selectedFile}
                className="h-9 px-3.5 rounded-lg bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-sm disabled:opacity-40 flex items-center gap-1.5 shrink-0"
              >
                {isUploading ? (
                  <>
                    <WheelSpinner size={14} />
                    <span>Ajout...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Joindre</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {documents.map((doc, idx) => (
            <div
              key={doc.id || idx}
              className="flex items-center justify-between rounded-lg border border-[#262632] bg-[#16161c] px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#202028] border border-[#2a2a36]">
                  {getFileIcon(doc.mimeType, doc.fileUrl)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate text-xs" title={doc.title}>
                    {doc.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span className="text-cyan-400 font-medium">{getDocumentTypeLabel(doc.type)}</span>
                    <span>•</span>
                    <span className="font-mono">{formatFileSize(doc.fileSize)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-zinc-400 hover:text-cyan-300 transition-colors"
                  title="Consulter le fichier"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Retirer cette pièce"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#24242e] bg-[#121216]/50 p-3 text-center text-[11px] text-zinc-500">
          Aucune pièce justificative jointe pour le moment. Vous pouvez joindre la carte grise, contrat, CIN ou facture dès maintenant.
        </div>
      )}
    </div>
  )
}
