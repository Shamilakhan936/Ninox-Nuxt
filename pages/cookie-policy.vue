<template>
  <div class="cookie-policy-page bg-white px-8">
     <div class=" mx-auto  py-6">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
   <PolicyContent/>
  </div>
</template>
<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue';
const breadcrumbItems = [
  { label: 'Home', to: '/' },
  { label: 'Cookie Policy' }
];
</script>