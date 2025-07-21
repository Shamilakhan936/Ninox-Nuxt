<template>
  <div class="disclaimer-page  bg-white px-8">
    <!-- Hero Section -->
    <section class="hero-section flex items-center justify-center w-full h-[60vh] md:h-[80vh] bg-cover bg-center relative" :style="heroStyle">
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <h1 class="text-white text-4xl md:text-6xl font-bold drop-shadow-lg uppercase">Disclaimer</h1>
      </div>
    </section>
    <!-- Breadcrumb -->
    <div class=" mx-auto  py-6">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <!-- Heading -->
    <div class=" mx-auto  py-8">
      <h2 class="text-2xl font-black     mb-4 text-[#2D1713] uppercase">Disclaimer</h2>
      <p class="text-base text-[#6F6259] leading-8 ">
        On this page you will find the disclaimer of Crastino. In this disclaimer we inform you how to handle the information (in the broadest sense of the word) on our website <a href="#" class="text-blue-400">www.crastino.com</a>  and <a href="#" class="text-blue-400">www.my.crastino.com</a> and which reservations apply thereto.<br><br>
        The information on this website is subject to (intellectual property) rights of Crastino, including, but not limited to, copyright. It is also possible that this information contains personal data. It is not permitted to copy, distribute, process or otherwise use this information, in any way other than to consult it through and on the website, unless otherwise agreed in writing by Crastino.<br><br>
        Although the information on the website has been compiled with care, Crastino does not guarantee in any way that the information on the website is correct and/or complete and/or up-to-date, nor that it is free of any third-party rights. Crastino is in no way responsible for (the consequences of) the use of the information. No rights can be derived from the information.<br><br>
        References to third party websites are for information purposes only. Crastino in no way guarantees the accuracy and/or completeness and/or topicality of information mentioned by third parties, nor the consequences of its use.<br><br>
        Crastino reserves the right to change or remove the website and all its parts, as well as all information listed on it, at any time and without any prior notice.
      </p>
    </div>
  </div>
</template>
<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue';
import { computed } from 'vue';
const breadcrumbItems = [
  { label: 'Home', to: '/' },
  { label: 'Disclaimer' }
];
const heroImage = 'https://d2d1pua3mz4gez.cloudfront.net/__o/images/Large-web-Coulisse_Lounge_16.jpg';
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