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

        <!-- Add right after the top control bar -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4">
          <div class="flex items-start">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">Multiple Orders System</h3>
              <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
                You can create multiple separate orders using the tabs below. Each tab represents a different order with its own products.
                Click the "+" tab to create a new order.
              </p>
            </div>
          </div>
        </div>

        <!-- Tabs for Multiple Orders -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex gap-2 overflow-x-auto">
              <UButton
                v-for="(order, index) in orders"
                :key="index"
                :color="activeTabIndex === index ? 'primary' : 'gray'"
                :variant="activeTabIndex === index ? 'soft' : 'ghost'"
                class="px-4 py-2 whitespace-nowrap"
                @click="activeTabIndex = index"
              >
                <div class="flex items-center">
                  <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-2" />
                  {{ order.name }}
                </div>
                <template v-if="orders.length > 1" #trailing>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark"
                    size="xs"
                    @click.stop="removeOrder(index)"
                    aria-label="Remove order"
                  />
                </template>
              </UButton>
              
              <UButton
                color="green"
                variant="ghost"
                class="px-4 py-2 whitespace-nowrap"
                @click="activeTabIndex = -1"
              >
                <div class="flex items-center text-green-600 dark:text-green-400">
                  <UIcon name="i-heroicons-plus-circle" class="w-4 h-4 mr-2" />
                  Create New Order
                </div>
              </UButton>
            </div>
          </div>
        </div>
        
        <!-- Current Active Order Content -->
        <div v-if="activeTabIndex >= 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <!-- Add inside the Current Active Order Content div, at the top -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div class="flex flex-col gap-2">
              <!-- Order header with name and info -->
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <!-- Order name (editable) -->
                  <div v-if="!isEditingOrderName" class="flex items-center cursor-pointer group" @click="startEditingOrderName">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ orders[activeTabIndex].name }}
                    </h3>
                    <UIcon 
                      name="i-heroicons-pencil-square" 
                      class="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Edit order name"
                    />
                    <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">({{ orders[activeTabIndex].products.length }} products)</span>
                  </div>
                  <!-- Order name editing form -->
                  <div v-else class="flex items-center">
                    <UInput
                      v-model="editedOrderName"
                      size="sm"
                      class="w-64"
                      placeholder="Order name"
                      @keyup.enter="saveOrderName"
                      @keyup.esc="cancelEditingOrderName"
                      ref="orderNameInputRef"
                    />
                    <div class="flex ml-2">
                      <UButton
                        color="green"
                        variant="soft"
                        size="xs"
                        icon="i-heroicons-check"
                        @click="saveOrderName"
                        aria-label="Save order name"
                      />
                      <UButton
                        color="gray"
                        variant="soft"
                        size="xs"
                        icon="i-heroicons-x-mark"
                        class="ml-1"
                        @click="cancelEditingOrderName"
                        aria-label="Cancel editing"
                      />
                    </div>
                  </div>
                </div>
                <UBadge color="blue" variant="soft">Order #{{ activeTabIndex + 1 }} of {{ orders.length }}</UBadge>
              </div>
              
              <!-- Customer selection for this order -->
              <div class="flex items-center mt-2">
                <div v-if="orders[activeTabIndex].client" class="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md">
                  <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-blue-500" />
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ orders[activeTabIndex].client.fields['First Name'] }} {{ orders[activeTabIndex].client.fields['Last Name'] }}
                  </span>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark"
                    size="xs"
                    @click="removeOrderClient"
                  />
                </div>
                <UButton
                  v-else
                  color="primary"
                  variant="soft"
                  size="sm"
                  @click="openOrderClientModal"
                >
                  <UIcon name="i-heroicons-user-plus" class="w-4 h-4 mr-1" />
                  Select Client for Order
                </UButton>
                
                <!-- Submit button moved from top control bar -->
                <div class="ml-auto">
                  <UButton
                    color="green"
                    variant="solid"
                    icon="i-heroicons-paper-airplane"
                    :disabled="!isOrderValid || isSubmitting"
                    @click="submitCurrentOrder"
                  >
                    Submit Order
                  </UButton>
                </div>
              </div>
            </div>
          </div>
          <!-- Product Table - Now with no column headers, only inline labels -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <!-- Product rows -->
                <tr v-for="(product, pIndex) in orders[activeTabIndex].products" :key="pIndex" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <!-- Product Type Cell -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <USelect
                      v-model="product.productType"
                      :options="productTypes"
                      placeholder="Type"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  
                  <!-- Fabric Selection Cell -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div v-if="product.fabricDetails" class="flex items-center">
                        <div 
                          class="w-4 h-4 rounded-full mr-2"
                          :style="{ backgroundColor: product.fabricDetails.fields['Color Hex'] || '#64748b' }"
                        ></div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[80px]">
                          {{ product.fabricDetails.fields['Fabric Name'] }}
                        </span>
                      </div>
                      <UButton
                        size="xs"
                        variant="soft"
                        color="primary"
                        @click="openFabricModal(pIndex)"
                      >
                        {{ product.fabricDetails ? 'FT - Change' : 'FT - Select' }}
                      </UButton>
                    </div>
                  </td>
                  
                  <!-- Width Cell -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <UInput
                      v-model="product.width"
                      type="number"
                      placeholder="Width - mm"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  
                  <!-- Height Cell -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <UInput
                      v-model="product.height"
                      type="number"
                      placeholder="Height - mm"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  
                  <!-- Quantity Cell -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <UInput
                      v-model="product.quantity"
                      type="number"
                      placeholder="Qty"
                      min="1"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  
                  <!-- Motorized Cell -->
                  <td class="px-2 py-3 whitespace-nowrap text-center">
                    <div class="flex items-center">
                      <span class="text-xs text-gray-500 mr-2">Motor</span>
                      <UCheckbox
                        v-model="product.isMotorized"
                        :disabled="!['Roller Shades', 'Roman Shades'].includes(product.productType)"
                      />
                    </div>
                  </td>
                  
                  <!-- Control Cell (changes based on motorization) -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <div v-if="product.isMotorized">
                      <USelect
                        v-model="product.motorType"
                        :options="getMotorTypes(product.productType)"
                        placeholder="Motor Type"
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
                  
                  <!-- Notes Cell -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <UInput
                      v-model="product.notes"
                      placeholder="Notes"
                      class="w-full"
                      size="sm"
                    />
                  </td>
                  
                  <!-- Actions Cell -->
                  <td class="px-2 py-3 whitespace-nowrap">
                    <div class="flex space-x-1">
                      <UButton
                        color="red"
                        icon="i-heroicons-trash"
                        variant="ghost"
                        size="xs"
                        @click="removeProduct(pIndex)"
                        aria-label="Delete product"
                      />
                      <UButton
                        color="blue"
                        icon="i-heroicons-pencil-square"
                        variant="ghost"
                        size="xs"
                        @click="editProductDetails(pIndex)"
                        aria-label="Edit product details"
                      />
                    </div>
                  </td>
                </tr>
                
                <!-- Add new product row -->
                <tr v-if="orders[activeTabIndex].products.length === 0" class="text-center bg-gray-50 dark:bg-gray-700">
                  <td colspan="9" class="px-4 py-8 text-gray-500 dark:text-gray-400">
                    No products added yet. Click the button below to add your first product.
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Add New Product Button -->
            <div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <UButton
                block
                color="green"
                variant="ghost"
                icon="i-heroicons-plus"
                @click="addNewProduct"
              >
                Add New Product
              </UButton>
            </div>
          </div>
          
          <!-- Order Notes -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <UFormGroup label="Special Instructions" class="mb-0">
              <UTextarea
                v-model="orders[activeTabIndex].specialInstructions"
                placeholder="Enter any special instructions for this order"
                :rows="2"
              />
            </UFormGroup>
          </div>
        </div>
        
        <!-- "Add New Tab" View -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <div class="max-w-lg mx-auto text-center">
            <UIcon name="i-heroicons-plus-circle" class="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Create a New Order</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              Each order can contain multiple products and has its own tab. You can switch between orders at any time using the tabs.
            </p>
            
            <div class="max-w-md mx-auto">
              <UFormGroup label="Order Name" class="mb-4">
                <UInput v-model="newOrderName" placeholder="Enter a name for this order" />
              </UFormGroup>
              
              <div class="flex justify-center">
                <UButton
                  color="green"
                  icon="i-heroicons-plus-circle"
                  size="lg"
                  @click="createNewOrder"
                  :disabled="!newOrderName"
                >
                  Create New Order
                </UButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product Details Modal -->
        <UModal v-model="showProductDetailsModal">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">Additional Product Details</h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="gray"
                  variant="ghost"
                  @click="showProductDetailsModal = false"
                />
              </div>
            </template>
            
            <div v-if="editingProduct" class="space-y-4">
              <!-- Mount Location -->
              <UFormGroup label="Mount Location">
                <USelect
                  v-model="editingProduct.mountLocation"
                  :options="['Inside', 'Outside', 'Ceiling']"
                  placeholder="Select mount location"
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

              <!-- Roll Direction (for roller shades) -->
              <UFormGroup v-if="editingProduct.productType === 'Roller Shades'" label="Roll Direction">
                <USelect
                  v-model="editingProduct.rollDirection"
                  :options="['Standard', 'Reverse']"
                  placeholder="Select roll direction"
                />
              </UFormGroup>

              <!-- Hardware Color -->
              <UFormGroup label="Hardware Color">
                <USelect
                  v-model="editingProduct.hardwareColor"
                  :options="['White', 'Black', 'Silver', 'Bronze', 'Antique Gold']"
                  placeholder="Select hardware color"
                />
              </UFormGroup>
              
              <!-- Notes -->
              <UFormGroup label="Additional Notes">
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
        
        <!-- Fabric Search Modal -->
        <FabricSearchModal
          v-if="editingProductIndex !== null && orders[activeTabIndex] && orders[activeTabIndex].products[editingProductIndex]"
          v-model="showFabricModal"
          :product-type="orders[activeTabIndex].products[editingProductIndex]?.productType"
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
const isSubmitting = ref(false)
const activeTabIndex = ref(0)
const orders = ref([
  {
    name: 'Order #1',
    products: [],
    specialInstructions: '',
    client: null
  }
])
const newOrderName = ref('')
const editingProductIndex = ref(null)
const editingProduct = ref(null)
const showProductDetailsModal = ref(false)
const showClientModal = ref(false)
const showFabricModal = ref(false)
const isEditingOrderName = ref(false)
const editedOrderName = ref('')

