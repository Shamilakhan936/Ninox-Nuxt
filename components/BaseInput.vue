<template>
  <div :class="vertical ? 'flex flex-col' : 'flex items-center gap-6'">
    <label
      v-if="label"
      :for="id"
      :class="[
        'text-base text-[#6F6259]',
        vertical ? 'mb-2' : 'w-[200px] shrink-0',
        labelClass
      ]"
    >
      {{ label }}
    </label>
    <input
      ref="inputRef"
      :id="id"
      :placeholder="placeholder"
      class="rounded-[66px] px-6 py-3 text-sm border border-[#C9C7C5] h-[50px] focus:outline-none focus:border-[#2d2d2d] bg-white text-black"
      :style="!vertical ? { width: inputWidth + 'px' } : {}"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: String,
  vertical: { type: Boolean, default: false },
  labelClass: { type: String, default: '' }
})

const inputRef = ref(null)
const inputWidth = ref(100)

// Dynamically adjust input width based on placeholder
const measurePlaceholder = () => {
  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.fontSize = '16px'
  span.style.fontFamily = 'inherit'
  span.style.whiteSpace = 'pre'
  span.textContent = props.placeholder || ''
  document.body.appendChild(span)
  inputWidth.value = span.offsetWidth + 60 // padding buffer
  document.body.removeChild(span)
}

onMounted(measurePlaceholder)
watch(() => props.placeholder, measurePlaceholder)
</script>
