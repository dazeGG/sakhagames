import type PocketBase from "pocketbase"
import type {
  DygynGame,
  DygynGamePageResponse,
} from "~/types/dygynGames"

interface GamesListResponse {
  items: DygynGame[]
  totalItems: number
  totalPages: number
}

export const createDygynGamesApi = (pb: PocketBase) => ({
  getList: async (page = 1, perPage = 10): Promise<GamesListResponse> => {
    const result = await pb.collection("dygyn_games").getList<DygynGame>(page, perPage, {
      sort: "-year,-dateStart",
      filter: "isPublished = true",
    })
    return {
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  },

  getByYear: async (year: number): Promise<DygynGame | null> => {
    try {
      return await pb.collection("dygyn_games").getFirstListItem<DygynGame>(`year = ${year}`)
    } catch {
      return null
    }
  },

  getGamePage: async (year: number, signal?: AbortSignal): Promise<DygynGamePageResponse> => {
    const lang = typeof localStorage !== "undefined"
      ? localStorage.getItem("lang") || "ru"
      : "ru"

    const response = await fetch(`${pb.baseUrl}/api/dygyn-games/${year}`, {
      headers: {
        "Content-Type": "application/json",
        "SG-Language": lang,
      },
      signal,
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw createError({ statusCode: 404, message: "Игра не найдена" })
      }
      throw await response.json()
    }

    return response.json()
  },
})
