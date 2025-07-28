<template>
  <GenericTable :columns="columns" :rows="visibleInvoices">
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
        v-if="visibleInvoices.length < props.invoices.length"
        @click="showMore"
        class="bg-[#8A7C59] font-normal uppercase text-sm rounded-full py-4 px-5 text-white"
      >
        Show Next 10 Orders
      </button>
    </template>
  </GenericTable>
</template>

<script setup>
import { ref, computed } from "vue";
import GenericTable from "./GenericTable.vue";
import ArrowCircleIcon from "~/assets/icons/ArrowCircleIcon.vue";

// Assign to variable so we can use props inside script
const props = defineProps({
  invoices: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  { label: "Document #", key: "document" },
  { label: "Doc Date", key: "date" },
  { label: "Billed To", key: "billedTo" },
  { label: "Total Ex. VAT", key: "total" },
  { label: "Outs. Total", key: "outstanding" },
];

// Pagination state
const itemsToShow = ref(10);

const visibleInvoices = computed(() =>
  props.invoices ? props.invoices.slice(0, itemsToShow.value) : []
);

const showMore = () => {
  itemsToShow.value += 10;
};
</script>
