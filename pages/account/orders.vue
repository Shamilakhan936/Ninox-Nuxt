<template>
  <div class="min-h-screen table-orders-container" style="background-color: #f7f7f5;">
    <!-- Navigation -->
    <Navbar />

    <!-- Page Content -->
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" style="color: #6B6B6B;" />
      </div>
      
      <div v-else-if="hasPermission" class="relative">
        <!-- Account Sidebar Component -->
        <AccountSidebar 
          active-item="Orders"
          :menu-items="sideMenuItems"
          :show-order-upload="true"
          @menu-click="handleMenuClick"
          @order-upload-click="handleOrderUpload"
        />

        <!-- Main Content Area -->
        <div class="ml-[400px] max-w-[950px]">
          <!-- Title Section -->
          <div class="mb-[64px]">
            <h1 class="text-[30px] font-light text-[#2d1713] mb-6">
              Order History
            </h1>
            <p class="text-[16px] leading-[24px] text-[#6f6259] max-w-[869px]">
              View and manage all your orders. You can search by order number, filter by date range, 
              and track the status of each order. Click "View" to see detailed information about any order.
            </p>
          </div>

          <!-- Search Section -->
          <div class="flex flex-wrap gap-6 mb-8">
            <!-- Order Number Search -->
            <div class="flex flex-col gap-2">
              <label class="text-[16px] leading-[14px] uppercase tracking-[0.2em] font-light text-[#3d3935]">
                Order No.
              </label>
              <input
                v-model="searchOrderNumber"
                type="text"
                placeholder="#"
                class="custom-input-field"
              />
            </div>

            <!-- Date From -->
            <div class="flex flex-col gap-2">
              <label class="text-[16px] leading-[14px] uppercase tracking-[0.2em] font-light text-[#3d3935]">
                From
              </label>
              <input
                v-model="searchDateFrom"
                type="date"
                placeholder="DD/MM/YYYY"
                class="custom-input-field custom-date-field"
              />
            </div>

            <!-- Date To -->
            <div class="flex flex-col gap-2">
              <label class="text-[16px] leading-[14px] uppercase tracking-[0.2em] font-light text-[#3d3935]">
                To
              </label>
              <input
                v-model="searchDateTo"
                type="date"
                placeholder="DD/MM/YYYY"
                class="custom-input-field custom-date-field"
              />
            </div>

            <!-- Search Button -->
            <div class="flex items-end">
              <button 
                @click="searchOrders"
                class="bg-[#8a7c59] text-white px-[18px] py-[12px] rounded-[74px] text-[13px] uppercase tracking-[0.1em] leading-[13px] font-light hover:bg-[#7a6c49] transition-colors"
                :disabled="isSearching"
              >
                <UIcon v-if="isSearching" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
                Search
              </button>
            </div>
          </div>

          <!-- Recent Orders Section -->
          <div class="mb-[120px]">
            <h2 class="text-[30px] font-light text-[#2d1713] mb-[64px]">Recent Orders</h2>
            
            <!-- Orders Table -->
            <div v-if="filteredOrders.length > 0" class="bg-white rounded-lg overflow-hidden shadow-sm">
              <!-- Table Header -->
              <div class="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b text-[16px] leading-[14px] uppercase tracking-[0.2em] font-light text-[#3d3935]">
                <div>Order #</div>
                <div>Order Date</div>
                <div>Status</div>
                <div>Items</div>
                <div>Total</div>
                <div>Action</div>
              </div>
              
              <!-- Table Rows -->
              <div class="divide-y divide-gray-100">
                <div 
                  v-for="(order, index) in paginatedOrders" 
                  :key="order.id" 
                  :class="[
                    'grid grid-cols-6 gap-4 p-4 text-[16px] leading-[24px] text-[#6f6259] hover:bg-gray-50 transition-colors',
                    index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                  ]"
                >
                  <div class="font-medium">{{ order.id || 'N/A' }}</div>
                  <div>{{ formatDate(order.createdAt) }}</div>
                  <div>
                    <span 
                      :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(order.status)
                      ]"
                    >
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                  <div>{{ order.items?.length || 0 }} item{{ (order.items?.length || 0) !== 1 ? 's' : '' }}</div>
                  <div>{{ formatCurrency(order.total) }}</div>
                  <div>
                    <button 
                      @click="viewOrderDetails(order)"
                      class="flex items-center gap-2 text-[16px] leading-[27.82px] uppercase font-light hover:opacity-70 transition-opacity"
                    >
                      <span>View</span>
                      <UIcon name="i-heroicons-chevron-right" class="w-[25px] h-[25px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!isLoading && !isSearching" class="text-center py-12">
              <div class="text-[#6f6259] text-[16px] mb-4">
                {{ hasSearched ? 'No orders found matching your search criteria.' : 'No orders found.' }}
              </div>
              <button 
                v-if="hasSearched"
                @click="clearSearch"
                class="text-[#8a7c59] hover:underline"
              >
                Clear search
              </button>
            </div>

            <!-- Pagination -->
            <div v-if="filteredOrders.length > ordersPerPage" class="mt-8 flex justify-center">
              <button 
                @click="loadMoreOrders"
                class="bg-[#8a7c59] text-white px-[18px] py-[16px] rounded-[74px] text-[13px] uppercase tracking-[0.1em] leading-[13px] font-light hover:bg-[#7a6c49] transition-colors"
                :disabled="isLoadingMore"
              >
                <UIcon v-if="isLoadingMore" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
                Show Next {{ Math.min(ordersPerPage, filteredOrders.length - currentPage * ordersPerPage) }} Orders
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Insufficient Permissions Message -->
      <div v-else class="border p-6 rounded-lg shadow-sm text-center" style="background-color: #FEF2F2; border-color: #FECACA;">
        <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto mb-4" style="color: #DC2626;" />
        <h2 class="text-xl font-semibold mb-2" style="color: #DC2626;">Insufficient Permissions</h2>
        <p class="mb-4" style="color: #DC2626;">
          You don't have the necessary permissions to access orders.
        </p>
        <UButton
          to="/api/logout"
          external
          color="red"
          variant="soft"
        >
          Sign out
        </UButton>
      </div>
    </div>

    <!-- Order Details Modal -->
    <UModal v-model="showOrderModal">
      <UCard v-if="selectedOrder">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Order Details - {{ selectedOrder.id }}</h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="closeOrderModal"
            />
          </div>
        </template>
        
        <div class="space-y-6">
          <!-- Order Summary -->
          <div>
            <h4 class="font-medium mb-3">Order Information</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Order Date:</span>
                <span class="ml-2">{{ formatDate(selectedOrder.createdAt) }}</span>
              </div>
              <div>
                <span class="text-gray-500">Status:</span>
                <span class="ml-2">{{ getStatusText(selectedOrder.status) }}</span>
              </div>
              <div>
                <span class="text-gray-500">Total:</span>
                <span class="ml-2 font-medium">{{ formatCurrency(selectedOrder.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div v-if="selectedOrder.items && selectedOrder.items.length > 0">
            <h4 class="font-medium mb-3">Order Items</h4>
            <div class="space-y-3">
              <div 
                v-for="item in selectedOrder.items" 
                :key="item.id"
                class="p-3 bg-gray-50 rounded-lg"
              >
                <div class="font-medium">{{ item.productType }}</div>
                <div class="text-sm text-gray-600 mt-1">
                  <span>{{ item.width }}" W × {{ item.height }}" H</span>
                  <span class="mx-2">•</span>
                  <span>Qty: {{ item.quantity }}</span>
                  <span v-if="item.fabric !== 'N/A'" class="mx-2">•</span>
                  <span v-if="item.fabric !== 'N/A'">{{ item.fabric }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div v-if="selectedOrder.shipping">
            <h4 class="font-medium mb-3">Shipping Information</h4>
            <div class="text-sm space-y-2">
              <div>
                <span class="text-gray-500">Method:</span>
                <span class="ml-2">{{ selectedOrder.shipping.method }}</span>
              </div>
              <div v-if="selectedOrder.shipping.trackingNumber">
                <span class="text-gray-500">Tracking:</span>
                <span class="ml-2">{{ selectedOrder.shipping.trackingNumber }}</span>
              </div>
              <div v-if="selectedOrder.shipping.estimatedDate">
                <span class="text-gray-500">Estimated Delivery:</span>
                <span class="ml-2">{{ formatDate(selectedOrder.shipping.estimatedDate) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="gray"
              variant="soft"
              @click="closeOrderModal"
            >
              Close
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Notification System -->
    <NotificationSystem 
      v-model:notification="notification" 
      :auto-hide="true" 
      :duration="5000"
    />
    
    <!-- Footer -->
    <div class="bg-[#3d3935] h-[82px] relative text-white mt-16">
      <div class="absolute bottom-[28px] left-[84px]">
        <div class="flex items-center">
          <img src="/copyright-icon.svg" alt="Copyright" class="w-[18.5px] h-[18.5px] mr-2" />
          <span class="text-[18px] leading-[26px] font-light">2025, Crastino</span>
        </div>
      </div>
      
      <div class="absolute bottom-[34px] right-[84px]">
        <div class="flex items-center">
          <img src="/location-pin.svg" alt="Location" class="w-[8px] h-[14px] mr-2" />
          <span class="text-[16px] leading-[14px] uppercase tracking-[0.2em] font-light">
            Søborg Hovedgade 3, 2870 Dyssegård, Denmark
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../components/Navbar.vue'
import NotificationSystem from '../components/NotificationSystem.vue'
import AccountSidebar from '../components/AccountSidebar.vue'
import { useNotifications } from '../composables/useNotifications'

// Define page meta
definePageMeta({
  title: 'Orders - Crastino'
})

// User authentication and permissions
const isLoading = ref(true)
const hasPermission = ref(true)

const auth = computed(() => {
  try {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$auth || null
  } catch (e) {
    console.error("Error accessing auth:", e)
    return null
  }
})

const user = computed(() => {
  return auth.value?.user || {}
})

// Use composables
const { notification, showNotification } = useNotifications()

// Orders data
const orders = ref([])
const isSearching = ref(false)
const isLoadingMore = ref(false)
const currentPage = ref(0)
const ordersPerPage = 10
const hasSearched = ref(false)

// Search filters
const searchOrderNumber = ref('')
const searchDateFrom = ref('')
const searchDateTo = ref('')

// Order details modal
const showOrderModal = ref(false)
const selectedOrder = ref(null)

// Side menu items
const sideMenuItems = [
  { name: 'My Account', action: 'account', route: '/account' },
  { name: 'Invoices', action: 'invoices' },
  { name: 'Credits', action: 'credits' },
  { name: 'Shipments', action: 'shipments' },
  { name: 'Back Orders', action: 'back-orders' },
  { name: 'Complaints', action: 'complaints' }
]

// Computed properties
const filteredOrders = computed(() => {
  let filtered = [...orders.value]
  
  if (searchOrderNumber.value) {
    filtered = filtered.filter(order => 
      order.id?.toLowerCase().includes(searchOrderNumber.value.toLowerCase())
    )
  }
  
  if (searchDateFrom.value) {
    filtered = filtered.filter(order => 
      new Date(order.createdAt) >= new Date(searchDateFrom.value)
    )
  }
  
  if (searchDateTo.value) {
    filtered = filtered.filter(order => 
      new Date(order.createdAt) <= new Date(searchDateTo.value)
    )
  }
  
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const paginatedOrders = computed(() => {
  const start = 0
  const end = (currentPage.value + 1) * ordersPerPage
  return filteredOrders.value.slice(start, end)
})

// Methods
const fetchOrders = async () => {
  if (!user.value?.email) return
  
  try {
    isLoading.value = true
    
    const response = await $fetch('/api/ninox/user-orders', {
      method: 'POST',
      body: {
        email: user.value.email
      }
    })
    
    if (response && response.orders) {
      orders.value = response.orders
    } else {
      orders.value = []
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    showNotification({
      title: 'Error',
      description: 'Failed to load orders. Please try again.',
      color: 'red'
    })
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

const searchOrders = async () => {
  hasSearched.value = true
  isSearching.value = true
  currentPage.value = 0
  
  // Simulate search delay
  await new Promise(resolve => setTimeout(resolve, 500))
  isSearching.value = false
}

const clearSearch = () => {
  searchOrderNumber.value = ''
  searchDateFrom.value = ''
  searchDateTo.value = ''
  hasSearched.value = false
  currentPage.value = 0
}

const loadMoreOrders = () => {
  currentPage.value++
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}

const handleMenuClick = (menuItem) => {
  if (menuItem.route) {
    navigateTo(menuItem.route)
  } else {
    showNotification({
      title: 'Coming Soon',
      description: `${menuItem.name} section is coming soon.`,
      color: 'blue'
    })
  }
}

const handleOrderUpload = () => {
  showNotification({
    title: 'Feature Coming Soon',
    description: 'Order upload functionality will be available soon.',
    color: 'blue'
  })
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (e) {
    return 'Invalid Date'
  }
}

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '€0.00'
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getStatusText = (status) => {
  const statusMap = {
    1: 'Pending',
    2: 'Processing',
    3: 'Shipped',
    4: 'Delivered',
    5: 'Complete',
    6: 'Cancelled'
  }
  return statusMap[status] || 'Unknown'
}

const getStatusColor = (status) => {
  const colorMap = {
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-purple-100 text-purple-800',
    4: 'bg-green-100 text-green-800',
    5: 'bg-green-100 text-green-800',
    6: 'bg-red-100 text-red-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

// Watch for auth state changes
watch(() => user.value?.email, (newEmail) => {
  if (newEmail) {
    fetchOrders()
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  try {
    hasPermission.value = true
    
    if (user.value?.email) {
      await fetchOrders()
    }
  } catch (error) {
    console.error('Error checking permissions:', error)
    hasPermission.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
@import '~/assets/css/table-orders.css';

.custom-input-field {
  border-radius: 66px;
  background-color: #fff;
  border: 1px solid #c9c7c5;
  box-sizing: border-box;
  width: 300px;
  height: 50px;
  padding: 12px 24px;
  font-size: 16px;
  line-height: 26px;
  font-weight: 300;
  color: #6f6259;
  font-family: 'Albert Sans';
  outline: none;
}

.custom-input-field:focus {
  border-color: #8a7c59;
  outline: none;
}

.custom-input-field::placeholder {
  color: #6f6259;
  font-weight: 300;
}

/* Date input specific styling */
.custom-date-field {
  width: 250px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.custom-date-field::-webkit-calendar-picker-indicator {
  color: #6f6259;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  margin-left: auto;
}

.custom-date-field::-webkit-inner-spin-button,
.custom-date-field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>