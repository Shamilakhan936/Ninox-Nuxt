<template>
  <div :class="vertical ? 'flex flex-col' : 'flex items-center gap-6'">
    <label
      v-if="label"
      :for="id"
      :class="[
        'text-base text-[#6F6259]',
        vertical ? 'mb-2' : 'w-[200px] shrink-0',
        labelClass
      ]"
    >
      {{ label }}
    </label>

    <div ref="containerRef" class="relative" :style="{ width }">
      <!-- Trigger -->
      <div
        :class="[
          'rounded-[66px] px-6 py-3 pr-10 text-sm border border-[#C9C7C5] bg-white text-black flex items-center justify-between cursor-pointer',
          { 'ring-2 ring-[#2d2d2d]': isOpen }
        ]"
        @click="toggleDropdown"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="isOpen"
      >
        <span class="truncate">{{ displayValue || placeholder }}</span>
        <svg class="w-4 h-4 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Dropdown Menu -->
      <Teleport to="body">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="z-50 absolute bg-white border border-[#C9C7C5] rounded-2xl shadow-lg mt-2 py-2"
          :style="{ ...dropdownStyles, minWidth: width, width }"
        >
          <div
            v-for="option in options"
            :key="option"
            @click="selectOption(option)"
            :class="[
              'px-6 py-2 cursor-pointer transition-colors',
              isSelected(option)
                ? 'bg-[#8A7C59] text-white font-semibold'
                : 'bg-white text-[#3D3935]',
              'hover:bg-[#F5F5F5] hover:text-[#2D1713]'
            ]"
          >
            {{ option }}
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  id: String,
  label: String,
  options: Array,
  placeholder: String,
  modelValue: String,
  vertical: { type: Boolean, default: false },
  labelClass: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  width: { type: String, default: '200px' }
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref(null)
const dropdownRef = ref(null)

const displayValue = computed(() => {
  if (!props.modelValue) return null
  return props.modelValue
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) nextTick(positionDropdown)
}

function selectOption(option) {
  emit('update:modelValue', option)
  isOpen.value = false
}

function isSelected(option) {
  return option === props.modelValue
}

function handleClickOutside(event) {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target) &&
    (!dropdownRef.value || !dropdownRef.value.contains(event.target))
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

watch(() => props.modelValue, () => {
  isOpen.value = false
})

// Dropdown positioning (basic, can be improved)
const dropdownStyles = computed(() => {
  if (!containerRef.value) return {}
  const rect = containerRef.value.getBoundingClientRect()
  return {
    position: 'absolute',
    top: rect.bottom + window.scrollY + 'px',
    left: rect.left + window.scrollX + 'px',
    minWidth: rect.width + 'px'
  }
})

function positionDropdown() {
  // This can be improved for edge cases
}
</script>
