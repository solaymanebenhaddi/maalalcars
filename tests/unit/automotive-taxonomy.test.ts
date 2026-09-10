import { describe, it, expect } from 'vitest'
import {
  AUTOMOTIVE_BRANDS,
  MODELS_BY_BRAND,
  VERSIONS_BY_BRAND,
  getBrandKey,
  getModelsForBrand,
  getVersionsForModel,
  normalizeTaxonomyString,
} from '@/data/automotive-taxonomy'

describe('Automotive Taxonomy Dataset & Helpers', () => {
  it('contains essential car brands with country flags', () => {
    expect(AUTOMOTIVE_BRANDS.length).toBeGreaterThan(20)
    expect(Object.keys(MODELS_BY_BRAND).length).toBeGreaterThan(15)
    expect(Object.keys(VERSIONS_BY_BRAND).length).toBeGreaterThan(15)
    const mb = AUTOMOTIVE_BRANDS.find((b) => b.name === 'Mercedes-Benz')
    expect(mb).toBeDefined()
    expect(mb?.country).toContain('Allemagne')

    const dacia = AUTOMOTIVE_BRANDS.find((b) => b.name === 'Dacia')
    expect(dacia).toBeDefined()
    expect(dacia?.country).toContain('Maroc')
  })

  it('normalizes taxonomy strings ignoring accents and case', () => {
    expect(normalizeTaxonomyString('Mercedes-Benz')).toBe('mercedes benz')
    expect(normalizeTaxonomyString('Škoda')).toBe('skoda')
    expect(normalizeTaxonomyString('SÉRIE 3')).toBe('serie 3')
  })

  it('resolves correct brand keys', () => {
    expect(getBrandKey('Mercedes-Benz')).toBe('mercedes-benz')
    expect(getBrandKey('BMW')).toBe('bmw')
    expect(getBrandKey('Range Rover Sport')).toBe('land-rover')
    expect(getBrandKey('Volkswagen')).toBe('volkswagen')
  })

  it('returns appropriate models for each brand', () => {
    const mbModels = getModelsForBrand('Mercedes-Benz')
    expect(mbModels).toContain('Classe C')
    expect(mbModels).toContain('GLC')
    expect(mbModels).toContain('Classe G')

    const bmwModels = getModelsForBrand('BMW')
    expect(bmwModels).toContain('Série 3')
    expect(bmwModels).toContain('X5')

    const daciaModels = getModelsForBrand('Dacia')
    expect(daciaModels).toContain('Duster')
    expect(daciaModels).toContain('Sandero')
  })

  it('returns appropriate versions/finitions for each brand/model', () => {
    const mbVersions = getVersionsForModel('Mercedes-Benz', 'Classe C')
    expect(mbVersions).toContain('AMG Line')
    expect(mbVersions).toContain('Avantgarde')

    const bmwVersions = getVersionsForModel('BMW', 'X5')
    expect(bmwVersions).toContain('Pack M Sport')

    const audiVersions = getVersionsForModel('Audi', 'A3')
    expect(audiVersions).toContain('S Line')
  })

  it('provides sensible fallback models and versions for custom or unknown brands', () => {
    const unknownModels = getModelsForBrand('Marque Inconnue Custom')
    expect(unknownModels.length).toBeGreaterThan(0)
    expect(unknownModels).toContain('Standard')

    const unknownVersions = getVersionsForModel('Marque Inconnue', 'Modèle Inconnu')
    expect(unknownVersions.length).toBeGreaterThan(0)
    expect(unknownVersions).toContain('Standard')
  })
})
