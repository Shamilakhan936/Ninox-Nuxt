<template>
  <div class="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800 shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-md font-semibold text-white">
        {{ isNewItem ? 'Add New Product' : 'Edit Product' }}
      </h3>
      <UButton
        icon="i-heroicons-x-mark"
        color="gray"
        variant="ghost"
        class="text-gray-400 hover:text-white"
        size="sm"
        @click="$emit('cancel')"
      />
    </div>
    
    <!-- Product Selection -->
    <div class="bg-gray-800 p-3 rounded-md border border-gray-700 mb-4">
      <h4 class="text-sm font-medium text-gray-300 mb-2">
        Product Details
      </h4>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UFormGroup label="Product Type" class="text-gray-300">
          <USelect
            v-model="formData.productType"
            :options="productTypes"
            placeholder="Select product type"
            :ui="{
              base: 'relative',
              form: 'form-select',
              input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
            }"
          />
        </UFormGroup>
        <UFormGroup label="Material" class="text-gray-300">
          <USelect
            v-model="formData.material"
            :options="materials[formData.productType] || []"
            placeholder="Select material"
            :ui="{
              base: 'relative',
              form: 'form-select',
              input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
            }"
          />
        </UFormGroup>
      </div>
    </div>

    <!-- Measurements -->
    <div class="bg-gray-800 p-3 rounded-md border border-gray-700 mb-4">
      <h4 class="text-sm font-medium text-gray-300 mb-2">
        Measurements
      </h4>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormGroup label="Width (mm)" class="text-gray-300">
          <UInput
            v-model="formData.width"
            type="number"
            placeholder="Enter width"
            min="0"
            :ui="{
              base: 'relative',
              form: 'form-input',
              input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
            }"
          />
        </UFormGroup>
        <UFormGroup label="Height (mm)" class="text-gray-300">
          <UInput
            v-model="formData.height"
            type="number"
            placeholder="Enter height"
            min="0"
            :ui="{
              base: 'relative',
              form: 'form-input',
              input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
            }"
          />
        </UFormGroup>
        <UFormGroup label="Quantity" class="text-gray-300">
          <UInput
            v-model="formData.quantity"
            type="number"
            placeholder="Enter quantity"
            min="1"
            :ui="{
              base: 'relative',
              form: 'form-input',
              input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
            }"
          />
        </UFormGroup>
      </div>
    </div>

    <!-- Additional Options -->
    <div class="bg-gray-800 p-3 rounded-md border border-gray-700 mb-4">
      <h4 class="text-sm font-medium text-gray-300 mb-2">
        Additional Options
      </h4>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Show motorization option for Roller Blinds and Roman Shades -->
        <template v-if="['Roller Blind', 'Roman Shade'].includes(formData.productType)">
          <UFormGroup label="Motorized" class="text-gray-300">
            <URadioGroup 
              v-model="formData.isMotorized" 
              :options="[
                { label: 'Yes', value: true },
                { label: 'No', value: false }
              ]"
              orientation="horizontal"
              :ui="{ 
                wrapper: 'flex flex-wrap gap-2',
                container: 'bg-gray-700 border border-gray-600 rounded-lg p-2 cursor-pointer transition-colors duration-200 hover:bg-gray-600 text-gray-300',
                containerActive: 'ring-2 ring-green-500 bg-gray-600 border-green-500 text-white'
              }"
            />
          </UFormGroup>

          <!-- Show motor type selection if motorized is selected -->
          <UFormGroup 
            v-if="formData.isMotorized" 
            label="Motor Type" 
            class="text-gray-300"
          >
            <USelect
              v-model="formData.motorType"
              :options="motorTypes[formData.productType] || []"
              placeholder="Select motor type"
              :ui="{
                base: 'relative',
                form: 'form-select',
                input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
              }"
            />
          </UFormGroup>
        </template>

        <!-- Show control side and chain type only if not motorized -->
        <template v-if="!formData.isMotorized">
          <UFormGroup label="Control Side" class="text-gray-300">
            <URadioGroup 
              v-model="formData.controlSide" 
              :options="['Left', 'Right']"
              orientation="horizontal"
              :ui="{ 
                wrapper: 'flex flex-wrap gap-2',
                container: 'bg-gray-700 border border-gray-600 rounded-lg p-2 cursor-pointer transition-colors duration-200 hover:bg-gray-600 text-gray-300',
                containerActive: 'ring-2 ring-green-500 bg-gray-600 border-green-500 text-white'
              }"
            />
          </UFormGroup>
          <UFormGroup 
            label="Chain Type" 
            v-if="formData.productType === 'Roller Blind'" 
            class="text-gray-300"
          >
            <USelect
              v-model="formData.chainType"
              :options="chainTypes"
              placeholder="Select chain type"
              :ui="{
                base: 'relative',
                form: 'form-select',
                input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
              }"
            />
          </UFormGroup>
        </template>
      </div>
    </div>

    <!-- Notes -->
    <div class="bg-gray-800 p-3 rounded-md border border-gray-700 mb-4">
      <UFormGroup label="Item Notes" class="mb-0 text-gray-300">
        <UTextarea
          v-model="formData.notes"
          placeholder="Enter any special instructions for this item"
          :rows="2"
          :ui="{
            base: 'relative',
            form: 'form-textarea',
            input: 'bg-gray-900 text-gray-100 border-gray-700 focus:border-gray-600 focus:ring-gray-600'
          }"
        />
      </UFormGroup>
    </div>
    
    <!-- Item Form Buttons -->
    <div class="mt-4 flex justify-end space-x-2">
      <UButton
        color="gray"
        variant="solid"
        @click="$emit('cancel')"
        class="bg-gray-700 hover:bg-gray-600 text-white"
      >
        Cancel
      </UButton>
      <UButton
        color="green"
        @click="saveItem"
        variant="solid"
      >
        {{ isNewItem ? 'Add to Order' : 'Save Changes' }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      productType: '',
      material: '',
      width: null,
      height: null,
      quantity: 1,
      controlSide: 'Left',
      chainType: '',
      isMotorized: false,
      motorType: '',
      notes: ''
    })
  },
  isNew: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['save', 'cancel'])

