<template>
    <svg   :width="size"
    :height="size" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"     :class="customClass">
        <path d="M2 10L6 6L2 2" stroke="#3D3935" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="round"/>
    </svg>

</template>

<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 26,
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>