<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }">
    <div class="fabric-search-container">
      <!-- Close button -->
      <button class="close-button" @click="close">
        ×
      </button>
      
      <!-- Title -->
      <div class="search-title">Select Fabric Color</div>
      
      <!-- Subtitle -->
      <div class="search-subtitle">Choose a color for {{ fabricName || 'selected fabric' }}</div>
      
      <!-- Divider line -->
      <div class="search-divider" />
      
      <!-- Search form container -->
      <div class="search-form-container">
        <!-- Search input -->
        <input
          v-model="searchQuery"
          placeholder="Search by color name or category..."
          class="search-input"
          @keyup.enter="debouncedSearch"
          @input="debouncedSearch"
          autofocus
        />
        
        <!-- Search button -->
        <button
          class="search-button"
          :disabled="isLoading"
          @click="searchFabricColors"
        >
          <span v-if="!isLoading">SEARCH</span>
          <span v-else>SEARCHING...</span>
        </button>
      </div>
      
      <!-- Helper text -->
      <div class="search-helper-text">
        {{ fabricId ? 'Search for specific color names or browse all available colors for this fabric.' : 'Please select a fabric first to view available colors.' }}
      </div>
      
      <!-- Results section -->
      <div class="results-section">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-gray-500" />
        </div>
        
        <!-- Error state -->
        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          class="mb-4"
        >
          {{ error }}
        </UAlert>
        
        <!-- No fabric selected -->
        <UAlert
          v-else-if="!fabricId"
          color="amber"
          variant="soft"
          icon="i-heroicons-information-circle"
          class="mb-4"
        >
          Please select a fabric first to view available colors.
        </UAlert>
        
        <!-- Results grid -->
        <div v-else-if="fabricColors.length > 0" class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-2 flex justify-between items-center">
            <span class="text-sm text-gray-600">
              Found {{ fabricColors.length }} color(s) for {{ fabricName }}
            </span>
          </div>
          
          <!-- Color grid -->
          <div class="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
            <div
              v-for="color in fabricColors"
              :key="color.id"
              class="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              @click="selectColor(color)"
            >
              <div class="flex items-center space-x-3">
                <div 
                  class="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
                  :style="{ backgroundColor: color.swatchColor || '#64748b' }"
                ></div>
                <div class="overflow-hidden flex-1">
                  <div class="text-sm font-medium text-gray-900 truncate">
                    {{ color.colour }}
                  </div>
                  <div class="text-xs text-gray-500 truncate">
                    {{ color.collectionName || fabricName }}
                    <template v-if="color.colourCategory">
                      - {{ color.colourCategory }}
                    </template>
                  </div>
                  <div v-if="color.availableForSample" class="text-xs text-green-600 mt-1">
                    Sample Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No results -->
        <div v-else-if="fabricId && searchQuery && !isLoading" class="text-center py-8">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p class="text-gray-600">No colors found matching "{{ searchQuery }}" for this fabric.</p>
        </div>
        
        <!-- No colors for fabric -->
        <div v-else-if="fabricId && !isLoading && hasSearched" class="text-center py-8">
          <UIcon name="i-heroicons-swatch" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p class="text-gray-600">No colors available for this fabric yet.</p>
        </div>
        
        <!-- Footer buttons -->
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
import { ref, watch, computed } from 'vue'
import debounce from 'lodash/debounce'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  fabricType: {
    type: String,
    default: ''
  },
  fabricName: {
    type: String,
    default: ''
  },
  fabricId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['update:model-value', 'select', 'notification'])

// Computed for modal state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value)
})

// State
const searchQuery = ref('')
const fabricColors = ref([])
const isLoading = ref(false)
const error = ref(null)
const hasSearched = ref(false)

// Methods
const debouncedSearch = debounce(() => {
  searchFabricColors()
}, 300)

// Reset the search state
function reset() {
  searchQuery.value = ''
  fabricColors.value = []
  error.value = null
  hasSearched.value = false
}

// Select a fabric color
function selectColor(color) {
  console.log('Selected color:', color)
  
  // Transform the color data to match what table-orders expects
  const transformedColor = {
    id: color.id,
    fields: {
      'Color ID': color.id,
      'Color Name': color.colour,
      'Collection Name': color.collectionName,
      'Color Category': color.colourCategory,
      'Available for Sample': color.availableForSample
    },
    // Include original data
    ...color
  }
  
  emit('select', transformedColor)
  
  emit('notification', {
    title: 'Color Selected',
    description: `${color.colour} has been selected.`,
    color: 'indigo'
  })
  
  close()
}

// Close modal
function close() {
  isOpen.value = false
}

// Fetch fabric colors
async function searchFabricColors() {
  if (!props.fabricId) {
    error.value = 'No fabric selected'
    return
  }
  
  isLoading.value = true
  error.value = null
  hasSearched.value = true
  
  try {
    const queryParams = new URLSearchParams({
      fabricId: props.fabricId.toString()
    })
    
    // Add search query if provided
    if (searchQuery.value.trim()) {
      queryParams.append('search', searchQuery.value.trim())
    }
    
    const response = await fetch(`/api/fabric-colours?${queryParams}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle both data.data and direct array response
    fabricColors.value = data.data || data || []
    
  } catch (err) {
    console.error('Error fetching fabric colors:', err)
    error.value = err.message || 'Failed to fetch fabric colors'
    emit('notification', {
      title: 'Error',
      description: err.message || 'Failed to fetch fabric colors',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

// Watch for modal open
watch(() => props.modelValue, (newVal) => {
  if (newVal && props.fabricId) {
    reset()
    // Auto-fetch colors when modal opens
    searchFabricColors()
  }
})

// Watch for fabric ID changes
watch(() => props.fabricId, (newVal) => {
  if (props.modelValue && newVal) {
    reset()
    searchFabricColors()
  }
})

// Expose methods
defineExpose({
  reset
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