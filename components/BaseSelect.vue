<template>
  <div class="flex items-center relative">
    <label class="text-base font-medium text-[#6F6259] w-[280px]">{{
      label
    }}</label>

    <div class="relative">
      <select
        class="min-w-[310px] appearance-none rounded-[66px] px-[35px] py-3 text-sm border border-[#C9C7C5] focus:outline-none focus:ring-1 focus:ring-[#8A7C59] h-[50px]"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <div
        class="pointer-events-none absolute inset-y-0 right-4 flex items-center"
      >
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
