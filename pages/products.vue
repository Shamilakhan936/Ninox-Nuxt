<template>
  <div class="min-h-screen" style="background-color: #ffffff">
    <div class="container mx-auto py-8 pt-[90px] px-4 sm:px-6 lg:px-8">
      <Breadcrumb :items="['Crastino', 'Products', 'Curtains']" />
      <!-- Add your page content here -->
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import NextArrow from "~/assets/icons/NextArrow.vue";
</script>

<style scoped>
/* Import Albert Sans font */
@import url("https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap");

.min-h-screen {
  font-family: "Albert Sans", sans-serif;
}
</style>
