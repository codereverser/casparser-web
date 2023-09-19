import PrimeVue from "primevue/config"
import Button from "primevue/button"
import Card from "primevue/card"
import Column from "primevue/column"
import DataTable from "primevue/datatable"
import Fieldset from "primevue/fieldset"
import InputSwitch from "primevue/inputswitch"
import InputText from "primevue/inputtext"
import Panel from "primevue/panel"
import Password from "primevue/password"
import ProgressBar from "primevue/progressbar"
import TabPanel from "primevue/tabpanel"
import TabView from "primevue/tabview"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true })
  nuxtApp.vueApp.component("Button", Button)
  nuxtApp.vueApp.component("Card", Card)
  nuxtApp.vueApp.component("Column", Column)
  nuxtApp.vueApp.component("DataTable", DataTable)
  nuxtApp.vueApp.component("Fieldset", Fieldset)
  nuxtApp.vueApp.component("InputSwitch", InputSwitch)
  nuxtApp.vueApp.component("InputText", InputText)
  nuxtApp.vueApp.component("Panel", Panel)
  nuxtApp.vueApp.component("Password", Password)
  nuxtApp.vueApp.component("ProgressBar", ProgressBar)
  nuxtApp.vueApp.component("TabPanel", TabPanel)
  nuxtApp.vueApp.component("TabView", TabView)
})
