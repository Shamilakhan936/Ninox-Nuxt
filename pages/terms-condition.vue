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
       <condition-card/>
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