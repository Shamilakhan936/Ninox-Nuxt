<template>
  <UCard class="max-w-4xl mx-auto">
    <form @submit.prevent="submitOrder">
      <!-- Customer Information Section -->
      <div class="space-y-6">
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 class="text-lg font-medium text-white mb-4">Customer Information</h3>
          
          <div class="mb-4">
            <UFormGroup label="Customer Type" class="text-gray-300">
              <URadioGroup 
                v-model="isExistingCustomer" 
                :options="[
                  { label: 'Existing Customer', value: true },
                  { label: 'New Customer', value: false }
                ]"
                orientation="horizontal"
                :ui="{ 
                  wrapper: 'flex flex-wrap gap-2',
                  container: 'bg-gray-700 border border-gray-600 rounded-lg p-2 cursor-pointer transition-colors duration-200 hover:bg-gray-600 text-gray-300',
                  containerActive: 'ring-2 ring-green-500 bg-gray-600 border-green-500 text-white'
                }"
              />
            </UFormGroup>
          </div>
          
          <!-- Existing Customer Selection -->
          <div v-if="isExistingCustomer" class="mb-4">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex-grow">
                <ClientCard v-if="selectedClient" :client="selectedClient" @remove="selectedClient = null" />
                <div v-else class="p-4 rounded bg-gray-800 border border-gray-700">
                  <p class="text-gray-400">No customer selected</p>
                </div>
              </div>
              
              <UButton 
                :disabled="isSubmitting"
                color="primary" 
                variant="soft" 
                @click="$emit('open-client-search')"
              >
                {{ selectedClient ? 'Change Customer' : 'Select Customer' }}
              </UButton>
            </div>
          </div>
          
          <!-- New Customer Form -->
          <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormGroup label="First Name" class="text-gray-300">
              <UInput 
                v-model="customerData.firstName" 
                placeholder="Enter first name"
                :ui="{
                  base: 'relative',
                  form: 'form-input',
                  input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
                }"
              />
            </UFormGroup>
            
            <UFormGroup label="Last Name" class="text-gray-300">
              <UInput 
                v-model="customerData.lastName" 
                placeholder="Enter last name"
                :ui="{
                  base: 'relative',
                  form: 'form-input',
                  input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
                }"
              />
            </UFormGroup>
            
            <UFormGroup label="Email" class="text-gray-300">
              <UInput 
                v-model="customerData.email" 
                placeholder="Enter email address"
                :ui="{
                  base: 'relative',
                  form: 'form-input',
                  input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
                }"
              />
            </UFormGroup>
            
            <UFormGroup label="Phone" class="text-gray-300">
              <UInput 
                v-model="customerData.phone" 
                placeholder="Enter phone number"
                :ui="{
                  base: 'relative',
                  form: 'form-input',
                  input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
                }"
              />
            </UFormGroup>
            
            <UFormGroup label="Company (Optional)" class="text-gray-300 sm:col-span-2">
              <UInput 
                v-model="customerData.company" 
                placeholder="Enter company name"
                :ui="{
                  base: 'relative',
                  form: 'form-input',
                  input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
                }"
              />
            </UFormGroup>
          </div>
        </div>

        <!-- Salesperson Selection -->
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 class="text-lg font-medium text-white mb-4">Salesperson Information</h3>
          
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex-grow">
              <SalesPersonCard v-if="selectedSalesperson" :salesperson="selectedSalesperson" @remove="selectedSalesperson = null" />
              <div v-else class="p-4 rounded bg-gray-800 border border-gray-700">
                <p class="text-gray-400">No salesperson selected</p>
              </div>
            </div>
            
            <UButton 
              :disabled="isSubmitting"
              color="primary" 
              variant="soft" 
              @click="$emit('open-salesperson-search')"
            >
              {{ selectedSalesperson ? 'Change Salesperson' : 'Select Salesperson' }}
            </UButton>
          </div>
        </div>

        <!-- Installation Details -->
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 class="text-lg font-medium text-white mb-4">Installation Details</h3>
          
          <div class="space-y-4">
            <UFormGroup label="Installation Required?" class="text-gray-300">
              <URadioGroup
                v-model="installationRequired"
                :options="[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ]"
                orientation="horizontal"
                :ui="{
                  wrapper: 'flex flex-wrap gap-2',
                  container: 'bg-gray-700 border border-gray-600 rounded-lg p-2 cursor-pointer transition-colors duration-200 hover:bg-gray-600 text-gray-300',
                  containerActive: 'ring-2 ring-green-500 bg-gray-600 border-green-500 text-white'
                }"
              />
            </UFormGroup>

            <template v-if="installationRequired">
              <UFormGroup label="Installation Address" class="text-gray-300">
                <UTextarea
                  v-model="installationAddress"
                  :rows="3"
                  placeholder="Enter installation address"
                  :ui="{
                    base: 'relative',
                    form: 'form-textarea',
                    input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
                  }"
                />
              </UFormGroup>
            </template>
            
            <template v-else>
              <UFormGroup label="Country" class="text-gray-300">
                <USelect
                  v-model="country"
                  :options="countries"
                  placeholder="Select country"
                  :ui="{
                    base: 'relative',
                    form: 'form-select',
                    input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
                  }"
                />
              </UFormGroup>
            </template>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-white">Order Items</h3>
            <UButton
              color="green"
              variant="solid"
              icon="i-heroicons-plus"
              @click="showProductForm = true"
            >
              Add Item
            </UButton>
          </div>

          <div v-if="orderItems.length === 0" class="text-center py-8">
            <p class="text-gray-400">No items added to the order yet</p>
          </div>

          <div v-else class="space-y-4">
            <ProductCard
              v-for="(item, index) in orderItems"
              :key="index"
              :item="item"
              @edit="editItem(index)"
              @remove="removeItem(index)"
            />
          </div>
        </div>

        <!-- Special Instructions -->
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <UFormGroup label="Special Instructions" class="mb-0 text-gray-300">
            <UTextarea
              v-model="specialInstructions"
              placeholder="Enter any special instructions for this order"
              :rows="3"
              :ui="{
                base: 'relative',
                form: 'form-textarea',
                input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
              }"
            />
          </UFormGroup>
        </div>
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
          :disabled="!isValid || orderItems.length === 0"
        >
          Submit Order
        </UButton>
      </div>
    </form>

    <!-- Product Form Modal -->
    <ProductForm
      v-if="showProductForm"
      :item="editingItem"
      :is-new="editingIndex === -1"
      @save="saveItem"
      @cancel="cancelProductForm"
      @validation-error="handleValidationError"
      @notification="$emit('notification', $event)"
    />

    <!-- Success Notification Overlay (shown when an order is successfully created) -->
    <div 
      v-if="localSuccessInfo.show" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="localSuccessInfo.show = false"
    >
      <div 
        class="bg-gray-800 border border-green-500 rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl" 
        @click.stop
      >
        <div class="flex items-center mb-4">
          <UIcon name="i-heroicons-check-circle" class="text-green-500 h-8 w-8 mr-3" />
          <h2 class="text-xl font-semibold text-white">Order Created Successfully!</h2>
        </div>
        
        <div class="text-gray-300 mb-4">
          <p>{{ localSuccessInfo.message }}</p>
          <div v-if="localSuccessInfo.orderData" class="mt-3 p-3 bg-gray-700 rounded text-sm">
            <div><span class="text-green-400">Order ID:</span> {{ localSuccessInfo.orderData.order?.id }}</div>
            <div><span class="text-green-400">Items:</span> {{ localSuccessInfo.orderData.orderItems?.length || 0 }}</div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <UButton
            color="gray"
            variant="solid"
            @click="localSuccessInfo.show = false"
          >
            Close
          </UButton>
          <UButton
            color="green"
            variant="solid"
            @click="resetItems(); localSuccessInfo.show = false"
          >
            Add Another Order
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ClientCard from './ClientCard.vue'
import SalesPersonCard from './SalesPersonCard.vue'
import ProductCard from './ProductDisplayCard.vue'
import ProductForm from './ProductForm.vue'

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
  },
  successInfo: {
    type: Object,
    default: () => ({ show: false, message: '', orderData: null })
  }
})

