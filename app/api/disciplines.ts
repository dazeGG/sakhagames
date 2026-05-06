import type { Discipline } from "~/types/dygynGames"

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const createDisciplinesApi = (baseUrl: string, lang: string) => ({
  getList: async (): Promise<{ items: Discipline[], totalItems: number }> => {
    try {
      const data = await $fetch<PaginatedResponse<Discipline>>(
        `${baseUrl}/disciplines/?page_size=100`,
        { headers: { "SG-Language": lang } },
      )
      return {
        items: data.results,
        totalItems: data.count,
      }
    } catch {
      return { items: [], totalItems: 0 }
    }
  },
})
