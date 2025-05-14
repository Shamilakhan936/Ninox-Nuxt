<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Loading state while auth initializes -->
      <div v-if="!isAuthInitialized" class="flex justify-center items-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
        <span class="ml-2 text-gray-600 dark:text-gray-400">Loading account...</span>
      </div>
      
      <!-- Not logged in state -->
      <div v-else-if="!isLoggedIn" class="text-center py-12">
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
      
      <!-- Logged in state -->
      <div v-else>
        <!-- Account Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6">
            <div class="flex items-center">
              <div class="mr-6">
                <img 
                  v-if="user.picture" 
                  :src="user.picture" 
                  class="h-24 w-24 rounded-full border-4 border-white shadow-md" 
                  alt="Profile" 
                />
                <div 
                  v-else 
                  class="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md"
                >
                  {{ user.given_name?.[0] || 'U' }}
                </div>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white">
                  {{ user.given_name }} {{ user.family_name }}
                </h1>
                <p class="text-blue-100">
                  {{ user.email }}
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
                  {{ formatDate(user.updated_at) }}
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
        
        <!-- Alternative approach using buttons instead of tabs -->
        <div class="mb-6 border-b border-gray-200">
          <div class="flex space-x-4">
            <button 
              v-for="tab in ['orders', 'settings', 'support']" 
              :key="tab"
              @click="activeTab = tab"
              class="px-4 py-2 border-b-2 font-medium text-sm"
              :class="activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
                          </div>
                        </div>
                        
        <!-- Content sections -->
        <div v-if="activeTab === 'orders'">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order History</h2>
          
          <p>Debug: {{ orders.length }} orders loaded</p>
                        
          <!-- Super simple list -->
          <ul class="mt-4 border border-gray-200 rounded-lg divide-y">
            <li v-for="order in orders" :key="order.id" class="p-4 hover:bg-gray-50">
              <p class="font-bold">Order #{{ order.id }}</p>
              <p>Date: {{ formatDate(order.createdAt) }}</p>
              <p>Status: {{ order.status }}</p>
              <button 
                @click="viewOrderDetails(order)" 
                class="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                            View Details
              </button>
            </li>
          </ul>
          
          <p v-if="orders.length === 0" class="text-center text-gray-500 my-12">
            No orders found
          </p>
                        </div>
        <div v-else-if="activeTab === 'settings'">
          <!-- Settings content -->
                      </div>
        <div v-else-if="activeTab === 'support'">
          <!-- Support content -->
                    </div>
                  </div>
                </div>
                
    <!-- Order Detail Modal -->
    <UModal v-model="showOrderDetailModal" :ui="{ width: 'max-w-3xl' }">
      <div v-if="selectedOrder" class="p-4">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Order #{{ selectedOrder.id }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Placed on {{ formatDate(selectedOrder.createdAt) }}
            </p>
                </div>
          <UBadge :color="getStatusColor(selectedOrder.status)" class="ml-2">
            {{ getStatusLabel(selectedOrder.status) }}
          </UBadge>
              </div>
              
        <!-- Order Items Table -->
        <div class="mb-6 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specs</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fabric</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(item, index) in selectedOrder.items" :key="index">
                <td class="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {{ item.productType }}
                  <span v-if="item.motorized" class="ml-1 text-xs text-blue-600 dark:text-blue-400">(Motorized)</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div>{{ item.width }}mm × {{ item.height }}mm</div>
                  <div class="text-xs text-gray-400 mt-1">Mount: {{ item.mountLocation || 'Inside' }}</div>
                  <div v-if="item.hardwareColor" class="text-xs text-gray-400">Color: {{ item.hardwareColor }}</div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div>{{ typeof item.fabric === 'number' ? `Fabric #${item.fabric}` : (item.fabric || 'N/A') }}</div>
                  <div v-if="item.style" class="text-xs text-gray-400 mt-1">Style: {{ item.style }}</div>
                  <div v-if="item.control" class="text-xs text-gray-400">
                    {{ item.controlPosition || '' }} {{ item.control }}
                  </div>
                  <div v-if="item.rollDirection" class="text-xs text-gray-400">
                    {{ item.rollDirection }} roll
                        </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ item.quantity }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <UBadge :color="getStatusColor(item.status)" size="sm">
                    {{ getStatusLabel(item.status) }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
                      </div>
                      
        <!-- Order Shipping Information -->
        <div v-if="selectedOrder.shipping" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Shipping Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Method</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedOrder.shipping.method }}</p>
                        </div>
            <div v-if="selectedOrder.shipping.estimatedDate">
              <p class="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedOrder.shipping.estimatedDate) }}</p>
                      </div>
            <div v-if="selectedOrder.shipping.trackingNumber" class="md:col-span-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
              <div class="flex items-center">
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedOrder.shipping.trackingNumber }}</p>
                        <UButton 
                  size="xs"
                  color="blue"
                  variant="link"
                  class="ml-2"
                  @click="trackOrder(selectedOrder.shipping.trackingNumber)"
                        >
                  Track package
                        </UButton>
                    </div>
                  </div>
                </div>
              </div>
              
        <!-- Order Total Information -->
        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(selectedOrder.total * 0.9) }}</span>
                  </div>
          <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            <span class="text-gray-600 dark:text-gray-400">Tax</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(selectedOrder.total * 0.1) }}</span>
                        </div>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatPrice(selectedOrder.total) }}</span>
                      </div>
                    </div>
                    
        <!-- Modal Actions -->
        <div class="flex justify-end space-x-3">
          <UButton
            color="gray"
            variant="soft"
            @click="showOrderDetailModal = false"
          >
            Close
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-document-duplicate"
            @click="duplicateOrder(selectedOrder)"
          >
            Reorder
                        </UButton>
                      </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../components/Navbar.vue'

