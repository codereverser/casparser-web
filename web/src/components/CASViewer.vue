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
    Fieldset.p-md-5.p-col-12(legend="CAS Data" :toggleable="true")
      .p-grid
        .p-col-6 Type
        .p-col-6.p-text-bold.p-font-mono {{ cas.cas_type }}
        .p-col-6 Source
        .p-col-6.p-text-bold.p-font-mono {{ cas.file_type }}
        .p-col-6 Date
        .p-col-6.p-text-bold.p-font-mono {{ formatDate(valuationDate) }}
        .p-col-6 Total Valuation
        .p-col-6.p-text-bold.p-font-mono.p-valuation {{ formatCurrency(valuation) }}
  TabView
    TabPanel(header="Table")
      .p-d-flex.p-flex-row.p-jc-end.p-ai-center.p-m-2
        .p-text-bold.p-mr-2 Hide zero-balance funds?
        InputSwitch(v-model="hideZeroSchemes")
      Panel.p-pb-4(v-for="(folio, index) in folios" :key="folio.folio" :toggleable="true")
        template(#header)
          .p-d-flex.p-flex-row.p-jc-between(style="width: 100%;")
            .p-d-flex.p-flex-row.p-jc-around.p-align-center
              span Folio:&nbsp;
              .p-text-bold {{ folio.folio }}
            .p-d-flex.p-flex-row.p-jc-around.p-align-center
              span PAN:&nbsp;
              .p-text-bold {{ folio.PAN }}
            .p-d-flex.p-flex-row.p-jc-around.p-align-center
              span KYC:&nbsp;
              .p-text-bold {{ folio.KYC }}
            .p-d-flex.p-flex-row.p-jc-around.p-align-center
              span PANKYC:&nbsp;
              .p-text-bold {{ folio.PANKYC }}
        DataTable.p-datatable-sm(v-for="scheme in getSchemes(folio)" :key="scheme.scheme" :autoLayout="true"
                               :value="scheme.transactions" :paginator="scheme.transactions.length > 5" :rows="10")
          template(#header)
            .p-grid
              .p-col-8 {{ scheme.scheme }} - {{ scheme.valuation.value }}
              .p-col-2.p-d-flex.p-flex-row.p-jc-end
                span Open:&nbsp;
                .p-text-bold {{ scheme.open }}
              .p-col-2.p-d-flex.p-flex-row.p-jc-end
                span Close:&nbsp;
                .p-text-bold {{ scheme.close }}
          template(#empty) No transactions found!
          template(#footer)
            .p-d-flex.p-flex-row.p-jc-end
              span Valuation as of&nbsp;
              .p-text-black {{ scheme.valuation.date }} :&nbsp;
              .p-text-mono.p-valuation.sm {{formatCurrency(scheme.valuation.value)}}
          Column(field="date" header="Date")
          Column(field="description" header="Description")
          Column(field="amount" header="Amount" headerClass="p-text-right" bodyClass="p-text-right")
            template(#body="slotProps") {{ formatCurrency(slotProps.data.amount) }}
          Column(field="nav" header="NAV" headerClass="p-text-right" bodyClass="p-text-right")
          Column(field="units" header="Units" headerClass="p-text-right" bodyClass="p-text-right")
          Column(field="balance" header="Balance" headerClass="p-text-right" bodyClass="p-text-right")
    TabPanel(header="Raw")
      vue-json-pretty.p-text-black(:data="cas" :show-length="true" :deep="2")

</template>

<script lang="ts">
import moment from "moment";
import { PropType, computed, defineComponent, ref, watch, toRefs } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import { CASParserData, Folio, Scheme } from "../defs";

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
      valuationDate.value = value.statement_period.to;
      value.folios.forEach((folio) => {
        folio.schemes.forEach((scheme) => {
          valuation.value += scheme.valuation.value;
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

    const hideZeroSchemes = ref(true);
    const displayScheme = (scheme: Scheme) => {
      return hideZeroSchemes.value ? scheme.valuation.value > 0 : true;
    };
    const getSchemes = (folio: Folio): Scheme[] => {
      return hideZeroSchemes.value
        ? folio.schemes.filter((scheme: Scheme) => scheme.valuation.value > 0)
        : folio.schemes;
    };
    const folios = computed((): Folio[] => {
      if (cas.value === null) return [];
      return cas.value.folios.filter(
        (folio: Folio) => getSchemes(folio).length > 0
      );
    });

    return {
      getSchemes,
      folios,
      formatCurrency,
      formatDate,
      valuation,
      valuationDate,
      hideZeroSchemes,
      displayScheme,
    };
  },
});
</script>

<style lang="scss">
.p-invisible {
  visibility: hidden;
}
.p-valuation {
  color: var(--green-500);
  font-size: 1.4rem;
  &.sm {
    font-size: 1rem;
  }
}
.p-text-black {
  color: black;
}

.p-datatable {
  .p-text-right {
    .p-column-header-content {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
}
</style>
