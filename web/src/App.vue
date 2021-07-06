<template lang="pug">
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
