<template>
  <div class="p-4 bg-gray-900 rounded-lg border border-gray-800">
    <h3 class="text-lg font-medium text-white mb-4">Test Order Submission</h3>
    
    <div class="space-y-4">
      <UFormGroup label="Use Existing Customer" class="text-gray-300">
        <USwitch v-model="useExistingCustomer" />
      </UFormGroup>

      <UFormGroup 
        v-if="useExistingCustomer" 
        label="Customer ID" 
        class="text-gray-300"
      >
        <UInput
          v-model="customerId"
          placeholder="Enter existing customer ID"
          :ui="{
            input: 'bg-gray-800 text-white border-gray-700'
          }"
        />
      </UFormGroup>

      <UFormGroup label="Number of Order Items" class="text-gray-300">
        <UInput
          v-model="numberOfItems"
          type="number"
          min="1"
          max="5"
          placeholder="Enter number of test items"
          :ui="{
            input: 'bg-gray-800 text-white border-gray-700'
          }"
        />
      </UFormGroup>

      <div class="flex space-x-4">
        <UButton
          color="green"
          variant="solid"
          :loading="isSubmitting"
          @click="submitTest"
        >
          Submit Test Order
        </UButton>
      </div>
    </div>

    <!-- Response Display -->
    <div v-if="response" class="mt-4 p-4 bg-gray-800 rounded border border-gray-700">
      <pre class="text-gray-300 whitespace-pre-wrap">{{ JSON.stringify(response, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSubmitting = ref(false)
const response = ref(null)
const useExistingCustomer = ref(false)
const customerId = ref('')
const numberOfItems = ref(1)

async function submitTest() {
  isSubmitting.value = true
  
  try {
    const res = await fetch('/api/ninox/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        useExistingCustomer: useExistingCustomer.value,
        customerId: customerId.value,
        numberOfItems: parseInt(numberOfItems.value) || 1
      })
    })
    
    response.value = await res.json()
  } catch (error) {
    response.value = {
      success: false,
      error: error.message
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
