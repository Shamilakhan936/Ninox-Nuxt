<template>
  <div v-if="client" class="mb-6">
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
          <div class="h-12 w-12 rounded-full bg-blue-900 flex items-center justify-center">
            <UIcon name="i-heroicons-user" class="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div class="flex-grow">
          <h3 class="text-lg font-medium text-white">
            {{ client.fields['First Name'] }} {{ client.fields['Last Name'] }}
          </h3>
          <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
            <div v-if="client.fields['Company']" class="mt-1 flex items-center text-sm text-gray-300">
              <UIcon name="i-heroicons-building-office-2" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {{ client.fields['Company'] }}
            </div>
            <div v-if="client.fields['Email']" class="mt-1 flex items-center text-sm text-gray-300">
              <UIcon name="i-heroicons-envelope" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {{ client.fields['Email'] }}
            </div>
            <div v-if="client.fields['Phone Number']" class="mt-1 flex items-center text-sm text-gray-300">
              <UIcon name="i-heroicons-phone" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {{ client.fields['Phone Number'] }}
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
            title="Clear selected client"
          />
        </div>
      </div>
      
      <!-- Optional address information if available -->
      <div v-if="hasAddressInfo" class="border-t border-gray-800 bg-gray-800 px-4 py-3">
        <div class="flex items-center text-sm text-gray-300">
          <UIcon name="i-heroicons-map-pin" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
          <span>
            <template v-if="client.fields['Address']">{{ client.fields['Address'] }}</template>
            <template v-else>
              <template v-if="client.fields['Street']">{{ client.fields['Street'] }}</template>
              <template v-if="client.fields['City']">
                <template v-if="client.fields['Street']">, </template>
                {{ client.fields['City'] }}
              </template>
              <template v-if="client.fields['State']">
                <template v-if="client.fields['City'] || client.fields['Street']">, </template>
                {{ client.fields['State'] }}
              </template>
              <template v-if="client.fields['Zip'] || client.fields['Postal Code']">
                <template v-if="client.fields['State'] || client.fields['City'] || client.fields['Street']">, </template>
                {{ client.fields['Zip'] || client.fields['Postal Code'] }}
              </template>
            </template>
          </span>
        </div>
      </div>
      
      <!-- Optional notes section if available -->
      <div v-if="client.fields['Notes']" class="border-t border-gray-800 bg-gray-800 px-4 py-3">
        <h4 class="text-xs uppercase tracking-wide text-gray-400">Notes</h4>
        <p class="mt-1 text-sm text-gray-300">{{ client.fields['Notes'] }}</p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  client: {
    type: Object,
    default: null
  }
})

defineEmits(['clear'])

// Computed property to determine if we have any address info to display
const hasAddressInfo = computed(() => {
  if (!props.client) return false
  
  return props.client.fields['Address'] ||
         props.client.fields['Street'] ||
         props.client.fields['City'] ||
         props.client.fields['State'] ||
         props.client.fields['Zip'] ||
         props.client.fields['Postal Code']
})
</script>
