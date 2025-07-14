<template>
  <button class="flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9C7C5] bg-white hover:bg-gray-100 transition" >
    <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5 text-[#6F6259]" />
     <a
          class="text-[#3D3935] font-light text-xs uppercase p-0 border-b border-[#8A7C59] hover:border-[#6F6259] cursor-pointer transition-all"
          @click="$emit('open-filters')"
        >
          All Filters
        </a>
  </button>
</template>

<script setup>
// Emits 'open-filters' when clicked
</script> 