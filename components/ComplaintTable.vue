<template>
  <GenericTable
    :columns="columns"
    :rows="visibleComplaints"
    tableType="complaint"
  >
    <template #actions>
      <button
        class="btn-secondary flex items-center gap-2 uppercase text-[#6F6259] text-base font-light"
      >
        View
        <ArrowCircleIcon size="20" />
      </button>
    </template>

    <template #footer>
      <button
        v-if="visibleComplaints.length < complaints.length"
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

const props = defineProps({
  complaints: Array,
});
const columns = [
  { label: "complaint no.", key: "complaint" },
  { label: "status", key: "status" },
  { label: "reported date", key: "reported" },
  { label: "complaint reference", key: "reference" },
  { label: "article number", key: "article" },
  { label: "complaint reason", key: "reason" },
];

// Pagination state
const itemsToShow = ref(10);

const visibleComplaints = computed(() =>
  props.complaints.slice(0, itemsToShow.value)
);

const showMore = () => {
  itemsToShow.value += 10;
};
</script>
