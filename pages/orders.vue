<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <div class="border-b border-gray-200 p-4 bg-white">
      <h1 class="text-xl font-semibold text-gray-900">Window Treatment Order Entry</h1>
    </div>

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Main Order Form -->
      <OrderForm
        :selected-client="selectedClient"
        :selected-salesperson="selectedSalesperson"
        :is-submitting="isSubmitting"
        :validation-errors="validationErrors"
        @submit="submitOrder"
        @reset="handleFormReset"
        @update:selected-client="selectedClient = $event"
        @update:selected-salesperson="selectedSalesperson = $event"
        @open-client-search="openClientModal"
        @open-salesperson-search="openSalespersonModal"
        @validation-error="handleValidationError"
        @notification="showNotification"
      />

      <!-- Client Search Modal -->
      <ClientSearchModal 
        v-model="showClientModal" 
        @select="selectClient" 
        @notification="showNotification"
        ref="clientSearchModal"
      />

      <!-- Salesperson Search Modal -->
      <SalespersonSearchModal 
        v-model="showSalespersonModal" 
        @select="selectSalesperson" 
        @notification="showNotification"
        ref="salespersonSearchModal"
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

// Modal control
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

// Client and salesperson selection
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
    color: 'green'
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
      showNotification({
        title: 'Success',
        description: result.message || 'Order submitted successfully!',
        color: 'green'
      })
      
      // Reset state after successful submission
      selectedClient.value = null
      selectedSalesperson.value = null
      validationErrors.value = []
    } else {
      showNotification({
        title: 'Error',
        description: result.error || 'Failed to submit order',
        color: 'red'
      })
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

// Helper functions
function handleValidationError(errors) {
  validationErrors.value = errors
  showNotification({
    title: 'Validation Error',
    description: errors.join(', '),
    color: 'red'
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
</script>

<style>
/* Add any custom styles here if needed */
</style>
