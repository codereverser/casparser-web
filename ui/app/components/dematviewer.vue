<template lang="pug">
div(v-if="cas !== null")
  h3.text-center.uppercase Consolidated Account Statement (Demat)
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
        .col-6 Source
        .col-6.font-bold.p-font-mono {{ cas.file_type }}
        .col-6 Demat Accounts
        .col-6.font-bold.p-font-mono {{ cas.accounts.length }}
        .col-6 Total Valuation
        .col-6.font-bold.p-font-mono.p-valuation {{ formatCurrency(totalValuation) }}

  Tabs(value="holdings")
    TabList
      Tab(value="holdings") Holdings
      Tab(value="raw") Raw
    TabPanels
      TabPanel(value="holdings")
        Panel.pb-4(v-for="account in cas.accounts" :key="account.name + account.client_id" :toggleable="true")
          template(#header)
            .flex.flex-row.justify-content-between.flex-wrap(style="width: 100%;")
              .flex.flex-row.justify-content-around.align-center
                span Account:&nbsp;
                .font-bold {{ account.name }}
              .flex.flex-row.justify-content-around.align-center
                span Type:&nbsp;
                .font-bold {{ account.type }}
              .flex.flex-row.justify-content-around.align-center(v-if="account.dp_id")
                span DP ID:&nbsp;
                .font-semibold {{ account.dp_id }}
              .flex.flex-row.justify-content-around.align-center(v-if="account.client_id")
                span Client ID:&nbsp;
                .font-semibold {{ account.client_id }}
              .flex.flex-row.justify-content-around.align-center
                span Value:&nbsp;
                .font-bold.p-text-profit {{ formatCurrency(account.balance) }}
          DataTable.my-2(v-if="account.equities.length > 0" size="small" :value="account.equities"
                         :paginator="account.equities.length > 10" :rows="10")
            template(#header)
              .font-bold Equities ({{ account.equities.length }})
            Column(field="name" header="Name")
            Column(field="isin" header="ISIN")
            Column(field="symbol" header="Symbol")
            Column(field="exchange" header="Exchange")
            Column(field="num_shares" header="Shares" header-class="text-right" body-class="text-right")
            Column(field="price" header="Price" header-class="text-right" body-class="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.price) }}
            Column(field="value" header="Value" header-class="text-right" body-class="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.value) }}
          DataTable.my-2(v-if="account.mutual_funds.length > 0" size="small" :value="account.mutual_funds"
                         :paginator="account.mutual_funds.length > 10" :rows="10")
            template(#header)
              .font-bold Mutual Funds ({{ account.mutual_funds.length }})
            Column(field="name" header="Name")
            Column(field="isin" header="ISIN")
            Column(field="folio" header="Folio")
            Column(field="type" header="Type")
            Column(field="balance" header="Units" header-class="text-right" body-class="text-right")
            Column(field="nav" header="NAV" header-class="text-right" body-class="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.nav) }}
            Column(field="value" header="Value" header-class="text-right" body-class="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.value) }}
          DataTable.my-2(v-if="account.bonds.length > 0" size="small" :value="account.bonds"
                         :paginator="account.bonds.length > 10" :rows="10")
            template(#header)
              .font-bold Bonds ({{ account.bonds.length }})
            Column(field="name" header="Name")
            Column(field="isin" header="ISIN")
            Column(field="num_bonds" header="Qty" header-class="text-right" body-class="text-right")
            Column(field="face_value" header="Face Value" header-class="text-right" body-class="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.face_value) }}
            Column(field="coupon_rate" header="Coupon %" header-class="text-right" body-class="text-right")
            Column(field="maturity_date" header="Maturity")
            Column(field="value" header="Value" header-class="text-right" body-class="text-right")
              template(#body="slotProps") {{ formatCurrency(slotProps.data.value) }}
          .text-center.my-2(v-if="account.equities.length === 0 && account.mutual_funds.length === 0 && account.bonds.length === 0") No holdings found in this account!
      TabPanel(value="raw")
        vue-json-pretty.text-black(:data="cas" :show-length="true" :deep="2")
</template>

<script setup lang="ts">
import type { NSDLCASData } from "../types/defs"

export interface Props {
  cas?: NSDLCASData | null
}
const props = withDefaults(defineProps<Props>(), {
  cas: null,
})

const { cas } = toRefs(props)

const formatCurrency = (amount: number | string | null) => {
  // API serializes Decimal values as strings; coerce before formatting
  const value = Number(amount)
  return amount !== null && amount !== "" && !Number.isNaN(value)
    ? value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
      })
    : "N/A"
}

const totalValuation = computed(() => {
  if (cas.value === null) return 0
  return cas.value.accounts.reduce(
    (total, account) => total + Number(account.balance),
    0,
  )
})
</script>
