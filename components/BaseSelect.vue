<template>
  <div class="flex items-center relative">
    <label class="text-base font-medium text-[#6F6259] w-[280px]">{{ label }}</label>
    <div class="relative">
      <select
        class="min-w-[220px] appearance-none rounded-[66px] px-6 py-3 text-sm border border-[#C9C7C5] focus:outline-none focus:border-[#2d2d2d] focus:border-[1px] h-[50px] bg-white text-black" 
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" disabled value="" class="text-black"> {{ placeholder }}</option>
        <option  v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center">
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
  </div>
</template>

<script setup>
defineProps({
  label: String,
  options: Array,
  placeholder: String,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>
