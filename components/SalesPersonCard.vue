<template>
  <div v-if="salesperson" class="mb-6">
    <UCard 
      :ui="{ 
        base: 'relative overflow-hidden',
        ring: '', 
        divide: 'divide-y divide-gray-800',
        body: { padding: 'p-0' }
      }"
    >
      <div class="flex bg-gray-900 p-4">
        <div class="mr-4 flex-shrink-0">
          <div class="h-12 w-12 rounded-full bg-green-900 flex items-center justify-center">
            <UIcon name="i-heroicons-user-circle" class="h-6 w-6 text-green-400" />
          </div>
        </div>
        <div class="flex-grow">
          <h3 class="text-lg font-medium text-white">
            {{ salesperson.fields['First Name'] }} {{ salesperson.fields['Last Name'] }}
          </h3>
          <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
            <div v-if="salesperson.fields['Position']" class="mt-1 flex items-center text-sm text-gray-300">
              <UIcon name="i-heroicons-briefcase" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {{ salesperson.fields['Position'] }}
            </div>
            <div v-if="salesperson.fields['Email']" class="mt-1 flex items-center text-sm text-gray-300">
              <UIcon name="i-heroicons-envelope" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {{ salesperson.fields['Email'] }}
            </div>
            <div v-if="salesperson.fields['Phone']" class="mt-1 flex items-center text-sm text-gray-300">
              <UIcon name="i-heroicons-phone" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {{ salesperson.fields['Phone'] }}
            </div>
          </div>
        </div>
        <div class="ml-2 flex-shrink-0">
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            class="text-gray-400 hover:text-white"
            @click="$emit('clear')"
            title="Clear selected salesperson"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps({
  salesperson: {
    type: Object,
    default: null
  }
})

defineEmits(['clear'])
</script>