// Notification system
const notification = ref({
  show: false,
  title: '',
  description: '',
  color: 'green'
})

// Initialize the first tab
if (orders.value.length > 0) {
  activeTabIndex.value = 0
}

// Watch for tab changes to "add-new"
watch(activeTabIndex, (newIndex) => {
  if (newIndex === -1) {
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
  return activeTabIndex.value >= 0 && activeTabIndex.value < orders.value.length 
    ? orders.value[activeTabIndex.value] 
    : { name: '', products: [], specialInstructions: '' }
})

// Computed property to check if the form is valid
const isFormValid = computed(() => {
  // Must have a client
  if (!currentOrder.value.client) return false
  
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
    specialInstructions: '',
    client: null
  })
  
  activeTabIndex.value = orders.value.length - 1
  newOrderName.value = ''
  
  showNotification({
    title: 'New Order Created',
    description: `Order "${orders.value[activeTabIndex.value].name}" has been created. You can now add products to it.`,
    color: 'green'
  })
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
  if (activeTabIndex.value === index || activeTabIndex.value >= orders.value.length) {
    activeTabIndex.value = 0
  }
  
  showNotification({
    title: 'Order Removed',
    description: `Order "${orderName}" has been removed.`,
    color: 'blue'
  })
}

// Function to add a new product
function addNewProduct() {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  orders.value[activeTabIndex.value].products.push({
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
    mountLocation: 'Inside',
    rollDirection: 'Standard',
    hardwareColor: 'White',
    notes: ''
  })
}

