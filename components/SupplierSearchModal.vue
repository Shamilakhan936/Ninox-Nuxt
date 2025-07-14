


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
          <div class="modal-title">Select Supplier</div>
          
          <!-- Modal Subtitle -->
          <div class="modal-subtitle">Search and select a supplier</div>
          
          <!-- Divider line -->
          <div class="modal-divider" />
          
          <!-- Search Section -->
          <div class="search-section">
            <div class="search-form-container">
              <input
                v-model="searchQuery"
                placeholder="Search by supplier name, location, or currency..."
                class="search-input"
                @keyup.enter="searchSuppliers"
                @input="debouncedSearch"
              />
              <button
                class="search-button"
                :disabled="isLoading"
                @click="searchSuppliers"
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
            <div v-else-if="suppliers.length > 0" class="results-grid">
              <div
                v-for="supplier in suppliers"
                :key="supplier.id"
                class="supplier-card"
                @click="selectSupplier(supplier)"
              >
                <div class="supplier-info">
                  <div class="supplier-name">{{ supplier.name }}</div>
                  <div class="supplier-details">
                    <span class="supplier-currency">{{ supplier.currency }}</span>
                    <span class="supplier-location">{{ supplier.location }}</span>
                  </div>
                  <div v-if="supplier.contactEmail" class="supplier-contact">
                    {{ supplier.contactEmail }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No results -->
            <div v-else-if="searchQuery && !isLoading" class="no-results">
              No suppliers found matching "{{ searchQuery }}"
            </div>
            
            <!-- Initial state -->
            <div v-else class="initial-state">
              Start typing to search for suppliers
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
  const suppliers = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Debounced search function
  const debouncedSearch = debounce(() => {
    if (searchQuery.value.length >= 2) {
      searchSuppliers()
    }
  }, 300)
  
  // Search suppliers function
  async function searchSuppliers() {
    if (!searchQuery.value.trim()) {
      suppliers.value = []
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`/api/suppliers?search=${encodeURIComponent(searchQuery.value)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      suppliers.value = data.data || data
    } catch (err) {
      error.value = `Failed to fetch suppliers: ${err.message}`
      console.error('Error fetching suppliers:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // Select supplier
  function selectSupplier(supplier) {
    emit('select', supplier)
    emit('close')
  }
  
  // Reset state when modal opens
  watch(() => props.show, (newVal) => {
    if (newVal) {
      searchQuery.value = ''
      suppliers.value = []
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
  
  .supplier-card {
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #fff;
  }
  
  .supplier-card:hover {
    border-color: #8a7c59;
    background-color: #fafafa;
  }
  
  .supplier-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .supplier-name {
    font-weight: 400;
    font-size: 16px;
    color: #2D2D2D;
  }
  
  .supplier-details {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #6B6B6B;
  }
  
  .supplier-currency {
    font-weight: 500;
    background-color: #f0f0f0;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
  
  .supplier-location {
    flex: 1;
  }
  
  .supplier-contact {
    font-size: 12px;
    color: #8a7c59;
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