import { createAthletesApi } from "./athletes"
import { createDygynGamesApi } from "./dygynGames"

export const createApi = (baseUrl: string, lang = "ru") => ({
  athletes: createAthletesApi(baseUrl, lang),
  dygynGames: createDygynGamesApi(baseUrl, lang),
})

export type Api = ReturnType<typeof createApi>
