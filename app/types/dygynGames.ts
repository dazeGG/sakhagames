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

export type MediaItem = {
  title?: string
  url?: string
  type?: string
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
  media?: MediaItem[] | null
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

export interface DygynGameParticipantExpanded extends DygynGameParticipant {
  expand?: {
    athlete?: import("~/types/athlete").Athlete
    dygynGame?: DygynGame
  }
}

export interface DygynGameEventExpanded extends DygynGameEvent {
  expand?: {
    dygynGame?: DygynGame
    discipline?: Discipline
  }
}

export interface DygynGameResultExpanded extends DygynGameResult {
  expand?: {
    event?: DygynGameEventExpanded
    participant?: DygynGameParticipantExpanded
  }
}

export interface DygynGamePageData {
  game: DygynGame
  participants: DygynGameParticipantExpanded[]
  events: Array<{
    event: DygynGameEventExpanded
    results: DygynGameResultExpanded[]
  }>
}

export interface DygynLeaderboardItem {
  participantId: RecordId
  athleteId: RecordId
  name: string
  team?: string
  bibNumber?: number
  totalPoints?: number
  finalRank?: number
  photo?: string
}

export interface DygynEventResultRow {
  place?: number
  resultLabel?: string
  points?: number
  participantId: RecordId
  athleteId: RecordId
  name: string
  team?: string
  bibNumber?: number
  photo?: string
}
