import VueJsonPretty from "vue-json-pretty"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("vue-json-pretty", VueJsonPretty)
})
