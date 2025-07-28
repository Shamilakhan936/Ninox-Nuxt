<template>
  <GenericTable :columns="columns" :rows="orders">
    <template #actions="{ row }">
      <button
        class="btn-secondary flex items-center gap-2 uppercase text-[#6F6259] text-base font-light"
        @click="$emit('view-details', row)"
      >
        View
        <ArrowCircleIcon size="20" />
      </button>
    </template>

    <template #footer>
      <button
        v-if="orders.length > 10" 
        class="bg-[#8A7C59] font-normal uppercase text-sm rounded-full py-4 px-5 text-white"
        @click="$emit('load-more')"
      >
        Show Next 10 Orders
      </button>
    </template>
  </GenericTable>
</template>

<script setup>
import GenericTable from "./GenericTable.vue";
import ArrowCircleIcon from "~/assets/icons/ArrowCircleIcon.vue";

// Assign defineProps to a variable
const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['view-details', 'load-more']);

const columns = [
  { label: "order #", key: "order" },
  { label: "order date", key: "date" },
  { label: "billed to", key: "billed" },
  { label: "total ex. vat", key: "total" },
  { label: "status", key: "status" },
];

// Directly use props.orders in the template
const orders = props.orders;
</script>
