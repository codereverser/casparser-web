<template lang="pug">
div(v-if="cas !== null")
  h3.p-text-center.p-text-uppercase Consolidated Account {{ cas.cas_type === "SUMMARY" ? "summary" : "statement" }}
  h4.p-text-center.p-text-uppercase Statement Period : {{ cas.statement_period.from }} To {{ cas.statement_period.to }}
  .p-grid.p-nogutter.p-jc-center
    Fieldset.p-md-5.p-col-12(legend="Investor Info" :toggleable="true")
      .p-grid
        .p-col-6 Name
        .p-col-6.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.name }}
        .p-col-6 Email
        .p-col-6.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.email }}
        .p-col-6 Address
        .p-col-6.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.address }}
        .p-col-6 Mobile
        .p-col-6.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.mobile }}
    .p-col-1
    Fieldset.p-md-5.p-col-12(legend="Valuation" :toggleable="true")
      .p-grid
        .p-col-6 Total Valuation
        .p-col-6.p-text-bold.p-font-mono.p-valuation {{ formatCurrency(valuation) }}
        .p-col-6 Date
        .p-col-6.p-text-bold.p-font-mono {{ formatDate(valuationDate) }}
  TabView
    TabPanel(header="Table")
      div
    TabPanel(header="Raw")
      vue-json-pretty.p-text-black(:data="cas" :show-length="true" :deep="2")

</template>

<script lang="ts">
import moment from "moment";
import { PropType, defineComponent, ref, watch, toRefs } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import { CASParserData } from "../defs";

export default defineComponent({
  components: {
    VueJsonPretty,
  },
  props: {
    cas: {
      type: Object as PropType<CASParserData | null>,
      default: null,
    },
  },
  setup: function (props) {
    const valuation = ref(0);
    const valuationDate = ref<Date | string>(new Date().toDateString());

    const { cas } = toRefs(props);
    watch(cas, (value: CASParserData | null) => {
      if (value === null) {
        valuation.value = 0;
        valuationDate.value = new Date().toDateString();
        return;
      }
      valuation.value = 0;
      value.folios.forEach((folio) => {
        folio.schemes.forEach((scheme) => {
          valuation.value += scheme.valuation.value;
          valuationDate.value = scheme.valuation.date;
        });
      });
    });

    const formatCurrency = (amount: number) => {
      return amount.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        style: "currency",
        currency: "INR",
      });
    };
    const formatDate = (date: Date | string) => {
      return moment(date).format("LL");
    };

    return { formatCurrency, formatDate, valuation, valuationDate };
  },
});
</script>

<style lang="scss">
.p-invisible {
  visibility: hidden;
}
.p-valuation {
  color: var(--blue-500);
  font-size: 1.4rem;
}
.p-text-black {
  color: black;
}
</style>
