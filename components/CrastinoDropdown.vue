<template>
  <div ref="containerRef" class="custom-dropdown-container" :style="{ minWidth: minWidth }">
    <!-- Top Box (Trigger) -->
    <div 
      :class="[
        'top-box',
        { 'open': isOpen, 'disabled': disabled }
      ]"
      @click="toggleDropdown"
    >
      <div class="selected-text">{{ displayValue || placeholder }}</div>
      <svg class="dropdown-arrow" viewBox="0 0 8 4" fill="none">
        <path d="M1 1L4 3L7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    
    <!-- Dropdown Menu (positioned directly relative to container) -->
    <div 
      v-if="isOpen" 
      class="dropdown-menu"
      @click.stop
      :style="{ 
        minWidth: minWidth,
        top: dropdownPosition.top + 'px',
        left: dropdownPosition.left + 'px'
      }"
    >
      <div class="dropdown-content">
        <div 
          v-for="(option, index) in options" 
          :key="index"
          :class="[
            'dropdown-option',
            { 'selected': isSelected(option) }
          ]"
          @click="selectOption(option)"
        >
          {{ getOptionLabel(option) }}
          <div v-if="index < options.length - 1" class="option-separator"></div>
        </div>
      </div>
    </div>
    
    <!-- Click overlay to close dropdown -->
    <div 
      v-if="isOpen" 
      class="dropdown-overlay"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Please select'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  minWidth: {
    type: String,
    default: '120px'
  }
})

const emit = defineEmits(['update:modelValue', 'click'])

const isOpen = ref(false)
const containerRef = ref(null)
const dropdownPosition = ref({ top: 0, left: 0 })

// Computed property for display value
const displayValue = computed(() => {
  if (!props.modelValue) return null
  
  if (typeof props.modelValue === 'string') {
    return props.modelValue
  }
  
  if (typeof props.modelValue === 'object' && props.modelValue !== null) {
    return props.modelValue.label || props.modelValue.name || String(props.modelValue)
  }
  
  return String(props.modelValue)
})

// Helper functions
function getOptionLabel(option) {
  if (typeof option === 'string') return option
  if (typeof option === 'object' && option !== null) {
    return option.label || option.name || String(option)
  }
  return String(option)
}

function getOptionValue(option) {
  if (typeof option === 'string') return option
  if (typeof option === 'object' && option !== null) {
    return option.value !== undefined ? option.value : option
  }
  return option
}

function isSelected(option) {
  const optionValue = getOptionValue(option)
  const currentValue = props.modelValue
  
  if (typeof optionValue === 'object' && typeof currentValue === 'object') {
    return JSON.stringify(optionValue) === JSON.stringify(currentValue)
  }
  
  return optionValue === currentValue
}

function toggleDropdown() {
  if (props.disabled) return
  
  console.log('Dropdown toggled, isOpen was:', isOpen.value)
  isOpen.value = !isOpen.value
  console.log('Dropdown isOpen now:', isOpen.value)
  
  // Calculate position when opening
  if (isOpen.value) {
    nextTick(() => {
      updateDropdownPosition()
    })
    emit('click')
  }
}

function updateDropdownPosition() {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    dropdownPosition.value = {
      top: rect.bottom + 4, // 4px spacing below the trigger
      left: rect.left
    }
  }
}

function closeDropdown() {
  console.log('Closing dropdown')
  isOpen.value = false
}

function selectOption(option) {
  console.log('Option selected:', option)
  const value = getOptionValue(option)
  emit('update:modelValue', value)
  closeDropdown()
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.custom-dropdown-container')) {
    closeDropdown()
  }
}

// Add/remove event listener when dropdown opens/closes
watch(isOpen, (newValue) => {
  console.log('Watch isOpen changed to:', newValue)
  if (newValue) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

.custom-dropdown-container {
  position: relative;
  font-family: 'Albert Sans', sans-serif;
}

.top-box {
  border-radius: 48px;
  background-color: #fff;
  border: 1px solid #8a7c59;
  box-sizing: border-box;
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8.8px 16.1px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11.74px;
  line-height: 19.08px;
  font-weight: 300;
}

.top-box:hover {
  border-color: #6B5B42;
}

.top-box.open {
  border-color: #2D2D2D;
  border-width: 1.5px;
}

.top-box.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selected-text {
  color: #000;
  font-size: 11.74px;
  line-height: 19.08px;
  font-weight: 300;
  flex: 1;
}

.dropdown-arrow {
  width: 8px;
  height: 4px;
  color: #6B6B6B;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.top-box.open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background: transparent;
}

.dropdown-menu {
  position: fixed; /* Keep fixed positioning for proper z-index layering */
  border-radius: 26px;
  background-color: #fff;
  border: 1px solid #8a7c59;
  box-sizing: border-box;
  max-height: 244px;
  overflow-y: auto;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: max-content;
  min-width: 200px;
}

.dropdown-content {
  padding: 20px;
  position: relative;
}

.dropdown-option {
  line-height: 26px;
  font-weight: 300;
  color: #000;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.15s ease;
  font-size: 11.74px;
  position: relative;
}

.dropdown-option:hover {
  color: #8A7C59;
}

.dropdown-option.selected {
  color: #8A7C59;
  font-weight: 400;
}

.option-separator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #bfb7b0;
  height: 1px;
}

/* Custom scrollbar */
.dropdown-menu::-webkit-scrollbar {
  width: 4px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background-color: #E5E5E5;
  border-radius: 2px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background-color: #DBDAD8;
}
</style>