<template>
  <UCard 
    class="relative"
    :ui="{
      base: 'relative overflow-hidden',
      ring: '',
      divide: '',
      header: { padding: 'p-0' },
      body: { padding: 'p-0' },
      footer: { padding: 'p-0' },
      background: 'bg-gray-900',
      rounded: 'rounded-lg',
      shadow: 'shadow-md'
    }"
  >
    <!-- Product header with delete button -->
    <div class="flex justify-between items-center p-4 border-b border-gray-800">
      <h3 class="text-md font-semibold text-white">
        Item #{{ index + 1 }}: {{ item.productType || 'Product' }}
        <span class="ml-2 text-sm font-normal text-gray-400">
          {{ item.material || 'No material selected' }}
        </span>
      </h3>
      <UButton
        color="red"
        variant="ghost"
        icon="i-heroicons-trash"
        size="xs"
        class="text-gray-400 hover:text-red-400"
        @click="$emit('remove')"
        title="Remove item"
      />
    </div>
    
    <!-- Product details in grid layout -->
    <div class="grid grid-cols-2 gap-2 text-sm p-4 bg-gray-800">
      <div class="text-gray-300">
        <span class="text-gray-400">Dimensions:</span> 
        {{ item.width || 0 }}mm × {{ item.height || 0 }}mm
      </div>
      <div class="text-gray-300">
        <span class="text-gray-400">Quantity:</span> 
        {{ item.quantity || 1 }}
      </div>
      <div v-if="item.isMotorized" class="text-gray-300">
        <span class="text-gray-400">Motor Type:</span> 
        {{ item.motorType }}
      </div>
      <div v-else class="text-gray-300">
        <span class="text-gray-400">Control:</span> 
        {{ item.controlSide || 'Left' }} side
        <template v-if="item.chainType">
          ({{ item.chainType }})
        </template>
      </div>
    </div>
    
    <!-- Notes if present -->
    <div v-if="item.notes" class="p-4 text-sm text-gray-300 border-t border-gray-800 bg-gray-800">
      <span class="text-gray-400">Notes:</span> {{ item.notes }}
    </div>
    
    <!-- Edit button -->
    <div class="p-3 flex justify-end bg-gray-900 border-t border-gray-800">
      <UButton
        color="blue"
        variant="solid"
        size="sm"
        class="bg-blue-700 hover:bg-blue-600"
        @click="$emit('edit')"
      >
        Edit
      </UButton>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

defineEmits(['edit', 'remove'])
</script>
