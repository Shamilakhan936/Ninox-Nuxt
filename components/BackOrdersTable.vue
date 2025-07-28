<template>
  <GenericTable :columns="columns" :rows="visibleBackOrders">
    <template #footer>
      <button
        v-if="visibleBackOrders.length < props.backOrders.length"
        @click="showMore"
        class="bg-[#8A7C59] font-normal uppercase text-sm rounded-full py-4 px-5 text-white"
      >
        Show Next 10 Orders
      </button>
    </template>
  </GenericTable >
</template>

<script setup>
import { ref, computed } from "vue";
import GenericTable from "./GenericTable.vue";

// props
const props = defineProps({
  backOrders: {
    type: Array,
    default: () => [],
  },
});

// table columns
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

// pagination state
const itemsToShow = ref(10);

const visibleBackOrders = computed(() =>
  props.backOrders ? props.backOrders.slice(0, itemsToShow.value) : []
);

const showMore = () => {
  itemsToShow.value += 10;
};
</script>
