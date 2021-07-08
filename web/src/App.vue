<template lang="pug">
.p-grid.p-jc-center.p-mt-6
  Card.p-col-6(v-if="casData === null")
    template(#title) CASParser Web
    template(#subtitle) A simple demo for&nbsp;
      a(href="https://github.com/codereverser/casparser" target="_blank") casparser
    template(#content)
      p Parse Consolidated Account Statements (CAS) from CAMS/Karvy and view
      ol
        li.p-my-2 Portfolio Summary and Valuation
        li Capital Gains report
      .p-text-bold Generate CAS pdf files from either of the following sources
      ol
        li.p-my-2
          a(href="https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement" target="_blank") CAMS
        li
          a(href="https://mfs.kfintech.com/investor/General/ConsolidatedAccountStatement" target="_blank") Karvy/KFINTECH

CASForm(@cas-parsed="onCASParsed")
CASViewer(:cas="casData" :gains="gainsData")
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import CASForm from "./components/CASForm.vue";
import CASViewer from "./components/CASViewer.vue";

import { CASParserData, GainsData } from "./defs";

export default defineComponent({
  name: "App",
  components: {
    CASForm,
    CASViewer,
  },
  setup() {
    const casData = ref<CASParserData | null>(null);
    const gainsData = ref<GainsData | null>(null);
    const onCASParsed = ({
      cas,
      gains,
    }: {
      cas: CASParserData;
      gains: GainsData;
    }) => {
      casData.value = cas;
      gainsData.value = gains;
    };
    return { casData, gainsData, onCASParsed };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //margin-top: 60px;

  .p-font-sans {
    font-family: Inter var, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
      "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji";
  }

  .p-font-mono {
    font-family: Menlo, ui-monospace, SFMono-Regular, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
  }

  .p-invisible {
    visibility: hidden;
  }
}
</style>
