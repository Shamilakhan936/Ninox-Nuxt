<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-800">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Window Treatment Order Entry</h1>
    </div>

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrderForm from '../components/OrderForm.vue'
import ClientSearchModal from '../components/ClientSearchModal.vue'
import SalespersonSearchModal from '../components/SalespersonSearchModal.vue'
import NotificationSystem from '../components/NotificationSystem.vue'

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
    const response = await fetch('/api/ninox/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
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
