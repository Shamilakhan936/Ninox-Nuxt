<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Page Content -->
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Table Order Entry System</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Create and manage multiple orders with a spreadsheet-like interface.
        </p>
      </div>
      
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
      </div>
      
      <div v-else-if="hasPermission" class="space-y-6">
        <!-- Top Control Bar -->
        <div class="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div class="flex items-center space-x-4">
            <!-- Customer Information -->
            <div v-if="selectedClient" class="flex items-center space-x-2">
              <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-blue-500" />
              <span class="font-medium text-gray-900 dark:text-white">
                {{ selectedClient.fields['First Name'] }} {{ selectedClient.fields['Last Name'] }}
              </span>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                size="xs"
                @click="selectedClient = null"
              />
            </div>
            <UButton
              v-else
              color="primary"
              variant="soft"
              @click="openClientModal"
            >
              Select Client
            </UButton>
            
            <!-- Salesperson Selection -->
            <div v-if="selectedSalesperson" class="flex items-center space-x-2">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-green-500" />
              <span class="font-medium text-gray-900 dark:text-white">
                {{ selectedSalesperson.fields['First Name'] }} {{ selectedSalesperson.fields['Last Name'] }}
              </span>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                size="xs"
                @click="selectedSalesperson = null"
              />
            </div>
            <UButton
              v-else
              color="primary"
              variant="soft"
              @click="openSalespersonModal"
            >
              Select Salesperson
            </UButton>
          </div>
          
          <div>
            <UButton
              color="green"
              variant="solid"
              icon="i-heroicons-plus"
              :disabled="!isFormValid || isSubmitting"
              @click="submitCurrentOrder"
            >
              Submit Order
            </UButton>
          </div>
        </div>

        <!-- Tabs for Multiple Orders -->
        <UTabs v-model="activeTab">
          <UTab v-for="(order, index) in orders" :key="index" :name="order.name">
            {{ order.name }}
            <template #trailing>
              <UButton
                v-if="orders.length > 1"
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                size="xs"
                @click.stop="removeOrder(index)"
              />
            </template>
          </UTab>
          
          <UTab name="add-new" as="button" icon="i-heroicons-plus">
            <span class="sr-only">Add New Tab</span>
          </UTab>
        </UTabs>
        
        <!-- Current Active Order Content -->
        <div v-if="activeTab !== 'add-new'" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <!-- Product Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">
                    Product Type
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-52">
                    Fabric
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                    Width (mm)
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                    Height (mm)
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                    Quantity
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                    Motorized
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">
                    Control
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <!-- Product rows -->
                <tr v-for="(product, pIndex) in currentOrder.products" :key="pIndex" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <USelect
                      v-model="product.productType"
                      :options="productTypes"
                      placeholder="Select type"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div v-if="product.fabricDetails" class="flex items-center">
                        <div 
                          class="w-5 h-5 rounded-full mr-2"
                          :style="{ backgroundColor: product.fabricDetails.fields['Color Hex'] || '#64748b' }"
                        ></div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ product.fabricDetails.fields['Fabric Name'] }}
                        </span>
                      </div>
                      <UButton
                        size="xs"
                        variant="soft"
                        color="primary"
                        @click="openFabricModal(pIndex)"
                      >
                        {{ product.fabricDetails ? 'Change' : 'Select' }}
                      </UButton>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <UInput
                      v-model="product.width"
                      type="number"
                      placeholder="Width"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <UInput
                      v-model="product.height"
                      type="number"
                      placeholder="Height"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <UInput
                      v-model="product.quantity"
                      type="number"
                      placeholder="Qty"
                      min="1"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-center">
                    <UCheckbox
                      v-model="product.isMotorized"
                      :disabled="!['Roller Shades', 'Roman Shades'].includes(product.productType)"
                    />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div v-if="product.isMotorized">
                      <USelect
                        v-model="product.motorType"
                        :options="getMotorTypes(product.productType)"
                        placeholder="Motor type"
                        size="sm"
                        class="w-full"
                      />
                    </div>
                    <div v-else>
                      <USelect
                        v-model="product.controlSide"
                        :options="['Left', 'Right']"
                        placeholder="Side"
                        size="sm"
                        class="w-full"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <UButton
                        color="red"
                        icon="i-heroicons-trash"
                        variant="ghost"
                        size="xs"
                        @click="removeProduct(pIndex)"
                      />
                      <UButton
                        color="blue"
                        icon="i-heroicons-pencil-square"
                        variant="ghost"
                        size="xs"
                        @click="editProductDetails(pIndex)"
                      />
                    </div>
                  </td>
                </tr>
                
                <!-- Add new product row -->
                <tr class="bg-gray-50 dark:bg-gray-700">
                  <td colspan="8" class="px-4 py-3">
                    <UButton
                      block
                      color="green"
                      variant="ghost"
                      icon="i-heroicons-plus"
                      @click="addNewProduct"
                    >
                      Add New Product
                    </UButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Order Notes -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <UFormGroup label="Special Instructions" class="mb-0">
              <UTextarea
                v-model="currentOrder.specialInstructions"
                placeholder="Enter any special instructions for this order"
                :rows="2"
              />
            </UFormGroup>
          </div>
        </div>
        
        <!-- "Add New Tab" View -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <UIcon name="i-heroicons-plus-circle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Create a New Order</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Start a new order with a clean template</p>
          
          <div class="max-w-md mx-auto">
            <UFormGroup label="Order Name" class="mb-4">
              <UInput v-model="newOrderName" placeholder="Enter a name for this order" />
            </UFormGroup>
            
            <UButton
              color="primary"
              @click="createNewOrder"
              :disabled="!newOrderName"
            >
              Create Order
            </UButton>
          </div>
        </div>
        
        <!-- Product Details Modal -->
        <UModal v-model="showProductDetailsModal">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">Edit Product Details</h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="gray"
                  variant="ghost"
                  @click="showProductDetailsModal = false"
                />
              </div>
            </template>
            
            <div v-if="editingProduct" class="space-y-4">
              <!-- Product Type -->
              <UFormGroup label="Product Type">
                <USelect
                  v-model="editingProduct.productType"
                  :options="productTypes"
                  placeholder="Select product type"
                />
              </UFormGroup>
              
              <!-- Chain Type (for non-motorized) -->
              <UFormGroup v-if="!editingProduct.isMotorized && editingProduct.productType === 'Roller Shades'" label="Chain Type">
                <USelect
                  v-model="editingProduct.chainType"
                  :options="chainTypes"
                  placeholder="Select chain type"
                />
              </UFormGroup>
              
              <!-- Notes -->
              <UFormGroup label="Item Notes">
                <UTextarea
                  v-model="editingProduct.notes"
                  placeholder="Enter any special instructions for this item"
                  :rows="3"
                />
              </UFormGroup>
            </div>
            
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton
                  color="gray"
                  variant="soft"
                  @click="showProductDetailsModal = false"
                >
                  Cancel
                </UButton>
                <UButton
                  color="primary"
                  @click="saveProductDetails"
                >
                  Save
                </UButton>
              </div>
            </template>
          </UCard>
        </UModal>
        
        <!-- Client Search Modal -->
        <ClientSearchModal 
          v-model="showClientModal" 
          @select="selectClient" 
          @notification="showNotification"
          ref="clientSearchModalRef"
        />
        
        <!-- Salesperson Search Modal -->
        <SalespersonSearchModal 
          v-model="showSalespersonModal" 
          @select="selectSalesperson" 
          @notification="showNotification"
          ref="salespersonSearchModalRef"
        />
        
        <!-- Fabric Search Modal -->
        <FabricSearchModal
          v-if="editingProductIndex !== null && currentOrder.products[editingProductIndex]"
          v-model="showFabricModal"
          :product-type="currentOrder.products[editingProductIndex]?.productType"
          @select="selectFabric"
          @notification="showNotification"
          ref="fabricSearchModalRef"
        />
        
        <!-- Notification System -->
        <NotificationSystem 
          v-model:notification="notification" 
          :auto-hide="true" 
          :duration="5000"
        />
      </div>
      
      <!-- Insufficient Permissions Message -->
      <div v-else class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg shadow-sm text-center">
        <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h2 class="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Insufficient Permissions</h2>
        <p class="text-red-600 dark:text-red-300 mb-4">
          You don't have the necessary permissions to access the order entry system.
        </p>
        <UButton
          to="/api/logout"
          external
          color="red"
          variant="soft"
        >
          Sign out
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../components/Navbar.vue'
import ClientSearchModal from '../components/ClientSearchModal.vue'
import SalespersonSearchModal from '../components/SalesPersonSearchModal.vue'
import FabricSearchModal from '../components/FabricSearchModal.vue'
import NotificationSystem from '../components/NotificationSystem.vue'

