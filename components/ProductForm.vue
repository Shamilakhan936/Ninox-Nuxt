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
    
   
    <div class="bg-gray-800 p-3 rounded-md border border-gray-700 mb-4">
      <h4 class="text-sm font-medium text-gray-300 mb-2">
        Product Details
      </h4>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
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
        
        
        <div v-if="formData.productType">
          <UFormGroup label="Fabric" class="text-gray-300">
            <div class="flex flex-col space-y-2">
              <!-- Selected fabric display -->
              <div 
                v-if="selectedFabric" 
                class="bg-gray-700 p-2 rounded-md border border-gray-600 flex items-center"
              >
               
                <div class="w-10 h-10 rounded-md overflow-hidden mr-3">
                  <img 
                    v-if="selectedFabric.fields['Image URL']" 
                    :src="selectedFabric.fields['Image URL']" 
                    :alt="selectedFabric.fields['Fabric Name']" 
                    class="w-full h-full object-cover"
                  />
                  <div 
                    v-else 
                    class="w-full h-full flex items-center justify-center"
                    :style="{ backgroundColor: selectedFabric.fields['Color Hex'] || '#64748b' }"
                  >
                    <UIcon name="i-heroicons-swatch" class="h-6 w-6 text-white opacity-75" />
                  </div>
                </div>
                
                <!-- Fabric details -->
                <div class="flex-grow">
                  <div class="text-sm text-white font-medium">
                    {{ selectedFabric.fields['Fabric Name'] }}
                  </div>
                  <div class="flex items-center text-xs text-gray-300">
                    <UBadge color="blue" variant="subtle" size="xs" class="mr-2">
                      {{ selectedFabric.fields['Fabric Type'] }}
                    </UBadge>
                    <span 
                      class="w-3 h-3 rounded-full mr-1"
                      :style="{ backgroundColor: selectedFabric.fields['Color Hex'] || '#64748b' }"
                    ></span>
                    {{ selectedFabric.fields['Fabric Color'] }}
                  </div>
                </div>
                
                <!-- Clear button -->
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  size="xs"
                  class="text-gray-400 hover:text-white"
                  @click="clearSelectedFabric"
                />
              </div>
              
              <!-- Button to open fabric selection modal -->
              <UButton
                color="primary"
                variant="soft"
                @click="openFabricModal"
                icon="i-heroicons-swatch"
              >
                {{ selectedFabric ? 'Change Fabric' : 'Select Fabric' }}
              </UButton>
            </div>
          </UFormGroup>
        </div>
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
        <!-- Show motorization option for Roller Shadess and Roman Shadess -->
        <template v-if="['Roller Shades', 'Roman Shades'].includes(formData.productType)">
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
            v-if="formData.productType === 'Roller Shades'" 
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
        :disabled="!isValid"
      >
        {{ isNewItem ? 'Add to Order' : 'Save Changes' }}
      </UButton>
    </div>
    
    <!-- Fabric Search Modal -->
    <FabricSearchModal
      v-model="showFabricModal"
      :product-type="formData.productType"
      @select="selectFabric"
      @notification="$emit('notification', $event)"
      ref="fabricSearchModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs } from 'vue'
import FabricSearchModal from './FabricSearchModal.vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      productType: '',
      fabricId: null,
      fabricDetails: null,
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

const emit = defineEmits(['save', 'cancel', 'validation-error', 'notification'])

// Product options
const productTypes = [
  'Roller Shades',
  'Roman Shades',
  'Curtains'
]

const chainTypes = [
  'Metal',
  'Plastic',
  'Cord'
]

const motorTypes = {
  'Roller Shades': [
    'RF Motor',
    'WiFi Motor',
    'Battery Motor',
    'Hard-Wired Motor'
  ],
  'Roman Shades': [
    'RF Motor',
    'WiFi Motor',
    'Battery Motor',
    'Hard-Wired Motor'
  ]
}

