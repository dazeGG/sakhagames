import { createApi } from "~/api"

export const useApi = () => {
  const { $pb } = useNuxtApp()
  return createApi($pb)
}
