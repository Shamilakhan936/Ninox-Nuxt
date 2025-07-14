<template>
    <!-- Custom Modal Overlay -->
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-wrapper" @click.stop>
        <div class="admin-modal-container">
          <!-- Close button -->
          <button class="modal-close-button" @click="$emit('close')">
            ×
          </button>
          
          <!-- Modal Title -->
          <div class="modal-title">Select Fabric</div>
          
          <!-- Modal Subtitle -->
          <div class="modal-subtitle">Search and select a fabric</div>
          
          <!-- Divider line -->
          <div class="modal-divider" />
          
          <!-- Search Section -->
          <div class="search-section">
            <div class="search-form-container">
              <input
                v-model="searchQuery"
                placeholder="Search by fabric name, supplier, or type..."
                class="search-input"
                @keyup.enter="searchFabrics"
                @input="debouncedSearch"
              />
              <button
                class="search-button"
                :disabled="isLoading"
                @click="searchFabrics"
              >
                <span v-if="!isLoading">SEARCH</span>
                <span v-else>SEARCHING...</span>
              </button>
            </div>
          </div>
          
          <!-- Results Section -->
          <div class="results-section">
            <!-- Loading state -->
            <div v-if="isLoading" class="flex justify-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-gray-500" />
            </div>
            
            <!-- Error state -->
            <div v-else-if="error" class="error-message">
              {{ error }}
            </div>
            
            <!-- Results grid -->
            <div v-else-if="fabrics.length > 0" class="results-grid">
              <div
                v-for="fabric in fabrics"
                :key="fabric.id"
                class="fabric-card"
                @click="selectFabric(fabric)"
              >
                <div class="fabric-info">
                  <div class="fabric-name">{{ fabric.publicName }}</div>
                  <div class="fabric-details">
                    <span v-if="fabric.products" class="fabric-products">{{ fabric.products }}</span>
                    <span v-if="fabric.transparency" class="fabric-transparency">{{ fabric.transparency }}</span>
                  </div>
                  <div class="fabric-specs">
                    <span v-if="fabric.rollWidth" class="fabric-spec">Width: {{ fabric.rollWidth }}</span>
                    <span v-if="fabric.composition" class="fabric-spec">{{ fabric.composition }}</span>
                  </div>
                  <div v-if="fabric.externalPricePerMeter" class="fabric-price">
                    ${{ fabric.externalPricePerMeter }}/meter
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No results -->
            <div v-else-if="searchQuery && !isLoading" class="no-results">
              No fabrics found matching "{{ searchQuery }}"
            </div>
            
            <!-- Initial state -->
            <div v-else class="initial-state">
              Start typing to search for fabrics
            </div>
          </div>
          
          <!-- Modal Footer Buttons -->
          <div class="modal-footer-buttons">
            <button @click="$emit('close')" class="modal-cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import debounce from 'lodash/debounce'
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['close', 'select'])
  
  // State
  const searchQuery = ref('')
  const fabrics = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Debounced search function
  const debouncedSearch = debounce(() => {
    if (searchQuery.value.length >= 2) {
      searchFabrics()
    }
  }, 300)
  
  // Search fabrics function
  async function searchFabrics() {
    if (!searchQuery.value.trim()) {
      fabrics.value = []
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`/api/fabrics?search=${encodeURIComponent(searchQuery.value)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      fabrics.value = data.data || data
    } catch (err) {
      error.value = `Failed to fetch fabrics: ${err.message}`
      console.error('Error fetching fabrics:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // Select fabric
  function selectFabric(fabric) {
    emit('select', fabric)
    emit('close')
  }
  
  // Reset state when modal opens
  watch(() => props.show, (newVal) => {
    if (newVal) {
      searchQuery.value = ''
      fabrics.value = []
      error.value = null
    }
  })
  </script>
  
  <style scoped>
  /* Import Albert Sans font */
  @import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');
  
  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .modal-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
  }
  
  .admin-modal-container {
    width: 100%;
    position: relative;
    min-height: 400px;
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: 'Albert Sans', sans-serif;
    background-color: #fff;
    border-radius: 8px;
    padding: 60px 56px 60px 56px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-close-button {
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
  
  .modal-close-button:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
  }
  
  .modal-title {
    text-align: center;
    font-size: 30px;
    line-height: 40px;
    font-weight: 300;
    color: #000;
    margin-bottom: 16px;
  }
  
  .modal-subtitle {
    text-align: center;
    letter-spacing: 0.2em;
    line-height: 14px;
    text-transform: uppercase;
    color: #3d3935;
    font-size: 12px;
    margin-bottom: 20px;
  }
  
  .modal-divider {
    background-color: rgba(61, 57, 53, 0.15);
    width: 100%;
    height: 1px;
    margin-bottom: 40px;
  }
  
  .search-section {
    margin-bottom: 30px;
  }
  
  .search-form-container {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
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
    align-items: center;
    justify-content: center;
    padding: 16px 32px;
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
  }
  
  .search-button:hover:not(:disabled) {
    background-color: #6B5B42;
  }
  
  .search-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .results-section {
    min-height: 200px;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .results-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
  }
  
  .fabric-card {
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #fff;
  }
  
  .fabric-card:hover {
    border-color: #8a7c59;
    background-color: #fafafa;
  }
  
  .fabric-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .fabric-name {
    font-weight: 400;
    font-size: 16px;
    color: #2D2D2D;
  }
  
  .fabric-details {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #6B6B6B;
  }
  
  .fabric-products {
    background-color: #e7f3ff;
    color: #2563eb;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .fabric-transparency {
    background-color: #f0f9ff;
    color: #0284c7;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .fabric-specs {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #6B6B6B;
  }
  
  .fabric-spec {
    background-color: #f5f5f5;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .fabric-price {
    font-weight: 500;
    color: #8a7c59;
    font-size: 14px;
  }
  
  .error-message {
    text-align: center;
    color: #EF4444;
    padding: 20px;
    font-size: 14px;
  }
  
  .no-results {
    text-align: center;
    color: #6B6B6B;
    padding: 20px;
    font-size: 14px;
  }
  
  .initial-state {
    text-align: center;
    color: #9CA3AF;
    padding: 20px;
    font-size: 14px;
  }
  
  .modal-footer-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
  }
  
  .modal-cancel-button {
    border-radius: 74px;
    background-color: transparent;
    border: 1px solid #c9c7c5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 48px;
    text-align: center;
    font-size: 13px;
    color: #6B6B6B;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.1em;
    line-height: 13px;
    text-transform: uppercase;
    font-family: 'Albert Sans', sans-serif;
    white-space: nowrap;
  }
  
  .modal-cancel-button:hover {
    border-color: #8a7c59;
    color: #8a7c59;
  }
  </style>