// Form data
const { item, isNew } = toRefs(props)
const formData = ref({ ...item.value })

// Fabric selection
const showFabricModal = ref(false)
const selectedFabric = ref(null)
const fabricSearchModalRef = ref(null)

// Initialize selectedFabric from item if it exists
if (formData.value.fabricDetails) {
  selectedFabric.value = formData.value.fabricDetails
}

// Computed properties
const isNewItem = computed(() => isNew.value)
const validationErrors = ref([])

const isValid = computed(() => {
  validationErrors.value = []
  
  if (!formData.value.productType) {
    validationErrors.value.push('Product type is required')
  }
  
  if (!selectedFabric.value) {
    validationErrors.value.push('Fabric is required')
  }
  
  if (!formData.value.width) {
    validationErrors.value.push('Width is required')
  }
  
  if (!formData.value.height) {
    validationErrors.value.push('Height is required')
  }
  
  // Validate motorization options
  if (['Roller Shades', 'Roman Shades'].includes(formData.value.productType)) {
    if (formData.value.isMotorized && !formData.value.motorType) {
      validationErrors.value.push('Motor type is required for motorized options')
    }
  }
  
  return validationErrors.value.length === 0
})

// Watch for product type changes
watch(() => formData.value.productType, (newType) => {
  // Reset fabric when product type changes
  if (selectedFabric.value && selectedFabric.value.fields['Product Type'] !== newType) {
    selectedFabric.value = null
    formData.value.fabricId = null
  }
})

// Watch for prop changes
watch(item, (newValue) => {
  formData.value = { ...newValue }
  
  // Update selectedFabric from item if it exists
  if (newValue.fabricDetails) {
    selectedFabric.value = newValue.fabricDetails
  } else {
    selectedFabric.value = null
  }
})

// Fabric modal methods
function openFabricModal() {
  if (!formData.value.productType) {
    emit('notification', {
      title: 'Select Product Type',
      description: 'Please select a product type before choosing a fabric.',
      color: 'yellow'
    })
    return
  }
  
  if (fabricSearchModalRef.value) {
    fabricSearchModalRef.value.reset()
  }
  showFabricModal.value = true
}

function selectFabric(fabric) {
  selectedFabric.value = fabric;
  // Use the fabricId from the passed fabric object, or the Fabric ID field
  formData.value.fabricId = fabric.fabricId || fabric.fields['Fabric ID'] || fabric.id;
  
  console.log('Selected fabric in ProductForm:', {
    fabricId: formData.value.fabricId,
    id: fabric.id,
    fabricID: fabric.fields['Fabric ID'],
    name: fabric.fields['Fabric Name']
  });
  
  emit('notification', {
    title: 'Fabric Selected',
    description: `${fabric.fields['Fabric Name']} has been selected.`,
    color: 'blue'
  });
}

function clearSelectedFabric() {
  selectedFabric.value = null
  formData.value.fabricId = null
}

// Save item
function saveItem() {
  if (!isValid.value) {
    emit('validation-error', validationErrors.value)
    return
  }
  
  // Add specific check for fabric
  if (!selectedFabric.value) {
    emit('validation-error', ['Fabric selection is required'])
    return
  }
  
  // Ensure we're capturing fabricId correctly
  const fabricId = selectedFabric.value?.fabricId || 
                  selectedFabric.value?.fields['Fabric ID'] || 
                  formData.value.fabricId
  
  if (!fabricId) {
    emit('validation-error', ['Could not determine fabric ID. Please try selecting the fabric again.'])
    return
  }
  
  // Make sure fabricId is included in the saved item
  const itemToSave = { 
    ...formData.value,
    fabricDetails: selectedFabric.value,
    fabricId: fabricId
  }
  
  console.log('Saving item with fabric:', {
    fabricId: itemToSave.fabricId,
    fabricName: selectedFabric.value?.fields['Fabric Name']
  })
  
  emit('save', itemToSave)
}
</script>
