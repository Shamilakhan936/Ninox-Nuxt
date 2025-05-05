<template>
  <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to Window Treatment Wholesale
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Your professional supplier for premium window coverings
      </p>
      
      <div class="flex justify-center space-x-4">
        <template v-if="$auth.loggedIn">
          <UButton 
            to="/orders" 
            size="lg" 
            color="primary"
            icon="i-heroicons-shopping-cart"
          >
            Place an Order
          </UButton>
        </template>
        <template v-else>
          <LoginLink to="/api/login" external>
            <UButton 
              size="lg" 
              color="primary"
              icon="i-heroicons-lock-closed"
            >
              Sign in to Order
            </UButton>
          </LoginLink>
          <RegisterLink to="/api/register" external>
            <UButton 
              size="lg" 
              variant="outline"
              icon="i-heroicons-user-plus"
            >
              Create Account
            </UButton>
          </RegisterLink>
        </template>
      </div>
    </div>
    
    <!-- Featured products or other marketing content -->
    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Sample cards for featured products -->
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Featured Product {{ i }}</h3>
          <p class="text-gray-600 dark:text-gray-400">Premium quality window treatments for every style</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Home'
})
</script>
