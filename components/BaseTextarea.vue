<template>
  <div class="flex items-start md:space-x-20 w-[50%]">
    <label class="text-base font-medium text-[#6F6259] w-48 pt-2">{{ label }}</label>
    <textarea
      rows="1"
      class="flex-1 resize-none rounded-full px-8 py-3  text-sm border border-[#C9C7C5] focus:outline-none focus:ring-1 focus:ring-[#8A7C59]"
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
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>
