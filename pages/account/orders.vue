<template>
  <div class="ml-[86px]">
    <div class="mb-[90px]">
      <h2 class="text-3xl font-light mb-6 text-[#2D1713]">Orders History</h2>
      <p class="text-base font-normal text-[#6F6259] leading-6">
        View and manage all your orders. Track status, view details, and access your order history.
      </p>
    </div>

    <OrdersSearchForm
      :fields="searchFields"
      button-label="Search"
      @submit="handleSearch"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
      <span class="ml-2 text-gray-600">Loading orders...</span>
    </div>

    <!-- No Orders State -->
    <div v-else-if="!orders.length && !loading" class="text-center py-12">
      <UIcon name="i-heroicons-inbox" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
      <p class="text-gray-600 mb-6">
        {{ hasSearched ? 'No orders match your search criteria.' : 'You haven\'t placed any orders yet.' }}
      </p>
      <button
        v-if="hasSearched"
        @click="clearSearch"
        class="crastino-button"
      >
        View All Orders
      </button>
      <NuxtLink
        v-else
        to="/table-orders"
        class="crastino-button inline-block"
      >
        Create Your First Order
      </NuxtLink>
    </div>

    <div v-else>
      <h3 class="text-3xl font-light mb-4 text-[#2D1713]">Recent Orders</h3>
      <OrdersTable :orders="formattedOrders" @view-details="viewOrderDetails" />
    </div>

    <!-- Order Details Modal -->
    <OrderDetailsModal
      v-model="showOrderDetails"
      :order-id="selectedOrderId"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import OrdersSearchForm from "~/components/SearchForm.vue"
import OrdersTable from "~/components/OrdersTable.vue"
import OrderDetailsModal from '~/components/OrderDetailsModal.vue'

definePageMeta({ layout: "account-section" })

// Reactive state
const loading = ref(false)
const orders = ref([])
const hasSearched = ref(false)
const showOrderDetails = ref(false)
const selectedOrderId = ref(null)

// Search form configuration - Updated to match SearchForm expectations
const searchFields = [
  { key: "orderNumber", label: "Order no", type: "text", placeholder: "#" },
  { key: "from", label: "From", type: "date" },
  { key: "to", label: "To", type: "date" },
]

// Get current user
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

// Format orders for the existing table component
const formattedOrders = computed(() => {
  return orders.value.map(order => ({
    id: order.id, // Keep original ID for details lookup
    order: order.uuid.substring(0, 8) + '...',
    date: formatDate(order.createdAt),
    billed: `${order.customerFirstName} ${order.customerLastName}`,
    total: "---", // You can add total calculation later
    status: order.status.toLowerCase()
  }))
})

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Get user ID from database
const getUserIdFromDatabase = async (email) => {
  try {
    const response = await $fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.success) {
      const users = response.data
      const foundUser = users.find(u => u.email === email)
      return foundUser?.id || null
    }
    return null
  } catch (error) {
    console.error('Error fetching user ID:', error)
    return null
  }
}

// Fetch orders
const fetchOrders = async (searchParams = {}) => {
  if (!user.value?.email) {
    console.error('User email not available')
    return
  }

  loading.value = true
  try {
    // Get user ID from database
    const userId = await getUserIdFromDatabase(user.value.email)
    
    if (!userId) {
      throw new Error('User not found in database')
    }

    // Build query parameters - Updated to handle the correct field names
    const params = new URLSearchParams()
    
    if (searchParams.orderNumber) {
      params.append('orderNumber', searchParams.orderNumber)
    }
    if (searchParams.from) {
      params.append('dateFrom', searchParams.from)
    }
    if (searchParams.to) {
      params.append('dateTo', searchParams.to)
    }

    const queryString = params.toString()
    const url = `/api/orders/user/${userId}${queryString ? '?' + queryString : ''}`

    const response = await $fetch(url)
    
    if (response.success) {
      orders.value = response.data
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    orders.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = (formValues) => {
  console.log("Search submitted with values:", formValues)
  hasSearched.value = true
  fetchOrders(formValues)
}

const clearSearch = () => {
  hasSearched.value = false
  fetchOrders()
}

const viewOrderDetails = (orderData) => {
  // Find the original order ID from the formatted data
  const originalOrder = orders.value.find(order => 
    order.uuid.substring(0, 8) + '...' === orderData.order
  )
  if (originalOrder) {
    selectedOrderId.value = originalOrder.id
    showOrderDetails.value = true
  }
}

// Lifecycle
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
/* Additional styling if needed */
.table-orders-container {
  min-height: 100vh;
}

/* Custom button styling to match application design */
.crastino-button {
  border-radius: 74px;
  background-color: #8a7c59;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  text-align: center;
  font-size: 13px;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  letter-spacing: 0.1em;
  line-height: 13px;
  text-transform: uppercase;
  font-family: 'Albert Sans', sans-serif;
  white-space: nowrap;
  text-decoration: none;
  font-weight: 400;
}

.crastino-button:hover {
  background-color: #6B5B42;
}

.crastino-button:focus {
  outline: 2px solid #8a7c59;
  outline-offset: 2px;
}

/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');
</style>
