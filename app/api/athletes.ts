import type { Athlete } from "~/types/athlete"

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

interface AthletesPage {
  items: Athlete[]
  totalItems: number
  totalPages: number
}

export const createAthletesApi = (baseUrl: string, lang: string) => ({
  getList: async (page = 1, perPage = 5, search = ""): Promise<AthletesPage> => {
    const params = new URLSearchParams({ page: String(page), page_size: String(perPage) })
    if (search) params.set("search", search)
    const data = await $fetch<PaginatedResponse<Athlete>>(`${baseUrl}/athletes/?${params}`, {
      headers: { "SG-Language": lang },
    })
    return {
      items: data.results,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / perPage),
    }
  },

  getBySlug: async (slug: string): Promise<Athlete | null> => {
    try {
      return await $fetch<Athlete>(`${baseUrl}/athletes/${slug}/`)
    } catch {
      return null
    }
  },
})
