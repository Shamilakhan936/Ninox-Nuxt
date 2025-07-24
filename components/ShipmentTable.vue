<template>
  <GenericTable :columns="columns" :rows="shipments">
    <template>
      <button
        class="btn-secondary flex items-center gap-2 uppercase text-[#6F6259] text-base font-light"
      >
        View
        <ArrowCircleIcon size="20" />
      </button>
    </template>

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
  shipments: Array,
});

const columns = [
  { label: "DOC. #", key: "document" },
  { label: "Doc Date", key: "date" },
  { label: "ORDER #", key: "order" },
  { label: "PACK LIST #", key: "pack" },
  { label: "billed to", key: "billed" },
  { label: "shipped to", key: "shipped" },
];
</script>
