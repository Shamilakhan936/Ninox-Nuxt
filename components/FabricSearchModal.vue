<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Select Fabric</h3>
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
                placeholder="Search by fabric name, color or type..."
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
            Search will be filtered by the selected product type: {{ productType }}
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
        v-else-if="showResults && fabrics.length === 0 && searchTerm"
        color="amber"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        class="mb-4"
      >
        No fabrics found matching "{{ searchTerm }}" for product type "{{ productType }}". Try a different search term.
      </UAlert>
      
      <!-- Search results -->
      <div v-if="showResults && fabrics.length > 0" class="border rounded-lg overflow-hidden">
        <div class="bg-gray-50 p-2 flex justify-between items-center">
          <span class="text-sm text-gray-600">
            Found {{ pagination.total }} fabric(s)
            <span v-if="pagination.total > pagination.limit">
              (showing {{ fabrics.length }} of {{ pagination.total }})
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
            { key: 'preview', label: '' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'type', label: 'Type' },
            { key: 'color', label: 'Color' },
            { key: 'actions', label: '' }
          ]"
          :rows="formattedFabrics"
          hover
          :sort="{ column: 'name', direction: 'asc' }"
        >
          <template #preview-data="{ row }">
            <div class="w-10 h-10 rounded-md overflow-hidden">
              <img 
                v-if="row.imageUrl" 
                :src="row.imageUrl" 
                :alt="row.name" 
                class="w-full h-full object-cover"
              />
              <div 
                v-else 
                class="w-full h-full flex items-center justify-center bg-gray-200"
                :style="{ backgroundColor: row.color || '#f3f4f6' }"
              >
                <UIcon name="i-heroicons-swatch" class="h-6 w-6 text-white opacity-75" />
              </div>
            </div>
          </template>
          <template #type-data="{ row }">
            <UBadge color="blue" variant="subtle" size="sm">
              {{ row.type }}
            </UBadge>
          </template>
          <template #color-data="{ row }">
            <div class="flex items-center">
              <span 
                class="w-4 h-4 rounded-full mr-2" 
                :style="{ backgroundColor: row.hex || '#f3f4f6' }"
              ></span>
              {{ row.color }}
            </div>
          </template>
          <template #actions-data="{ row }">
            <UButton
              color="primary"
              variant="ghost"
              size="xs"
              @click="selectFabric(row._original)"
            >
              Select
            </UButton>
          </template>
        </UTable>
      </div>
      
      <!-- Initial state message - only show if no search has been performed -->
      <div v-if="!showResults && !isLoading && !error" class="py-8 text-center text-gray-500">
        Search for fabrics compatible with {{ productType }}
      </div>
      
      <template #footer>
        <div class="flex justify-between">
          <UButton color="gray" variant="soft" @click="close">
            Cancel
          </UButton>
          <UButton 
            v-if="fabrics.length > 0" 
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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  productType: {
    type: String,
    required: true
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
const fabrics = ref([])
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

// Format fabrics for display in the table
const formattedFabrics = computed(() => {
  return fabrics.value.map(fabric => ({
    _original: fabric,
    name: fabric.fields['Fabric Name'] || '',
    type: fabric.fields['Fabric Type'] || '',
    color: fabric.fields['Fabric Color'] || '',
    hex: fabric.fields['Color Hex'] || null,
    imageUrl: fabric.fields['Image URL'] || null
  }))
})

// Watch for product type changes
watch(() => props.productType, () => {
  // Reset fabrics when product type changes
  if (showResults.value) {
    search()
  }
})

// Function to trigger fabric search
async function search() {
  if (!props.productType) {
    error.value = 'Please select a product type first'
    return
  }
  
  error.value = ''
  isLoading.value = true
  showResults.value = true
  
  try {
    const response = await fetch(`/api/ninox/fabrics?page=${pagination.value.page}&limit=${pagination.value.limit}&productType=${encodeURIComponent(props.productType)}`, {
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
      fabrics.value = data.fabrics
      pagination.value = data.pagination
      
      if (data.fabrics.length === 0 && searchTerm.value) {
        error.value = data.message || 'No fabrics found matching your search'
      }
    } else {
      error.value = data.error || 'Failed to search fabrics'
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

// Function to select a fabric
function selectFabric(fabric) {
  // Looking at the logs, we can see the Fabric ID is in fields['Fabric ID']
  const fabricId = fabric.fields['Fabric ID'];
  
  console.log('Selected fabric with fabricId:', fabricId);
  console.log('Full fabric data:', fabric);
  
  if (!fabricId) {
    console.error('No Fabric ID found in the selected fabric:', fabric);
  }
  
  emit('select', {
    ...fabric,
    fabricId: fabricId // Add this explicit property
  });
  
  emit('notification', {
    title: 'Fabric Selected',
    description: `${fabric.fields['Fabric Name']} has been selected.`,
    color: 'blue'
  });
  
  close();
}

// Function to close the modal
function close() {
  isOpen.value = false
}

// Reset state when opening modal
function reset() {
  searchTerm.value = ''
  fabrics.value = []
  error.value = ''
  showResults.value = false
  pagination.value.page = 1
}

// Auto-search when modal opens
watch(isOpen, (newValue) => {
  if (newValue && props.productType) {
    // Slight delay to ensure DOM is ready
    setTimeout(() => {
      search()
    }, 100)
  }
})

// Expose functions to parent
defineExpose({
  reset,
  search
})
</script>
