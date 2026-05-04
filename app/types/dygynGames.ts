import type { RecordId, RecordDefault } from "~/types"

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
  validFromDate: string
  validToDate: string
  is_active?: boolean
  changeNote?: string
  sources?: SourceItem[] | null
  predecessor?: RecordId | null
}

export interface DygynGame extends RecordDefault {
  year: number
  title: string
  dateStart: string
  dateEnd: string
  location: string
  venue: string
  summary: string
  historicalNote: string
  status?: DygynGameStatus | ""
  cover: string
  gallery?: unknown
  sources?: unknown
  isFeatured: boolean
  isPublished: boolean
}

export interface DygynGameParticipant extends RecordDefault {
  dygynGame: RecordId
  athlete: RecordId
  bibNumber: number
  team: string
  finalRank: number
  placesSum: number
  status?: DygynParticipantStatus | ""
  note: string
  expand?: Record<string, unknown>
}

export interface DygynGameEvent extends RecordDefault {
  dygynGame: RecordId
  discipline: RecordId
  title: string
  sortOrder: number
  dayNumber: number
  dateHeld: string
  status?: DygynEventStatus | ""
  rulesNote: string
  recordNote: string
  sources?: unknown
  media?: unknown
  expand?: Record<string, unknown>
}

export interface DygynGameResult extends RecordDefault {
  event: RecordId
  participant: RecordId
  place?: number
  resultValue: string
  resultLabel: string
  status?: DygynResultStatus | ""
  details?: unknown
  note: string
}

export interface ExpandedAthlete {
  id: string
  name: string
  slug: string
  bio: string
  title: string
  birthDate: string
  birthPlace: string
  club: string
  photo: string
  photos: string[]
  achievements: Array<{ icon: string, text: string }>
  socialLinks: unknown
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
  placesSum: number
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
  resultValue: string
  resultLabel: string
  note: string
  details: unknown
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
