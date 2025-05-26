<template>
  <div class="menu">
    <!-- Background -->
    <div class="bg" />
    
    <!-- Navigation Items -->
    <NuxtLink to="/products" class="products">Products</NuxtLink>
    <NuxtLink to="/cases" class="cases">Cases</NuxtLink>
    <NuxtLink to="/about" class="about">About</NuxtLink>
    <NuxtLink to="/customer-service" class="customer-service">Customer Service</NuxtLink>
    
    <!-- Auth Section - Fixed positioning to be next to cart -->
    <div class="auth-container">
      <template v-if="$auth.loggedIn">
        <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
          <span class="login cursor-pointer">{{ $auth.user.given_name || 'Account' }}</span>
        </UDropdown>
      </template>
      <template v-else>
        <LoginLink to="/api/login" external class="login">Login</LoginLink>
      </template>
    </div>
    
    <!-- Cart -->
    <NuxtLink to="/cart" class="cart">Cart ({{ cartCount }})</NuxtLink>
    
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

.cart {
  position: absolute;
  top: 55px;
  left: calc(50% + 520.01px);
  line-height: 14px;
  font-family: 'Albert Sans', sans-serif;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #000;
  text-decoration: none;
}

.cart:hover {
  color: #8A7C59;
}

.bg {
  position: absolute;
  top: 0px;
  left: calc(50% - 719.99px);
  background-color: #f7f7f5;
  width: 1440px;
  height: 120px;
}

/* Fixed auth container positioning */
.auth-container {
  position: absolute;
  top: 49px;
  left: calc(50% + 445.01px);
  z-index: 50;
}

.login {
  line-height: 14px;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #000;
  text-decoration: none;
  font-family: 'Albert Sans', sans-serif;
}

.login:hover {
  color: #8A7C59;
}

.about {
  position: absolute;
  top: 53px;
  left: calc(50% - 398.99px);
  line-height: 14px;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #000;
  text-decoration: none;
  font-family: 'Albert Sans', sans-serif;
}

.about:hover {
  color: #8A7C59;
}

.customer-service {
  position: absolute;
  top: 53px;
  left: calc(50% + 280.01px);
  line-height: 14px;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #000;
  text-decoration: none;
  font-family: 'Albert Sans', sans-serif;
}

.customer-service:hover {
  color: #8A7C59;
}

.products {
  position: absolute;
  top: 53px;
  left: calc(50% - 577.99px);
  line-height: 14px;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #000;
  text-decoration: none;
  font-family: 'Albert Sans', sans-serif;
}

.products:hover {
  color: #8A7C59;
}

.cases {
  position: absolute;
  top: 53px;
  left: calc(50% - 477.99px);
  line-height: 14px;
  font-weight: 300;
  text-shadow: 1px 0 0 #ebe6dc, 0 1px 0 #ebe6dc, -1px 0 0 #ebe6dc, 0 -1px 0 #ebe6dc;
  color: #000;
  text-decoration: none;
  font-family: 'Albert Sans', sans-serif;
}

.cases:hover {
  color: #8A7C59;
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
