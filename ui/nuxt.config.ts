import { definePreset } from "@primevue/themes"
import Aura from "@primevue/themes/aura"

// Match the green primary of the old saga-green theme
const CASPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{green.50}",
      100: "{green.100}",
      200: "{green.200}",
      300: "{green.300}",
      400: "{green.400}",
      500: "{green.500}",
      600: "{green.600}",
      700: "{green.700}",
      800: "{green.800}",
      900: "{green.900}",
      950: "{green.950}",
    },
  },
})

export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@primevue/nuxt-module"],
  app: {
    head: {
      charset: "utf-8",
      title: "CASParser Demo",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "description", content: "Demo of casparser module" }],
    },
  },
  css: [
    "primeicons/primeicons.css",
    "primeflex/primeflex.css",
    "vue-json-pretty/lib/styles.css",
  ],
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: CASPreset,
        options: {
          darkModeSelector: false,
        },
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
    devProxy: {
      "/api": {
        target: "http://127.0.0.1:8000/api",
        changeOrigin: true,
      },
    },
  },
})
