<template>
  <GenericTable :columns="columns" :rows="visibleShipments">
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
        v-if="visibleShipments.length < props.shipments.length"
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

// Assign defineProps to a variable
const props = defineProps({
  shipments: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  { label: "DOC. #", key: "document" },
  { label: "Doc Date", key: "date" },
  { label: "ORDER #", key: "order" },
  { label: "PACK LIST #", key: "pack" },
  { label: "billed to", key: "billed" },
  { label: "shipped to", key: "shipped" },
];

// Pagination
const itemsToShow = ref(10);

const visibleShipments = computed(() =>
  props.shipments ? props.shipments.slice(0, itemsToShow.value) : []
);

const showMore = () => {
  itemsToShow.value += 10;
};
</script>
