<template lang="pug">
.grid.justify-content-center.mt-6
  Card.col-6(v-if="casData === null")
      template(#title) CASParser Web
      template(#subtitle)
        .flex.flex-row.align-items-center
          div A simple demo for
          a.no-underline(href="https://github.com/codereverser/casparser" target="_blank")
            Button.p-button-link.p-button-sm(label="casparser")
      template(#content)
        p Parse Consolidated Account Statements (CAS) from CAMS/Karvy and view
        ol
          li.my-2 Portfolio Summary and Valuation
          li Capital Gains report
        .font-bold Generate CAS pdf files from either of the following sources
        .grid.justify-content.start.my-2
          a.no-underline(href="https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement" target="_blank")
            Button.p-button-link(label="CAMS")
          a.no-underline(href="https://mfs.kfintech.com/investor/General/ConsolidatedAccountStatement" target="_blank")
            Button.p-button-link(label="Karvy/KFINTECH")
casform(@cas-parsed="onCASParsed")
casviewer(:cas="casData" :gains="gainsData" :stats="statsData")
</template>

<script setup lang="ts">
import type { CASParserData, GainsData, StatsData } from "./types/defs"

const casData = ref<CASParserData | null>(null);
const gainsData = ref<GainsData | null>(null);
const statusData = ref("");
const messageData = ref<string[]>([]);
const statsData = ref<StatsData | null>(null);
const onCASParsed = ({
    cas,
    gains,
    stats,
    status,
    message,
  }: {
    cas: CASParserData;
    gains: GainsData;
    stats: StatsData | null;
    status: string;
    message: string[];
  }) => {
    casData.value = cas;
    gainsData.value = gains;
    statusData.value = status;
    statsData.value = stats;
    messageData.value = message;
  };
</script>