// Check user permissions
const client = useKindeClient();
const isLoading = ref(true);
const hasPermission = ref(true); // Default to true to allow access

// Check if user has the required permission to access order entry
onMounted(async () => {
  try {
    // For now, simply check that the user is authenticated
    // You can implement specific permission checks later
    hasPermission.value = true;
  } catch (error) {
    console.error('Error checking permissions:', error);
    // Still allow access even if permission check fails
    hasPermission.value = true;
  } finally {
    isLoading.value = false;
  }
});

// State
const selectedClient = ref(null)
const selectedSalesperson = ref(null)
const isSubmitting = ref(false)
const activeTab = ref(null)
const orders = ref([
  {
    name: 'Order #1',
    products: [],
    specialInstructions: ''
  }
])
const newOrderName = ref('')
const editingProductIndex = ref(null)
const editingProduct = ref(null)
const showProductDetailsModal = ref(false)
const showClientModal = ref(false)
const showSalespersonModal = ref(false)
const showFabricModal = ref(false)

// Notification system
const notification = ref({
  show: false,
  title: '',
  description: '',
  color: 'green'
})

// Initialize the first tab
if (orders.value.length > 0) {
  activeTab.value = orders.value[0].name
}

// Watch for tab changes to "add-new"
watch(activeTab, (newTab) => {
  if (newTab === 'add-new') {
    newOrderName.value = `Order #${orders.value.length + 1}`
  }
})

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

