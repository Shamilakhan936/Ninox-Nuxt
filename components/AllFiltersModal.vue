<template>
  <div v-if="open" class="fixed inset-0 z-[99999]">
    <div class="fixed inset-0 bg-[#3D3935] bg-opacity-20" @click="emit('close')"></div>
    <div class="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-lg px-8 z-[99999]" style="transform: translateX(0);">
      <!-- Header -->
      <div class="flex justify-end gap-6 py-8">
        <button class="text-[#3D3935] font-light text-xs uppercase border-b border-[#8A7C59] hover:border-[#6F6259]" @click="resetFilters">
          Reset Filters
        </button>
        <button class="px-4 py-2 rounded-full text-sm font-normal uppercase bg-[#8A7C59] text-white font-semibold hover:bg-[#6F6259]" @click="applyFilters">
          Save
        </button>
      </div>

      <!-- Filter Dropdowns -->
      <div class="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#aaa] scrollbar-track-[#eee]" style="max-height: calc(100vh - 130px);">
        <div class="flex flex-col gap-[11px] mb-6">
          <CrastinoDropdown
            v-for="(options, key) in filters"
            :key="key"
            v-model="localValues[key]"
            :options="options"
            :placeholder="key.charAt(0).toUpperCase() + key.slice(1)"
            dropdownWidth="calc(36rem - 4.8rem)"
            height="50px"
            :open="openDropdown === key"
            @open="openDropdown = key"
            @close="openDropdown = null"
            topBoxClass="filterTopBoxClass"
            dropdownClass="filterDropdownMenu"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CrastinoDropdown from './CrastinoDropdown.vue'

const props = defineProps({
  open: Boolean,
  filters: Object,
  values: Object
})

const emit = defineEmits(['close', 'apply-filters'])
const openDropdown = ref(null)
const localValues = ref({})

watch(() => props.open, (val) => {
  if (val) {
    localValues.value = { ...props.values }
  }
})

function applyFilters() {
  emit('apply-filters', { ...localValues.value })
  emit('close')
}

function resetFilters() {
  const reset = {}
  Object.keys(props.filters).forEach(key => (reset[key] = ''))
  localValues.value = reset
  emit('apply-filters', reset)
  emit('close')
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #EDEBE7;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #C9C7C5;
  border-radius: 10px;
}
.bg-opacity-20 {
  background-color: rgba(61, 57, 53, 0.2) !important;
}
</style>