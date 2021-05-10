<template lang="pug">
CASForm(@cas-parsed="onCASParsed")
CASViewer(:cas="casData")
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import CASForm from "./components/CASForm.vue";
import CASViewer from "./components/CASViewer.vue";

import { CASParserData } from "./defs";

export default defineComponent({
  name: "App",
  components: {
    CASForm,
    CASViewer,
  },
  setup() {
    const casData = ref<CASParserData | null>(null);
    const onCASParsed = (cas: CASParserData) => {
      casData.value = cas;
    };
    return { casData, onCASParsed };
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

  .p-card {
    .p-card-footer {
      padding: 0;
    }
  }

  .p-fileupload {
    .p-fileupload-content {
      padding: 0 1rem;
    }
    .p-fileupload-buttonbar {
      text-align: right;
    }
  }

  .p-fileupload-choose {
    & + button {
      display: none;
    }
    & ~ button:nth-of-type(2) {
      display: none;
    }
  }

  .p-fileupload-row {
    & > div:nth-of-type(1) {
      width: 0;
    }
    & > div:nth-of-type(2) {
      width: 60%;
    }
    & > div:nth-of-type(3),
    div:nth-of-type(4) {
      width: 20%;
    }
  }
  .p-invisible {
    visibility: hidden;
  }
}
</style>