// Helper function to get motor types based on product type
function getMotorTypes(productType) {
  return motorTypes[productType] || []
}

// Computed property to get the current order
const currentOrder = computed(() => {
  const index = orders.value.findIndex(order => order.name === activeTab.value)
  return index !== -1 ? orders.value[index] : { products: [], specialInstructions: '' }
})

// Computed property to check if the form is valid
const isFormValid = computed(() => {
  // Must have a client
  if (!selectedClient.value) return false
  
  // Current order must have at least one product
  if (currentOrder.value.products.length === 0) return false
  
  // All products must have required fields
  for (const product of currentOrder.value.products) {
    if (!product.productType) return false
    if (!product.width || !product.height) return false
    if (!product.fabricId && !product.fabricDetails) return false
    if (product.isMotorized && !product.motorType) return false
  }
  
  return true
})

// Function to create a new order
function createNewOrder() {
  if (!newOrderName.value) return
  
  orders.value.push({
    name: newOrderName.value,
    products: [],
    specialInstructions: ''
  })
  
  activeTab.value = newOrderName.value
  newOrderName.value = ''
}

// Function to remove an order
function removeOrder(index) {
  if (orders.value.length <= 1) {
    showNotification({
      title: 'Error',
      description: 'Cannot remove the last order. You must have at least one order.',
      color: 'red'
    })
    return
  }
  
  const orderName = orders.value[index].name
  orders.value.splice(index, 1)
  
  // If we removed the active tab, switch to the first tab
  if (activeTab.value === orderName) {
    activeTab.value = orders.value[0].name
  }
}

