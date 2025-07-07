<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 26 26"
    fill="none"
    :class="customClass"
  >
    <circle
      cx="12.6818"
      cy="13"
      r="12.4176"
      stroke="#3D3935"
      stroke-width="0.528409"
    />
    <path
      d="M13.21 16.1704L16.3804 13L13.21 9.8295"
      stroke="#3D3935"
      stroke-width="0.739773"
    />
    <rect
      x="8.4541"
      y="12.6301"
      width="7.39773"
      height="0.739773"
      fill="#3D3935"
    />
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
