<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
      Customer Information
    </h2>
    
    <!-- Client Registration Status -->
    <div class="mb-6 mt-4">
      <UFormGroup label="Client Status">
        <URadioGroup 
          v-model="clientStatusLocal" 
          :options="[
            { label: 'Existing Client', value: 'existing' },
            { label: 'New Client', value: 'new' }
          ]"
          orientation="horizontal"
          class="mb-2"
          :ui="{ 
            wrapper: 'flex flex-wrap gap-4',
            container: 'bg-white border border-gray-300 rounded-lg p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50',
            containerActive: 'ring-2 ring-primary-500 bg-primary-50 border-primary-500'
          }"
        />
      </UFormGroup>
    </div>
    
    <!-- Client search/selection section - only shown for existing clients -->
    <div v-if="clientStatusLocal === 'existing'" class="mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <UButton
          icon="i-heroicons-user"
          color="primary"
          variant="soft"
          @click="openClientSearch"
        >
          Find Client
        </UButton>
      </div>
      
      <!-- Selected client display -->
      <ClientCard 
        :client="selectedClient" 
        @clear="clearClient"
      />
    </div>
    
    <!-- Client form fields -->
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Split customer name into first and last name -->
      <UFormGroup label="First Name">
        <UInput 
          v-model="localCustomerData.firstName" 
          placeholder="Enter first name" 
          :disabled="clientStatusLocal === 'existing' && selectedClient"
        />
      </UFormGroup>
      
      <UFormGroup label="Last Name">
        <UInput 
          v-model="localCustomerData.lastName" 
          placeholder="Enter last name" 
          :disabled="clientStatusLocal === 'existing' && selectedClient"
        />
      </UFormGroup>
      
      <UFormGroup label="Phone Number">
        <UInput 
          v-model="localCustomerData.phoneNumber" 
          placeholder="Enter phone number" 
          :disabled="clientStatusLocal === 'existing' && selectedClient"
        />
      </UFormGroup>
      
      <UFormGroup label="Email">
        <UInput 
          v-model="localCustomerData.email" 
          type="email" 
          placeholder="Enter email address" 
          :disabled="clientStatusLocal === 'existing' && selectedClient"
        />
      </UFormGroup>
      
      <!-- Additional fields for new clients only -->
      <template v-if="clientStatusLocal === 'new'">
        <UFormGroup label="Company (Optional)" class="sm:col-span-2">
          <UInput v-model="localCustomerData.company" placeholder="Enter company name if applicable" />
        </UFormGroup>
        
        <UFormGroup label="Address (Optional)" class="sm:col-span-2">
          <UInput v-model="localCustomerData.address" placeholder="Enter street address" class="mb-2" />
          <div class="grid grid-cols-2 gap-2">
            <UInput v-model="localCustomerData.city" placeholder="City" />
            <UInput v-model="localCustomerData.state" placeholder="State/Province" />
          </div>
          <UInput v-model="localCustomerData.postalCode" placeholder="Postal/ZIP Code" class="mt-2" />
        </UFormGroup>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ClientCard from './ClientCard.vue'

const props = defineProps({
  customerData: {
    type: Object,
    required: true
  },
  selectedClient: {
    type: Object,
    default: null
  },
  clientStatus: {
    type: String,
    default: 'existing'
  }
})

const emit = defineEmits([
  'update:customerData', 
  'update:selectedClient', 
  'update:clientStatus', 
  'open-client-search'
])

// Create local data to track changes
const localCustomerData = ref({ ...props.customerData })

// Watch for changes to props and update local data
watch(() => props.customerData, (newData) => {
  localCustomerData.value = { ...newData }
}, { deep: true })

// Watch for changes to local data and emit updates
watch(localCustomerData, (newData) => {
  emit('update:customerData', newData)
}, { deep: true })

// Handle client status with a computed property
const clientStatusLocal = computed({
  get: () => props.clientStatus,
  set: (value) => {
    emit('update:clientStatus', value)
    
    // If switching to new client, clear selected client
    if (value === 'new' && props.selectedClient) {
      emit('update:selectedClient', null)
    }
  }
})

// Methods
function openClientSearch() {
  emit('open-client-search')
}

function clearClient() {
  emit('update:selectedClient', null)
  // Don't clear customer data when client is cleared - user might want to edit it
}
</script>
