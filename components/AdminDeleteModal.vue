<template>
  <!-- Delete Confirmation Modal -->
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-wrapper" @click.stop>
      <div class="admin-modal-container delete-modal">
        <!-- Close button -->
        <button class="modal-close-button" @click="$emit('close')">
          ×
        </button>
        
        <!-- Modal Title -->
        <div class="modal-title delete-title">
          Confirm Delete
        </div>
        
        <!-- Modal Subtitle -->
        <div class="modal-subtitle">
          Are you sure you want to delete this {{ entity.singular.toLowerCase() }}?
        </div>
        
        <!-- Divider line -->
        <div class="modal-divider" />
        
        <!-- Delete Warning Content -->
        <div class="modal-form-content">
          <div class="delete-warning">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 delete-warning-icon" />
            <p class="delete-warning-text">
              This action cannot be undone. All data associated with this {{ entity.singular.toLowerCase() }} will be permanently removed.
            </p>
          </div>
        </div>
        
        <!-- Modal Footer Buttons -->
        <div class="modal-footer-buttons">
          <button @click="$emit('close')" class="modal-cancel-button">
            Cancel
          </button>
          <button @click="$emit('confirm')" :disabled="deleting" class="modal-delete-button">
            <UIcon v-if="deleting" name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  entity: {
    type: Object,
    required: true
  },
  deleting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);
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

.delete-title {
  color: #EF4444;
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

/* Delete Warning Styling */
.delete-warning {
  text-align: center;
  padding: 20px 0;
}

.delete-warning-icon {
  color: #EF4444;
}

.delete-warning-text {
  font-size: 14px;
  line-height: 20px;
  color: #6B6B6B;
  font-family: 'Albert Sans', sans-serif;
  font-weight: 300;
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

.modal-delete-button {
  border-radius: 74px;
  background-color: #EF4444;
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

.modal-delete-button:hover:not(:disabled) {
  background-color: #DC2626;
}

.modal-delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Focus states for accessibility */
.modal-close-button:focus,
.modal-cancel-button:focus,
.modal-delete-button:focus {
  outline: 2px solid #8a7c59;
  outline-offset: 2px;
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
.modal-delete-button .w-4 {
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
  .modal-delete-button {
    padding: 12px 32px;
    width: 100%;
  }
}
</style> 