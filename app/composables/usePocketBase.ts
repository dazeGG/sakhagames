import type { Athlete, AthletesList } from '~/types/athlete'

export const usePocketBase = () => {
  const { $pb } = useNuxtApp()

  const getAthletes = async (): Promise<AthletesList> => {
    return await $pb.collection('athletes').getFullList({
      sort: '-created',
      filter: 'isActive = true'
    })
  }

  const getAthleteById = async (id: string): Promise<Athlete | null> => {
    try {
      return await $pb.collection('athletes').getOne(id)
    } catch (err) {
      console.error('Ошибка получения атлета:', err)
      return null
    }
  }

  return {
    pb: $pb,
    getAthletes,
    getAthleteById
  }
}