const emit = defineEmits([
  'submit', 
  'reset',
  'update:selected-client',
  'update:selected-salesperson',
  'open-client-search',
  'open-salesperson-search',
  'validation-error',
  'notification'
])

// Form state
const isExistingCustomer = ref(true)
const customerData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: ''
})
const installationRequired = ref(false)
const installationAddress = ref('')
const country = ref('')
const specialInstructions = ref('')
const orderItems = ref([])

// Product form state
const showProductForm = ref(false)
const editingItem = ref(null)
const editingIndex = ref(-1)

// Countries list
const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'New Zealand',
  // Add more countries as needed
]

// Two-way binding for selected client and salesperson
const selectedClient = computed({
  get: () => props.selectedClient,
  set: (value) => emit('update:selected-client', value)
})

const selectedSalesperson = computed({
  get: () => props.selectedSalesperson,
  set: (value) => emit('update:selected-salesperson', value)
})

// Validation
const isValid = computed(() => {
  const errors = [];
  
  // Customer validation
  if (isExistingCustomer.value && !selectedClient.value) {
    errors.push('Please select an existing customer');
  }
  
  if (!isExistingCustomer.value) {
    if (!customerData.value.firstName) errors.push('Customer first name is required');
    if (!customerData.value.lastName) errors.push('Customer last name is required');
    // Optional validation for email/phone if needed
  }
  
  // Salesperson validation - optional validation
  // if (!selectedSalesperson.value) {
  //   errors.push('Please select a salesperson');
  // }
  
  // Installation details validation
  if (installationRequired.value && !installationAddress.value) {
    errors.push('Installation address is required');
  }
  
  if (!installationRequired.value && !country.value) {
    errors.push('Country is required for non-installation orders');
  }
  
  // Order items validation
  if (orderItems.value.length === 0) {
    errors.push('At least one item is required');
  }
  
  // Update validation errors if any
  if (errors.length > 0) {
    emit('validation-error', errors);
  }
  
  return errors.length === 0;
})

