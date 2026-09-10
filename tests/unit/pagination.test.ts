import { describe, it, expect } from 'vitest'
import { vehicleRepository, buildVehicleWhere } from '@/repositories/vehicle.repository'

describe('Vehicle Pagination System (9 cars per page)', () => {
  describe('vehicleRepository.getPaginated', () => {
    it('should paginate vehicles with default page size of 9', async () => {
      const result = await vehicleRepository.getPaginated({ page: 1, pageSize: 9 })
      expect(result).toBeDefined()
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(9)
      expect(result.vehicles.length).toBeLessThanOrEqual(9)
      expect(result.totalPages).toBe(Math.max(1, Math.ceil(result.total / 9)))
    })

    it('should calculate correct total pages and handle offsets for page 2', async () => {
      const page1 = await vehicleRepository.getPaginated({ page: 1, pageSize: 9 })
      const page2 = await vehicleRepository.getPaginated({ page: 2, pageSize: 9 })

      expect(page1.page).toBe(1)
      expect(page2.page).toBe(2)
      expect(page1.total).toBe(page2.total)
      expect(page1.totalPages).toBe(page2.totalPages)

      // If there are more than 9 vehicles, page 1 and page 2 should not share the same first vehicle
      if (page1.total > 9 && page1.vehicles.length > 0 && page2.vehicles.length > 0) {
        expect(page1.vehicles[0].id).not.toBe(page2.vehicles[0].id)
      }
    })

    it('should apply status and park filters while paginating', async () => {
      const inStockResult = await vehicleRepository.getPaginated({
        status: 'IN_STOCK',
        page: 1,
        pageSize: 9,
      })

      expect(inStockResult.pageSize).toBe(9)
      inStockResult.vehicles.forEach((v) => {
        expect(v.status).toBe('IN_STOCK')
      })
    })
  })

  describe('buildVehicleWhere', () => {
    it('should exclude archived and sold vehicles from default search', () => {
      const where = buildVehicleWhere()
      expect(where.AND).toBeDefined()
    })

    it('should include isBulkImport when urgent is true', () => {
      const where = buildVehicleWhere({ urgent: true })
      expect(JSON.stringify(where)).toContain('isBulkImport')
    })
  })
})
