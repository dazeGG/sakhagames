import type PocketBase from "pocketbase"
import { createAthletesApi } from "./athletes"
import { createDygynGamesApi } from "./dygynGames"

export const createApi = (pb: PocketBase) => ({
  athletes: createAthletesApi(pb),
  dygynGames: createDygynGamesApi(pb),
})

export type Api = ReturnType<typeof createApi>
