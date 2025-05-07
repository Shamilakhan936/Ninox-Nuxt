<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Page Content -->
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Entry System</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Create and submit orders for window treatments and accessories.
        </p>
      </div>
      
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
      </div>
      
      <div v-else-if="hasPermission">
        <!-- Main Order Form -->
        <OrderForm
          :selected-client="selectedClient"
          :selected-salesperson="selectedSalesperson"
          :is-submitting="isSubmitting"
          :validation-errors="validationErrors"
          :success-info="successInfo"
          @submit="submitOrder"
          @reset="handleFormReset"
          @update:selected-client="selectedClient = $event"
          @update:selected-salesperson="selectedSalesperson = $event"
          @open-client-search="openClientModal"
          @open-salesperson-search="openSalespersonModal"
          @validation-error="handleValidationError"
          @notification="showNotification"
          ref="orderFormRef"
        />

        <!-- Client Search Modal -->
        <ClientSearchModal 
          v-model="showClientModal" 
          @select="selectClient" 
          @notification="showNotification"
          ref="clientSearchModalRef"
        />
        
        <!-- Salesperson Search Modal -->
        <SalespersonSearchModal 
          v-model="showSalespersonModal" 
          @select="selectSalesperson" 
          @notification="showNotification"
          ref="salespersonSearchModalRef"
        />

        <!-- Notification System -->
        <NotificationSystem 
          v-model:notification="notification" 
          :auto-hide="true" 
          :duration="5000"
        />
      </div>
      
      <div v-else class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg shadow-sm text-center">
        <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h2 class="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Insufficient Permissions</h2>
        <p class="text-red-600 dark:text-red-300 mb-4">
          You don't have the necessary permissions to access the order entry system.
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import OrderForm from '../components/OrderForm.vue'
import ClientSearchModal from '../components/ClientSearchModal.vue'
import SalespersonSearchModal from '../components/SalespersonSearchModal.vue'
import NotificationSystem from '../components/NotificationSystem.vue'

// Check user permissions
const client = useKindeClient();
const isLoading = ref(true);
const hasPermission = ref(true); // Default to true to allow access

// Check if user has the required permission to access order entry
onMounted(async () => {
  try {
    // For now, simply check that the user is authenticated
    // You can implement specific permission checks later
    hasPermission.value = true;
    
    // Optional: If you want to check specific permissions in the future
    // Uncomment the code below once you've set up permissions in Kinde
    /* 
    const result = await client?.getPermission("create:orders");
    hasPermission.value = result?.isGranted || true; // Default to true if no permission found
    */
  } catch (error) {
    console.error('Error checking permissions:', error);
    // Still allow access even if permission check fails
    hasPermission.value = true;
  } finally {
    isLoading.value = false;
  }
});

// State
const selectedClient = ref(null)
const selectedSalesperson = ref(null)
const isSubmitting = ref(false)
const validationErrors = ref([])
const showClientModal = ref(false)
const showSalespersonModal = ref(false)

// Notification system
const notification = ref({
  show: false,
  title: '',
  description: '',
  color: 'green'
})

// Success notification
const successInfo = ref({
  show: false,
  message: '',
  orderData: null
})

// Modal controls
function openClientModal() {
  if (clientSearchModalRef.value) {
    clientSearchModalRef.value.reset()
  }
  showClientModal.value = true
}

function openSalespersonModal() {
  if (salespersonSearchModalRef.value) {
    salespersonSearchModalRef.value.reset()
  }
  showSalespersonModal.value = true
}

// Selection handlers
function selectClient(client) {
  selectedClient.value = client
  showNotification({
    title: 'Client Selected',
    description: `${client.fields['First Name']} ${client.fields['Last Name']} has been selected.`,
    color: 'blue'
  })
}

function selectSalesperson(salesperson) {
  selectedSalesperson.value = salesperson
  showNotification({
    title: 'Salesperson Selected',
    description: `${salesperson.fields['First Name']} ${salesperson.fields['Last Name']} has been selected.`,
    color: 'blue'
  })
}

// Form submission
async function submitOrder(orderData) {
  isSubmitting.value = true
  
  try {
    // Add user ID from authentication to the order data
    const enhancedOrderData = {
      ...orderData,
      // Include authenticated user information for audit/tracking
      userId: $auth.user?.id,
      userEmail: $auth.user?.email
    };
    
    const response = await fetch('/api/ninox/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enhancedOrderData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      showSuccessNotification(result.message || 'Order submitted successfully!', result.data);
      
      validationErrors.value = [];
      
      if (orderFormRef.value && orderFormRef.value.resetItems) {
        orderFormRef.value.resetItems();
      }
    } else {
      throw new Error(result.error || 'Failed to submit order')
    }
  } catch (error) {
    showNotification({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

function showSuccessNotification(message, data) {
  showNotification({
    title: 'Success',
    description: message,
    color: 'green'
  });
  
  successInfo.value = {
    show: true,
    message,
    orderData: data
  };
  
  setTimeout(() => {
    successInfo.value.show = false;
  }, 10000);
}

// Helper functions
function handleValidationError(errors) {
  validationErrors.value = errors
  showNotification({
    title: 'Validation Error',
    description: Array.isArray(errors) ? errors.join('\n') : errors,
    color: 'yellow'
  })
}

function handleFormReset() {
  validationErrors.value = []
  showNotification({
    title: 'Form Reset',
    description: 'The form has been reset to its initial state.',
    color: 'blue'
  })
}

function showNotification(notify) {
  notification.value = {
    show: true,
    title: notify.title || 'Notification',
    description: notify.description || '',
    color: notify.color || 'blue'
  }
}

// Template refs for modals
const clientSearchModalRef = ref(null)
const salespersonSearchModalRef = ref(null)
const orderFormRef = ref(null)
</script>

<style>
/* Add any custom styles here if needed */
</style>
