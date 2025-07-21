<template>
    <div class="terms-page bg-white px-8">
        <!-- Hero Section -->
        <section class="hero-section flex items-center justify-s w-full h-[60vh] md:h-[80vh] bg-cover bg-center relative" :style="heroStyle">
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        <div class="relative z-10 flex flex-col items-start justify-end w-full h-full">
            <h1 class="text-white text-4xl md:text-6xl font-bold drop-shadow-lg uppercase p-10">Terms and Conditions</h1>
        </div>
        </section>
        <!-- Breadcrumb -->
        <div class=" mx-auto  py-6">
        <Breadcrumb :items="breadcrumbItems" />
        </div>
        <!-- Heading -->
        <div class=" mx-auto  py-8 ">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
           <div v-for="(card, idx) in cards" :key="idx" class="bg-white flex flex-col items-start text-start ">
  <img
    :src="card.image"
    alt="Card image"
    class="w-full h-80  rounded-lg mb-4"
  />
  <p class="text-sm text-[#6F6259] leading-6 mb-4">{{ card.text }}</p>
  <button class="mt-auto px-6 py-2 bg-[#8A7C59] text-white rounded-full font-semibold hover:bg-[#6F6259] transition">
    {{ card.buttonText }}
  </button>
</div>
        </div>
        </div>
    </div>
    </template>
    <script setup>
    import Breadcrumb from '@/components/Breadcrumb.vue';
    import { computed } from 'vue';
    const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Terms and Conditions' }
    ];
    const heroImage = 'https://d2d1pua3mz4gez.cloudfront.net/__o/images/Large-web-PF-HC25-Rioja-772-01-white-L.jpg';
    const heroStyle = computed(() => `background-image: url('${heroImage}');`);
    const cards = [
    {
        image: 'https://d2d1pua3mz4gez.cloudfront.net/images/Large-web-RF-Lara-0400-anthracite-L.jpg',
        text: 'Here you find the General Terms and Conditions, a set of rules that apply to all offers and agreements made by Crastino and its group companies. These terms ensure that both Crastino and our customers understand their rights and obligations.',
        buttonText: 'General terms and conditions'
    },
    {
        image: 'https://d2d1pua3mz4gez.cloudfront.net/images/Large-web-RF-Lara-0400-anthracite-L.jpg',
        text: 'Here you find the Terms and Conditions regarding Crastino content. These Terms and Conditions are applicable to all contractual relations between Crastino and another party to whom Crastino’s content, are provided, or by whom content is received in any way.',
        buttonText: 'Terms and Conditions regarding Crastino Content'
    },
    {
        image: 'https://d2d1pua3mz4gez.cloudfront.net/images/Large-web-RF-Lara-0400-anthracite-L.jpg',
        text: 'The Motionblinds End User License Agreement is a legal agreement between the user and Crastino regarding the use of the Motionblinds app. By installing and using the app, users agree to the terms outlined in the EULA.',
        buttonText: 'Motionblinds End User License Agreement (EULA)s    '
    },
    {
        image: 'https://d2d1pua3mz4gez.cloudfront.net/images/Large-web-RF-Lara-0400-anthracite-L.jpg',
        text: 'Here you will find our Warranty Leaflet, which is based on our General Terms and Conditions. This document provides you with an overview of everything around our warranties, such as the relevant warranty period, warranty conditions and information on how to file a claim under our warranty policy.',
        buttonText: 'Warranty Leaflet'
    }
    ];
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