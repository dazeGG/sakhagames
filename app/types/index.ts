export type RecordId = number

export type FileName = string

export interface RecordTimestamps {
  created: string
  updated: string
}

export interface RecordDefault extends RecordTimestamps {
  id: RecordId
}

export interface RecordSlug extends RecordDefault {
  slug: string
}
