export interface AthleteAchievement {
  icon: string
  text_ru: string
  text_sah: string
  text_en: string
}

export type AthleteAchievements = AthleteAchievement[]

export interface Athlete {
  id: string
  slug: string

  isActive: boolean

  birthDate: string

  name_ru: string
  name_sah: string
  name_en: string

  birthPlace_ru: string
  birthPlace_sah: string
  birthPlace_en: string

  region_ru: string
  region_sah: string
  region_en: string

  club_ru: string
  club_sah: string
  club_en: string

  title_ru: string
  title_sah: string
  title_en: string

  bio_ru: string
  bio_sah: string
  bio_en: string

  achievements: AthleteAchievements

  photo: string
  photos: string[]

  created: string
  updated: string
}

export type AthletesList = Athlete[]
