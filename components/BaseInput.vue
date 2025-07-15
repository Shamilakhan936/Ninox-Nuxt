<template>
  <div class="flex items-center">
    <label class="text-base font-medium text-[#6F6259] pt-2 w-[280px]">{{
      label
    }}</label>
    <input
      ref="inputRef"
      :placeholder="placeholder"
      class="rounded-[66px] px-6 py-3 text-sm border border-[#C9C7C5] h-[50px] focus:outline-none focus:border-[#2d2d2d] focus:border-[1px] bg-white text-black"
      :style="{ width: inputWidth + 'px' }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);

const inputRef = ref(null);
const inputWidth = ref(100);

const measurePlaceholder = () => {
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.fontSize = "16px";
  span.style.padding = "0px";
  span.textContent = props.placeholder;
  document.body.appendChild(span);
  inputWidth.value = span.offsetWidth + 30;
  document.body.removeChild(span);
};

onMounted(measurePlaceholder);
watch(() => props.placeholder, measurePlaceholder);
</script>
