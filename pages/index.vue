<template>
  <div>
    <!-- Navigation -->
    <Navbar />
    
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Premium Window Treatments for Professionals
        </h1>
        <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Quality window coverings and accessories for contractors, designers and industry professionals.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <template v-if="$auth.loggedIn">
            <UButton 
              to="/orders" 
              size="xl" 
              color="white"
              variant="solid"
              icon="i-heroicons-shopping-cart"
            >
              Place an Order
            </UButton>
          </template>
          <template v-else>
            <LoginLink to="/api/login" external>
              <UButton 
                size="xl" 
                color="white"
                variant="solid"
                icon="i-heroicons-lock-closed"
              >
                Sign in to Order
              </UButton>
            </LoginLink>
            <RegisterLink to="/api/register" external>
              <UButton 
                size="xl" 
                color="white"
                variant="outline"
                icon="i-heroicons-user-plus"
              >
                Create Account
              </UButton>
            </RegisterLink>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Featured Products Section -->
    <div class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Featured Products
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
            <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UIcon name="i-heroicons-squares-2x2" class="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Roller Shades</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Modern design with various opacity options for perfect light control.
              </p>
              <UButton color="primary" variant="ghost" icon="i-heroicons-arrow-right" iconRight to="/orders">
                Order Now
              </UButton>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
            <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UIcon name="i-heroicons-rectangle-stack" class="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Roman Shades</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Elegant fabric options with classic folding design for a timeless look.
              </p>
              <UButton color="primary" variant="ghost" icon="i-heroicons-arrow-right" iconRight to="/orders">
                Order Now
              </UButton>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
            <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UIcon name="i-heroicons-bars-3-bottom-left" class="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Curtains</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Premium fabrics in various styles to complement any interior design.
              </p>
              <UButton color="primary" variant="ghost" icon="i-heroicons-arrow-right" iconRight to="/orders">
                Order Now
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Benefits Section -->
    <div class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Us
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center p-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
              <UIcon name="i-heroicons-truck" class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Shipping</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Quick turnaround times with reliable shipping options.
            </p>
          </div>
          
          <div class="text-center p-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
              <UIcon name="i-heroicons-shield-check" class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Guaranteed</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Premium materials and expert craftsmanship in every product.
            </p>
          </div>
          
          <div class="text-center p-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
              <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Wholesale Pricing</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Competitive pricing for industry professionals.
            </p>
          </div>
          
          <div class="text-center p-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expert Support</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Dedicated customer service team to assist with your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- CTA Section -->
    <div class="py-16 bg-gray-100 dark:bg-gray-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Place Your Order?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Join our wholesale platform for exclusive pricing and premium products.
        </p>
        <div v-if="$auth.loggedIn">
          <UButton 
            to="/orders" 
            size="xl" 
            color="primary"
            icon="i-heroicons-shopping-cart"
          >
            Start Ordering Now
          </UButton>
        </div>
        <div v-else class="flex flex-col sm:flex-row gap-4 justify-center">
          <LoginLink to="/api/login" external>
            <UButton 
              size="xl" 
              color="primary"
              icon="i-heroicons-lock-closed"
            >
              Sign in to Start
            </UButton>
          </LoginLink>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About Us</h3>
            <p class="text-gray-400">
              Premium window treatment wholesale supplier for industry professionals.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Products</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Roller Shades</a></li>
              <li><a href="#" class="hover:text-white">Roman Shades</a></li>
              <li><a href="#" class="hover:text-white">Curtains</a></li>
              <li><a href="#" class="hover:text-white">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Home</a></li>
              <li><a href="#" class="hover:text-white">Orders</a></li>
              <li><a href="#" class="hover:text-white">About</a></li>
              <li><a href="#" class="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-center space-x-2">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                <span>contact@windowtreatment.com</span>
              </li>
              <li class="flex items-center space-x-2">
                <UIcon name="i-heroicons-phone" class="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
          &copy; {{ new Date().getFullYear() }} Window Treatment Wholesale. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';

// Define meta data for SEO
definePageMeta({
  title: 'Home - Window Treatment Wholesale',
  description: 'Premium window treatments for industry professionals at wholesale prices.'
})
</script>
