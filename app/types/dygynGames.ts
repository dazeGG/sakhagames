import type { RecordId, RecordDefault, FileName } from "~/types"

export type DygynGameStatus
  = | "completed"
    | "planned"
    | "cancelled"
    | "archived"

export type DygynEventStatus
  = | "completed"
    | "planned"
    | "cancelled"
    | "demo"

export type DygynParticipantStatus
  = | "registered"
    | "started"
    | "finished"
    | "dns"
    | "dnf"
    | "dsq"

export type DygynResultStatus
  = | "finished"
    | "dns"
    | "dnf"
    | "dsq"

export type SourceItem = {
  title: string
  url?: string
  type?: string
  note?: string
}

export interface Discipline extends RecordDefault {
  name: string
  description?: string
  rules?: string
  scoring?: string
  unit?: string
  validFromDate?: string
  validToDate?: string
  isActive: boolean
  changeNote?: string
  sources?: SourceItem[] | null
  predecessor?: RecordId | null
}

export interface DygynGame extends RecordDefault {
  year: number
  title: string
  dateStart?: string
  dateEnd?: string
  location?: string
  venue?: string
  summary?: string
  historicalNote?: string
  status: DygynGameStatus
  cover?: string
  gallery?: string[]
  sources?: SourceItem[] | null
  isFeatured: boolean
  isPublished: boolean
}

export interface DygynGameParticipant extends RecordDefault {
  dygynGame: RecordId
  athlete: RecordId
  bibNumber?: number
  team?: string
  finalRank?: number
  totalPoints?: number
  status?: DygynParticipantStatus
  note?: string
}

export interface DygynGameEvent extends RecordDefault {
  dygynGame: RecordId
  discipline: RecordId
  title?: string
  sortOrder?: number
  dayNumber?: number
  dateHeld?: string
  status?: DygynEventStatus
  rulesNote?: string
  recordNote?: string
  sources?: SourceItem[] | null
  media?: FileName[] | null
}

export interface DygynGameResult extends RecordDefault {
  event: RecordId
  participant: RecordId
  place?: number
  resultValue?: string
  resultLabel?: string
  points?: number
  status?: DygynResultStatus
  details?: Record<string, unknown> | null
  note?: string
}

// Unified endpoint response for GET /api/dygyn-games/{year}
// All fields are already localized (no *_ru/*_sah/*_en suffixes)

export interface ExpandedAthlete {
  id: string
  name: string
  slug: string
  bio: string
  title: string
  birthDate: string
  birthPlace: string
  region: string
  club: string
  photo: string
  photos: string[]
  achievements: Array<{ icon: string, text: string }>
}

export interface DisciplineCompact {
  id: string
  name: string
  unit: string
}

export interface LocalizedDygynGame {
  id: string
  year: number
  title: string
  summary: string
  historicalNote: string
  location: string
  venue: string
  cover: string
  gallery: string[]
  sources: SourceItem[]
  dateStart: string
  dateEnd: string
  status: DygynGameStatus
  isFeatured: boolean
  isPublished: boolean
  created: string
  updated: string
}

export interface LocalizedDygynParticipant {
  id: string
  dygynGame: string
  athlete: string
  bibNumber: number
  finalRank: number
  totalPoints: number
  team: string
  note: string
  status: DygynParticipantStatus
  created: string
  updated: string
  expand?: {
    athlete?: ExpandedAthlete
  }
}

export interface LocalizedDygynEvent {
  id: string
  dygynGame: string
  discipline: string
  dayNumber: number
  sortOrder: number
  dateHeld: string
  title: string
  rulesNote: string
  recordNote: string
  media: string[]
  sources: SourceItem[]
  status: DygynEventStatus
  created: string
  updated: string
  expand?: {
    discipline?: DisciplineCompact
  }
}

export interface LocalizedDygynResult {
  id: string
  event: string
  participant: string
  place: number
  points: number
  resultValue: string
  resultLabel: string
  note: string
  details: Record<string, unknown> | null
  status: DygynResultStatus
  created: string
  updated: string
}

export interface DygynGamePageResponse {
  game: LocalizedDygynGame
  participants: LocalizedDygynParticipant[]
  events: LocalizedDygynEvent[]
  results: LocalizedDygynResult[]
}
