<template>
  <div class="flex items-center w-full">
    <label class="text-base font-medium text-[#6F6259] w-[280px]">{{
      label
    }}</label>
    <input
      type="text"
      class="min-w-[310px] rounded-[66px] px-[35px] py-3 text-sm border border-[#C9C7C5] focus:outline-none focus:ring-1 focus:ring-[#8A7C59] h-[50px]"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>
