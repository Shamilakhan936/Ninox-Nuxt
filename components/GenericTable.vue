<template>
  <div class="overflow-x-auto mt-10">
    <table class="w-full text-left border-collapse">
      <thead class="bg-[#F7F7F5]">
        <tr class="text-base text-[#3D3935] uppercase font-normal pb-3">
          <th
            v-for="(col, idx) in columns"
            :key="idx"
            class="py-3 px-4 text-base text-[#3D3935] uppercase font-normal"
          >
            {{ col.label }}
          </th>
          <th v-if="$slots.actions" class="py-3 px-4"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="[
            rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#EAEAEA]',
            'hover:bg-gray-100 transition',
          ]"
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

    <div v-if="$slots.footer" class="mt-4 flex justify-start">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
/* Optional reusable button class */
.btn-secondary {
  @apply border border-gray-400 rounded px-4 py-1 text-sm hover:bg-gray-300 transition;
}
</style>
