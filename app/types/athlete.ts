export interface Athlete {
  id: string
  slug: string

  created: string
  updated: string

  name_ru: string
  name_sah: string
  name_en: string

  birthDate: string

  birthPlace_ru: string
  birthPlace_sah: string
  birthPlace_en: string

  region_ru: string
  region_sah: string
  region_en: string

  club_ru: string
  club_sah: string
  club_en: string

  bio_ru: string
  bio_sah: string
  bio_en: string

  photo: string
  photos: string[]

  isActive: boolean
}

export type AthletesList = Athlete[]
