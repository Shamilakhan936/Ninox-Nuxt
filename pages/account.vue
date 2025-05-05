<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="!$auth.loggedIn">
        <div class="text-center py-12">
          <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your account information.
          </p>
          <LoginLink to="/api/login" external>
            <UButton color="primary" icon="i-heroicons-arrow-right-on-rectangle">
              Sign In
            </UButton>
          </LoginLink>
        </div>
      </div>
      
      <div v-else>
        <!-- Account Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6">
            <div class="flex items-center">
              <div class="mr-6">
                <img 
                  v-if="$auth.user.picture" 
                  :src="$auth.user.picture" 
                  class="h-24 w-24 rounded-full border-4 border-white shadow-md" 
                  alt="Profile" 
                />
                <div 
                  v-else 
                  class="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md"
                >
                  {{ $auth.user.given_name?.[0] || 'U' }}
                </div>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white">
                  {{ $auth.user.given_name }} {{ $auth.user.family_name }}
                </h1>
                <p class="text-blue-100">
                  {{ $auth.user.email }}
                </p>
                <p class="text-blue-200 text-sm mt-2">
                  Account type: <span class="font-semibold">Wholesale Customer</span>
                </p>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap gap-6">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ formatDate($auth.user.updated_at) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p class="font-medium">
                  <UBadge color="green" variant="subtle">Active</UBadge>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Orders Placed</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ orders.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Account Content Tabs -->
        <UTabs :items="tabItems" class="mb-8">
          <template #default="{ activeTabValue }">
            <div class="py-4">
              <!-- Orders Tab -->
              <div v-if="activeTabValue === 'orders'">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Order History</h2>
                  <UButton to="/orders" icon="i-heroicons-plus" color="primary" size="sm">
                    New Order
                  </UButton>
                </div>
                
                <div v-if="isLoading" class="flex justify-center py-12">
                  <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
                </div>
                
                <div v-else-if="orders.length > 0">
                  <!-- Order Cards List -->
                  <div class="space-y-6">
                    <div 
                      v-for="order in orders" 
                      :key="order.id" 
                      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                    >
                      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Order #{{ order.id }}
                          </p>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ formatDate(order.created_at) }}
                          </p>
                        </div>
                        <UBadge 
                          :color="getStatusColor(order.status)" 
                          variant="subtle"
                        >
                          {{ order.status }}
                        </UBadge>
                      </div>
                      
                      <!-- Order Summary -->
                      <div class="px-6 py-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              Items
                            </p>
                            <p class="font-medium text-gray-900 dark:text-white">
                              {{ order.items?.length || 0 }} products
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              Shipping
                            </p>
                            <p class="font-medium text-gray-900 dark:text-white">
                              {{ order.shipping_method || 'Standard' }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              Total
                            </p>
                            <p class="font-medium text-gray-900 dark:text-white">
                              {{ formatPrice(order.total) }}
                            </p>
                          </div>
                        </div>
                        
                        <!-- Order Products -->
                        <UAccordion :items="getOrderProducts(order)" class="mb-4" />
                        
                        <!-- Order Actions -->
                        <div class="flex justify-end space-x-2">
                          <UButton size="sm" color="gray" variant="ghost" icon="i-heroicons-document-duplicate">
                            Duplicate
                          </UButton>
                          <UButton size="sm" color="primary" icon="i-heroicons-eye">
                            View Details
                          </UButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                  <UIcon name="i-heroicons-shopping-bag" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't placed any orders yet. Start by creating your first order.
                  </p>
                  <UButton to="/orders" color="primary" icon="i-heroicons-plus">
                    Create Your First Order
                  </UButton>
                </div>
              </div>
              
              <!-- Settings Tab -->
              <div v-else-if="activeTabValue === 'settings'">
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h3>
                  </div>
                  
                  <div class="px-6 py-4">
                    <div class="space-y-6">
                      <!-- Contact Information -->
                      <div>
                        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Contact Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <UFormGroup label="First Name" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              :model-value="$auth.user.given_name"
                              disabled
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Last Name" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              :model-value="$auth.user.family_name"
                              disabled
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Email Address" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              :model-value="$auth.user.email"
                              disabled
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                              }"
                            />
                          </UFormGroup>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          To update your profile information, please contact customer support.
                        </p>
                      </div>
                      
                      <!-- Company Information -->
                      <div>
                        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Company Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <UFormGroup label="Company Name" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="companyInfo.name"
                              placeholder="Enter company name"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Business Type" class="text-gray-600 dark:text-gray-300">
                            <USelect
                              v-model="companyInfo.type"
                              :options="businessTypes"
                              placeholder="Select business type"
                              :ui="{
                                base: 'relative',
                                form: 'form-select',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Tax ID / Business Number" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="companyInfo.taxId"
                              placeholder="Enter tax ID"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                        </div>
                      </div>
                      
                      <!-- Shipping Information -->
                      <div>
                        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Default Shipping Address</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <UFormGroup label="Address Line 1" class="text-gray-600 dark:text-gray-300 md:col-span-2">
                            <UInput
                              v-model="shippingInfo.address1"
                              placeholder="Enter address line 1"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Address Line 2" class="text-gray-600 dark:text-gray-300 md:col-span-2">
                            <UInput
                              v-model="shippingInfo.address2"
                              placeholder="Enter address line 2 (optional)"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="City" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="shippingInfo.city"
                              placeholder="Enter city"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="State / Province" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="shippingInfo.state"
                              placeholder="Enter state or province"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Postal Code" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="shippingInfo.postalCode"
                              placeholder="Enter postal code"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Country" class="text-gray-600 dark:text-gray-300">
                            <USelect
                              v-model="shippingInfo.country"
                              :options="countries"
                              placeholder="Select country"
                              :ui="{
                                base: 'relative',
                                form: 'form-select',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                        </div>
                      </div>
                      
                      <!-- Save Button -->
                      <div class="flex justify-end">
                        <UButton 
                          color="primary" 
                          icon="i-heroicons-check" 
                          :loading="isSaving"
                          @click="saveSettings"
                        >
                          Save Changes
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Support Tab -->
              <div v-else-if="activeTabValue === 'support'">
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Customer Support</h3>
                  </div>
                  
                  <div class="px-6 py-4">
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                      Need assistance with your wholesale account or orders? Our support team is here to help.
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div class="flex items-center mb-4">
                          <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-blue-500 mr-2" />
                          <h4 class="text-md font-medium text-gray-900 dark:text-white">Email Support</h4>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 mb-3">
                          Send us an email and we'll respond within 24 hours.
                        </p>
                        <a href="mailto:support@windowtreatment.com" class="text-blue-600 dark:text-blue-400 font-medium">
                          support@windowtreatment.com
                        </a>
                      </div>
                      
                      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div class="flex items-center mb-4">
                          <UIcon name="i-heroicons-phone" class="w-6 h-6 text-blue-500 mr-2" />
                          <h4 class="text-md font-medium text-gray-900 dark:text-white">Phone Support</h4>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 mb-3">
                          Call us Monday-Friday, 9am-5pm EST.
                        </p>
                        <a href="tel:+15551234567" class="text-blue-600 dark:text-blue-400 font-medium">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>
                    
                    <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h4>
                      
                      <UAccordion :items="supportFaqs" class="mb-6" />
                      
                      <div class="text-center mt-6">
                        <UButton color="primary" variant="soft">
                          View All FAQs
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'

