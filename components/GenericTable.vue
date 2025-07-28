<template>
  <div class="overflow-x-auto my-8">
    <table class="w-full text-left border-collapse">
      <thead class="bg-[#F7F7F5]">
        <tr class="text-base text-[#3D3935] uppercase font-normal pb-3">
          <th
            v-for="(col, idx) in columns"
            :key="idx"
            class="py-3 px-4 text-base text-[#3D3935] uppercase font-normal select-none"
            :class="isSortable(col.key) ? 'cursor-pointer' : ''"
            @click="handleSort(col.key)"
          >
            <div class="flex items-center gap-1">
              {{ col.label }}
              <template v-if="showArrow(col.key)">
                <ArrowUpIcon
                  v-if="sortKey === col.key && sortOrder === 'asc'"
                  class="w-3 h-3"
                />
                <ArrowDownIcon
                  v-else-if="sortKey === col.key && sortOrder === 'desc'"
                  class="w-3 h-3"
                />
                <ArrowUpIcon
                  v-else
                  class="w-3 h-3 opacity-30"
                />
              </template>
            </div>
          </th>
          <th v-if="$slots.actions" class="py-3 px-4"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in sortedRows"
          :key="rowIndex"
          :class="[rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#EAEAEA]', 'hover:bg-gray-100 transition']"
        >
          <td
            v-for="(col, colIndex) in columns"
            :key="`${rowIndex}-${colIndex}`"
            class="py-3 px-4 text-[#6F6259] text-base font-normal"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="py-3 px-4">
            <slot name="actions" :row="row" :rowIndex="rowIndex" />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="$slots.footer" class="mt-8 flex justify-start">
      <slot name="footer" />
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import ArrowUpIcon from "@/assets/icons/ArrowUpIcon";
import ArrowDownIcon from "@/assets/icons/ArrowDownIcon";

const props = defineProps({
  columns: Array,
  rows: Array,
  tableType: { type: String, default: '' }, // new prop
});

const sortKey = ref('');
const sortOrder = ref('asc');

const complaintSortableKeys = ['status', 'reported'];

const isSortable = (key) => {
  return props.tableType === 'complaint' && complaintSortableKeys.includes(key);
};

const showArrow = (key) => {
  return isSortable(key);
};

const handleSort = (key) => {
  if (!isSortable(key)) return;
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const sortedRows = computed(() => {
  if (!sortKey.value || !isSortable(sortKey.value)) return props.rows;
  return [...props.rows].sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    if (valA == null) return 1;
    if (valB == null) return -1;
    return sortOrder.value === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
});
</script>



<style scoped>
/* Optional reusable button class */
.btn-secondary {
  @apply border border-gray-400 rounded px-4 py-1 text-sm hover:bg-gray-300 transition;
}
</style>
