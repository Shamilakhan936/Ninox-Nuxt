<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }">
    <div class="client-search-container">
      <!-- Close button - properly positioned -->
      <button
        class="close-button"
        @click="close"
      >
        ×
      </button>
      
      <!-- Title -->
      <div class="search-title">Find Client</div>
      
      <!-- Subtitle -->
      <div class="search-subtitle">Enter a search term and click "search" to find clients</div>
      
      <!-- Divider line -->
      <div class="search-divider" />
      
      <!-- Search form container -->
      <div class="search-form-container">
        <!-- Search input -->
        <input
          v-model="searchTerm"
          placeholder="Search by name, email or phone..."
          class="search-input"
          @keyup.enter="search"
          autofocus
        />
        
        <!-- Search button -->
        <button
          class="search-button"
          :disabled="isLoading"
          @click="search"
        >
          <span v-if="!isLoading">SEARCH</span>
          <span v-else>SEARCHING...</span>
        </button>
      </div>
      
      <!-- Helper text -->
      <div class="search-helper-text">
        Enter at least 3 characters to search. More specific searches will yield better results.
      </div>
      
      <!-- Results section - shown after search -->
      <div v-if="showResults" class="results-section">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-gray-500" />
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
          v-else-if="clients.length === 0 && searchTerm"
          color="amber"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          class="mb-4"
        >
          No clients found matching "{{ searchTerm }}". Try a different search term.
        </UAlert>
        
        <!-- Search results -->
        <div v-if="clients.length > 0" class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-2 flex justify-between items-center">
            <span class="text-sm text-gray-600">
              Found {{ pagination.total }} client(s)
              <span v-if="pagination.total > pagination.limit">
                (showing {{ clients.length }} of {{ pagination.total }})
              </span>
            </span>
            
            <!-- Pagination controls -->
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
        
        <!-- Footer buttons for results view -->
        <div class="flex justify-between mt-4">
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
      </div>
    </div>
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
  showResults.value = false
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

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

.client-search-container {
  width: 100%;
  position: relative;
  min-height: 330px;
  max-width: 860px;
  margin: 0 auto;
  text-align: left;
  font-size: 12px;
  color: #000;
  font-family: 'Albert Sans', sans-serif;
  background-color: #fff;
  border-radius: 8px;
  padding: 60px 56px 60px 56px;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #E5E5E5;
  background-color: #fff;
  color: #666;
  font-size: 18px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: 'Albert Sans', sans-serif;
}

.close-button:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.search-title {
  text-align: center;
  font-size: 30px;
  line-height: 40px;
  font-weight: 300;
  color: #000;
  margin-bottom: 16px;
}

.search-subtitle {
  text-align: center;
  letter-spacing: 0.2em;
  line-height: 14px;
  text-transform: uppercase;
  color: #3d3935;
  font-size: 12px;
  margin-bottom: 20px;
}

.search-divider {
  background-color: rgba(61, 57, 53, 0.15);
  width: 100%;
  height: 1px;
  margin-bottom: 40px;
}

.search-form-container {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  border-radius: 66px;
  background-color: #fff;
  border: 1px solid #c9c7c5;
  padding: 12px 24px;
  font-size: 16px;
  line-height: 26px;
  font-weight: 300;
  flex: 1;
  max-width: 500px;
  font-family: 'Albert Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #8a7c59;
}

.search-input::placeholder {
  color: #9CA3AF;
}

.search-button {
  border-radius: 74px;
  background-color: #8a7c59;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px 48px;
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
  flex-shrink: 0;
}

.search-button:hover:not(:disabled) {
  background-color: #6B5B42;
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-helper-text {
  text-align: center;
  line-height: 16px;
  color: #6f6259;
  font-size: 12px;
  margin-bottom: 20px;
}

.results-section {
  margin-top: 40px;
  padding: 0;
}

/* Reset text selection to browser default */
::selection {
  background-color: Highlight !important;
  color: HighlightText !important;
}

::-moz-selection {
  background-color: Highlight !important;
  color: HighlightText !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .client-search-container {
    padding: 40px 24px;
  }
  
  .search-form-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-input {
    max-width: 100%;
  }
  
  .search-button {
    padding: 12px 32px;
  }
}
</style>
