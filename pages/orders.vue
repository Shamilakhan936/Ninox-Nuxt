<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <div class="border-b border-gray-200 p-4 bg-white">
      <h1 class="text-xl font-semibold text-gray-900">Window Treatment Order Entry</h1>
    </div>

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Client search modal -->
      <UModal v-model="showClientModal" :ui="{ width: 'max-w-4xl' }">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Find Client</h3>
              <UButton
                icon="i-heroicons-x-mark"
                color="gray"
                variant="ghost"
                @click="showClientModal = false"
              />
            </div>
          </template>
          
          <!-- Search input -->
          <div class="mb-4">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <UInputGroup class="flex-grow">
                  <UInput
                    v-model="clientSearchTerm"
                    placeholder="Search by name, email or phone..."
                    @keyup.enter="triggerClientSearch"
                    autofocus
                  />
                  <UButton
                    color="gray"
                    @click="clientSearchTerm = ''"
                    v-if="clientSearchTerm"
                    icon="i-heroicons-x-mark"
                  />
                </UInputGroup>
                <UButton
                  icon="i-heroicons-magnifying-glass"
                  color="primary"
                  :loading="isLoadingClients"
                  @click="triggerClientSearch"
                >
                  Search
                </UButton>
              </div>
              <p class="text-xs text-gray-500">
                Enter at least 3 characters to search. More specific searches will yield better results.
              </p>
            </div>
          </div>
          
          <!-- Loading state -->
          <div v-if="isLoadingClients" class="flex justify-center py-8">
            <ULoader />
          </div>
          
          <!-- Error message -->
          <UAlert
            v-else-if="clientsError"
            color="red"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            class="mb-4"
          >
            {{ clientsError }}
          </UAlert>
          
          <!-- No results message -->
          <UAlert
            v-else-if="showClientResults && clients.length === 0 && clientSearchTerm"
            color="amber"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            class="mb-4"
          >
            No clients found matching "{{ clientSearchTerm }}". Please try a different search term.
          </UAlert>
          
          <!-- Search results -->
          <div v-if="showClientResults && clients.length > 0" class="border rounded-lg overflow-hidden">
            <div class="bg-gray-50 p-2 flex justify-between items-center">
              <span class="text-sm text-gray-600">
                Found {{ pagination.total }} client(s) matching "{{ clientSearchTerm }}"
                <span v-if="pagination.total > pagination.limit">
                  (showing {{ clients.length }} of {{ pagination.total }})
                </span>
              </span>
              
              <!-- Add pagination controls -->
              <div class="flex items-center space-x-2" v-if="pagination.totalPages > 1">
                <UButton 
                  icon="i-heroicons-chevron-left" 
                  size="xs" 
                  color="gray" 
                  variant="ghost"
                  :disabled="pagination.page === 1"
                  @click="changePage(pagination.page - 1)"
                />
                <span class="text-sm text-gray-600">
                  Page {{ pagination.page }} of {{ pagination.totalPages }}
                </span>
                <UButton 
                  icon="i-heroicons-chevron-right" 
                  size="xs" 
                  color="gray" 
                  variant="ghost"
                  :disabled="pagination.page === pagination.totalPages"
                  @click="changePage(pagination.page + 1)"
                />
              </div>
            </div>
            
            <UTable
              :columns="[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'company', label: 'Company' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'actions', label: '' }
              ]"
              :rows="formattedClients"
              hover
              :sort="{ column: 'name', direction: 'asc' }"
            >
              <template #company-data="{ row }">
                {{ row.company || '-' }}
              </template>
              <template #actions-data="{ row }">
                <UButton
                  color="primary"
                  variant="ghost"
                  size="xs"
                  @click="selectClientAndCloseModal(row._original)"
                >
                  Select
                </UButton>
              </template>
            </UTable>
          </div>
          
          <!-- Initial state message - only show if no search has been performed -->
          <div v-if="!showClientResults && !isLoadingClients && !clientsError" class="py-8 text-center text-gray-500">
            Enter a search term and click "Search" to find clients
          </div>
          
          <template #footer>
            <div class="flex justify-between">
              <UButton color="gray" variant="soft" @click="showClientModal = false">
                Cancel
              </UButton>
              <UButton 
                v-if="clients.length > 0" 
                color="primary" 
                @click="showClientModal = false"
              >
                Done
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <UCard class="max-w-4xl mx-auto">
        <form @submit.prevent="submitOrder">
          <!-- Customer Information Section -->
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
                Customer Information
              </h2>
              
              <!-- Client selection and display -->
              <div class="mb-6">
                <div class="flex items-center space-x-4 mb-4">
                  <UButton
                    icon="i-heroicons-user"
                    color="primary"
                    variant="soft"
                    @click="openClientModal"
                  >
                    Find Client
                  </UButton>
                  
                  <UButton
                    v-if="selectedClient"
                    icon="i-heroicons-user-minus"
                    color="gray"
                    variant="soft"
                    @click="clearSelectedClient"
                  >
                    Clear Selection
                  </UButton>
                </div>
                
                <!-- Selected client display -->
                <UAlert
                  v-if="selectedClient"
                  color="blue"
                  variant="soft"
                  icon="i-heroicons-user-circle"
                  class="mb-4"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <strong>Selected Client:</strong> {{ selectedClient.fields['First Name'] }} {{ selectedClient.fields['Last Name'] }}<br>
                      <span class="text-sm">
                        {{ selectedClient.fields['Email'] || 'No email' }} 
                        <template v-if="selectedClient.fields['Phone Number']">
                          | {{ selectedClient.fields['Phone Number'] }}
                        </template>
                      </span>
                    </div>
                  </div>
                </UAlert>
              </div>
              
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UFormGroup label="Customer Name">
                  <UInput v-model="order.customerName" placeholder="Enter customer name" />
                </UFormGroup>
                <UFormGroup label="Phone Number">
                  <UInput v-model="order.phoneNumber" placeholder="Enter phone number" />
                </UFormGroup>
                <UFormGroup label="Email" class="sm:col-span-2">
                  <UInput v-model="order.email" type="email" placeholder="Enter email address" />
                </UFormGroup>
              </div>
            </div>

            <!-- Product Selection -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
                Product Details
              </h2>
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UFormGroup label="Product Type">
                  <USelect
                    v-model="order.productType"
                    :options="productTypes"
                    placeholder="Select product type"
                  />
                </UFormGroup>
                <UFormGroup label="Material">
                  <USelect
                    v-model="order.material"
                    :options="materials[order.productType] || []"
                    placeholder="Select material"
                  />
                </UFormGroup>
              </div>
            </div>

            <!-- Measurements -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
                Measurements
              </h2>
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <UFormGroup label="Width (mm)">
                  <UInput
                    v-model="order.width"
                    type="number"
                    placeholder="Enter width"
                    min="0"
                  />
                </UFormGroup>
                <UFormGroup label="Drop (mm)">
                  <UInput
                    v-model="order.drop"
                    type="number"
                    placeholder="Enter drop"
                    min="0"
                  />
                </UFormGroup>
                <UFormGroup label="Quantity">
                  <UInput
                    v-model="order.quantity"
                    type="number"
                    placeholder="Enter quantity"
                    min="1"
                  />
                </UFormGroup>
              </div>
            </div>

            <!-- Additional Options -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
                Additional Options
              </h2>
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UFormGroup label="Control Side">
                  <URadioGroup v-model="order.controlSide" :options="['Left', 'Right']" />
                </UFormGroup>
                <UFormGroup label="Chain Type" v-if="order.productType !== 'Roman Shade'">
                  <USelect
                    v-model="order.chainType"
                    :options="chainTypes"
                    placeholder="Select chain type"
                  />
                </UFormGroup>
              </div>
            </div>

            <!-- Notes -->
            <UFormGroup label="Additional Notes">
              <UTextarea
                v-model="order.notes"
                placeholder="Enter any special instructions or notes"
                :rows="3"
              />
            </UFormGroup>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 flex justify-end space-x-3">
            <UButton
              color="gray"
              variant="soft"
              @click="resetForm"
            >
              Reset
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
            >
              Submit Order
            </UButton>
          </div>
        </form>
      </UCard>
    </div>

    <!-- Show toast message -->
    <UNotification
      v-if="notification.show"
      :title="notification.title"
      :description="notification.description"
      :color="notification.color"
      @close="notification.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Client search modal
