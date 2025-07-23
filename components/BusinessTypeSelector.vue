<template>
  <div class="relative border border-[#C9C7C5] rounded-2xl pt-6 pb-6 px-6">
    <p class="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-4 text-center font-light text-xs tracking-[1] uppercase text-[#3D3935] whitespace-normal md:whitespace-nowrap max-w-xs md:max-w-none">
      Which of the following best describes your line of business?
    </p>
    <div class="space-y-4 md:pt-0 pt-10">
      <label
        v-for="option in options"
        :key="option"
        class="flex items-center gap-3 cursor-pointer"
      >
        <input
          type="radio"
          :value="option"
          v-model="selected"
          class="form-radio text-[#8A7C59] focus:ring-[#8A7C59] border-[#8A7C59]"
        />
        <span class="text-base text-[#3D3935] font-normal">{{ option }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const options = [
  'Retailer',
  'Wholesaler',
  'End User',
  'Interior Designer',
  'Other'
]

const selected = ref(props.modelValue)

watch(selected, (val) => {
  emit('update:modelValue', val)
})
</script>
<style scoped>
.text-xs {
font-size: 12px !important;
line-height: 16px !important; 
letter-spacing: 1px !important;
}
</style>
