<template>
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo & Site Name -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <UIcon name="i-heroicons-window" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span class="text-lg font-semibold text-gray-900 dark:text-white">Window Treatment Wholesale</span>
        </NuxtLink>
        
        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink to="/" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </NuxtLink>
          <NuxtLink v-if="$auth.loggedIn" to="/orders" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Orders
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            About
          </NuxtLink>
          <NuxtLink to="/contact" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Contact
          </NuxtLink>
        </div>
        
        <!-- User Menu / Auth -->
        <div class="flex items-center space-x-3">
          <template v-if="$auth.loggedIn">
            <UDropdown :items="userMenuItems">
              <UButton
                color="gray"
                variant="ghost"
                class="flex items-center space-x-2"
              >
                <img 
                  v-if="$auth.user.picture" 
                  :src="$auth.user.picture" 
                  class="h-8 w-8 rounded-full" 
                  alt="Profile" 
                />
                <span v-else class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {{ $auth.user.given_name?.[0] || 'U' }}
                </span>
                <span class="hidden sm:inline text-gray-700 dark:text-gray-300">
                  {{ $auth.user.given_name || 'User' }}
                </span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </UButton>
            </UDropdown>
          </template>
          <template v-else>
            <LoginLink to="/api/login" external>
              <UButton size="sm" color="primary">Sign in</UButton>
            </LoginLink>
            <RegisterLink to="/api/register" external class="hidden sm:inline-block">
              <UButton size="sm" variant="outline">Register</UButton>
            </RegisterLink>
          </template>
        </div>
        
        <!-- Mobile Menu Button -->
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-bars-3"
          class="md:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
      
      <!-- Mobile Navigation Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pt-4 pb-2 space-y-3">
        <NuxtLink 
          v-for="link in mobileNavLinks" 
          :key="link.to" 
          :to="link.to" 
          class="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const mobileMenuOpen = ref(false);

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

// Computed property for mobile navigation that includes auth-protected links when logged in
const mobileNavLinks = computed(() => {
  const baseLinks = [...navLinks];
  
  if ($auth.loggedIn) {
    baseLinks.splice(1, 0, 
      { label: 'Orders', to: '/orders' },
      { label: 'My Account', to: '/account' }
    );
  }
  
  return baseLinks;
});

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
