<template>
<svg :width="width" :height="height" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg" :class="customClass">
<path d="M4.66667 1V14.0318M4.66667 1L1 5.34392M4.66667 1L8.33333 5.34392" :stroke="color" stroke-width="1.22222" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

</template>
<script setup>
defineProps({
  height: {
    type: [String, Number],
    default: 15,
  },
   width: {
    type: [String, Number],
    default: 9,
  },
   color: {
    type: String,
    default: "#6F6259",
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>