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
        <div class="modal-title">
          {{ editingItem ? `Edit ${entity.singular}` : `Create ${entity.singular}` }}
        </div>
        
        <!-- Modal Subtitle -->
        <div class="modal-subtitle">
          {{ editingItem ? 'Update the information below' : 'Enter the information below to create a new entry' }}
        </div>
        
        <!-- Divider line -->
        <div class="modal-divider" />
        
        <!-- Form Content -->
        <div class="modal-form-content">
          <form @submit.prevent="$emit('save')" class="admin-form">
            <div v-for="field in entity.fields" :key="field.key" class="admin-form-group">
              <label :for="field.key" class="admin-form-label">
                {{ field.label }}
                <span v-if="field.required" class="required-asterisk">*</span>
              </label>
              
              <input
                v-if="field.type === 'text' || field.type === 'email'"
                :id="field.key"
                :value="formData[field.key]"
                @input="updateFormData(field.key, $event.target.value)"
                :type="field.type"
                :required="field.required"
                :placeholder="field.placeholder"
                class="admin-modal-input"
              />
              
              <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.key"
                :value="formData[field.key]"
                @input="updateFormData(field.key, $event.target.value)"
                :required="field.required"
                :placeholder="field.placeholder"
                rows="3"
                class="admin-modal-textarea"
              />
              
              <input
                v-else-if="field.type === 'number'"
                :id="field.key"
                :value="formData[field.key]"
                @input="updateFormData(field.key, $event.target.value)"
                type="number"
                step="0.01"
                :required="field.required"
                :placeholder="field.placeholder"
                class="admin-modal-input"
              />
              
              <input
                v-else-if="field.type === 'date'"
                :id="field.key"
                :value="formData[field.key]"
                @input="updateFormData(field.key, $event.target.value)"
                type="date"
                :required="field.required"
                class="admin-modal-input"
              />
              
              <CrastinoDropdown
                v-else-if="field.type === 'select'"
                :id="field.key"
                :model-value="formData[field.key]"
                @update:model-value="updateFormData(field.key, $event)"
                :options="field.options"
                :placeholder="field.placeholder"
                min-width="100%"
              />
              
              <!-- Modal Search Fields -->
              <div v-else-if="field.type === 'modal-search'" class="modal-search-field">
                <div class="selected-display" v-if="selectedItems[field.key]">
                  <div class="selected-item">
                    <span class="selected-name">{{ getSelectedDisplayName(field, selectedItems[field.key]) }}</span>
                    <button type="button" @click="clearSelection(field.key)" class="clear-selection">
                      ×
                    </button>
                  </div>
                </div>
                <button 
                  type="button" 
                  @click="openSearchModal(field)" 
                  class="search-modal-button"
                  :class="{ 'has-selection': selectedItems[field.key] }"
                >
                  <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 mr-2" />
                  {{ selectedItems[field.key] ? 'Change' : `Select ${field.label}` }}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Modal Footer Buttons -->
        <div class="modal-footer-buttons">
          <button @click="$emit('close')" class="modal-cancel-button">
            Cancel
          </button>
          <button @click="$emit('save')" :disabled="saving" class="modal-save-button">
            <UIcon v-if="saving" name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
            {{ editingItem ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Search Modals -->
  <SupplierSearchModal
    :show="activeSearchModal === 'supplier'"
    @close="closeSearchModal"
    @select="onSupplierSelect"
  />
  
  <DatabaseFabricSearchModal
    :show="activeSearchModal === 'fabric'"
    @close="closeSearchModal"
    @select="onFabricSelect"
  />
</template>

<script setup>
import CrastinoDropdown from './CrastinoDropdown.vue'
import SupplierSearchModal from './SupplierSearchModal.vue'
import DatabaseFabricSearchModal from './DatabaseFabricSearchModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  entity: {
    type: Object,
    required: true
  },
  editingItem: {
    type: Object,
    default: null
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save', 'update:formData']);

// State for modal searches
const activeSearchModal = ref(null)
const currentSearchField = ref(null)
const selectedItems = ref({})

// Initialize selected items when form data changes
watch(() => props.formData, (newFormData) => {
  // Initialize selected items based on existing form data
  if (newFormData && props.entity.fields) {
    props.entity.fields.forEach(field => {
      if (field.type === 'modal-search' && newFormData[field.key]) {
        // We have an ID but need to fetch the display data
        fetchSelectedItemData(field, newFormData[field.key])
      }
    })
  }
}, { immediate: true })

// Fetch data for already selected items (for edit mode)
async function fetchSelectedItemData(field, id) {
  if (!id || selectedItems.value[field.key]) return
  
  try {
    let endpoint = ''
    if (field.searchType === 'supplier') {
      endpoint = `/api/suppliers/${id}`
    } else if (field.searchType === 'fabric') {
      endpoint = `/api/fabrics/${id}`
    }
    
    if (endpoint) {
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        selectedItems.value[field.key] = data.data || data
      }
    }
  } catch (err) {
    console.error('Error fetching selected item data:', err)
  }
}

function updateFormData(key, value) {
  emit('update:formData', { ...props.formData, [key]: value });
}

function openSearchModal(field) {
  currentSearchField.value = field
  activeSearchModal.value = field.searchType
}

function closeSearchModal() {
  activeSearchModal.value = null
  currentSearchField.value = null
}

function onSupplierSelect(supplier) {
  if (currentSearchField.value) {
    selectedItems.value[currentSearchField.value.key] = supplier
    updateFormData(currentSearchField.value.key, supplier.id)
    closeSearchModal()
  }
}

function onFabricSelect(fabric) {
  if (currentSearchField.value) {
    selectedItems.value[currentSearchField.value.key] = fabric
    updateFormData(currentSearchField.value.key, fabric.id)
    closeSearchModal()
  }
}

function clearSelection(fieldKey) {
  selectedItems.value[fieldKey] = null
  updateFormData(fieldKey, null)
}

function getSelectedDisplayName(field, selectedItem) {
  if (!selectedItem) return ''
  
  if (field.searchType === 'supplier') {
    return selectedItem.name || 'Unknown Supplier'
  } else if (field.searchType === 'fabric') {
    return selectedItem.publicName || 'Unknown Fabric'
  }
  
  return 'Selected Item'
}

// Reset selected items when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    activeSearchModal.value = null
    currentSearchField.value = null
  }
})
</script>

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Modal Overlay - Full screen backdrop with VERY HIGH z-index */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10001; /* Higher than navbar's 1001 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Modal Wrapper - Centering container */
.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
}

