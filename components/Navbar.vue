<template>
  <div class="menu">
    <!-- Background -->
    <div class="bg" />
    
    <!-- Navigation Items with hover underlines -->
    <div class="nav-item-container products-container">
      <div class="hover-underline"></div>
      <NuxtLink to="/products" class="nav-link products">Products</NuxtLink>
    </div>
    
    <div class="nav-item-container cases-container">
      <div class="hover-underline"></div>
      <NuxtLink to="/cases" class="nav-link cases">Cases</NuxtLink>
    </div>
    
    <div class="nav-item-container about-container">
      <div class="hover-underline"></div>
      <NuxtLink to="/about" class="nav-link about">About</NuxtLink>
    </div>
    
    <div class="nav-item-container customer-service-container">
      <div class="hover-underline"></div>
      <NuxtLink to="/customer-service" class="nav-link customer-service">Customer Service</NuxtLink>
    </div>
    
    <!-- Auth Section with hover underline -->
    <div class="nav-item-container auth-container">
      <div class="hover-underline auth-underline"></div>
      <template v-if="$auth.loggedIn">
        <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
          <span class="nav-link login cursor-pointer">{{ $auth.user.given_name || 'Account' }}</span>
        </UDropdown>
      </template>
      <template v-else>
        <LoginLink to="/api/login" external class="nav-link login">Login</LoginLink>
      </template>
    </div>
    
    <!-- Cart with hover underline -->
    <div class="nav-item-container cart-container">
      <div class="hover-underline"></div>
      <NuxtLink to="/cart" class="nav-link cart">Cart ({{ cartCount }})</NuxtLink>
    </div>
    
    <!-- Language Selection -->
    <div class="language-selection">
      <div class="language">Language</div>
      <div class="en">En</div>
      <div class="isl">ISL</div>
    </div>
    
    <!-- Logo -->
    <NuxtLink to="/">
      <img class="crastino-logo" alt="Crastino Logo" src="/Crastino_logo.svg" />
    </NuxtLink>
    
    <!-- Bottom Border -->
    <div class="menu-border" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Cart count - you can replace this with actual cart state
const cartCount = ref(0);

const userMenuItems = computed(() => [
  [
    {
      label: 'My Account',
      icon: 'i-heroicons-user-circle',
      to: '/account'
    },
    {
      label: 'My Orders',
      icon: 'i-heroicons-shopping-cart',
      to: '/orders'
    },
    {
      label: 'Table Orders',
      icon: 'i-heroicons-table-cells',
      to: '/table-orders'
    }
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      to: '/api/logout',
      external: true
    }
  ]
]);
</script>

<style scoped>
/* Import Albert Sans and Quicksand fonts */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

/* Navigation Item Container Styles */
.nav-item-container {
  position: absolute;
  height: 22px;
  text-align: left;
  font-size: 12px;
  color: #3d3935;
  font-family: 'Albert Sans', sans-serif;
}

.products-container {
  top: 49px;
  left: calc(50% - 577.99px);
  width: 80px;
}

.cases-container {
  top: 49px;
  left: calc(50% - 477.99px);
  width: 50px;
}

.about-container {
  top: 49px;
  left: calc(50% - 398.99px);
  width: 50px;
}

.customer-service-container {
  top: 49px;
  left: calc(50% + 280.01px);
  width: 160px; /* Increased width to prevent text wrapping */
}

.auth-container {
  top: 36px; /* Aligned with other nav items */
  left: calc(50% + 445.01px);
  width: 70px; /* Added width for proper underline sizing */
  z-index: 50;
  height: 22px; /* Same height as other containers for consistent underline thickness */
}

.cart-container {
  top: 49px; /* Aligned with other nav items */
  left: calc(50% + 520.01px);
  width: 90px; /* Width to accommodate "CART (0)" */
}

/* Hover Underline */
.hover-underline {
  position: absolute;
  height: 9.09%;
  width: 91.1%;
  top: 90.91%;
  right: 8.9%;
  bottom: 0%;
  left: 0%;
  border-radius: 4px;
  background-color: #8a7c59;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: all 0.3s ease;
}

/* Special positioning for auth container underline */
.auth-underline {
  top: 150%; /* Adjusted positioning to place underline below the text with same container height */
}

/* Navigation Link Styles */
.nav-link {
  position: absolute;
  width: 100%;
  top: 0%;
  left: 0%;
  letter-spacing: 0.1em;
  line-height: 12px;
  text-transform: uppercase;
  font-weight: 300;
  display: flex;
  align-items: center;
  color: #3d3935;
  text-decoration: none;
  transition: color 0.3s ease;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  white-space: nowrap; /* Prevent text wrapping */
}

/* Hover Effects */
.nav-item-container:hover .hover-underline {
  opacity: 1;
  transform: scaleX(1);
}

.nav-item-container:hover .nav-link {
  color: #8A7C59;
}

/* Specific styling for login link to maintain existing behavior */
.login {
  line-height: 12px;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #3d3935;
  text-decoration: none;
  font-family: 'Albert Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Cart specific styling to match other nav elements */
.cart {
  line-height: 12px;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #3d3935;
  text-decoration: none;
  font-family: 'Albert Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.bg {
  position: absolute;
  top: 0px;
  left: calc(50% - 719.99px);
  background-color: #f7f7f5;
  width: 1440px;
  height: 120px;
}

.language {
  position: absolute;
  top: 0px;
  left: 14px;
  line-height: 14px;
  font-family: 'Albert Sans', sans-serif;
  color: #000;
}

.en {
  position: absolute;
  top: 0px;
  left: 79px;
  line-height: 14px;
  font-family: 'Albert Sans', sans-serif;
  color: #000;
  cursor: pointer;
}

.en:hover {
  color: #8A7C59;
}

.isl {
  position: absolute;
  top: 0px;
  left: 101px;
  line-height: 14px;
  color: #898989;
  font-family: 'Albert Sans', sans-serif;
  cursor: pointer;
}

.isl:hover {
  color: #8A7C59;
}

.language-selection {
  position: absolute;
  top: 12px;
  left: calc(50% + 579.01px);
  width: 132px;
  height: 14px;
  font-size: 12px;
}

.menu-border {
  position: absolute;
  top: 117.79px;
  left: calc(50% - 720.5px);
  border-top: 1px solid #bfb7b0;
  box-sizing: border-box;
  width: 1441px;
  height: 1px;
}

.crastino-logo {
  position: absolute;
  top: 38px;
  left: calc(50% - 106.99px);
  width: 214px;
  height: 44px;
  overflow: hidden;
}

.menu {
  width: 100%;
  position: relative;
  height: 120px;
  text-align: left;
  font-size: 16px;
  color: #000;
  font-family: 'Albert Sans', sans-serif;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 1400px) {
  .bg {
    width: 100vw;
    left: 0;
  }
  
  .menu-border {
    width: 100vw;
    left: 0;
  }
}
</style>
