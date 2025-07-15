<template>
  <div class="relative">
    <select
      class="w-full appearance-none rounded-[66px] py-3 px-6 text-sm border border-[#C9C7C5] focus:outline-none focus:border-[#2d2d2d] focus:border-[1px] h-[50px] bg-white text-black"
      v-model="internalValue"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.value === ''"
      >
        {{ option.label }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center h-full pr-4 -translate-x-1/2">
      <svg
        class="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: Array,
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
<style scoped>
.text-sm {
  font-size: 16px !important;
  line-height: 26px !important;
}
</style>
