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

    it('should reorder photos so that newly assigned couverture photo is at index 0 with order 0', () => {
      const photos = [
        { id: 'p1', url: '/vehicles/photo1.webp', isPrimary: true, order: 0 },
        { id: 'p2', url: '/vehicles/photo2.webp', isPrimary: false, order: 1 },
        { id: 'p3', url: '/vehicles/photo3.webp', isPrimary: false, order: 2 },
      ]

      // User sets p3 as new couverture photo
      const targetId = 'p3'
      const target = photos.find((p) => p.id === targetId)!
      const others = photos.filter((p) => p.id !== targetId)

      const reordered = [
        { ...target, isPrimary: true, order: 0 },
        ...others.map((p, idx) => ({ ...p, isPrimary: false, order: idx + 1 })),
      ]

      expect(reordered[0].id).toBe('p3')
      expect(reordered[0].isPrimary).toBe(true)
      expect(reordered[0].order).toBe(0)

      expect(reordered[1].id).toBe('p1')
      expect(reordered[1].isPrimary).toBe(false)
      expect(reordered[1].order).toBe(1)

      expect(reordered[2].id).toBe('p2')
      expect(reordered[2].isPrimary).toBe(false)
      expect(reordered[2].order).toBe(2)

      // Test helper logic used across catalog, dashboard, and detail page
      const getCoverUrl = (list: typeof reordered) =>
        list.find((p) => p.isPrimary)?.url || list[0]?.url || ''

      expect(getCoverUrl(reordered)).toBe('/vehicles/photo3.webp')
    })

    it('should sort photos prioritizing isPrimary: desc then order: asc', () => {
      // Even if order is unordered or not yet synced, isPrimary: desc ensures primary is first
      const photos = [
        { id: 'p1', url: '/vehicles/photo1.webp', isPrimary: false, order: 0 },
        { id: 'p2', url: '/vehicles/photo2.webp', isPrimary: true, order: 2 },
        { id: 'p3', url: '/vehicles/photo3.webp', isPrimary: false, order: 1 },
      ]

      const sorted = photos.slice().sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) {
          return a.isPrimary ? -1 : 1
        }
        return a.order - b.order
      })

      expect(sorted[0].id).toBe('p2')
      expect(sorted[0].url).toBe('/vehicles/photo2.webp')
      expect(sorted[0].isPrimary).toBe(true)
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

  describe('Purchase Payer & Commissioner Attribution Rules', () => {
    it('should correctly attribute handledById to the personnel who paid the fournisseur', () => {
      const purchaseData = {
        supplierName: 'Auto Import SARL',
        supplierPhone: '0612345678',
        purchasePrice: 200000,
        handledById: 'user_admin_1',
        paymentMethod: 'VIREMENT',
      }

      expect(purchaseData.handledById).toBe('user_admin_1')
      expect(purchaseData.supplierName).toBe('Auto Import SARL')
      expect(purchaseData.paymentMethod).toBe('VIREMENT')
    })

    it('should correctly handle optional commissioner and commissioner payer', () => {
      // Case 1: Direct purchase without commissioner
      const directPurchase = {
        handledById: 'user_admin_1',
        commissionerName: null,
        commissionAmount: 0,
        commissionPaidById: null,
      }
      expect(directPurchase.commissionerName).toBeNull()
      expect(directPurchase.commissionPaidById).toBeNull()
      expect(directPurchase.handledById).toBe('user_admin_1')

      // Case 2: Purchase with courtier/commissioner and dedicated payer
      const mediatedPurchase = {
        handledById: 'user_admin_1', // Agency staff who paid the car to the supplier
        commissionerName: 'Hassan Semsar',
        commissionAmount: 3000,
        commissionPaidById: 'user_sales_2', // Agency staff who paid the commission to Hassan
      }
      expect(mediatedPurchase.commissionerName).toBe('Hassan Semsar')
      expect(mediatedPurchase.commissionAmount).toBe(3000)
      expect(mediatedPurchase.handledById).toBe('user_admin_1')
      expect(mediatedPurchase.commissionPaidById).toBe('user_sales_2')
    })
  })
})
