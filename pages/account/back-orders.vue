<template>
  <div class="ml-[86px]">
    <div class="mb-[90px]">
      <h2 class="text-3xl font-light mb-6 text-[#2D1713]">Back Orders</h2>
      <p class="text-base font-normal text-[#6F6259] leading-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
        molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
        fringilla accumsan, risus. sem sollicitudin lacus, ut interdum tellus
        elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
        lectus.
      </p>
    </div>

    <BackOrdersForm
      :fields="searchFields"
      button-label="Search"
      @submit="handleSearch"
    />

    <div>
      <h3 class="text-3xl font-light mb-4 text-[#2D1713]">Recent Back Orders</h3>
      <button
        @click="showMore"
        class="bg-[#EBE6DC] font-normal uppercase text-sm rounded-full py-4 px-5 text-[#6F6259]"
      >
        download full list
      </button>
      <BackOrdersTable :backOrders="dummyBackOrders" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "account-section" });

import BackOrdersForm from "~/components/SearchForm.vue";
import BackOrdersTable from "~/components/BackOrdersTable";
const searchFields = [
  { key: "reference", label: "Reference no.", type: "text", placeholder: "#" },
  { key: "from", label: "From", type: "date" },
  { key: "item", label: "item no.", type: "text", placeholder: "#" },
  { key: "to", label: "To", type: "date" },
  { key: "order", label: "order no.", type: "text", placeholder: "#" },
];

const handleSearch = (formValues) => {
  console.log("Search submitted with values:", formValues);
};
const dummyBackOrders = Array.from({ length: 10 }, () => ({
  order: "VF–2508227",
  date: "27/05/2025",
  item: "RF-PORTOFINO-5100-28",
  title: "Roller blind fabric texture B0 PES 280cm natural",
  qty: "",
  newShips: "Diddo ef.",
  oldShips: "Diddo ef.",
  diffDays: "Diddo ehf.",
  adjDate: "27/05/2025",
}));
</script>
<style>
.font-normal {
  font-weight: 400 !important
}
</style>