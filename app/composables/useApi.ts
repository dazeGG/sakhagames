import { createApi } from "~/api"

export const useApi = () => {
  const { public: { apiUrl } } = useRuntimeConfig()
  return createApi(apiUrl)
}
