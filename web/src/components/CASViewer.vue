<template lang="pug">
div(v-if="cas !== null")
  h3.p-text-center.p-text-uppercase Consolidated Account {{ cas.cas_type === "SUMMARY" ? "summary" : "statement" }}
  h4.p-text-center.p-text-uppercase Statement Period : {{ cas.statement_period.from }} To {{ cas.statement_period.to }}
  .p-grid.p-nogutter.p-jc-center
    Fieldset.p-md-5.p-col-12(legend="Investor Info" :toggleable="true")
      .p-grid
        .p-col-3 Name
        .p-col-9.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.name }}
        .p-col-3 Email
        .p-col-9.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.email }}
        .p-col-3 Address
        .p-col-9.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.address }}
        .p-col-3 Mobile
        .p-col-9.p-text-uppercase.p-font-mono.p-text-bold {{ cas.investor_info.mobile }}
    .p-col-1
    Fieldset.p-md-5.p-col-12(legend="CAS Data" :toggleable="true")
      .p-grid
        .p-col-6 Type
        .p-col-6.p-text-bold.p-font-mono {{ cas.cas_type }}
        .p-col-6 Source
        .p-col-6.p-text-bold.p-font-mono {{ cas.file_type }}
        .p-col-6 Date
        .p-col-6.p-text-bold.p-font-mono {{ valuationDate }}
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
              .p-col-8 {{ scheme.scheme }}
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
    TabPanel(header="Capital Gains")
      .p-text-center.p-error.p-mt-2(v-if="gains === null") Capital Gains Report is available only for complete CAS Reports. i.e. the opening balance of all schemes should be zero
      .p-pb-4(v-else)
        Panel(v-for="(fy, index) in fys" :key="fy" toggleable :collapsed="index > 0")
          template(#header)
            .p-d-flex.p-flex-row.p-grid(style="width: 100%;")
              .p-text-bold.p-col-3 {{fy}}
              .p-col-3.p-d-flex.p-flex-row.p-jc-around.p-align-center
                span LTCG:&nbsp;
                .p-text-bold(:class="{'p-error': gains[fy].total.ltcg < 0, 'p-text-profit': gains[fy].total.ltcg > 0}") {{ formatCurrency(gains[fy].total.ltcg) }}
              .p-col-3.p-d-flex.p-flex-row.p-jc-around.p-align-center
                span LTCG(Taxable):&nbsp;
                .p-text-bold(:class="{'p-error': gains[fy].total.tax_ltcg < 0, 'p-text-profit': gains[fy].total.tax_ltcg > 0}") {{ formatCurrency(gains[fy].total.tax_ltcg) }}
              .p-col-3.p-d-flex.p-flex-row.p-jc-around.p-align-center
                span STCG:&nbsp;
                .p-text-bold(:class="{'p-error': gains[fy].total.stcg < 0, 'p-text-profit': gains[fy].total.stcg > 0}") {{ formatCurrency(gains[fy].total.stcg) }}
          DataTable.p-datatable-sm.p-my-4(v-for="fund in gains[fy].funds" :key="fund.fund.isin" :autoLayout="true"
                                          :value="fund.txns" :paginator="fund.txns.length > 5" :rows="10")
            template(#header)
              .p-grid
                .p-col-8 {{ fund.fund.name }}
                .p-col-2.p-d-flex.p-flex-row.p-jc-end
                  span ISIN:&nbsp;
                  .p-text-bold {{ fund.fund.isin }}
                .p-col-2.p-d-flex.p-flex-row.p-jc-end
                  span Type:&nbsp;
                  .p-text-bold {{ fund.fund.type }}
            template(#footer)
              .p-grid
                .p-col-4.p-d-flex.p-flex-row.p-jc-around.p-align-center
                  span LTCG:&nbsp;
                  .p-text-bold(:class="{'p-error': fund.total.ltcg < 0, 'p-text-profit': fund.total.ltcg > 0}") {{ formatCurrency(fund.total.ltcg) }}
                .p-col-4.p-d-flex.p-flex-row.p-jc-around.p-align-center
                  span LTCG (Taxable):&nbsp;
                  .p-text-bold(:class="{'p-error': fund.total.tax_ltcg < 0, 'p-text-profit': fund.total.tax_ltcg > 0}") {{ formatCurrency(fund.total.tax_ltcg) }}
                .p-col-4.p-d-flex.p-flex-row.p-jc-around.p-align-center
                  span STCG:&nbsp;
                  .p-text-bold(:class="{'p-error': fund.total.stcg < 0, 'p-text-profit': fund.total.stcg > 0}") {{ formatCurrency(fund.total.stcg) }}
            template(#empty) No transactions found!
            Column(field="buy_date" header="Purchase Date")
            Column(field="buy_price" header="Purchase Value" headerClass="p-text-right" bodyClass="p-text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.buy_price) }}
            Column(field="coa" header="Acquisition Value" headerClass="p-text-right" bodyClass="p-text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.coa) }}
            Column(field="units" header="Units")
            Column(field="sell_date" header="Sale Date")
            Column(field="sell_price" header="Sale Value" headerClass="p-text-right" bodyClass="p-text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.sell_price) }}
            Column(field="ltcg" header="LTCG" headerClass="p-text-right" bodyClass="p-text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.ltcg) }}
            Column(field="tax_ltcg" header="LTCG(Taxable)" headerClass="p-text-right" bodyClass="p-text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.tax_ltcg) }}
            Column(field="stcg" header="STCG" headerClass="p-text-right" bodyClass="p-text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.stcg) }}
</template>

<script lang="ts">
import moment from "moment";
import { PropType, computed, defineComponent, ref, watch, toRefs } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import { CASParserData, GainsData, Folio, Scheme } from "../defs";

export default defineComponent({
  components: {
    VueJsonPretty,
  },
  props: {
    cas: {
      type: Object as PropType<CASParserData | null>,
      default: null,
    },
    gains: {
      type: Object as PropType<GainsData | null>,
      default: null,
    },
  },
  setup: function (props) {
    const valuation = ref(0);
    const valuationDate = ref<Date | string>(new Date().toDateString());

    const { cas, gains } = toRefs(props);
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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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

    const fys = computed((): string[] => {
      if (gains.value === null) return [];
      let keys = Object.keys(gains.value);
      keys.sort();
      keys.reverse();
      return keys;
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
      fys,
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

.p-text-profit {
  color: var(--green-500);
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
