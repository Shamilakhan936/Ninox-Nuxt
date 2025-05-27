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
      <template v-if="isLoggedIn">
        <CrastinoDropdown
          :model-value="truncatedUserName"
          :options="userMenuOptions"
          :placeholder="truncatedUserName"
          min-width="auto"
          @update:model-value="handleUserMenuSelection"
          class="navbar-dropdown"
        />
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
import CrastinoDropdown from './CrastinoDropdown.vue';

// Cart count - you can replace this with actual cart state
const cartCount = ref(0);

// Get Kinde client for authentication
const kindeClient = useKindeClient();

// Create a safe way to access auth
const auth = computed(() => {
  try {
    const nuxtApp = useNuxtApp();
    return nuxtApp.$auth || null;
  } catch (e) {
    console.error("Error accessing auth:", e);
    return null;
  }
});

// Create a computed property for auth state
const isLoggedIn = computed(() => {
  return !!auth.value?.loggedIn;
});

// Create a computed property for user
const user = computed(() => {
  return auth.value?.user || {};
});

// User menu options for the dropdown
const userMenuOptions = computed(() => [
  'Profile',
  'Table Orders',
  'Sign Out'
]);

// Truncate user name if too long
const truncatedUserName = computed(() => {
  const userName = user.value?.given_name || 'Account';
  if (userName.length > 8) {
    return userName.substring(0, 8) + '...';
  }
  return userName;
});

// Handle user menu selection
function handleUserMenuSelection(selectedOption) {
  switch (selectedOption) {
    case 'Profile':
      navigateTo('/account');
      break;
    case 'Table Orders':
      navigateTo('/table-orders');
      break;
    case 'Sign Out':
      // Use Kinde logout
      window.location.href = '/api/logout';
      break;
  }
}
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
  width: 150px; /* Increased from 120px to better match "Customer Service" text length */
}

.auth-container {
  top: 44px; /* Aligned with other nav items */
  left: calc(50% + 445.01px);
  width: fit-content; /* Dynamic width based on content */
  max-width: 75px; /* Maximum width to prevent overlap */
  min-width: 50px; /* Minimum width for "Login" */
  z-index: 50;
  height: 22px; /* Same height as other containers for consistent underline thickness */
}

.cart-container {
  top: 49px; /* Aligned with other nav items */
  left: calc(50% + 520.01px);
  width: 65px; /* Reduced from 90px to better match "Cart (0)" text */
}

/* Hover Underline */
.hover-underline {
  position: absolute;
  height: 9.09%;
  width: 90%; /* Reduced from 100% to better match text content */
  top: 90.91%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  border-radius: 4px;
  background-color: #8a7c59;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: all 0.3s ease;
}

/* Special underline for auth container - more precise width */
.auth-underline {
  width: 105%; /* Increased from 85% to better match client name text */
  top: 90.91%;
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

/* Navbar dropdown styling - minimal overrides */
.navbar-dropdown {
  position: absolute;
  width: 100%;
  top: 0%;
  left: 0%;
}

/* Light styling to integrate dropdown with navbar */
.navbar-dropdown :deep(.top-box) {
  background: transparent !important;
  border: none !important;
  height: 22px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 12px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  font-weight: 300 !important;
  color: #3d3935 !important;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  width: fit-content !important;
  max-width: 75px !important;
}

.navbar-dropdown :deep(.top-box:hover) {
  color: #8A7C59 !important;
}

.navbar-dropdown :deep(.dropdown-arrow) {
  width: 6px !important;
  height: 3px !important;
  color: #6B6B6B !important;
  margin-left: 4px !important;
  flex-shrink: 0 !important;
}

.navbar-dropdown :deep(.selected-text) {
  color: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  font-weight: inherit !important;
  text-transform: inherit !important;
  letter-spacing: inherit !important;
  text-shadow: inherit !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  max-width: 60px !important; /* Leave space for arrow */
}

/* Hover Effects */
.nav-item-container:hover .hover-underline {
  opacity: 1;
  transform: scaleX(1);
}

.nav-item-container:hover .nav-link {
  color: #8A7C59;
}

/* Trigger hover effect for auth container when dropdown is hovered */
.auth-container:hover .auth-underline {
  opacity: 1;
  transform: scaleX(1);
}

.auth-container:hover .navbar-dropdown :deep(.top-box) {
  color: #8A7C59 !important;
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
