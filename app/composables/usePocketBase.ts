import type { Athlete, AthletesList } from "~/types/athlete"

interface AthletesPage {
  items: AthletesList
  totalItems: number
  totalPages: number
}

export const usePocketBase = () => {
  const { $pb } = useNuxtApp()

  const getAthletes = async (page = 1, perPage = 5, search = ""): Promise<AthletesPage> => {
    const result = await $pb.collection("athletes").getList<Athlete>(page, perPage, {
      sort: "-created",
      filter: search ? `name_ru ~ "${search}"` : "",
    })
    return {
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  }

  const getAthleteById = async (id: string): Promise<Athlete | null> => {
    try {
      return await $pb.collection("athletes").getOne(id)
    } catch (err) {
      console.error("Ошибка получения атлета:", err)
      return null
    }
  }

  return {
    pb: $pb,
    getAthletes,
    getAthleteById,
  }
}
