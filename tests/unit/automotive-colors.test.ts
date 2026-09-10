import { describe, it, expect } from 'vitest'
import {
  EXTERIOR_COLORS,
  INTERIOR_COLORS,
  filterAutomotiveColors,
  findColorByName,
  getVisualColorSwatch,
  normalizeColorString,
  generateFinishBackground,
} from '@/data/automotive-colors'

describe('Automotive Colors Dataset & Utilities', () => {
  it('contains essential exterior colors including Gris Métallisé from BULL-ADD.xlsx', () => {
    const grisMetallise = EXTERIOR_COLORS.find((c) => c.name === 'Gris Métallisé')
    expect(grisMetallise).toBeDefined()
    expect(grisMetallise?.category).toBe('Gris & Argents')
    expect(grisMetallise?.finish).toBe('Métallisé')
    expect(grisMetallise?.hex).toBe('#7E848C')

    const grisNardo = EXTERIOR_COLORS.find((c) => c.name === 'Gris Nardo')
    expect(grisNardo).toBeDefined()

    const blancNacre = EXTERIOR_COLORS.find((c) => c.name.includes('Blanc Nacré'))
    expect(blancNacre).toBeDefined()
  })

  it('contains essential interior colors including Standard from BULL-ADD.xlsx', () => {
    const standard = INTERIOR_COLORS.find((c) => c.name === 'Standard')
    expect(standard).toBeDefined()
    expect(standard?.category).toBe('Standard')

    const cuirFauve = INTERIOR_COLORS.find((c) => c.name.includes('Fauve / Camel'))
    expect(cuirFauve).toBeDefined()

    const cuirCognac = INTERIOR_COLORS.find((c) => c.name.includes('Cognac'))
    expect(cuirCognac).toBeDefined()
  })

  it('normalizes search strings ignoring accents and case', () => {
    expect(normalizeColorString('Gris Métallisé')).toBe('gris metallise')
    expect(normalizeColorString('Blanc Nacré / Perle')).toBe('blanc nacre perle')
    expect(normalizeColorString('ÉLÉCTRIQUE')).toBe('electrique')
  })

  it('filters colors by search query and category', () => {
    const nardoResults = filterAutomotiveColors(EXTERIOR_COLORS, 'nardo')
    expect(nardoResults.length).toBeGreaterThan(0)
    expect(nardoResults[0].name).toBe('Gris Nardo')

    const grisCategory = filterAutomotiveColors(EXTERIOR_COLORS, '', 'Gris & Argents')
    expect(grisCategory.length).toBeGreaterThan(3)
    grisCategory.forEach((c) => expect(c.category).toBe('Gris & Argents'))
  })

  it('finds color by name with case & accent insensitivity', () => {
    const found = findColorByName('gris metallise', 'exterior')
    expect(found).not.toBeNull()
    expect(found?.name).toBe('Gris Métallisé')

    const interiorFound = findColorByName('standard', 'interior')
    expect(interiorFound).not.toBeNull()
    expect(interiorFound?.name).toBe('Standard')
  })

  it('provides visual color swatches with fallback heuristics for arbitrary names', () => {
    const nardoSwatch = getVisualColorSwatch('Gris Nardo')
    expect(nardoSwatch.hex).toBe('#6E7278')

    // Custom non-listed colors
    const customBleu = getVisualColorSwatch('Bleu Ciel Spécial')
    expect(customBleu.hex).toBe('#1A3F70')

    const customCamel = getVisualColorSwatch('Cuir Havane Camel')
    expect(customCamel.hex).toBe('#8B4513')

    const unknownColor = getVisualColorSwatch('Cosmic Titanium Pearl 99')
    expect(unknownColor.cssBackground).toContain('linear-gradient')
  })

  it('generates custom finish backgrounds', () => {
    const matBg = generateFinishBackground('#123456', 'Mat')
    expect(matBg).toBe('#123456')

    const nacreBg = generateFinishBackground('#123456', 'Nacré')
    expect(nacreBg).toContain('linear-gradient')
  })
})
