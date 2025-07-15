<template>
  <div class="flex items-center">
    <label class="text-base font-medium text-[#6F6259] w-[280px] pt-2">
      {{ label }}
    </label>
    <textarea
      ref="textareaRef"
      rows="1"
      class="rounded-[66px] px-6 py-3 text-sm border border-[#C9C7C5] h-[50px] resize-none focus:outline-none focus:border-[#2d2d2d] focus:border-[1px] bg-white text-black"
      :placeholder="placeholder"
      :style="{ width: inputWidth + 'px' }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const { label, placeholder, modelValue } = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
});

defineEmits(["update:modelValue"]);

const textareaRef = ref(null);
const inputWidth = ref(100);

const measurePlaceholder = () => {
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.fontSize = "16px";
  span.style.fontFamily = "inherit";
  span.style.padding = "0 18px";
  span.textContent = placeholder;
  document.body.appendChild(span);
  inputWidth.value = span.offsetWidth + 30;
  document.body.removeChild(span);
};

onMounted(measurePlaceholder);
watch(() => placeholder, measurePlaceholder);
</script>
