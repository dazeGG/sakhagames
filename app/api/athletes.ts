import type { Athlete, AthletesList } from "~/types/athlete"
import type PocketBase from "pocketbase"

interface AthletesPage {
  items: AthletesList
  totalItems: number
  totalPages: number
}

export const createAthletesApi = (pb: PocketBase) => ({
  getList: async (page = 1, perPage = 5, search = ""): Promise<AthletesPage> => {
    const result = await pb.collection("athletes").getList<Athlete>(page, perPage, {
      sort: "-created",
      filter: search ? `name_ru ~ "${search}"` : "",
    })
    return {
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  },

  getById: async (id: string): Promise<Athlete | null> => {
    try {
      return await pb.collection("athletes").getOne<Athlete>(id)
    } catch {
      return null
    }
  },

  getBySlug: async (slug: string): Promise<Athlete | null> => {
    try {
      return await pb.collection("athletes").getFirstListItem<Athlete>(`slug = "${slug}"`)
    } catch {
      return null
    }
  },
})
