import type {
  DygynGame,
  DygynGamePageResponse,
} from "~/types/dygynGames"

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

interface GamesListResponse {
  items: DygynGame[]
  totalItems: number
  totalPages: number
}

export const createDygynGamesApi = (baseUrl: string, lang: string) => ({
  getList: async (page = 1, perPage = 10): Promise<GamesListResponse> => {
    const params = new URLSearchParams({ page: String(page), page_size: String(perPage) })
    const data = await $fetch<PaginatedResponse<DygynGame>>(
      `${baseUrl}/dygyn-game-records/?${params}`,
      { headers: { "SG-Language": lang } },
    )
    return {
      items: data.results,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / perPage),
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
