import type { RecordId, RecordDefault } from "~/types"
import type { Athlete } from "~/types/athlete"

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
  url: string
  publisher: string
  date?: string
}

export type ResultDetail = {
  type: string
  format: string
  value: string
}

export interface Discipline extends RecordDefault {
  name: string
  description?: string
  rules?: string
  scoring?: string
  unit?: string
  changeNote?: string
  validFromDate: string | null
  validToDate: string | null
  isActive?: boolean
  sources?: SourceItem[]
  predecessor: RecordId | null
  record: RecordId | null
}

export interface DygynGame extends RecordDefault {
  year: number
  title: string
  dateStart: string | null
  dateEnd: string | null
  location: string
  venue: string
  summary: string
  historicalNote: string
  status?: DygynGameStatus | ""
  cover: string
  gallery?: unknown[]
  sources?: SourceItem[]
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
}

export interface DygynGameEvent extends RecordDefault {
  dygynGame: RecordId
  discipline: RecordId
  title: string
  sortOrder: number
  dayNumber: number
  dateHeld: string | null
  status?: DygynEventStatus | ""
  rulesNote: string
  recordNote: string
  sources?: SourceItem[]
  media?: unknown[]
}

export interface DygynGameResult extends RecordDefault {
  event: RecordId
  participant: RecordId
  place?: number
  resultValue: string
  resultLabel: string
  status?: DygynResultStatus | ""
  details?: ResultDetail[]
  note: string
}

export interface LocalizedDygynGame {
  id: number
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
  id: number
  dygynGame: number
  athlete: number
  bibNumber: number
  finalRank: number
  placesSum: number
  team: string
  note: string
  status: DygynParticipantStatus
  created: string
  updated: string
  expand?: {
    athlete?: Athlete
  }
}

export interface LocalizedDygynEvent {
  id: number
  dygynGame: number
  discipline: number
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
    discipline?: Discipline
  }
}

export interface LocalizedDygynResult {
  id: number
  event: number
  participant: number
  place: number
  resultValue: string
  resultLabel: string
  note: string
  details: ResultDetail[]
  status: DygynResultStatus | ""
  created: string
  updated: string
}

export interface DygynGameArchive {
  game: LocalizedDygynGame
  participants: LocalizedDygynParticipant[]
  events: LocalizedDygynEvent[]
  results: LocalizedDygynResult[]
}
