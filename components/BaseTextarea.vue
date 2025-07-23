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
    <textarea
      ref="textareaRef"
      rows="1"
      :id="id"
      class="rounded-full px-6 py-3 text-sm border border-[#C9C7C5] h-[50px] resize-none focus:outline-none focus:border-[#2d2d2d] bg-white text-black"
      :placeholder="placeholder"
      :style="!vertical ? { width: inputWidth + 'px' } : {}"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"

const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: String,
  vertical: { type: Boolean, default: false },
  labelClass: { type: String, default: '' }
})

const emit = defineEmits(["update:modelValue"])

const textareaRef = ref(null)
const inputWidth = ref(100)

const measurePlaceholder = () => {
  const span = document.createElement("span")
  span.style.visibility = "hidden"
  span.style.fontSize = "16px"
  span.style.fontFamily = "inherit"
  span.style.padding = "0"
  span.style.whiteSpace = "pre"
  span.textContent = props.placeholder || ''
  document.body.appendChild(span)
  inputWidth.value = span.offsetWidth + 60 // padding + buffer
  document.body.removeChild(span)
}

onMounted(measurePlaceholder)
watch(() => props.placeholder, measurePlaceholder)
</script>