// Product options
const productTypes = [
  'Roller Blind',
  'Roman Shade',
  'Curtains'
]

const materials = {
  'Roller Blind': [
    'Blockout',
    'Light Filter',
    'Sunscreen',
    'Double Roller'
  ],
  'Roman Shade': [
    'Linen',
    'Cotton',
    'Polyester',
    'Silk Blend'
  ],
  'Curtains': [
    'Sheer',
    'Blockout',
    'Linen',
    'Velvet'
  ]
}

const chainTypes = [
  'Metal',
  'Plastic',
  'Cord'
]

const motorTypes = {
  'Roller Blind': [
    'RF Motor',
    'WiFi Motor',
    'Battery Motor',
    'Hard-Wired Motor'
  ],
  'Roman Shade': [
    'RF Motor',
    'WiFi Motor',
    'Battery Motor',
    'Hard-Wired Motor'
  ]
}

// Form data
const { item, isNew } = toRefs(props)
const formData = ref({ ...item.value })

// Computed properties
const isNewItem = computed(() => isNew.value)
const validationErrors = ref([])

const isValid = computed(() => {
  validationErrors.value = []
  
  if (!formData.value.productType) {
    validationErrors.value.push('Product type is required')
  }
  
  if (!formData.value.material) {
    validationErrors.value.push('Material is required')
  }
  
  if (!formData.value.width) {
    validationErrors.value.push('Width is required')
  }
  
  if (!formData.value.height) {
    validationErrors.value.push('Height is required')
  }
  
  // Validate motorization options
  if (['Roller Blind', 'Roman Shade'].includes(formData.value.productType)) {
    if (formData.value.isMotorized && !formData.value.motorType) {
      validationErrors.value.push('Motor type is required for motorized options')
    }
  }
  
  return validationErrors.value.length === 0
})

// Watch for prop changes
watch(item, (newValue) => {
  formData.value = { ...newValue }
})

// Save item
function saveItem() {
  if (!isValid.value) {
    emit('validation-error', validationErrors.value)
    return
  }
  
  emit('save', { ...formData.value })
}
</script>
