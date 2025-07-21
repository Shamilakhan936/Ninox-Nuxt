<template>
  <footer class="footer-container bg-[#3d3935]">
    <!-- Footer Background -->
    <div class="footer-background" />
    
    <!-- Copyright and Company Info -->
    <div class="company-info">
      <div class="copyright-section">
        <!-- Copyright symbol using Unicode -->
        <span class="copyright-symbol">©</span>
        <span class="company-text ">2025, CRASTINO</span>
      </div>
      <div class="flex items-center justify-center gap-2 mt-4">
      <NuxtLink to="/cookie-policy" class="text-white hover:underline text-sm">Cookie Policy</NuxtLink><span class="text-white"> | </span>
      <NuxtLink to="/disclaimer" class="text-white hover:underline text-sm">Disclaimer</NuxtLink><span class="text-white"> | </span>
      <NuxtLink to="/terms-condition" class="text-white hover:underline text-sm">Terms and conditions</NuxtLink><span class="text-white"> | </span>
      <NuxtLink to="/privacy-statement" class="text-white hover:underline text-sm">Privacy Statement</NuxtLink>
    </div>
    </div>
    
    <!-- Address with Location Pin -->
    <div class="address-section">
      <div class="location-icon">
        <img src="/location-pin.svg" alt="Location Pin" />
      </div>
      <div class="address-text">Søborg Hovedgade 3, 2870 Dyssegård, Denmark</div>
    </div>
    
  </footer>
</template>

<script setup>
// No props needed for now, but can be added later if needed
</script>

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

.footer-container {
  position: relative;
  width: 100%;
  height: 102px;
  font-family: 'Albert Sans', sans-serif;
}

.footer-background {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #3d3935;
  /* height: 82px;   */
}

.company-info {
  position: absolute;
  top: 28px;
  left: 84px;
  height: 26px;
  font-size: 18px;
  z-index: 1;
}

.copyright-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copyright-symbol {
  color: #fff;
  font-size: 18px;
  font-weight: 300;
  line-height: 26px;
}

.company-text {
  color: #fff;
  font-size: 18px;
  font-weight: 300;
  line-height: 26px;
}

.address-section {
  position: absolute;
  top: 34px;
  right: 84px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.location-icon {
  color: #fff;
  font-size: 14px;
  line-height: 14px;
}

.address-text {
  letter-spacing: 0.2em;
  line-height: 14px;
  text-transform: uppercase;
  font-weight: 300;
  color: #fff;
  font-size: 12px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .address-section {
    right: 40px;
  }
  
  .address-text {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .footer-container {
    height: 100px;
  }
  
  .footer-background {
    height: 100px;
  }
  
  .company-info {
    top: 20px;
    left: 20px;
  }
  
  .address-section {
    top: 55px;
    left: 20px;
    right: auto;
  }
  
  .address-text {
    font-size: 10px;
    max-width: calc(100% - 40px);
  }
}

@media (max-width: 480px) {
  .company-info {
    font-size: 16px;
  }
  
  .copyright-symbol,
  .company-text {
    font-size: 16px;
  }
}
</style>