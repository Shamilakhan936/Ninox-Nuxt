<template>
  <div class="menu">
    <!-- Background -->
    <div class="bg" />
    
    <!-- Desktop Navigation -->
    <div class="desktop-nav">
      <!-- Navigation Items with hover underlines -->
      <div class="nav-item-container products-container">
        <div class="hover-underline"></div>
        <NuxtLink to="/products/curtains" class="nav-link products">Products</NuxtLink>
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
    </div>
    
    <!-- Mobile Navigation Toggle -->
    <div class="mobile-nav">
      <button @click="toggleMobileMenu" class="mobile-menu-toggle">
        <div class="hamburger-line" :class="{ 'active': isMobileMenuOpen }"></div>
        <div class="hamburger-line" :class="{ 'active': isMobileMenuOpen }"></div>
        <div class="hamburger-line" :class="{ 'active': isMobileMenuOpen }"></div>
      </button>
      
      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu-overlay" :class="{ 'active': isMobileMenuOpen }" @click="closeMobileMenu"></div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="mobile-menu-items">
          <NuxtLink to="/products/curtains" class="mobile-nav-link" @click="closeMobileMenu">Products</NuxtLink>
          <NuxtLink to="/cases" class="mobile-nav-link" @click="closeMobileMenu">Cases</NuxtLink>
          <NuxtLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">About</NuxtLink>
          <NuxtLink to="/customer-service" class="mobile-nav-link" @click="closeMobileMenu">Customer Service</NuxtLink>
          
          <div class="mobile-auth-section">
            <template v-if="isLoggedIn">
              <div class="mobile-user-menu">
                <span class="mobile-user-name">{{ user.given_name || 'Account' }}</span>
                <NuxtLink to="/account" class="mobile-nav-link" @click="closeMobileMenu">Profile</NuxtLink>
                <NuxtLink to="/table-orders" class="mobile-nav-link" @click="closeMobileMenu">Table Orders</NuxtLink>
                <button @click="handleSignOut" class="mobile-nav-button">Sign Out</button>
              </div>
            </template>
            <template v-else>
              <a href="/api/login" class="mobile-nav-link">Login</a>
            </template>
          </div>
          
          <NuxtLink to="/cart" class="mobile-nav-link" @click="closeMobileMenu">Cart ({{ cartCount }})</NuxtLink>
          
          <div class="mobile-language">
            <span class="mobile-language-label">Language:</span>
            <span class="mobile-lang-option active">En</span>
            <span class="mobile-lang-option">ISL</span>
          </div>
        </div>
      </div>
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
import { ref, computed, onMounted } from 'vue';
import CrastinoDropdown from './CrastinoDropdown.vue';

// Cart count - you can replace this with actual cart state
const cartCount = ref(0);

// Mobile menu state
const isMobileMenuOpen = ref(false);

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

// Mobile menu functions
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function handleSignOut() {
  closeMobileMenu();
  window.location.href = '/api/logout';
}

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

// Add this function to handle user creation
async function ensureUserInDatabase(user) {
  if (!user || !user.email) return;
  
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: {
        username: user.given_name || user.preferred_username || user.email.split('@')[0],
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error creating user in database:', error);
  }
}

// Call this when component mounts and user is logged in
onMounted(() => {
  if (isLoggedIn.value && user.value) {
    ensureUserInDatabase(user.value);
  }
});
</script>

<style scoped>
/* Import Albert Sans and Quicksand fonts */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

/* Desktop Navigation - Show by default */
.desktop-nav {
  display: block;
}

/* Mobile Navigation - Hidden by default */
.mobile-nav {
  display: none;
}

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
  width: 150px;
}

.auth-container {
  top: 49px;
  left: calc(50% + 445.01px);
  width: fit-content;
  max-width: 75px;
  min-width: 50px;
  z-index: 50;
  height: 22px;
}

.cart-container {
  top: 49px;
  left: calc(50% + 520.01px);
  width: 65px;
}

