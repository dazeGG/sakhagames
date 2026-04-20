import PocketBase from "pocketbase"

export default defineNuxtPlugin(() => {
  const pb = new PocketBase(useRuntimeConfig().public.pocketbaseUrl)

  pb.beforeSend = (url, options) => {
    options.headers = { ...options.headers, "SG-Language": "ru" }
    return { url, options }
  }

  return {
    provide: {
      pb,
    },
  }
})
