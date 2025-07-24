<template>
  <div ref="containerRef" class="custom-dropdown-container" :style="{ minWidth: minWidth }">
    <!-- Top Box (Trigger) -->
    <div 
      :class="[
        'top-box',
        { 'open': isOpen, 'disabled': disabled }
      ]"
      :style="{height: height}"
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
        minWidth: dropdownWidth,
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
  },
  open: {
    type: Boolean,
    default: undefined
  },
  dropdownWidth : {
    type: String
  },
  height : {
   type: String
  }
})

const emit = defineEmits(['update:modelValue', 'click', 'open', 'close'])

// Controlled open state
const isControlled = computed(() => props.open !== undefined)
const isOpen = computed({
  get() {
    return isControlled.value ? props.open : localOpen.value
  },
  set(val) {
    if (isControlled.value) {
      if (val) emit('open')
      else emit('close')
    } else {
      localOpen.value = val
    }
  }
})
const localOpen = ref(false)
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
  if (!isOpen.value) {
    isOpen.value = true
    nextTick(() => {
      updateDropdownPosition()
    })
    emit('click')
    if (isControlled.value) emit('open')
  } else {
    isOpen.value = false
    if (isControlled.value) emit('close')
  }
}

function updateDropdownPosition() {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  
  // Constants
  const DROPDOWN_SPACING = 4
  const MIN_SPACE_NEEDED = 10 // Reduced minimum space needed
  const DEFAULT_MAX_HEIGHT = 244
  const EDGE_BUFFER = 10
  const ABSOLUTE_MIN_HEIGHT = 60 // Absolute minimum height for dropdown
  
  // Calculate available space
  const spaceBelow = viewportHeight - rect.bottom - EDGE_BUFFER
  const spaceAbove = rect.top - EDGE_BUFFER
  
const dropdownWidth = computed(() => {
  return window.innerWidth >= 768 ? '500px' : 'auto'
})
  
  // Determine position and constraints
  let finalTop
  let maxHeight
  let showAbove = false
  
  // Always try to position relative to the trigger first
  if (spaceBelow >= MIN_SPACE_NEEDED) {
    // Show below - there's enough reasonable space
    showAbove = false
    finalTop = rect.bottom + DROPDOWN_SPACING
    maxHeight = Math.min(DEFAULT_MAX_HEIGHT, spaceBelow - DROPDOWN_SPACING)
  } else if (spaceAbove >= MIN_SPACE_NEEDED) {
    // Show above - not enough space below but enough above
    showAbove = true
    maxHeight = Math.min(DEFAULT_MAX_HEIGHT, spaceAbove - DROPDOWN_SPACING)
    finalTop = rect.top - maxHeight - DROPDOWN_SPACING
  } else {
    // Very limited space case: still position relative to trigger, just use whatever space is available
    if (spaceBelow >= spaceAbove) {
      // Prefer below even with minimal space
      showAbove = false
      finalTop = rect.bottom + DROPDOWN_SPACING
      maxHeight = Math.max(ABSOLUTE_MIN_HEIGHT, spaceBelow - DROPDOWN_SPACING)
      
      // If dropdown would go off bottom, adjust but keep it below the trigger
      if (finalTop + maxHeight > viewportHeight - EDGE_BUFFER) {
        maxHeight = Math.max(ABSOLUTE_MIN_HEIGHT, viewportHeight - finalTop - EDGE_BUFFER)
      }
    } else {
      // Prefer above even with minimal space
      showAbove = true
      maxHeight = Math.max(ABSOLUTE_MIN_HEIGHT, spaceAbove - DROPDOWN_SPACING)
      finalTop = rect.top - maxHeight - DROPDOWN_SPACING
      
      // If dropdown would go off top, adjust but keep it above the trigger
      if (finalTop < EDGE_BUFFER) {
        finalTop = EDGE_BUFFER
        maxHeight = Math.max(ABSOLUTE_MIN_HEIGHT, rect.top - EDGE_BUFFER - DROPDOWN_SPACING)
      }
    }
  }
  
  // Handle horizontal positioning
  let finalLeft = rect.left
  
  // Ensure dropdown doesn't go off the right edge
  if (finalLeft + dropdownWidth > viewportWidth - EDGE_BUFFER) {
    finalLeft = viewportWidth - dropdownWidth - EDGE_BUFFER
  }
  
  // Ensure dropdown doesn't go off the left edge
  if (finalLeft < EDGE_BUFFER) {
    finalLeft = EDGE_BUFFER
  }
  
  // Final safety check: ensure we have a minimum viable height
  maxHeight = Math.max(ABSOLUTE_MIN_HEIGHT, maxHeight)
  
  dropdownPosition.value = {
    top: finalTop,
    left: finalLeft,
    maxHeight: maxHeight
  }
}

function closeDropdown() {
  isOpen.value = false
  if (isControlled.value) emit('close')
}

function selectOption(option) {
  const value = getOptionValue(option)
  emit('update:modelValue', value)
  closeDropdown()
}

// Handle scroll events to update dropdown position
function handleScroll() {
  if (isOpen.value) {
    // Check if the trigger element is still visible and reasonably positioned
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Close dropdown if trigger is scrolled way out of view
      if (rect.bottom < -100 || rect.top > viewportHeight + 100) {
        closeDropdown()
        return
      }
      
      // If trigger is still somewhat visible, update position
      if (rect.bottom > -50 && rect.top < viewportHeight + 50) {
        updateDropdownPosition()
      }
    }
  }
}

// Handle window resize
function handleResize() {
  if (isOpen.value) {
    // Small delay to ensure window has finished resizing
    setTimeout(() => {
      updateDropdownPosition()
    }, 10)
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  // Don't close if clicking on the trigger or dropdown
  if (event.target.closest('.custom-dropdown-container') || 
      event.target.closest('.dropdown-menu')) {
    return
  }
  closeDropdown()
}

// Enhanced keyboard support
function handleKeydown(event) {
  if (!isOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      closeDropdown()
      break
    case 'Tab':
      closeDropdown()
      break
  }
}

// Remove watch on isOpen, and instead watch isOpen (computed) for event listeners
watch(isOpen, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true)
      document.addEventListener('keydown', handleKeydown, true)
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
    }, 10)
  } else {
    document.removeEventListener('click', handleClickOutside, true)
    document.removeEventListener('keydown', handleKeydown, true)
    window.removeEventListener('scroll', handleScroll, true)
    window.removeEventListener('resize', handleResize)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('keydown', handleKeydown, true)
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
  border: 1px solid #BFB7B0;
  box-sizing: border-box;
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  z-index: 10100; /* Higher than modal's 10001 */
  background: transparent;
}

.dropdown-menu {
  position: fixed;
  border-radius: 26px;
  background-color: #fff;
  border: 1px solid #8a7c59;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 99999 !important; /* Higher than modal's 10001 and overlay's 10100 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: max-content;
  min-width: 200px;
  
  /* Smooth transitions for position changes */
  transition: opacity 0.15s ease, transform 0.15s ease;
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
  white-space: nowrap;
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
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background-color: #E5E5E5;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background-color: #DBDAD8;
}

/* Animation for dropdown appearance */
.dropdown-menu {
  animation: dropdownAppear 0.15s ease-out;
}

@keyframes dropdownAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>