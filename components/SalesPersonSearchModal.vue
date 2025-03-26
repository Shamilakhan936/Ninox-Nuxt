<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Select Salesperson</h3>
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
                placeholder="Search by name..."
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
            Enter a name to search or leave blank to see all salespeople.
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
        v-else-if="showResults && salespeople.length === 0 && searchTerm"
        color="amber"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        class="mb-4"
      >
        No salespeople found matching "{{ searchTerm }}". Please try a different search term.
      </UAlert>
      
      <!-- Search results -->
      <div v-if="showResults && salespeople.length > 0" class="border rounded-lg overflow-hidden">
        <div class="bg-gray-50 p-2 flex justify-between items-center">
          <span class="text-sm text-gray-600">
            Found {{ pagination.total }} salesperson(s)
            <span v-if="pagination.total > pagination.limit">
              (showing {{ salespeople.length }} of {{ pagination.total }})
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
            { key: 'position', label: 'Position' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'actions', label: '' }
          ]"
          :rows="formattedSalespeople"
          hover
          :sort="{ column: 'name', direction: 'asc' }"
        >
          <template #position-data="{ row }">
            {{ row.position || '-' }}
          </template>
          <template #actions-data="{ row }">
            <UButton
              color="primary"
              variant="ghost"
              size="xs"
              @click="selectSalesperson(row._original)"
            >
              Select
            </UButton>
          </template>
        </UTable>
      </div>
      
      <!-- Initial state message - only show if no search has been performed -->
      <div v-if="!showResults && !isLoading && !error" class="py-8 text-center text-gray-500">
        Click "Search" to view all salespeople or enter a name to filter
      </div>
      
      <template #footer>
        <div class="flex justify-between">
          <UButton color="gray" variant="soft" @click="close">
            Cancel
          </UButton>
          <UButton 
            v-if="salespeople.length > 0" 
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
const salespeople = ref([])
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

// Format salespeople for display in the table
const formattedSalespeople = computed(() => {
  return salespeople.value.map(person => ({
    _original: person,
    name: `${person.fields['First Name'] || ''} ${person.fields['Last Name'] || ''}`.trim(),
    email: person.fields['Email'] || '',
    phone: person.fields['Phone'] || '',
    position: person.fields['Position'] || ''
  }))
})

// Function to trigger search
async function search() {
  error.value = ''
  isLoading.value = true
  showResults.value = true
  
  try {
    const response = await fetch(`/api/ninox/salespeople?page=${pagination.value.page}&limit=${pagination.value.limit}`, {
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
      salespeople.value = data.salespeople
      pagination.value = data.pagination
      
      if (data.salespeople.length === 0 && searchTerm.value) {
        error.value = data.message || 'No salespeople found matching your search'
      }
    } else {
      error.value = data.error || 'Failed to search salespeople'
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

// Function to select a salesperson
function selectSalesperson(person) {
  emit('select', person)
  close()
}

// Function to close the modal
function close() {
  isOpen.value = false
}

// Reset state when opening modal
function reset() {
  searchTerm.value = ''
  salespeople.value = []
  error.value = ''
  showResults.value = false
  pagination.value.page = 1
}

// Expose functions to parent
defineExpose({
  reset,
  search // Expose the search function to allow parent to trigger a search
})
</script>
