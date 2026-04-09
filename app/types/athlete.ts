export interface Athlete {
  id: string

  created: string
  updated: string

  fullName_ru: string
  fullName_sah: string | null
  fullName_en: string | null

  birthDate: string
  bio_ru: string
  bio_sah: string | null
  bio_en: string | null

  photo: string | null
  photos: string[]

  isActive: boolean
}

export type AthletesList = Athlete[]