// Function to remove a product
function removeProduct(index) {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  orders.value[activeTabIndex.value].products.splice(index, 1)
}

// Function to edit product details
function editProductDetails(index) {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  editingProductIndex.value = index
  editingProduct.value = { ...orders.value[activeTabIndex.value].products[index] }
  showProductDetailsModal.value = true
}

// Function to save product details
function saveProductDetails() {
  if (!editingProduct.value) return
  
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  // Update the product in the order
  orders.value[activeTabIndex.value].products[editingProductIndex.value] = { ...editingProduct.value }
  
  // Reset editing state
  showProductDetailsModal.value = false
  editingProduct.value = null
  editingProductIndex.value = null
}

// Open fabric modal for a specific product
function openFabricModal(productIndex) {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  const product = orders.value[activeTabIndex.value].products[productIndex]
  
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
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  const orderIndex = activeTabIndex.value
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

// Selection handlers
function selectClient(client) {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  orders.value[activeTabIndex.value].client = client
  
  showNotification({
    title: 'Client Selected',
    description: `${client.fields['First Name']} ${client.fields['Last Name']} has been selected for this order.`,
    color: 'blue'
  })
}

function removeOrderClient() {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  orders.value[activeTabIndex.value].client = null
}

// Show notification
function showNotification(notify) {
  notification.value = {
    id: Date.now().toString(),
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
      description: 'Please fill in all required fields and select a client for this order before submitting.',
      color: 'red'
    })
    return
  }
  
  isSubmitting.value = true
  
  try {
    const order = orders.value[activeTabIndex.value]
    const orderData = {
      isExistingCustomer: true,
      selectedCustomerId: order.client?.id,
      installationRequired: false,
      country: 'United States',
      specialInstructions: order.specialInstructions,
      items: order.products.map(product => {
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
      const orderIndex = activeTabIndex.value
      if (orderIndex !== -1) {
        orders.value.splice(orderIndex, 1)
        
        // If no orders remain, create a new blank one
        if (orders.value.length === 0) {
          orders.value.push({
            name: 'Order #1',
            products: [],
            specialInstructions: '',
            client: null
          })
          activeTabIndex.value = 0
        } else {
          activeTabIndex.value = 0
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

// Order name editing functions
function startEditingOrderName() {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  editedOrderName.value = orders.value[activeTabIndex.value].name
  isEditingOrderName.value = true
  
  // Focus the input after the DOM updates
  nextTick(() => {
    if (orderNameInputRef.value) {
      orderNameInputRef.value.focus()
    }
  })
}

function saveOrderName() {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  if (editedOrderName.value.trim()) {
    orders.value[activeTabIndex.value].name = editedOrderName.value.trim()
    showNotification({
      title: 'Order Renamed',
      description: `Order has been renamed to "${editedOrderName.value.trim()}"`,
      color: 'blue'
    })
  }
  
  isEditingOrderName.value = false
  editedOrderName.value = ''
}

function cancelEditingOrderName() {
  isEditingOrderName.value = false
  editedOrderName.value = ''
}

// Template refs for modals
const clientSearchModalRef = ref(null)
const fabricSearchModalRef = ref(null)
const orderNameInputRef = ref(null)

// Add functions to handle per-order client selection
function openOrderClientModal() {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  if (clientSearchModalRef.value) {
    clientSearchModalRef.value.reset()
  }
  showClientModal.value = true
}
</script>

<style>
/* Remove cell-label class as we don't need it anymore */
td {
  vertical-align: top;
  min-width: 100px;
}
</style>