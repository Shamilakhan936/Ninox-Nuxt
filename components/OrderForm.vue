<template>
  <UCard class="max-w-4xl mx-auto">
    <form @submit.prevent="submitOrder">
      <!-- Customer Information Section -->
      <div class="space-y-6">
        <CustomerForm
          :customer-data="order"
          :selected-client="selectedClientLocal"
          :client-status="clientRegistrationStatus"
          @update:customer-data="updateCustomerData"
          @update:selected-client="$emit('update:selectedClient', $event)"
          @update:client-status="clientRegistrationStatus = $event"
          @open-client-search="$emit('open-client-search')"
        />

        <!-- Salesperson Section -->
        <div class="space-y-6 mb-6">
          <div>
            <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
              Sales Information
            </h2>
            
            <!-- Salesperson search/selection section -->
            <div class="mt-4">
              <div class="flex items-center space-x-4 mb-4">
                <UButton
                  icon="i-heroicons-user-group"
                  color="primary"
                  variant="soft"
                  @click="$emit('open-salesperson-search')"
                >
                  Select Salesperson
                </UButton>
              </div>
              
              <!-- Selected salesperson display -->
              <SalespersonCard
                :salesperson="selectedSalespersonLocal"
                @clear="$emit('update:selectedSalesperson', null)"
              />
            </div>
          </div>
        </div>

        <!-- Product Items Section -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
            Order Items
          </h2>

          <!-- List of products -->
          <div v-if="order.items.length > 0" class="mt-4 space-y-4">
            <ProductCard
              v-for="(item, index) in order.items"
              :key="index"
              :item="item"
              :index="index"
              @edit="editItem(index)"
              @remove="removeItem(index)"
            />
          </div>
          
          <!-- Empty state -->
          <EmptyItemsState v-else />
          
          <!-- Add Item button -->
          <div class="mt-4 flex justify-center">
            <UButton
              color="primary"
              @click="openNewItemForm"
              icon="i-heroicons-plus"
            >
              Add Product
            </UButton>
          </div>
        </div>

        <!-- Product Form (only shown when adding/editing) -->
        <ProductForm
          v-if="showProductForm"
          :item="currentItem"
          :is-new="editingItemIndex === -1"
          @save="saveItem"
          @cancel="cancelItemEdit"
          @validation-error="handleItemValidationError"
        />

        <!-- Order Notes -->
        <UFormGroup label="Order Notes">
          <UTextarea
            v-model="order.notes"
            placeholder="Enter any special instructions for the entire order"
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
          :disabled="!isValid || order.items.length === 0"
        >
          Submit Order
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CustomerForm from './CustomerForm.vue'
import SalespersonCard from './SalespersonCard.vue'
import ProductCard from './ProductCard.vue'
import ProductForm from './ProductForm.vue'
import EmptyItemsState from './EmptyItemsState.vue'

const props = defineProps({
  selectedClient: {
    type: Object,
    default: null
  },
  selectedSalesperson: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  validationErrors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'submit', 
  'reset',
  'update:selectedClient',
  'update:selectedSalesperson',
  'open-client-search',
  'open-salesperson-search',
  'validation-error',
  'notification'
])

// Use computed properties for two-way binding
const selectedClientLocal = computed({
  get: () => props.selectedClient,
  set: (value) => emit('update:selectedClient', value)
})

const selectedSalespersonLocal = computed({
  get: () => props.selectedSalesperson,
  set: (value) => emit('update:selectedSalesperson', value)
})

// Client registration status
const clientRegistrationStatus = ref('existing')

// Form data - main order object
const order = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  clientId: null,
  salespersonId: null,
  company: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  notes: '',
  items: []
})

// Function to update customer data
function updateCustomerData(data) {
  // Update order with customer data
  order.value = {
    ...order.value,
    ...data
  }
}