const showClientModal = ref(false)
const clients = ref([])
const isLoadingClients = ref(false)
const clientsError = ref('')
const clientSearchTerm = ref('')
const selectedClient = ref(null)
const showClientResults = ref(false)

// Format clients for display in the table
const formattedClients = computed(() => {
  return clients.value.map(client => ({
    _original: client,
    name: `${client.fields['First Name'] || ''} ${client.fields['Last Name'] || ''}`.trim(),
    email: client.fields['Email'] || '',
    phone: client.fields['Phone Number'] || '',
    company: client.fields['Company'] || ''
  }))
})

// Function to open client search modal
function openClientModal() {
  clientSearchTerm.value = ''
  showClientResults.value = false
  clients.value = []
  clientsError.value = ''
  pagination.value.page = 1
  showClientModal.value = true
}

// Function to trigger client search
async function triggerClientSearch() {
  if (!clientSearchTerm.value || clientSearchTerm.value.length < 3) {
    clientsError.value = 'Please enter at least 3 characters to search'
    return
  }
  
  clientsError.value = ''
  isLoadingClients.value = true
  showClientResults.value = true
  
  try {
    const response = await fetch(`/api/ninox/clients?page=${pagination.value.page}&limit=${pagination.value.limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: clientSearchTerm.value
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      clients.value = data.clients;
      pagination.value = data.pagination;
      
      if (data.clients.length === 0) {
        clientsError.value = data.message || 'No clients found matching your search';
      } else if (data.clients.length === 1) {
        // Auto-select if only one client is found
        notification.value = {
          show: true,
          title: 'Client Found',
          description: 'One client was found and has been selected.',
          color: 'blue'
        };
        setTimeout(() => {
          notification.value.show = false;
        }, 3000);
        
        selectClient(data.clients[0]);
      }
    } else {
      clientsError.value = data.error || 'Failed to search clients';
    }
  } catch (error) {
    clientsError.value = error.message || 'An error occurred while searching';
  } finally {
    isLoadingClients.value = false;
  }
}

// Function to select a client and close modal
function selectClientAndCloseModal(client) {
  selectClient(client)
  showClientModal.value = false
}

// Function to select a client
function selectClient(client) {
  selectedClient.value = client
  
  // Populate form with client data
  order.value.customerName = `${client.fields['First Name'] || ''} ${client.fields['Last Name'] || ''}`.trim()
  order.value.phoneNumber = client.fields['Phone Number'] || ''
  
  // Check for email field with different possible field names
  order.value.email = client.fields['Email'] || client.fields['email'] || client.fields['E-mail'] || ''
  
  // Log what we found to help debugging
  console.log('Selected client fields:', client.fields)
  console.log('Populated email:', order.value.email)
  
  // Store the client ID for later use
  order.value.clientId = client.id
}

// Function to clear selected client
function clearSelectedClient() {
  selectedClient.value = null
  order.value.clientId = null
  // We don't clear the form fields to allow for manual edits
}

// Notification system
const notification = ref({
  show: false,
  title: '',
  description: '',
  color: 'green'
})

// Form data
const order = ref({
  customerName: '',
  phoneNumber: '',
  email: '',
  productType: '',
  material: '',
  width: null,
  drop: null,
  quantity: 1,
  controlSide: 'Left',
  chainType: '',
  notes: '',
  clientId: null
})

// Form validation
const validationErrors = ref([])

const isValid = computed(() => {
  validationErrors.value = []
  
  if (!order.value.customerName) {
    validationErrors.value.push('Customer name is required')
  }
  
  if (!order.value.phoneNumber) {
    validationErrors.value.push('Phone number is required')
  }
  
  if (!order.value.email) {
    validationErrors.value.push('Email is required')
  } else if (!isValidEmail(order.value.email)) {
    validationErrors.value.push('Email format is invalid')
  }
  
  if (!order.value.productType) {
    validationErrors.value.push('Product type is required')
  }
  
  if (!order.value.material) {
    validationErrors.value.push('Material is required')
  }
  
  if (!order.value.width) {
    validationErrors.value.push('Width is required')
  }
  
  if (!order.value.drop) {
    validationErrors.value.push('Drop is required')
  }
  
  return validationErrors.value.length === 0
})

// Email validation helper
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const isSubmitting = ref(false)

// Product options
const productTypes = [
  'Roller Blind',
  'Roman Shade',
  'Curtains'
]

const materials = {
  'Roller Blind': [
    'Blockout',
    'Light Filter',
    'Sunscreen',
    'Double Roller'
  ],
  'Roman Shade': [
    'Linen',
    'Cotton',
    'Polyester',
    'Silk Blend'
  ],
  'Curtains': [
    'Sheer',
    'Blockout',
    'Linen',
    'Velvet'
  ]
}

const chainTypes = [
  'Metal',
  'Plastic',
  'Cord'
]

// Notification helpers
const showSuccess = (message: string) => {
  notification.value = {
    show: true,
    title: 'Success',
    description: message,
    color: 'green'
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const showError = (message: string) => {
  notification.value = {
    show: true,
    title: 'Error',
    description: message,
    color: 'red'
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const resetForm = () => {
  order.value = {
    customerName: '',
    phoneNumber: '',
    email: '',
    productType: '',
    material: '',
    width: null,
    drop: null,
    quantity: 1,
    controlSide: 'Left',
    chainType: '',
    notes: '',
    clientId: null
  }
  selectedClient.value = null
  validationErrors.value = []
}

// Submit order
const submitOrder = async () => {
  // Validate form first
  if (!isValid.value) {
    showError(validationErrors.value.join(', '))
    return
  }
  
  isSubmitting.value = true
  try {
    const response = await fetch('/api/ninox/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order.value)
    })
    
    const result = await response.json()
    
    if (result.success) {
      showSuccess(result.message || 'Order submitted successfully!')
      resetForm()
    } else {
      showError(result.error || 'Failed to submit order')
    }
  } catch (error: any) {
    showError(error.message || 'An unexpected error occurred')
  } finally {
    isSubmitting.value = false
  }
}

// Add these to your script setup section
const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1
})

// Add a function to change page
function changePage(newPage) {
  pagination.value.page = newPage
  triggerClientSearch()
}
</script>

<style>
/* Add any custom styles here if needed */
</style>