// Define page meta
definePageMeta({
  title: 'My Account - Window Treatment Wholesale'
})

// State variables
const isLoading = ref(true)
const isAuthInitialized = ref(false)
const orders = ref([])
const isSaving = ref(false)
const showOrderDetailModal = ref(false)
const selectedOrder = ref(null)
const activeTab = ref('orders')

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
const tabItems = computed(() => [
  {
    label: 'Orders',
    icon: 'i-heroicons-shopping-bag',
    slot: 'orders',
    value: 'orders',
    default: true
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    slot: 'settings',
    value: 'settings'
  },
  {
    label: 'Support',
    icon: 'i-heroicons-question-mark-circle',
    slot: 'support',
    value: 'support'
  }
]);

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

// Fetch user orders safely
async function fetchOrders() {
  console.log("fetchOrders function called, isLoggedIn:", isLoggedIn.value);
  
  if (!isLoggedIn.value) return;
  
  isLoading.value = true;
  
  try {
    // Get the user's email from the auth object
    const userEmail = user.value?.email;
    
    if (!userEmail) {
      console.warn("No user email available");
      orders.value = [];
      isLoading.value = false;
      return;
    }
    
    console.log(`Fetching orders for ${userEmail}`);
    
    // Pass the email in the request body
    const response = await fetch('/api/ninox/user-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: userEmail }),
      credentials: 'include' // Include cookies
    });
    
    const data = await response.json();
    
    if (data.orders && Array.isArray(data.orders)) {
      // Force reactivity by creating a new array
      orders.value = [...data.orders];
      console.log(`Loaded ${orders.value.length} orders successfully`);
      console.log('Order data:', JSON.stringify(orders.value));
      
      // Add this to check if each order can be displayed correctly
      orders.value.forEach((order, index) => {
        console.log(`Order ${index + 1} (${order.id}):`, {
          hasItems: !!order.items && Array.isArray(order.items),
          itemCount: order.items?.length || 0,
          status: order.status,
          displayStatus: getStatusLabel(order.status)
        });
      });
    } else {
      console.warn('No valid orders data in response');
      orders.value = [];
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Watch for auth state changes
watch(() => isLoggedIn.value, (newValue) => {
  if (newValue) {
    fetchOrders();
  }
}, { immediate: true });

// Initialize component
onMounted(() => {
  // Allow a short delay for auth to initialize
  setTimeout(() => {
    isAuthInitialized.value = true;
    
    if (isLoggedIn.value) {
      fetchOrders();
      // Force the active tab to be orders
      activeTab.value = 'orders';
    } else {
      isLoading.value = false;
    }
  }, 200);
});

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

// Get status label from numeric value
function getStatusLabel(status) {
  // Map status ID to human-readable text
  const statusMap = {
    1: 'Pending',
    2: 'Processing',
    3: 'Fabrication',
    4: 'Shipped',
    5: 'Delivered',
    6: 'Cancelled'
  };
  
  // If it's already a string, return it
  if (typeof status === 'string') {
    return status;
  }
  
  return statusMap[status] || 'Unknown';
}

// Get status color
function getStatusColor(status) {
  const statusValue = typeof status === 'string' ? status.toLowerCase() : status;
  
  const colorMap = {
    // String values
    'delivered': 'green',
    'shipped': 'blue',
    'processing': 'yellow',
    'pending': 'gray',
    'fabrication': 'purple',
    'cancelled': 'red',
    'defining order': 'yellow',
    'queued': 'blue',
    
    // Numeric values
    1: 'gray',    // Pending
    2: 'yellow',  // Processing
    3: 'purple',  // Fabrication
    4: 'blue',    // Shipped
    5: 'green',   // Delivered
    6: 'red'      // Cancelled
  };
  
  return colorMap[statusValue] || 'gray';
}

// Get formatted order products for accordion
function getOrderProducts(order) {
  if (!order.items || order.items.length === 0) return []
  
  return order.items.map(item => {
    // Convert fabric ID to a meaningful string if it's a number
    const fabricDisplay = typeof item.fabric === 'number' 
      ? `Fabric #${item.fabric}` 
      : (item.fabric || 'N/A');
    
    return {
      label: `${item.productType} (${item.quantity})`,
    content: `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
        <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Size & Mount</p>
            <p class="font-medium text-gray-900 dark:text-white">${item.width}mm × ${item.height}mm</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Mount: ${item.mountLocation || 'Inside'}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">${item.rollDirection || ''} roll</p>
        </div>
        <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Materials & Style</p>
            <p class="font-medium text-gray-900 dark:text-white">${fabricDisplay}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Style: ${item.style || 'N/A'}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Hardware: ${item.hardwareColor || 'Standard'}</p>
        </div>
        <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Controls</p>
            <p class="font-medium text-gray-900 dark:text-white">${item.motorized ? 'Motorized' : 'Manual'}</p>
            ${item.control ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ${item.controlPosition || ''} ${item.control}
            </p>` : ''}
            ${item.includesRemote ? `<p class="text-xs text-gray-500 dark:text-gray-400">Includes remote</p>` : ''}
        </div>
      </div>
    `,
    open: false
    };
  });
}

// Order tracking function
function trackOrder(trackingNumber) {
  // For demo purposes, we'll show a notification
  // In a real app, you'd likely redirect to a tracking page or carrier's website
  alert(`Tracking order with number: ${trackingNumber}. In a production app, this would open the shipping carrier's tracking page.`);
}

// View order details
function viewOrderDetails(order) {
  selectedOrder.value = order;
  showOrderDetailModal.value = true;
}

// Duplicate order
function duplicateOrder(order) {
  // Here we redirect to the order page with the order ID as a parameter
  // This will allow the order form to be pre-filled with the order details
  navigateTo({
    path: '/orders',
    query: { duplicate: order.id }
  });
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
