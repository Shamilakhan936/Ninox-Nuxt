<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Find Client</h3>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="close"
          />
        </div>
      </template>
      
      <!-- Search input -->
      <div class="mb-4">
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <UInputGroup class="flex-grow">
              <UInput
                v-model="searchTerm"
                placeholder="Search by name, email or phone..."
                @keyup.enter="search"
                autofocus
              />
              <UButton
                color="gray"
                @click="searchTerm = ''"
                v-if="searchTerm"
                icon="i-heroicons-x-mark"
              />
            </UInputGroup>
            <UButton
              icon="i-heroicons-magnifying-glass"
              color="primary"
              :loading="isLoading"
              @click="search"
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
      <div v-if="isLoading" class="flex justify-center py-8">
        <ULoader />
      </div>
      
      <!-- Error message -->
      <UAlert
        v-else-if="error"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        class="mb-4"
      >
        {{ error }}
      </UAlert>
      
      <!-- No results message -->
      <UAlert
        v-else-if="showResults && clients.length === 0 && searchTerm"
        color="amber"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        class="mb-4"
      >
        No clients found matching "{{ searchTerm }}". Please try a different search term.
      </UAlert>
      
      <!-- Search results -->
      <div v-if="showResults && clients.length > 0" class="border rounded-lg overflow-hidden">
        <div class="bg-gray-50 p-2 flex justify-between items-center">
          <span class="text-sm text-gray-600">
            Found {{ pagination.total }} client(s) matching "{{ searchTerm }}"
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
              @click="selectClient(row._original)"
            >
              Select
            </UButton>
          </template>
        </UTable>
      </div>
      
      <!-- Initial state message - only show if no search has been performed -->
      <div v-if="!showResults && !isLoading && !error" class="py-8 text-center text-gray-500">
        Enter a search term and click "Search" to find clients
      </div>
      
      <template #footer>
        <div class="flex justify-between">
          <UButton color="gray" variant="soft" @click="close">
            Cancel
          </UButton>
          <UButton 
            v-if="clients.length > 0" 
            color="primary" 
            @click="close"
          >
            Done
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select', 'notification'])

// Computed property for v-model binding
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Search state
const searchTerm = ref('')
const clients = ref([])
const isLoading = ref(false)
const error = ref('')
const showResults = ref(false)

// Pagination
const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1
})

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

// Function to trigger client search
async function search() {
  if (!searchTerm.value || searchTerm.value.length < 3) {
    error.value = 'Please enter at least 3 characters to search'
    return
  }
  
  error.value = ''
  isLoading.value = true
  showResults.value = true
  
  try {
    const response = await fetch(`/api/ninox/clients?page=${pagination.value.page}&limit=${pagination.value.limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: searchTerm.value
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      clients.value = data.clients
      pagination.value = data.pagination
      
      if (data.clients.length === 0) {
        error.value = data.message || 'No clients found matching your search'
      } else if (data.clients.length === 1) {
        // Emit notification event
        emit('notification', {
          title: 'Client Found',
          description: 'One client was found and has been selected.',
          color: 'blue'
        })
        
        // Auto-select if only one client is found
        selectClient(data.clients[0])
      }
    } else {
      error.value = data.error || 'Failed to search clients'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while searching'
  } finally {
    isLoading.value = false
  }
}

// Function to change page
function changePage(newPage) {
  pagination.value.page = newPage
  search()
}

// Function to select a client
function selectClient(client) {
  emit('select', client)
  emit('notification', {
    title: 'Client Selected',
    description: `${client.fields['First Name']} ${client.fields['Last Name']} has been selected.`,
    color: 'blue'
  })
  close()
}

// Function to close the modal
function close() {
  isOpen.value = false
}

// Reset state when opening modal
function reset() {
  searchTerm.value = ''
  clients.value = []
  error.value = ''
  showResults.value = false
  pagination.value.page = 1
}

// Expose functions to parent
defineExpose({
  reset
})
</script>
