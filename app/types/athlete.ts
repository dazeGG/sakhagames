export interface AthleteAchievement {
  icon: string
  text: string
}

export type AthleteAchievements = AthleteAchievement[]

export interface Athlete {
  id: string
  slug: string

  isActive: boolean

  birthDate: string

  name: string
  birthPlace: string
  region: string
  club: string
  title: string
  bio: string

  achievements: AthleteAchievements

  photo: string
  photos: string[]

  created: string
  updated: string
}

export type AthletesList = Athlete[]
