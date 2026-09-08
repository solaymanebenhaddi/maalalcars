/**
 * Client-Side Image Optimizer
 * Converts images to modern WebP format with super high quality (0.92),
 * resizes large images (max 1920px) preserving aspect ratio,
 * and significantly reduces payload size before network upload.
 */

export interface OptimizedImageResult {
  file: File
  blob: Blob
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  previewUrl: string
  width: number
  height: number
}

export interface OptimizeOptions {
  maxDimension?: number
  quality?: number
}

/**
 * Optimizes an image File into high-quality WebP format using HTML5 Canvas.
 * Safe fallback: If browser does not support WebP canvas export, returns original file.
 */
export async function optimizeImageToWebP(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizedImageResult> {
  const maxDimension = options.maxDimension ?? 1920
  const quality = options.quality ?? 0.92

  // If running in an environment without window/DOM, return original
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    const previewUrl = URL.createObjectURL(file)
    return {
      file,
      blob: file,
      originalSize: file.size,
      optimizedSize: file.size,
      compressionRatio: 0,
      previewUrl,
      width: 0,
      height: 0,
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Erreur de lecture du fichier image'))

    reader.onload = (e) => {
      const img = new Image()

      img.onerror = () => reject(new Error("Format d'image non pris en charge ou fichier corrompu"))

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Downscale proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          // Fallback if canvas context is unavailable
          const previewUrl = URL.createObjectURL(file)
          return resolve({
            file,
            blob: file,
            originalSize: file.size,
            optimizedSize: file.size,
            compressionRatio: 0,
            previewUrl,
            width: img.width,
            height: img.height,
          })
        }

        // Apply bicubic high quality image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              const previewUrl = URL.createObjectURL(file)
              return resolve({
                file,
                blob: file,
                originalSize: file.size,
                optimizedSize: file.size,
                compressionRatio: 0,
                previewUrl,
                width,
                height,
              })
            }

            // Create new WebP File with sanitized name
            const baseName = file.name.replace(/\.[^/.]+$/, '')
            const safeName = `${baseName.replace(/[^a-zA-Z0-9_-]/g, '_')}.webp`
            const optimizedFile = new File([blob], safeName, {
              type: 'image/webp',
              lastModified: Date.now(),
            })

            const previewUrl = URL.createObjectURL(blob)
            const originalSize = file.size
            const optimizedSize = blob.size
            const compressionRatio =
              originalSize > 0
                ? Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100))
                : 0

            resolve({
              file: optimizedFile,
              blob,
              originalSize,
              optimizedSize,
              compressionRatio,
              previewUrl,
              width,
              height,
            })
          },
          'image/webp',
          quality
        )
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Format bytes into human-readable size (Ko, Mo)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Ko'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Octets', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
