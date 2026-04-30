import type { FileName, RecordSlug } from "~/types"

export interface AthleteAchievement {
  icon: string
  text: string
}

export type AthleteAchievements = AthleteAchievement[]

export interface Athlete extends RecordSlug {
  isActive: boolean

  birthDate: string

  name: string
  birthPlace: string
  region: string
  club: string
  title: string
  bio: string

  achievements: AthleteAchievements

  photo: FileName
  photos: FileName[]
}

export type AthletesList = Athlete[]