/* Hover Underline */
.hover-underline {
  position: absolute;
  height: 9.09%;
  width: 90%;
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

.auth-underline {
  width: 105%;
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
  white-space: nowrap;
}

/* Navbar dropdown styling */
.navbar-dropdown {
  position: absolute;
  width: 100%;
  top: -5px;
  left: 0%;
}

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
  max-width: 60px !important;
}

/* Hover Effects */
.nav-item-container:hover .hover-underline {
  opacity: 1;
  transform: scaleX(1);
}

.nav-item-container:hover .nav-link {
  color: #8A7C59;
}

.auth-container:hover .auth-underline {
  opacity: 1;
  transform: scaleX(1);
}

.auth-container:hover .navbar-dropdown :deep(.top-box) {
  color: #8A7C59 !important;
}

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
  left: 0;
  background-color: #f7f7f5;
  width: 100%;
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
  left: 0;
  border-top: 1px solid #bfb7b0;
  box-sizing: border-box;
  width: 100%;
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
  max-width: 100vw;
  overflow: visible;
  z-index: 100;
}

/* Mobile Navigation Styles - Complete isolation and simplification */
.mobile-nav {
  display: none;
}

.mobile-menu-toggle {
  position: absolute;
  top: 40px;
  right: 20px;
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1001;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background-color: #3d3935;
  margin: 2px 0;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: #f7f7f5;
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-items {
  padding: 140px 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Completely reset mobile menu styling - AGGRESSIVE overrides */
.mobile-nav-link {
  font-family: 'Albert Sans', sans-serif !important;
  font-size: 16px !important;
  font-weight: 300 !important;
  color: #3d3935 !important;
  text-decoration: none !important;
  text-decoration-line: none !important;
  text-decoration-style: none !important;
  text-decoration-color: transparent !important;
  text-underline-offset: 0 !important;
  text-decoration-thickness: 0 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  padding: 15px 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  border-bottom: 1px solid #d0d0d0 !important;
  transition: color 0.3s ease !important;
  display: block !important;
  background: none !important;
  background-color: transparent !important;
  outline: none !important;
  position: relative !important;
  box-shadow: none !important;
  text-shadow: none !important;
  line-height: 1.2 !important;
}

.mobile-nav-link:hover,
.mobile-nav-link:focus,
.mobile-nav-link:active,
.mobile-nav-link:visited {
  color: #8A7C59 !important;
  text-decoration: none !important;
  text-decoration-line: none !important;
  text-decoration-style: none !important;
  text-decoration-color: transparent !important;
  text-underline-offset: 0 !important;
  text-decoration-thickness: 0 !important;
  border-bottom: 1px solid #d0d0d0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: none !important;
}

.mobile-nav-button {
  font-family: 'Albert Sans', sans-serif !important;
  font-size: 16px !important;
  font-weight: 300 !important;
  color: #3d3935 !important;
  text-decoration: none !important;
  text-decoration-line: none !important;
  text-decoration-style: none !important;
  text-decoration-color: transparent !important;
  text-underline-offset: 0 !important;
  text-decoration-thickness: 0 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  padding: 15px 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  border-bottom: 1px solid #d0d0d0 !important;
  background: none !important;
  background-color: transparent !important;
  cursor: pointer !important;
  text-align: left !important;
  transition: color 0.3s ease !important;
  display: block !important;
  width: 100% !important;
  outline: none !important;
  position: relative !important;
  box-shadow: none !important;
  text-shadow: none !important;
  line-height: 1.2 !important;
}

.mobile-nav-button:hover,
.mobile-nav-button:focus,
.mobile-nav-button:active {
  color: #8A7C59 !important;
  text-decoration: none !important;
  text-decoration-line: none !important;
  text-decoration-style: none !important;
  text-decoration-color: transparent !important;
  text-underline-offset: 0 !important;
  text-decoration-thickness: 0 !important;
  border-bottom: 1px solid #d0d0d0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: none !important;
}

.mobile-auth-section {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 20px 0;
  border-top: none !important;
  border-bottom: none !important;
  margin: 10px 0;
  background: none;
}

.mobile-user-menu {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.mobile-user-name {
  font-family: 'Albert Sans', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #3d3935;
  text-transform: capitalize;
  padding: 10px 0;
}

.mobile-language {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0 10px 0;
  border-top: none !important;
  margin-top: 10px;
}

.mobile-language-label {
  font-family: 'Albert Sans', sans-serif;
  font-size: 14px;
  color: #3d3935;
  font-weight: 400;
}

.mobile-lang-option {
  font-family: 'Albert Sans', sans-serif;
  font-size: 14px;
  color: #898989;
  cursor: pointer;
  transition: color 0.3s ease;
}

.mobile-lang-option.active {
  color: #3d3935;
  font-weight: 500;
}

.mobile-lang-option:hover {
  color: #8A7C59;
}

/* Critical: Prevent desktop hover underlines from affecting mobile menu */
.mobile-menu .hover-underline {
  display: none !important;
}

.mobile-menu * {
  position: relative;
  text-decoration: none !important;
}

.mobile-menu *::before,
.mobile-menu *::after {
  display: none !important;
  content: none !important;
}

/* Completely isolate mobile menu from any desktop nav styling */
.mobile-menu .nav-item-container,
.mobile-menu .products-container,
.mobile-menu .cases-container,
.mobile-menu .about-container,
.mobile-menu .customer-service-container,
.mobile-menu .auth-container,
.mobile-menu .cart-container,
.mobile-menu .hover-underline {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Override any global styling that might interfere */
.mobile-menu a,
.mobile-menu button {
  box-shadow: none !important;
  text-shadow: none !important;
  background-image: none !important;
  transform: none !important;
  text-decoration: none !important;
}

.mobile-menu a:focus,
.mobile-menu a:active,
.mobile-menu a:visited,
.mobile-menu a:hover,
.mobile-menu button:focus,
.mobile-menu button:active,
.mobile-menu button:hover {
  outline: none !important;
  box-shadow: none !important;
  background: none !important;
  text-decoration: none !important;
}

/* NUCLEAR option - Override everything in mobile menu */
.mobile-menu,
.mobile-menu *,
.mobile-menu *:before,
.mobile-menu *:after {
  text-decoration: none !important;
  text-decoration-line: none !important;
  text-decoration-style: none !important;
  text-decoration-color: transparent !important;
  text-underline-offset: 0 !important;
  text-decoration-thickness: 0 !important;
  box-shadow: none !important;
  text-shadow: none !important;
  background-image: none !important;
  border-image: none !important;
}

.mobile-menu *:before,
.mobile-menu *:after {
  display: none !important;
  content: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Target specific problematic elements if they exist */
.mobile-menu a[href*="customer-service"],
.mobile-menu a[href*="login"],
.mobile-menu a[href*="cart"] {
  text-decoration: none !important;
  text-decoration-line: none !important;
  border-bottom: 1px solid #d0d0d0 !important;
  box-shadow: none !important;
  text-shadow: none !important;
}

/* Also override any NuxtLink specific styling */
.mobile-menu .nuxt-link-exact-active,
.mobile-menu .nuxt-link-active,
.mobile-menu .router-link-exact-active,
.mobile-menu .router-link-active {
  text-decoration: none !important;
  text-decoration-line: none !important;
  border-bottom: 1px solid #d0d0d0 !important;
}

/* Responsive adjustments */
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

/* Mobile breakpoint */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-nav {
    display: block;
  }
  
  /* Critical: Hide any hover-underline elements that might leak into mobile */
  .hover-underline {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }
  
  .crastino-logo {
    left: 20px;
    transform: none;
    width: 160px;
    height: 33px;
    top: 43px;
  }
}

@media (max-width: 480px) {
  .mobile-menu {
    width: 280px;
    right: -280px;
  }
  
  .crastino-logo {
    width: 140px;
    height: 29px;
    top: 45px;
  }
}
</style>
