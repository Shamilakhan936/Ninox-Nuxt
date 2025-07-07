<template>
  <div class="flex flex-col">
    <!-- Top Navigation -->

    <Navbar />

    <!-- Page Content -->
    <!-- <div class="flex-grow"> -->
    <slot />
    <!-- </div> -->

    <!-- Footer -->
    <footer>
      <Footer />
    </footer>
  </div>
</template>
<script setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
</script>