// Product form state
const showProductForm = ref(false)
const editingItemIndex = ref(-1)
const currentItem = ref({
  productType: '',
  material: '',
  width: null,
  height: null,
  quantity: 1,
  controlSide: 'Left',
  chainType: '',
  isMotorized: false,
  motorType: '',
  notes: ''
})

// Watch for client selection
watch(() => props.selectedClient, (newClient) => {
  if (newClient) {
    order.value.firstName = newClient.fields['First Name'] || ''
    order.value.lastName = newClient.fields['Last Name'] || ''
    order.value.phoneNumber = newClient.fields['Phone Number'] || ''
    order.value.email = newClient.fields['Email'] || ''
    order.value.clientId = newClient.id
  }
})

// Watch for salesperson selection
watch(() => props.selectedSalesperson, (newSalesperson) => {
  if (newSalesperson) {
    order.value.salespersonId = newSalesperson.id
  } else {
    order.value.salespersonId = null
  }
})

// Computed for form validation
const isValid = computed(() => {
  const errors = []
  
  // Customer information validation
  if (!order.value.firstName) {
    errors.push('First name is required')
  }
  
  if (!order.value.lastName) {
    errors.push('Last name is required')
  }
  
  if (!order.value.phoneNumber) {
    errors.push('Phone number is required')
  }
  
  if (!order.value.email) {
    errors.push('Email is required')
  } else if (!isValidEmail(order.value.email)) {
    errors.push('Email format is invalid')
  }
  
  // Salesperson validation
  if (!order.value.salespersonId) {
    errors.push('Salesperson is required')
  }
  
  return errors.length === 0
})

// Methods for item management
function openNewItemForm() {
  currentItem.value = {
    productType: '',
    material: '',
    width: null,
    height: null, 
    quantity: 1,
    controlSide: 'Left',
    chainType: '',
    isMotorized: false,
    motorType: '',
    notes: ''
  }
  editingItemIndex.value = -1
  showProductForm.value = true
}

function editItem(index) {
  editingItemIndex.value = index
  currentItem.value = { ...order.value.items[index] }
  showProductForm.value = true
}

function removeItem(index) {
  order.value.items.splice(index, 1)
}

function cancelItemEdit() {
  showProductForm.value = false
  editingItemIndex.value = -1
}

function saveItem(item) {
  if (editingItemIndex.value === -1) {
    // Add new item
    order.value.items.push({ ...item })
  } else {
    // Update existing item
    order.value.items[editingItemIndex.value] = { ...item }
  }
  
  showProductForm.value = false
  editingItemIndex.value = -1
}

function handleItemValidationError(errors) {
  emit('validation-error', errors)
}

// Form submission
function submitOrder() {
  if (!isValid.value) {
    const errors = []
    
    if (!order.value.firstName) errors.push('First name is required')
    if (!order.value.lastName) errors.push('Last name is required') 
    if (!order.value.phoneNumber) errors.push('Phone number is required')
    
    if (!order.value.email) {
      errors.push('Email is required')
    } else if (!isValidEmail(order.value.email)) {
      errors.push('Email format is invalid')
    }
    
    if (!order.value.salespersonId) errors.push('Salesperson is required')
    if (order.value.items.length === 0) errors.push('At least one product is required')
    
    emit('validation-error', errors)
    return
  }
  
  // Create payload
  const payload = {
    ...order.value,
    customerName: `${order.value.firstName} ${order.value.lastName}`.trim(),
    isNewClient: clientRegistrationStatus.value === 'new'
  }
  
  emit('submit', payload)
}

// Reset form
function resetForm() {
  order.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    clientId: null,
    salespersonId: null,
    company: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
    items: []
  }
  
  emit('update:selectedClient', null)
  emit('update:selectedSalesperson', null)
  
  clientRegistrationStatus.value = 'existing'
  showProductForm.value = false
  editingItemIndex.value = -1
  
  emit('reset')
}

// Helper for email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
</script>
