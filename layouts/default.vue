<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-800">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Window Treatment Wholesale</h1>
        
        <!-- Authentication Links -->
        <div class="flex items-center space-x-4">
          <template v-if="$auth.loggedIn">
            <div class="flex items-center space-x-2">
              <img v-if="$auth.user.picture" :src="$auth.user.picture" class="h-8 w-8 rounded-full" alt="Profile" />
              <span class="text-gray-700 dark:text-gray-300">{{ $auth.user.given_name }}</span>
            </div>
            <UButton to="/orders" size="sm">Orders</UButton>
            <UButton to="/api/logout" external variant="ghost" size="sm">Sign out</UButton>
          </template>
          <template v-else>
            <LoginLink to="/api/login" external>
              <UButton size="sm">Sign in</UButton>
            </LoginLink>
          </template>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="flex-grow">
      <slot />
    </div>
    
    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div class="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {{ new Date().getFullYear() }} Window Treatment Wholesale. All rights reserved.
      </div>
    </footer>
  </div>
</template>
