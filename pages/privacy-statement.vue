<template>
  <div class="privacy-statement-page bg-white px-8">
   <section class="hero-section flex items-center justify-s w-full h-[60vh] md:h-[80vh] bg-cover bg-center relative" :style="heroStyle">
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        <div class="relative z-10 flex flex-col items-start justify-end w-full h-full">
            <h1 class="text-white text-4xl md:text-6xl font-bold drop-shadow-lg uppercase p-10">Privacy statement</h1>
        </div>
        </section>
    <!-- Breadcrumb -->
    <div class=" mx-auto py-6">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <!-- Language Switcher -->
    <div class=" mx-auto mb-6 flex gap-2">
      <span class=" py-1  text-[#2D1713] p-0 m-0 font-normal cursor-pointer"><a href="#" class="underline">ENG</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0  font-normal cursor-pointer"><a href="#" class="underline">NL</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0  font-normal cursor-pointer"><a href="#" class="underline">DE</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0 font-normal cursor-pointer"><a href="#" class="underline">ES</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0 font-normal cursor-pointer"><a href="#" class="underline">PL</a></span>
    </div>
    <!-- Content -->
   <privacy-content/>
  </div>
</template>
<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue';
import { computed } from 'vue';
const breadcrumbItems = [
  { label: 'Home', to: '/' },
  { label: 'Privacy Statement' }
];
const heroImage = 'https://d2d1pua3mz4gez.cloudfront.net/__o/images/Large-web-Jasper-Abels-7313.jpg';
const heroStyle = computed(() => `background-image: url('${heroImage}');`);
</script>
<style scoped>
.hero-section {
  min-height: 60vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>