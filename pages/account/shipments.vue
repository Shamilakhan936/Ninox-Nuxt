<template>
  <div class="ml-[86px]">
    <div class="mb-[90px]">
      <h2 class="text-3xl font-light mb-6 text-[#2D1713]">Shipments History</h2>
      <p class="text-base font-normal text-[#6F6259] leading-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
        molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
        fringilla accumsan, risus. sem sollicitudin lacus, ut interdum tellus
        elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
        lectus.
      </p>
    </div>

    <ShipmentSearchForm
      :fields="searchFields"
      button-label="Search"
      @submit="handleSearch"
    />

    <div>
      <h3 class="text-3xl font-light mb-4 text-[#2D1713]">Recent Shipments</h3>
      <ShipmentTable :shipments="dummyShipments" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "account-section" });

import ShipmentSearchForm from "~/components/SearchForm.vue";
import ShipmentTable from "~/components/ShipmentTable.vue";
const searchFields = [
  { key: "order", label: "Order no", type: "text", placeholder: "#" },
  { key: "from", label: "From", type: "date" },
  { key: "document", label: "document no.", type: "text", placeholder: "#" },
  { key: "to", label: "To", type: "date" },
];

const handleSearch = (formValues) => {
  console.log("Search submitted with values:", formValues);
};
const dummyShipments = Array.from({ length: 10 }, () => ({
  document: "VF–2508227",
  date: "27/05/2025",
  order: "V0-2508227",
  pack: "LL-2508303",
  billed: "Diddo ehf.",
  shipped: "Diddo ehf.",
}));
</script>
