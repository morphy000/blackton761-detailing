export type MessengerType = 'max' | 'whatsapp' | 'telegram'

export interface MessengerConfig {
  type: MessengerType
  url: string
  label: string
  chatActionText: string
}

export interface StudioBranding {
  namePrefix: string // e.g. "АВТОМОЙКА"
  nameHighlight: string // e.g. "БЛЕСК"
  tagline: string // e.g. "Детейлинг и уход · Краснодар"
  logoUrl?: string
  faviconUrl?: string
  phoneRaw: string // e.g. "+79184422669"
  phoneDisplay: string // e.g. "+7 (918) 442-26-69"
  address: string // e.g. "г. Краснодар, ул. Первомайская, 55 (1 этаж)"
  schedule: string // e.g. "Пн.–Вс. 9:00–20:00"
  messenger: MessengerConfig
}

export interface StudioHero {
  badge: string
  ratingBadge: string
  titleLine1: string
  titleLine2: string
  description: string
  ctaPrimaryText: string
  ctaSecondaryText: string
}

export interface StudioService {
  no: string
  title: string
  desc: string
  price: string
  time: string
  category?: string
}

export interface StudioPricingPackage {
  title: string
  price: string
  desc: string
  items: string[]
  featured?: boolean
  badge?: string
}

export interface StudioTestimonial {
  quote: string
  name: string
  car: string
  date: string
  source?: string
}

export interface StudioRating {
  score: string // e.g. "4.9"
  reviewsCount: number // e.g. 278
  label: string
  sourceName: string
  sourceUrl: string
}

export interface StudioConfig {
  id: string
  branding: StudioBranding
  hero: StudioHero
  rating: StudioRating
  services: StudioService[]
  popularPackages: StudioPricingPackage[]
  gallery: string[]
  testimonials: StudioTestimonial[]
  faqs: [string, string][]
  mapEmbedUrl?: string
}
