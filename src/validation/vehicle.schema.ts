import { z } from 'zod'
import { positiveMoneySchema } from './common'

export const vehicleFuelTypes = ['DIESEL', 'ESSENCE', 'HYBRIDE', 'HYBRIDE_RECHARGEABLE', 'ELECTRIQUE'] as const
export const vehicleTransmissions = ['AUTOMATIQUE', 'MANUELLE', 'SEMI_AUTO', 'ROBOTISEE'] as const
export const vehicleStatuses = ['IN_STOCK', 'RESERVED', 'SOLD', 'WORKSHOP', 'TRANSIT', 'ARCHIVED'] as const
export const vehicleBodyTypes = ['SUV', 'Berline', '4x4 & Pick-up', 'Citadine', 'Utilitaire', 'Coupé'] as const

export const vehicleCreateSchema = z.object({
  code: z.string().min(1, 'Code véhicule requis').optional(),
  vin: z.string().length(17, 'Le code VIN doit comporter exactement 17 caractères').toUpperCase(),
  matricule: z.string().nullable().optional(),
  brand: z.string().min(1, 'Marque requise'),
  model: z.string().min(1, 'Modèle requis'),
  version: z.string().nullable().optional(),
  bodyType: z.enum(vehicleBodyTypes).default('SUV'),
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  colorExterior: z.string().min(1, 'Couleur extérieure requise'),
  colorInterior: z.string().nullable().optional(),
  fuelType: z.enum(vehicleFuelTypes),
  transmission: z.enum(vehicleTransmissions),
  mileage: z.coerce.number().int().min(0, 'Kilométrage invalide'),
  doors: z.coerce.number().int().min(2).max(7).default(5),
  seats: z.coerce.number().int().min(1).max(9).default(5),
  fiscalPower: z.coerce.number().int().min(1).default(8),
  options: z.string().nullable().optional(),
  location: z.string().default('Casablanca Showroom'),
  purchasePrice: positiveMoneySchema.default(0),
  targetSalePrice: positiveMoneySchema.default(0),
  minSalePrice: positiveMoneySchema.nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(vehicleStatuses).default('IN_STOCK'),
})

export const vehicleUpdateSchema = vehicleCreateSchema.partial()

export const vehicleFilterSchema = z.object({
  brand: z.string().optional(),
  status: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>
export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>
export type VehicleFilterInput = z.infer<typeof vehicleFilterSchema>
