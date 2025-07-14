<template>
  <GenericTable :columns="columns" :rows="credits">
    <template #actions="{ row }">
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
        show next 10 orders
      </button>
    </template>
  </GenericTable>
</template>

<script setup>
import GenericTable from "./GenericTable.vue";
import ArrowCircleIcon from "~/assets/icons/ArrowCircleIcon.vue";

defineProps({
  credits: Array,
});

const columns = [
  { label: "Document #", key: "document" },
  { label: "Doc Date", key: "date" },
  { label: "Billed To", key: "billedTo" },
  { label: "Total Ex. VAT", key: "total" },
  { label: "Outs. Total", key: "outstanding" },
];
</script>
