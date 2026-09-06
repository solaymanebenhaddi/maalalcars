export interface VehicleFiltersState {
  brand?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  fuelType?: string
  transmission?: string
  search?: string
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString('fr-FR')} km`
}

export function formatFiscalPower(cv: number): string {
  return `${cv} CV`
}