/* Modal Container - Based on FabricSearchModal design */
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

/* Close button - Matching FabricSearchModal */
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

/* Modal Title - Matching FabricSearchModal */
.modal-title {
  text-align: center;
  font-size: 30px;
  line-height: 40px;
  font-weight: 300;
  color: #000;
  margin-bottom: 16px;
}

/* Modal Subtitle - Matching FabricSearchModal */
.modal-subtitle {
  text-align: center;
  letter-spacing: 0.2em;
  line-height: 14px;
  text-transform: uppercase;
  color: #3d3935;
  font-size: 12px;
  margin-bottom: 20px;
}

/* Modal Divider - Matching FabricSearchModal */
.modal-divider {
  background-color: rgba(61, 57, 53, 0.15);
  width: 100%;
  height: 1px;
  margin-bottom: 40px;
}

/* Form Content */
.modal-form-content {
  margin-bottom: 40px;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-form-label {
  font-size: 12px;
  font-weight: 400;
  color: #3d3935;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: 'Albert Sans', sans-serif;
}

.required-asterisk {
  color: #EF4444;
  margin-left: 4px;
}

/* Input styling - Matching FabricSearchModal */
.admin-modal-input,
.admin-modal-textarea {
  border-radius: 66px;
  background-color: #fff;
  border: 1px solid #c9c7c5;
  padding: 12px 24px;
  font-size: 16px;
  line-height: 26px;
  font-weight: 300;
  font-family: 'Albert Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.admin-modal-textarea {
  border-radius: 16px;
  resize: vertical;
  min-height: 80px;
}

.admin-modal-input:focus,
.admin-modal-textarea:focus {
  border-color: #8a7c59;
}

.admin-modal-input::placeholder,
.admin-modal-textarea::placeholder {
  color: #9CA3AF;
}

/* Modal Search Field Styling */
.modal-search-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-display {
  margin-bottom: 8px;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 8px 12px;
}

.selected-name {
  font-size: 14px;
  color: #0284c7;
  font-weight: 400;
}

.clear-selection {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-selection:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #ef4444;
}

.search-modal-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: 1px solid #c9c7c5;
  border-radius: 66px;
  background-color: #fff;
  color: #6B6B6B;
  font-size: 14px;
  font-weight: 300;
  font-family: 'Albert Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-modal-button:hover {
  border-color: #8a7c59;
  color: #8a7c59;
}

.search-modal-button.has-selection {
  border-color: #bae6fd;
  color: #0284c7;
  background-color: #f0f9ff;
}

.search-modal-button.has-selection:hover {
  border-color: #0284c7;
  background-color: #e0f2fe;
}

/* Footer Buttons - Matching FabricSearchModal button style */
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

.modal-save-button {
  border-radius: 74px;
  background-color: #8a7c59;
  display: flex;
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
}

.modal-save-button:hover:not(:disabled) {
  background-color: #6B5B42;
}

.modal-save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Focus states for accessibility */
.modal-close-button:focus,
.modal-cancel-button:focus,
.modal-save-button:focus {
  outline: 2px solid #8a7c59;
  outline-offset: 2px;
}

.admin-modal-input:focus,
.admin-modal-textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(138, 124, 89, 0.2);
}

/* Scrollbar styling for modal */
.admin-modal-container::-webkit-scrollbar {
  width: 6px;
}

.admin-modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.admin-modal-container::-webkit-scrollbar-thumb {
  background: #c9c7c5;
  border-radius: 3px;
}

.admin-modal-container::-webkit-scrollbar-thumb:hover {
  background: #8a7c59;
}

/* Animation for modal */
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.admin-modal-container {
  animation: slideIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading state styling */
.modal-save-button .w-4 {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-modal-container {
    padding: 40px 24px;
    margin: 10px;
    max-width: calc(100vw - 20px);
  }
  
  .modal-title {
    font-size: 24px;
    line-height: 32px;
  }
  
  .modal-footer-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .modal-cancel-button,
  .modal-save-button {
    padding: 12px 32px;
    width: 100%;
  }
  
  .admin-modal-input,
  .admin-modal-textarea {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style> 