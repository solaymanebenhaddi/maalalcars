'use client'

import React, { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  UploadCloud,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
} from 'lucide-react'
import { optimizeImageToWebP, formatBytes } from '@/lib/image-optimizer'

export interface VehiclePhotoItem {
  id?: string
  url: string
  isPrimary?: boolean
  name?: string
  originalSize?: number
  optimizedSize?: number
}

interface VehiclePhotoUploaderProps {
  initialPhotos?: VehiclePhotoItem[]
  vehicleId?: string
  maxPhotos?: number
  onPhotosChange?: (photos: VehiclePhotoItem[]) => void | Promise<void>
  onDeletePhoto?: (photoId: string, url: string) => Promise<void>
  onSetPrimaryPhoto?: (photoId: string) => Promise<void>
}

export function VehiclePhotoUploader({
  initialPhotos = [],
  vehicleId,
  maxPhotos = 10,
  onPhotosChange,
  onDeletePhoto,
  onSetPrimaryPhoto,
}: VehiclePhotoUploaderProps) {
  const router = useRouter()
  const [photos, setPhotos] = useState<VehiclePhotoItem[]>(() => {
    if (initialPhotos.length > 0) {
      // Ensure at least one primary
      const hasPrimary = initialPhotos.some((p) => p.isPrimary)
      return initialPhotos.map((p, idx) => ({
        ...p,
        isPrimary: hasPrimary ? p.isPrimary : idx === 0,
      }))
    }
    return []
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const remainingSlots = Math.max(0, maxPhotos - photos.length)

  const updatePhotos = async (newPhotos: VehiclePhotoItem[]) => {
    setPhotos(newPhotos)
    if (onPhotosChange) {
      try {
        await onPhotosChange(newPhotos)
      } catch (err: unknown) {
        console.error('Failed to sync photos:', err)
      }
    }
  }

  const handleFiles = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'))

    if (rawFiles.length === 0) {
      setErrorMessage("Aucune image valide sélectionnée (formats acceptés : JPG, PNG, WEBP, etc.)")
      return
    }

    if (remainingSlots <= 0) {
      setErrorMessage(`Limite maximale atteinte : ce véhicule possède déjà ${maxPhotos} photos.`)
      return
    }

    const filesToProcess = rawFiles.slice(0, remainingSlots)
    if (rawFiles.length > remainingSlots) {
      setErrorMessage(
        `Seules les ${remainingSlots} premières images ont été sélectionnées pour ne pas dépasser la limite de ${maxPhotos} photos.`
      )
    } else {
      setErrorMessage(null)
    }

    setIsProcessing(true)
    setProcessingStatus(`Optimisation WebP de ${filesToProcess.length} image(s)...`)

    try {
      const optimizedFiles: File[] = []
      const metaMap: Record<string, { originalSize: number; optimizedSize: number }> = {}

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i]
        setProcessingStatus(
          `Conversion WebP (${i + 1}/${filesToProcess.length}) : ${file.name}...`
        )

        const result = await optimizeImageToWebP(file, {
          maxDimension: 1920,
          quality: 0.92,
        })

        optimizedFiles.push(result.file)
        metaMap[result.file.name] = {
          originalSize: result.originalSize,
          optimizedSize: result.optimizedSize,
        }
      }

      setProcessingStatus(`Téléversement sécurisé de ${optimizedFiles.length} photo(s) WebP...`)

      // Upload files to API
      const formData = new FormData()
      optimizedFiles.forEach((f) => formData.append('photos', f))
      if (vehicleId) {
        formData.append('vehicleId', vehicleId)
      }

      const res = await fetch('/api/vehicles/upload-photos', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Échec du téléversement sur le serveur')
      }

      const data = (await res.json()) as {
        success: boolean
        photos: Array<{ url: string; name: string; size: number }>
      }

      const newlyUploaded: VehiclePhotoItem[] = data.photos.map((p, idx) => {
        const meta = metaMap[p.name]
        return {
          url: p.url,
          name: p.name,
          isPrimary: photos.length === 0 && idx === 0,
          originalSize: meta?.originalSize,
          optimizedSize: p.size,
        }
      })

      const updated = [...photos, ...newlyUploaded]
      // Ensure primary
      if (!updated.some((p) => p.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true
      }

      await updatePhotos(updated)
      setSuccessMessage(
        `${newlyUploaded.length} photo(s) ajoutée(s) et convertie(s) en WebP haute fidélité avec succès !`
      )
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err: unknown) {
      console.error('Photo optimization/upload error:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors du traitement des photos')
    } finally {
      setIsProcessing(false)
      setProcessingStatus('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (remainingSlots > 0 && !isProcessing) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (isProcessing || remainingSlots <= 0) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemovePhoto = async (index: number) => {
    const photoToRemove = photos[index]

    if (photoToRemove.id && onDeletePhoto) {
      startTransition(async () => {
        try {
          await onDeletePhoto(photoToRemove.id!, photoToRemove.url)
          executeLocalRemoval(index)
        } catch (err: unknown) {
          setErrorMessage(err instanceof Error ? err.message : 'Erreur lors de la suppression')
        }
      })
    } else {
      executeLocalRemoval(index)
    }
  }

  const executeLocalRemoval = (index: number) => {
    const next = photos.filter((_, idx) => idx !== index)
    // If the removed one was primary, assign primary to first
    if (photos[index]?.isPrimary && next.length > 0) {
      next[0].isPrimary = true
    }
    updatePhotos(next)
  }

  const handleSetPrimary = async (index: number) => {
    const photo = photos[index]
    if (photo.isPrimary) return

    if (photo.id && onSetPrimaryPhoto) {
      startTransition(async () => {
        try {
          await onSetPrimaryPhoto(photo.id!)
          executeLocalSetPrimary(index)
          setSuccessMessage('Photo de couverture mise à jour. Mise à jour partout sur le véhicule.')
          setTimeout(() => setSuccessMessage(null), 3500)
          router.refresh()
        } catch (err: unknown) {
          setErrorMessage(err instanceof Error ? err.message : 'Erreur modification photo principale')
        }
      })
    } else {
      executeLocalSetPrimary(index)
    }
  }

  const executeLocalSetPrimary = (index: number) => {
    const target = photos[index]
    const others = photos.filter((_, idx) => idx !== index)
    const next = [
      { ...target, isPrimary: true },
      ...others.map((p) => ({ ...p, isPrimary: false })),
    ]
    updatePhotos(next)
  }

  return (
    <div className="space-y-4">
      {/* Hidden inputs for parent forms (e.g. New Vehicle Page) */}
      <input
        type="hidden"
        name="vehiclePhotosData"
        value={JSON.stringify(
          photos.map((p, idx) => ({
            url: p.url,
            isPrimary: Boolean(p.isPrimary),
            order: idx,
          }))
        )}
      />
      {/* Legacy fallback for primary photo */}
      <input
        type="hidden"
        name="photoUrl"
        value={photos.find((p) => p.isPrimary)?.url || photos[0]?.url || ''}
      />

      {/* Header / Counter & Specs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222228] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Galerie Photos du Véhicule
          </span>
          <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-mono font-bold text-zinc-300">
            {photos.length} / {maxPhotos}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Compression WebP automatique haute définition (qualité 92%)</span>
        </div>
      </div>

      {/* Dropzone Area */}
      {remainingSlots > 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-200 cursor-pointer text-center ${
            isDragging
              ? 'border-red-500 bg-red-950/20 scale-[0.99]'
              : 'border-[#282834] bg-[#14141a] hover:border-zinc-500 hover:bg-[#181822]'
          } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={isProcessing || remainingSlots <= 0}
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2a2a38] bg-[#1a1a24] text-red-500 shadow-inner mb-3">
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin text-red-400" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-white">
              {isProcessing
                ? processingStatus
                : 'Glissez-déposez vos photos de voiture ici, ou cliquez pour parcourir'}
            </p>
            <p className="text-[11px] text-zinc-400">
              Jusqu’à <strong className="text-white">{remainingSlots}</strong> photo(s) restante(s) • Formats acceptés : JPG, PNG, WEBP • Max 10 photos au total
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Limite de {maxPhotos} photos atteinte.</strong> Pour ajouter une nouvelle photo, supprimez-en une au préalable.
          </span>
        </div>
      )}

      {/* Alert Messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 animate-in fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Photos Thumbnail Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id || photo.url}
              className={`group relative aspect-[4/3] rounded-xl border overflow-hidden bg-black transition-all ${
                photo.isPrimary
                  ? 'border-red-500 ring-2 ring-red-500/40 shadow-lg shadow-red-950/40'
                  : 'border-[#262634] hover:border-zinc-500'
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.name || `Photo véhicule ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Primary Badge or Set Primary Button */}
              <div className="absolute top-2 left-2 z-10">
                {photo.isPrimary ? (
                  <span className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-md">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Principale</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    disabled={isPending}
                    title="Définir comme photo principale de couverture"
                    className="flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-zinc-300 backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all shadow"
                  >
                    <Star className="h-3 w-3" />
                    <span>Couverture</span>
                  </button>
                )}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                disabled={isPending}
                title="Supprimer cette photo"
                className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-black/70 text-zinc-400 backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Bottom Metadata Bar */}
              <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[10px] text-zinc-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="rounded bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
                  #{index + 1}
                </span>
                {photo.optimizedSize ? (
                  <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-emerald-400 border border-emerald-500/30">
                    WEBP • {formatBytes(photo.optimizedSize)}
                  </span>
                ) : (
                  <span className="rounded bg-black/60 px-1.5 py-0.5 text-zinc-400">
                    WEBP
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
