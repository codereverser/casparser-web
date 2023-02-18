import eslint from "vite-plugin-eslint"

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-16",
      title: "CASParser Demo",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "description", content: "Demo of casparser module" }],
    },
  },
  build: {
    transpile: ["primevue"],
  },
  css: [
    "primevue/resources/themes/saga-green/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
    "primeflex/primeflex.css",
    "vue-json-pretty/lib/styles.css",
  ],
  plugins: ["@/plugins/vue-json-pretty", "@/plugins/primevue"],
  nitro: {
    compressPublicAssets: true,
    devProxy: {
      "/api": {
        target: "http://127.0.0.1:8000/api",
        changeOrigin: true,
      },
    },
  },
  vite: {
    plugins: [eslint()],
  },
})
