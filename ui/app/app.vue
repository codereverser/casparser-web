<template lang="pug">
div
  .grid.justify-content-center.mt-6
    Card.col-6(v-if="casData === null")
        template(#title) CASParser Web
        template(#subtitle)
          .flex.flex-row.align-items-center
            div A simple demo for
            NuxtLink.p-button.p-component.p-button-text.no-underline.p-button-xs(href="https://github.com/codereverser/casparser" target="_blank")
              span.p-button-label.font-bold casparser
        template(#content)
          p Parse Consolidated Account Statements (CAS) from CAMS/KFintech or NSDL/CDSL (demat) and view
          ol
            li.my-2 Portfolio Summary and Valuation
            li.my-2 Capital Gains report (CAMS/KFintech detailed statements)
            li Demat holdings - equities, mutual funds and bonds (NSDL/CDSL)
          .font-bold Generate CAS pdf files from either of the following sources
          .grid.justify-content.start.my-2
            NuxtLink.p-button.p-component.p-button-text.no-underline(to="https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement" target="_blank")
              span.p-button-label.font-bold CAMS
            NuxtLink.p-button.p-component.p-button-text.no-underline(to="https://mfs.kfintech.com/investor/General/ConsolidatedAccountStatement" target="_blank")
              span.p-button-label.font-bold Karvy/KFINTECH
            NuxtLink.p-button.p-component.p-button-text.no-underline(to="https://nsdlcas.nsdl.com" target="_blank")
              span.p-button-label.font-bold NSDL
            NuxtLink.p-button.p-component.p-button-text.no-underline(to="https://www.cdslindia.com" target="_blank")
              span.p-button-label.font-bold CDSL
  casform(@cas-parsed="onCASParsed")
  .grid.justify-content-center.mt-2(v-if="statusData === 'warn' && messageData")
    Message(class="col-10 md:col-8" severity="warn") {{ messageData }}
  casviewer(v-if="!isDemat" :cas="rtaData" :gains="gainsData" :stats="statsData")
  dematviewer(v-else :cas="dematData")
</template>

<script setup lang="ts">
import type {
  CASParserData,
  NSDLCASData,
  GainsData,
  StatsData,
} from "./types/defs"

const casData = ref<CASParserData | NSDLCASData | null>(null)
const gainsData = ref<GainsData | null>(null)
const statusData = ref("")
const messageData = ref("")
const statsData = ref<StatsData | null>(null)

// NSDL/CDSL demat statements carry accounts; RTA (CAMS/KFin) carry folios
const isDemat = computed(
  () => casData.value !== null && "accounts" in casData.value,
)
const rtaData = computed(() =>
  isDemat.value ? null : (casData.value as CASParserData | null),
)
const dematData = computed(() =>
  isDemat.value ? (casData.value as NSDLCASData) : null,
)

const onCASParsed = ({
  cas,
  gains,
  stats,
  status,
  message,
}: {
  cas: CASParserData | NSDLCASData | null
  gains: GainsData | null
  stats: StatsData | null
  status: string
  message: string
}) => {
  casData.value = cas
  gainsData.value = gains
  statusData.value = status
  statsData.value = stats
  messageData.value = message
}
</script>

<style lang="scss">
body {
  background: var(--p-surface-50);
  margin: 0;
}

#__nuxt {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //margin-top: 60px;

  .p-font-sans {
    font-family:
      Inter var,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      Arial,
      "Noto Sans",
      sans-serif,
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji";
  }

  .p-font-mono {
    font-family: Menlo, ui-monospace, SFMono-Regular, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
  }

  .invisible {
    visibility: hidden;
  }

  .p-button-xs {
    padding: 0.4375rem 0.3rem;
  }
}
</style>