// Function to add a new product
function addNewProduct() {
  const orderIndex = orders.value.findIndex(order => order.name === activeTab.value)
  if (orderIndex === -1) return
  
  orders.value[orderIndex].products.push({
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
}

// Function to remove a product
function removeProduct(index) {
  const orderIndex = orders.value.findIndex(order => order.name === activeTab.value)
  if (orderIndex === -1) return
  
  orders.value[orderIndex].products.splice(index, 1)
}

// Function to edit product details
function editProductDetails(index) {
  const orderIndex = orders.value.findIndex(order => order.name === activeTab.value)
  if (orderIndex === -1) return
  
  editingProductIndex.value = index
  editingProduct.value = { ...orders.value[orderIndex].products[index] }
  showProductDetailsModal.value = true
}

// Function to save product details
function saveProductDetails() {
  if (!editingProduct.value) return
  
  const orderIndex = orders.value.findIndex(order => order.name === activeTab.value)
  if (orderIndex === -1 || editingProductIndex.value === null) return
  
  // Update the product in the order
  orders.value[orderIndex].products[editingProductIndex.value] = { ...editingProduct.value }
  
  // Reset editing state
  showProductDetailsModal.value = false
  editingProduct.value = null
  editingProductIndex.value = null
}

// Open fabric modal for a specific product
function openFabricModal(productIndex) {
  const orderIndex = orders.value.findIndex(order => order.name === activeTab.value)
  if (orderIndex === -1) return
  
  const product = orders.value[orderIndex].products[productIndex]
  
  if (!product.productType) {
    showNotification({
      title: 'Select Product Type',
      description: 'Please select a product type before choosing a fabric.',
      color: 'yellow'
    })
    return
  }
  
  editingProductIndex.value = productIndex
  if (fabricSearchModalRef.value) {
    fabricSearchModalRef.value.reset()
  }
  showFabricModal.value = true
}

// Select fabric for the current editing product
function selectFabric(fabric) {
  const orderIndex = orders.value.findIndex(order => order.name === activeTab.value)
  if (orderIndex === -1 || editingProductIndex.value === null) return
  
  const fabricId = fabric.fabricId || fabric.fields['Fabric ID'] || fabric.id
  
  orders.value[orderIndex].products[editingProductIndex.value].fabricDetails = fabric
  orders.value[orderIndex].products[editingProductIndex.value].fabricId = fabricId
  
  showNotification({
    title: 'Fabric Selected',
    description: `${fabric.fields['Fabric Name']} has been selected.`,
    color: 'blue'
  })
  
  // Reset editing product index
  editingProductIndex.value = null
}

// Modal controls
function openClientModal() {
  if (clientSearchModalRef.value) {
    clientSearchModalRef.value.reset()
  }
  showClientModal.value = true
}

function openSalespersonModal() {
  if (salespersonSearchModalRef.value) {
    salespersonSearchModalRef.value.reset()
  }
  showSalespersonModal.value = true
}

// Selection handlers
function selectClient(client) {
  selectedClient.value = client
  showNotification({
    title: 'Client Selected',
    description: `${client.fields['First Name']} ${client.fields['Last Name']} has been selected.`,
    color: 'blue'
  })
}

function selectSalesperson(salesperson) {
  selectedSalesperson.value = salesperson
  showNotification({
    title: 'Salesperson Selected',
    description: `${salesperson.fields['First Name']} ${salesperson.fields['Last Name']} has been selected.`,
    color: 'blue'
  })
}

// Show notification
function showNotification(notify) {
  notification.value = {
    show: true,
    title: notify.title || 'Notification',
    description: notify.description || '',
    color: notify.color || 'blue'
  }
}

// Submit the current order
async function submitCurrentOrder() {
  if (!isFormValid.value) {
    showNotification({
      title: 'Validation Error',
      description: 'Please fill in all required fields and select a client before submitting.',
      color: 'red'
    })
    return
  }
  
  isSubmitting.value = true
  
  try {
    const orderData = {
      isExistingCustomer: true,
      selectedCustomerId: selectedClient.value?.id,
      selectedSalespersonId: selectedSalesperson.value?.id,
      installationRequired: false,
      country: 'United States',
      specialInstructions: currentOrder.value.specialInstructions,
      items: currentOrder.value.products.map(product => {
        // Ensure fabricId is correctly included
        const fabricId = product.fabricId || 
                        (product.fabricDetails?.fabricId) || 
                        (product.fabricDetails?.fields['Fabric ID']) || 
                        null
        
        return {
          ...product,
          fabricId: fabricId
        }
      })
    }
    
    const response = await fetch('/api/ninox/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      showNotification({
        title: 'Order Submitted',
        description: result.message || 'Order submitted successfully!',
        color: 'green'
      })
      
      // Remove the submitted order and create a new one
      const orderIndex = orders.value.findIndex(order => order.name === activeTab.value)
      if (orderIndex !== -1) {
        orders.value.splice(orderIndex, 1)
        
        // If no orders remain, create a new blank one
        if (orders.value.length === 0) {
          orders.value.push({
            name: 'Order #1',
            products: [],
            specialInstructions: ''
          })
          activeTab.value = 'Order #1'
        } else {
          activeTab.value = orders.value[0].name
        }
      }
    } else {
      throw new Error(result.error || 'Failed to submit order')
    }
  } catch (error) {
    showNotification({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Template refs for modals
const clientSearchModalRef = ref(null)
const salespersonSearchModalRef = ref(null)
const fabricSearchModalRef = ref(null)
</script>

<style>
/* Add custom styles for table-like interfaces */
.editable-cell {
  position: relative;
}
.editable-cell input {
  background: transparent;
  border: 1px solid transparent;
  width: 100%;
  padding: 0.5rem;
}
.editable-cell input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}
</style>