// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: false,
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || "http://127.0.0.1:8000",
    },
  },

  routeRules: {
    "/": { prerender: true },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
})
