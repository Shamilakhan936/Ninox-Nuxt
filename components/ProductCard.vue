<template>
  <div class="  bg-white flex flex-col ">
    <img :src="image" alt="Product Image" class="  rounded-lg mb-4 w-full md:h-[326px]" />
    <div class="text-base font-normal text-black mb-2 text-start">{{ name }}</div>
    <div class="text-xs font-light text-[#6F6259] text-start">{{ price }}</div>
  </div>
</template>

<script setup>
defineProps({
  image: String,
  name: String,
  price: [String, Number],
});
</script> 