import type PocketBase from "pocketbase"
import { createAthletesApi } from "./athletes"

export const createApi = (pb: PocketBase) => ({
  athletes: createAthletesApi(pb),
})

export type Api = ReturnType<typeof createApi>
