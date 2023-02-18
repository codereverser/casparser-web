<template lang="pug">
div(v-if="cas !== null")
  h3.text-center.uppercase Consolidated Account {{ cas.cas_type === "SUMMARY" ? "summary" : "statement" }}
  h4.text-center.uppercase Statement Period : {{ cas.statement_period.from }} To {{ cas.statement_period.to }}
  .grid.grid-nogutter.justify-content-center
    Fieldset(class="col-12 md:col-5" legend="Investor Info" :toggleable="true")
      .grid
        .col-3 Name
        .col-9.uppercase.p-font-mono.font-bold {{ cas.investor_info.name }}
        .col-3 Email
        .col-9.uppercase.p-font-mono.font-bold {{ cas.investor_info.email }}
        .col-3 Address
        .col-9.uppercase.p-font-mono.font-bold {{ cas.investor_info.address }}
        .col-3 Mobile
        .col-9.uppercase.p-font-mono.font-bold {{ cas.investor_info.mobile }}
    .col-1
    Fieldset(class="col-12 md:col-5" legend="CAS Data" :toggleable="true")
      .grid
        .col-6 Type
        .col-6.font-bold.p-font-mono {{ cas.cas_type }}
        .col-6 Source
        .col-6.font-bold.p-font-mono {{ cas.file_type }}
        .col-6 Date
        .col-6.font-bold.p-font-mono {{ valuationDate }}
        .col-6 Total Invested
        .col-6.font-bold.p-font-mono.p-valuation {{ (stats && stats.invested) ? formatCurrency(stats.invested) : 'N/A' }}
        .col-6 Total Valuation
        .col-6.font-bold.p-font-mono.p-valuation {{ (stats && stats.current) ? formatCurrency(stats.current) : formatCurrency(valuation) }}

  TabView
    TabPanel(header="Detailed")
      .flex.flex-row.justify-content-end.align-items-center.m-2
        .font-bold.mr-2 Hide zero-balance funds?
        InputSwitch(v-model="hideZeroSchemes")
      Panel.pb-4(v-for="(folio, index) in folios" :key="folio.folio" :toggleable="true")
        template(#header)
          .flex.flex-row.justify-content-between(style="width: 100%;")
            .flex.flex-row.justify-content-around.align-center
              span Folio:&nbsp;
              .font-bold {{ folio.folio }}
            .flex.flex-row.justify-content-around.align-center
              span PAN:&nbsp;
              .font-semibold {{ folio.PAN }}
            .flex.flex-row.justify-content-around.align-center
              span KYC:&nbsp;
              .font-bold {{ folio.KYC }}
            .flex.flex-row.justify-content-around.align-center
              span PANKYC:&nbsp;
              .font-bold {{ folio.PANKYC }}
        DataTable.p-datatable-sm(v-for="scheme in getSchemes(folio)" :key="scheme.scheme" :autoLayout="true"
                               :value="scheme.transactions" :paginator="scheme.transactions.length > 5" :rows="10")
          template(#header)
            .grid
              .col-8 {{ scheme.scheme }}
              .col-2.flex.flex-row.justify-content-end
                span Open:&nbsp;
                .font-bold {{ scheme.open }}
              .col-2.flex.flex-row.justify-content-end
                span Close:&nbsp;
                .font-bold {{ scheme.close }}
          template(#empty) No transactions found!
          template(#footer)
            .flex.flex-row.justify-content-end
              span Valuation as of&nbsp;
              .text-black {{ scheme.valuation.date }} :&nbsp;
              .p-font-mono.p-valuation.sm {{formatCurrency(scheme.valuation.value)}}
          Column(field="date" header="Date")
          Column(field="description" header="Description")
          Column(field="amount" header="Amount" headerClass="text-right" bodyClass="text-right")
            template(#body="slotProps") {{ formatCurrency(slotProps.data.amount) }}
          Column(field="nav" header="NAV" headerClass="text-right" bodyClass="text-right")
          Column(field="units" header="Units" headerClass="text-right" bodyClass="text-right")
          Column(field="balance" header="Balance" headerClass="text-right" bodyClass="text-right")
    TabPanel(header="Raw")
      vue-json-pretty.text-black(:data="cas" :show-length="true" :deep="2")
    TabPanel(header="Capital Gains")
      .text-center.text-red-400.mt-2(v-if="gains === null") Capital Gains Report is available only for complete CAS Reports. i.e. the opening balance of all schemes should be zero
      .pb-4(v-else)
        Panel(v-for="(fy, index) in fys" :key="fy" toggleable :collapsed="index > 0")
          template(#header)
            .flex.flex-row.grid(style="width: 100%;")
              .font-bold.col-3 {{fy}}
              .col-3.flex.flex-row.justify-content-around.align-center
                span LTCG:&nbsp;
                .font-bold(:class="{'text-red-400': gains[fy].total.ltcg < 0, 'p-text-profit': gains[fy].total.ltcg > 0}") {{ formatCurrency(gains[fy].total.ltcg) }}
              .col-3.flex.flex-row.justify-content-around.align-center
                span LTCG(Taxable):&nbsp;
                .font-bold(:class="{'text-red-400': gains[fy].total.tax_ltcg < 0, 'p-text-profit': gains[fy].total.tax_ltcg > 0}") {{ formatCurrency(gains[fy].total.tax_ltcg) }}
              .col-3.flex.flex-row.justify-content-around.align-center
                span STCG:&nbsp;
                .font-bold(:class="{'text-red-400': gains[fy].total.stcg < 0, 'p-text-profit': gains[fy].total.stcg > 0}") {{ formatCurrency(gains[fy].total.stcg) }}
          DataTable.datatable-sm.my-4(v-for="fund in gains[fy].funds" :key="fund.fund.isin" :autoLayout="true"
                                          :value="fund.txns" :paginator="fund.txns.length > 5" :rows="10")
            template(#header)
              .grid
                .col-8 {{ fund.fund.scheme }}
                .col-2.flex.flex-row.justify-content-end
                  span ISIN:&nbsp;
                  .font-bold {{ fund.fund.isin }}
                .col-2.flex.flex-row.justify-content-end
                  span Type:&nbsp;
                  .font-bold {{ fund.fund.type }}
            template(#footer)
              .grid
                .col-4.flex.flex-row.justify-content-around.align-center
                  span LTCG:&nbsp;
                  .font-bold(:class="{'text-red-400': fund.total.ltcg < 0, 'p-text-profit': fund.total.ltcg > 0}") {{ formatCurrency(fund.total.ltcg) }}
                .col-4.flex.flex-row.justify-content-around.align-center
                  span LTCG (Taxable):&nbsp;
                  .font-bold(:class="{'text-red-400': fund.total.tax_ltcg < 0, 'p-text-profit': fund.total.tax_ltcg > 0}") {{ formatCurrency(fund.total.tax_ltcg) }}
                .col-4.flex.flex-row.justify-content-around.align-center
                  span STCG:&nbsp;
                  .font-bold(:class="{'text-red-400': fund.total.stcg < 0, 'p-text-profit': fund.total.stcg > 0}") {{ formatCurrency(fund.total.stcg) }}
            template(#empty) No transactions found!
            Column(field="buy_date" header="Purchase Date")
            Column(field="buy_price" header="Purchase Value" headerClass="text-right" bodyClass="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.buy_price) }}
            Column(field="coa" header="Acquisition Value" headerClass="text-right" bodyClass="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.coa) }}
            Column(field="units" header="Units")
            Column(field="sell_date" header="Sale Date")
            Column(field="sell_price" header="Sale Value" headerClass="text-right" bodyClass="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.sell_price) }}
            Column(field="ltcg" header="LTCG" headerClass="text-right" bodyClass="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.ltcg) }}
            Column(field="tax_ltcg" header="LTCG(Taxable)" headerClass="text-right" bodyClass="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.tax_ltcg) }}
            Column(field="stcg" header="STCG" headerClass="text-right" bodyClass="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.stcg) }}
</template>

<script setup lang="ts">
import moment from 'moment'
import type { CASParserData, GainsData, Folio, Scheme, StatsData } from "../types/defs";
export interface Props {
  cas: CASParserData | null
  gains: GainsData | null
  stats: StatsData | null
}
const props = withDefaults(defineProps<Props>(), {
  cas: null,
  gains: null,
  stats: null,
});

const valuation = ref(0);
const valuationDate = ref<Date | string>(new Date().toDateString());
const { cas, gains } = toRefs(props);


const formatCurrency = (amount: number) => {
  return amount ? amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  }) : "N/A"
}
const formatDate = (date: Date | string) => {
  return moment(date).format('LL')
}

watch(cas, (value: CASParserData | null) => {
  if (value === null) {
    valuation.value = 0;
    valuationDate.value = new Date().toDateString();
    return;
  }

  valuation.value = 0
  valuationDate.value = value.statement_period.to;
  value.folios.forEach((folio) => {
    folio.schemes.forEach((scheme) => {
      valuation.value += scheme.valuation.value;
    })
  })

})


const hideZeroSchemes = ref(true);
const displayScheme = (scheme: Scheme) => {
  return hideZeroSchemes.value ? scheme.valuation.value > 0 : true;
}
const getSchemes = (folio: Folio): Scheme[] => {
  return hideZeroSchemes.value ? folio.schemes.filter((scheme: Scheme) => scheme.valuation.value > 0): folio.schemes
}

const folios = computed((): Folio[] => {
  return cas.value === null ? [] : cas.value.folios.filter((folio: Folio) => getSchemes(folio).length > 0)
})

const fys = computed((): string[] => {
  if (gains.value == null) return [];
  let keys = Object.keys(gains.value);
  keys.sort();
  keys.reverse();
  return keys;
})

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
.text-black {
  color: black;
}

.p-text-profit {
  color: var(--green-500);
}

.p-datatable th[class*="text-"] .p-column-header-content {
  display: inline-flex;
}

</style>
