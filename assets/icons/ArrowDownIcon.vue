<template>
<svg :width="width" :height="height" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg" :class="customClass">
<path d="M4.66634 14.0317L4.66634 0.999985M4.66634 14.0317L8.33301 9.68782M4.66634 14.0317L0.999675 9.68782" :stroke="color" stroke-width="1.22222" stroke-linecap="round" stroke-linejoin="round"/>
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
    default: "#C9C7C5",
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>