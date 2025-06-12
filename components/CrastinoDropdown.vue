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
    
    <!-- Dropdown Menu (positioned absolutely relative to document) -->
    <Teleport to="body">
      <div 
        v-if="isOpen" 
        ref="dropdownRef"
        class="dropdown-menu"
        @click.stop
        :style="{ 
          minWidth: minWidth,
          top: dropdownPosition.top + 'px',
          left: dropdownPosition.left + 'px',
          maxHeight: dropdownPosition.maxHeight + 'px'
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
    </Teleport>
    
    <!-- Click overlay to close dropdown -->
    <Teleport to="body">
      <div 
        v-if="isOpen" 
        class="dropdown-overlay"
        @click="closeDropdown"
      ></div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick, onMounted } from 'vue'

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
const dropdownRef = ref(null)
const dropdownPosition = ref({ top: 0, left: 0, maxHeight: 244 })

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
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  // Calculate absolute position
  const absoluteTop = rect.bottom + scrollTop + 4 // 4px spacing below the trigger
  const absoluteLeft = rect.left + scrollLeft
  
  // Calculate available space below and above the trigger
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  
  // Default dropdown height
  const defaultMaxHeight = 244
  
  // Determine if dropdown should appear above or below
  let finalTop = absoluteTop
  let maxHeight = defaultMaxHeight
  
  if (spaceBelow < 200 && spaceAbove > spaceBelow) {
    // Show above the trigger if there's more space above
    finalTop = rect.top + scrollTop - Math.min(defaultMaxHeight, spaceAbove - 10)
    maxHeight = Math.min(defaultMaxHeight, spaceAbove - 10)
  } else {
    // Show below the trigger
    maxHeight = Math.min(defaultMaxHeight, spaceBelow - 10)
  }
  
  // Ensure dropdown doesn't go off the right edge of the screen
  const dropdownWidth = parseInt(props.minWidth) || 200
  const maxLeft = window.innerWidth + scrollLeft - dropdownWidth - 10
  const finalLeft = Math.min(absoluteLeft, maxLeft)
  
  dropdownPosition.value = {
    top: finalTop,
    left: finalLeft,
    maxHeight: Math.max(100, maxHeight) // Minimum height of 100px
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

// Handle scroll events to update dropdown position
function handleScroll() {
  if (isOpen.value) {
    // Check if the trigger element is still visible
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      
      // Close dropdown if trigger is scrolled too far out of view
      if (rect.bottom < -50 || rect.top > window.innerHeight + 50) {
        closeDropdown()
        return
      }
    }
    
    // Update position
    updateDropdownPosition()
  }
}

// Handle window resize
function handleResize() {
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.custom-dropdown-container') && 
      !event.target.closest('.dropdown-menu')) {
    closeDropdown()
  }
}

// Add/remove event listeners when dropdown opens/closes
watch(isOpen, (newValue) => {
  console.log('Watch isOpen changed to:', newValue)
  if (newValue) {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true) // Use capture phase
    window.addEventListener('resize', handleResize)
  } else {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', handleScroll, true)
    window.removeEventListener('resize', handleResize)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
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
  position: absolute; /* Changed from fixed to absolute */
  border-radius: 26px;
  background-color: #fff;
  border: 1px solid #8a7c59;
  box-sizing: border-box;
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