// Define meta data for SEO
definePageMeta({
  title: 'My Account - Window Treatment Wholesale'
})

// Mock orders data - in real app, this would come from an API
const isLoading = ref(true)
const orders = ref([])
const isSaving = ref(false)

// Company information form
const companyInfo = ref({
  name: '',
  type: 'Contractor',
  taxId: ''
})

// Shipping information form
const shippingInfo = ref({
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States'
})

// Business types options
const businessTypes = [
  'Contractor',
  'Interior Designer',
  'Architect',
  'Retailer',
  'Distributor',
  'Other'
]

// Countries list
const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'New Zealand',
  // Add more countries as needed
]

// Tabs configuration
const tabItems = [
  {
    label: 'Orders',
    icon: 'i-heroicons-shopping-bag',
    slot: 'orders',
    value: 'orders'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    slot: 'settings',
    value: 'settings'
  },
  {
    label: 'Support',
    icon: 'i-heroicons-life-buoy',
    slot: 'support',
    value: 'support'
  }
]

// Support FAQs
const supportFaqs = [
  {
    label: 'How do I track my order?',
    content: 'You can track your order by visiting your account page and selecting the specific order. Tracking information will be available once your order has been shipped.',
    open: false
  },
  {
    label: 'What is your return policy?',
    content: 'We offer a 30-day return policy for most items. Custom orders may have different return terms. Please contact our support team for specific return instructions.',
    open: false
  },
  {
    label: 'How do I qualify for wholesale pricing?',
    content: 'Wholesale pricing is available to verified businesses in the home improvement, interior design, and related industries. Please contact our sales team to discuss volume discounts and special pricing.',
    open: false
  },
  {
    label: 'Do you offer installation services?',
    content: 'We provide installation services in select areas. During checkout, you can select installation if it\'s available in your location. We also offer installation guidance for contractors.',
    open: false
  }
]

// Fetch user orders
onMounted(async () => {
  // Simulate API call to fetch orders
  setTimeout(() => {
    // Mock data - replace with actual API call in production
    orders.value = [
      {
        id: '1001',
        created_at: '2023-11-28T14:32:00Z',
        status: 'Delivered',
        shipping_method: 'Express',
        total: 2450.75,
        items: [
          { id: 1, name: 'Roller Shade', quantity: 3, fabric: 'Blockout - Aberdeen', price: 450.25 },
          { id: 2, name: 'Roman Shade', quantity: 2, fabric: 'Light Filter - Alesia', price: 550 }
        ]
      },
      {
        id: '1002',
        created_at: '2023-12-10T09:15:00Z',
        status: 'Processing',
        shipping_method: 'Standard',
        total: 1850.00,
        items: [
          { id: 3, name: 'Curtains', quantity: 4, fabric: 'Sheer - Vienna', price: 350 },
          { id: 4, name: 'Roller Shade', quantity: 2, fabric: 'Sunscreen - Oslo', price: 225 }
        ]
      }
    ]
    isLoading.value = false
  }, 1000)
})

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

// Format price
function formatPrice(price) {
  if (price === undefined || price === null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Get status color
function getStatusColor(status) {
  switch (status) {
    case 'Delivered':
      return 'green'
    case 'Shipped':
      return 'blue'
    case 'Processing':
      return 'yellow'
    case 'Cancelled':
      return 'red'
    default:
      return 'gray'
  }
}

// Get formatted order products for accordion
function getOrderProducts(order) {
  if (!order.items || order.items.length === 0) return []
  
  return order.items.map(item => ({
    label: `${item.name} (${item.quantity})`,
    content: `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Fabric</p>
          <p class="font-medium text-gray-900 dark:text-white">${item.fabric || 'N/A'}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Unit Price</p>
          <p class="font-medium text-gray-900 dark:text-white">${formatPrice(item.price)}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p class="font-medium text-gray-900 dark:text-white">${formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    `,
    open: false
  }))
}

// Save settings function
async function saveSettings() {
  isSaving.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Show success notification (you'd use your notification system here)
  alert('Settings saved successfully!')
  
  isSaving.value = false
}
</script>
