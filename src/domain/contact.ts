/**
 * Domain rules and Moroccan identity validators for Contacts
 */

export function validateMoroccanCIN(cin: string | null | undefined): boolean {
  if (!cin) return false
  const trimmed = cin.trim().toUpperCase()
  return /^[A-Z]{1,2}\d{5,7}$/.test(trimmed)
}

export function validateMoroccanICE(ice: string | null | undefined): boolean {
  if (!ice) return false
  const trimmed = ice.trim()
  return /^\d{15}$/.test(trimmed)
}

export function formatMoroccanPhone(phone: string): string {
  if (!phone) return ''
  let cleaned = phone.replace(/[\s.-]/g, '')
  if (cleaned.startsWith('00212')) {
    cleaned = '+212' + cleaned.slice(5)
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '+212' + cleaned.slice(1)
  }
  return cleaned
}

export function computeContactRiskRating(currentDebt: number, totalVolume: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (totalVolume === 0 && currentDebt > 0) return 'HIGH'
  if (totalVolume === 0) return 'LOW'
  const debtRatio = currentDebt / totalVolume
  if (debtRatio > 0.5) return 'HIGH'
  if (debtRatio > 0.2) return 'MEDIUM'
  return 'LOW'
}