// Product form methods
function editItem(index) {
  editingIndex.value = index;
  editingItem.value = { ...orderItems.value[index] };
  showProductForm.value = true;
}

function removeItem(index) {
  orderItems.value.splice(index, 1);
}

function saveItem(item) {
  // Check if the item has a valid fabric
  if (!item.fabricId && (!item.fabricDetails || !item.fabricDetails.fields?.['Fabric ID'])) {
    handleValidationError(['Fabric selection is required']);
    return;
  }

  if (editingIndex.value > -1) {
    orderItems.value[editingIndex.value] = item;
  } else {
    orderItems.value.push(item);
  }
  cancelProductForm();
}

function cancelProductForm() {
  showProductForm.value = false;
  editingItem.value = null;
  editingIndex.value = -1;
}

function handleValidationError(errors) {
  emit('validation-error', errors);
}

// Form submission
function submitOrder() {
  if (!isValid.value) return;
  
  // Check all items have valid fabrics
  const invalidItems = orderItems.value.filter(item => 
    !item.fabricId && 
    (!item.fabricDetails || !item.fabricDetails.fields?.['Fabric ID'])
  );
  
  if (invalidItems.length > 0) {
    handleValidationError([`${invalidItems.length} item(s) are missing fabric selection`]);
    return;
  }
  
  // Log items for debugging
  console.log('Order items before submission:', orderItems.value);
  
  const orderData = {
    isExistingCustomer: isExistingCustomer.value,
    selectedCustomerId: selectedClient.value?.id,
    selectedSalespersonId: selectedSalesperson.value?.id,
    customerFirstName: customerData.value.firstName,
    customerLastName: customerData.value.lastName,
    customerEmail: customerData.value.email,
    customerPhone: customerData.value.phone,
    company: customerData.value.company,
    installationRequired: installationRequired.value,
    installationAddress: installationAddress.value,
    country: country.value,
    specialInstructions: specialInstructions.value,
    items: orderItems.value.map(item => {
      // Ensure fabricId is correctly included, checking all possible locations
      const fabricId = item.fabricId || 
                      (item.fabricDetails?.fabricId) || 
                      (item.fabricDetails?.fields['Fabric ID']) || 
                      null;
      
      console.log(`Item ${item.productType}: fabricId = ${fabricId}`);
      
      if (!fabricId) {
        console.error('Missing fabric ID for item:', item);
      }
      
      return {
        ...item,
        fabricId: fabricId
      };
    })
  };
  
  console.log('Final order data:', orderData);
  
  emit('submit', orderData);
}

// Local success info to manage the modal/overlay
const localSuccessInfo = ref({ ...props.successInfo });

// Watch for changes in success info from parent
watch(() => props.successInfo, (newValue) => {
  localSuccessInfo.value = { ...newValue };
}, { deep: true });

// Add a method to reset just the items and form data, not customer/salesperson
function resetItems() {
  // Keep customer and salesperson info
  // Only reset the order-specific data
  installationRequired.value = false;
  installationAddress.value = '';
  country.value = '';
  specialInstructions.value = '';
  orderItems.value = [];
  
  // Optional: Reset validation errors
  emit('validation-error', []);
}

// Expose the resetItems method to parent components
defineExpose({
  resetItems
})

// Update the reset method to call resetItems
function resetForm() {
  // Reset everything including customer/salesperson
  isExistingCustomer.value = true;
  selectedClient.value = null;
  selectedSalesperson.value = null;
  customerData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: ''
  };
  
  // Reset the rest of the form
  resetItems();
  
  emit('reset');
}
</script>
