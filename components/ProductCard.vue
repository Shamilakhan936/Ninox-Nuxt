<template>
  <div class="  bg-white flex flex-col mb-2">
    <img :src="image" alt="Product Image" class=" mb-2 w-full md:h-[326px]" />
    <h4 class="text-base font-normal text-black mb-3 text-start">{{ name }}</h4>
    <p class="text-xs font-light text-[#6F6259] text-start">{{ price }}</p>
  </div>
</template>

<script setup>
defineProps({
  image: String,
  name: String,
  price: [String, Number],
});
</script> 
<style scoped>
.text-xs {
  font-size: 12px !important;
  line-height: 16px !important;
  font-weight: 300 !important;
  font-family: "Albert Sans", sans-serif !important;
}
.text-base {
  font-size: 16px !important;
  line-height: 24px !important;
  font-weight: 400 !important;
  font-family: "Albert Sans", sans-serif !important;
}
</style>