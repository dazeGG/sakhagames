import type {
  DygynGame,
  DygynGamePageResponse,
} from "~/types/dygynGames"

interface GamesListResponse {
  items: DygynGame[]
  totalItems: number
  totalPages: number
}

export const createDygynGamesApi = (baseUrl: string, lang: string) => ({
  getList: async (page = 1, perPage = 10): Promise<GamesListResponse> => {
    const all = await $fetch<DygynGame[]>(`${baseUrl}/dygyn-game-records/`, {
      headers: { "SG-Language": lang },
    })
    const sorted = [...all].sort((a, b) => b.year - a.year)
    const totalItems = sorted.length
    const totalPages = Math.ceil(totalItems / perPage)
    const start = (page - 1) * perPage
    return {
      items: sorted.slice(start, start + perPage),
      totalItems,
      totalPages,
    }
  },

  getGamePage: async (year: number, signal?: AbortSignal): Promise<DygynGamePageResponse> => {
    const response = await fetch(`${baseUrl}/dygyn-games/${year}/`, {
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
      throw createError({ statusCode: response.status, data: await response.json() })
    }

    return response.json()
  },
})
