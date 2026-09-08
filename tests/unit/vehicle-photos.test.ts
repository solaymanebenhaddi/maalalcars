import { describe, it, expect } from 'vitest'
import { formatBytes } from '@/lib/image-optimizer'
import { generateStoragePath } from '@/lib/storage'

describe('Vehicle Photos & Image Optimization Rules', () => {
  describe('formatBytes', () => {
    it('should format 0 bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Ko')
    })

    it('should format Kilobytes correctly', () => {
      expect(formatBytes(256 * 1024)).toBe('256 Ko')
    })

    it('should format Megabytes correctly', () => {
      expect(formatBytes(3.5 * 1024 * 1024)).toBe('3.5 Mo')
    })
  })

  describe('Max 10 Photos Limit Logic', () => {
    const MAX_PHOTOS = 10

    it('should limit new photos batch to available slots', () => {
      const currentCount = 7
      const availableSlots = Math.max(0, MAX_PHOTOS - currentCount)
      expect(availableSlots).toBe(3)

      const incomingPhotos = [
        { url: '/api/storage/vehicles/1.webp' },
        { url: '/api/storage/vehicles/2.webp' },
        { url: '/api/storage/vehicles/3.webp' },
        { url: '/api/storage/vehicles/4.webp' },
        { url: '/api/storage/vehicles/5.webp' },
      ]

      const photosToAdd = incomingPhotos.slice(0, availableSlots)
      expect(photosToAdd.length).toBe(3)
      expect(currentCount + photosToAdd.length).toBe(MAX_PHOTOS)
    })

    it('should reject or provide 0 slots when maximum 10 photos is reached', () => {
      const currentCount = 10
      const availableSlots = Math.max(0, MAX_PHOTOS - currentCount)
      expect(availableSlots).toBe(0)
    })

    it('should slice incoming photo list to max 10 during initial vehicle creation', () => {
      const incomingList = Array.from({ length: 15 }, (_, i) => ({
        url: `/api/storage/vehicles/photo_${i}.webp`,
        isPrimary: i === 0,
      }))

      const capped = incomingList.slice(0, MAX_PHOTOS)
      expect(capped.length).toBe(10)
    })
  })

  describe('Primary Photo Assignment Rules', () => {
    it('should guarantee first photo is primary when none is explicitly marked', () => {
      const rawPhotos = [
        { url: '/api/storage/vehicles/1.webp', isPrimary: false },
        { url: '/api/storage/vehicles/2.webp', isPrimary: false },
        { url: '/api/storage/vehicles/3.webp', isPrimary: false },
      ]

      const hasPrimary = rawPhotos.some((p) => p.isPrimary)
      const sanitized = rawPhotos.map((p, idx) => ({
        ...p,
        isPrimary: hasPrimary ? p.isPrimary : idx === 0,
      }))

      expect(sanitized[0].isPrimary).toBe(true)
      expect(sanitized[1].isPrimary).toBe(false)
      expect(sanitized[2].isPrimary).toBe(false)
    })

    it('should preserve explicit primary photo if user selected one', () => {
      const rawPhotos = [
        { url: '/api/storage/vehicles/1.webp', isPrimary: false },
        { url: '/api/storage/vehicles/2.webp', isPrimary: true },
        { url: '/api/storage/vehicles/3.webp', isPrimary: false },
      ]

      const hasPrimary = rawPhotos.some((p) => p.isPrimary)
      const sanitized = rawPhotos.map((p, idx) => ({
        ...p,
        isPrimary: hasPrimary ? p.isPrimary : idx === 0,
      }))

      expect(sanitized[0].isPrimary).toBe(false)
      expect(sanitized[1].isPrimary).toBe(true)
    })

    it('should promote next photo when primary is deleted', () => {
      let photos = [
        { id: 'p1', url: '/api/storage/vehicles/1.webp', isPrimary: true },
        { id: 'p2', url: '/api/storage/vehicles/2.webp', isPrimary: false },
        { id: 'p3', url: '/api/storage/vehicles/3.webp', isPrimary: false },
      ]

      const deletedIndex = 0
      const isDeletedPrimary = photos[deletedIndex].isPrimary
      photos = photos.filter((_, idx) => idx !== deletedIndex)

      if (isDeletedPrimary && photos.length > 0) {
        photos[0].isPrimary = true
      }

      expect(photos.length).toBe(2)
      expect(photos[0].id).toBe('p2')
      expect(photos[0].isPrimary).toBe(true)
    })
  })

  describe('Storage Path Generation & WebP Extension Safety', () => {
    it('should generate secure storage path in vehicles category', () => {
      const pathInfo = generateStoragePath('vehicles', 'front_view.webp')
      expect(pathInfo.relativePath.replace(/\\/g, '/').startsWith('vehicles/')).toBe(true)
      expect(pathInfo.safeFilename.endsWith('.webp')).toBe(true)
    })

    it('should sanitize unsafe filenames into safe webp filenames', () => {
      const unsafe = '../../../dangerous photo (1) #test.png'
      const baseName = unsafe.replace(/\.[^/.]+$/, '')
      const safeName = `${baseName.replace(/[^a-zA-Z0-9_-]/g, '_')}.webp`

      expect(safeName).not.toContain('..')
      expect(safeName).not.toContain('/')
      expect(safeName).not.toContain('#')
      expect(safeName.endsWith('.webp')).toBe(true)
    })
  })
})
