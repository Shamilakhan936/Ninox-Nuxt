<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }">
    <div class="fabric-search-container">
      <!-- Close button -->
      <button class="close-button" @click="close">
        ×
      </button>
      
      <!-- Title -->
      <div class="search-title">Find Fabric</div>
      
      <!-- Subtitle -->
      <div class="search-subtitle">Enter a search term and click "search" to find fabrics</div>
      
      <!-- Divider line -->
      <div class="search-divider" />
      
      <!-- Search form container -->
      <div class="search-form-container">
        <!-- Search input -->
        <input
          v-model="searchTerm"
          placeholder="Search by fabric name, supplier, or type..."
          class="search-input"
          @keyup.enter="search"
          @input="debouncedSearch"
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
        Enter at least 2 characters to search. More specific searches will yield better results.
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
          v-else-if="fabrics.length === 0 && searchTerm"
          color="amber"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          class="mb-4"
        >
          No fabrics found matching "{{ searchTerm }}". Try a different search term.
        </UAlert>
        
        <!-- Search results -->
        <div v-if="fabrics.length > 0" class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-2 flex justify-between items-center">
            <span class="text-sm text-gray-600">
              Found {{ fabrics.length }} fabric(s)
            </span>
          </div>
          
          <UTable
            :columns="[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'products', label: 'Products' },
              { key: 'transparency', label: 'Transparency' },
              { key: 'supplier', label: 'Supplier' },
              { key: 'price', label: 'Price/m' },
              { key: 'actions', label: '' }
            ]"
            :rows="formattedFabrics"
            hover
            :sort="{ column: 'name', direction: 'asc' }"
          >
            <template #products-data="{ row }">
              <UBadge v-if="row.products" color="blue" variant="subtle" size="sm">
                {{ row.products }}
              </UBadge>
              <span v-else class="text-gray-400">-</span>
            </template>
            
            <template #transparency-data="{ row }">
              <UBadge v-if="row.transparency" color="green" variant="subtle" size="sm">
                {{ row.transparency }}
              </UBadge>
              <span v-else class="text-gray-400">-</span>
            </template>
            
            <template #supplier-data="{ row }">
              <span class="text-sm text-gray-600">{{ row.supplier || '-' }}</span>
            </template>
            
            <template #price-data="{ row }">
              <span v-if="row.price" class="font-medium text-green-600">
                ${{ row.price }}
              </span>
              <span v-else class="text-gray-400">-</span>
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
        
        <!-- Footer buttons for results view -->
        <div class="flex justify-between mt-4">
          <UButton color="gray" variant="soft" @click="close">
            Cancel
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  productType: {
    type: String,
    required: false
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

// Debounced search function
const debouncedSearch = debounce(() => {
  if (searchTerm.value.length >= 2) {
    search()
  }
}, 300)

// Format fabrics for display in the table
const formattedFabrics = computed(() => {
  return fabrics.value.map(fabric => ({
    _original: fabric,
    name: fabric.publicName || 'Unknown Fabric',
    products: fabric.products || null,
    transparency: fabric.transparency || null,
    supplier: fabric.supplierName || null,
    price: fabric.externalPricePerMeter ? Number(fabric.externalPricePerMeter).toFixed(2) : null
  }))
})

// Function to trigger fabric search
async function search() {
  if (searchTerm.value.length < 2) {
    error.value = 'Please enter at least 2 characters to search'
    return
  }
  
  error.value = ''
  isLoading.value = true
  showResults.value = true
  
  try {
    const queryParams = new URLSearchParams({
      search: searchTerm.value
    })
    
    // Add product type filter if provided
    if (props.productType) {
      queryParams.append('productType', props.productType)
    }
    
    const response = await fetch(`/api/fabrics?${queryParams}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle both data.data and direct array response
    fabrics.value = data.data || data || []
    
    if (fabrics.value.length === 0 && searchTerm.value) {
      error.value = 'No fabrics found matching your search'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while searching'
    console.error('Error searching fabrics:', err)
  } finally {
    isLoading.value = false
  }
}

// Function to select a fabric
function selectFabric(fabric) {
  console.log('Selected fabric:', fabric)
  
  // Transform the fabric data to match what table-orders expects
  const transformedFabric = {
    id: fabric.id,
    fabricId: fabric.id,
    fields: {
      'Fabric ID': fabric.id,
      'Fabric Name': fabric.publicName,
      'Fabric Type': fabric.products || 'General',
      'Supplier Name': fabric.supplierName || 'Unknown'
    },
    // Include original data
    ...fabric
  }
  
  emit('select', transformedFabric)
  
  emit('notification', {
    title: 'Fabric Selected',
    description: `${fabric.publicName} has been selected.`,
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
  fabrics.value = []
  error.value = ''
  showResults.value = false
}

// Watch for modal open/close
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    reset()
  }
})

// Expose functions to parent
defineExpose({
  reset,
  search
})
</script>

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

.fabric-search-container {
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
  .fabric-search-container {
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
