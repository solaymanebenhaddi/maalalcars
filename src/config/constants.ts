export const APP_CONFIG = {
  name: 'MAALAL CARS',
  locale: 'fr-MA' as const,
  currency: 'MAD' as const,
  currencyDisplay: 'DH',
  timezone: 'Africa/Casablanca',
} as const

export const PAGINATION_DEFAULTS = {
  pageSize: 25,
  maxPageSize: 100,
} as const

export const SESSION_CONFIG = {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  cookieName: 'maalal_session',
} as const

export const STORAGE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  allowedDocumentTypes: ['application/pdf', 'image/jpeg', 'image/png'] as const,
} as const
