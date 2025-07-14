<template>
  <GenericTable :columns="columns" :rows="backOrders">
    <template #footer>
      <button
        class="bg-[#8A7C59] font-normal uppercase text-sm rounded-full py-4 px-5 text-white"
      >
        Show Next 10 Orders
      </button>
    </template>
  </GenericTable>
</template>

<script setup>
import GenericTable from "./GenericTable.vue";
import ArrowCircleIcon from "~/assets/icons/ArrowCircleIcon.vue";

defineProps({
  backOrders: Array,
});

const columns = [
  { label: "Order #", key: "order" },
  { label: "Date", key: "date" },
  { label: "Item #", key: "item" },
  { label: "Title", key: "title" },
  { label: "rem. qty", key: "qty" },
  { label: "new ship.", key: "newShips" },
  { label: "old ship.", key: "oldShips" },
  { label: "diff. days", key: "diffDays" },
  { label: "adj. date", key: "adjDate" },
];
</script>
