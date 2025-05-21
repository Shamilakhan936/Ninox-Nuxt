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
        <!-- Information Banner -->
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
          </div>
              <div class="flex justify-end mt-4">
            <UButton
              color="green"
                  icon="i-heroicons-paper-airplane"
                  :loading="isSubmitting"
                  :disabled="!isFormValid"
              @click="submitCurrentOrder"
            >
              Submit Order
            </UButton>
          </div>
        </div>
          </div>
          <!-- Product Table - With enhanced scrolling but no fixed headers -->
          <div class="relative">
            <!-- Scroll indicators -->
            <div class="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div class="scroll-indicator-left opacity-0 transition-opacity duration-300 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent h-12 w-8 flex items-center justify-center">
                <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div class="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div class="scroll-indicator-right opacity-0 transition-opacity duration-300 bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent h-12 w-8 flex items-center justify-center">
                <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            <!-- Table container with improved scrolling but no fixed headers -->
            <div class="overflow-x-auto scrollbar-track-rounded scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scrollbar-thin" ref="tableContainer" @scroll="handleTableScroll">
              <div class="bg-white dark:bg-gray-800">
                <!-- Product rows -->
                <div v-for="(product, pIndex) in orders[activeTabIndex].products" :key="pIndex" class="min-w-max flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <!-- Product Type Cell -->
                  <div class="w-[120px] p-2">
                    <USelect
                      v-model="product.productType"
                      :options="productTypes"
                      placeholder="Type"
                      class="w-full"
                      size="sm"
                    />
                  </div>
                  
                  <!-- Fabric Selection Cell - Keep horizontal layout for fabric type, fix modal trigger -->
                  <div class="w-[240px] p-2">
                    <!-- Fabric Type Row -->
                    <div class="flex items-center space-x-2 mb-1">
                      <UButton
                        size="xs"
                        variant="soft"
                        color="primary"
                        @click="openFabricModal(pIndex)"
                      >
                        {{ product.fabricDetails ? 'FT - Change' : 'FT - Select' }}
                      </UButton>
                      
                      <div v-if="product.fabricDetails" class="flex items-center overflow-hidden">
                        <div 
                          class="w-3 h-3 rounded-full mr-1 flex-shrink-0"
                          :style="{ backgroundColor: product.fabricDetails.fields['Color Hex'] || '#64748b' }"
                        ></div>
                        <span class="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {{ product.fabricDetails.fields['Fabric Name'] }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Fabric Color Row -->
                    <div class="flex items-center space-x-2">
                      <UButton
                        size="xs"
                        variant="soft"
                        color="indigo"
                        @click="openFabricColorModal(pIndex)"
                        :disabled="!product.fabricDetails"
                        class="whitespace-nowrap"
                      >
                        {{ product.fabricColorDetails ? 'FC - Change' : 'FC - Select' }}
                      </UButton>
                      
                      <div v-if="product.fabricColorDetails" class="flex items-center overflow-hidden">
                        <div 
                          class="w-3 h-3 rounded-full mr-1 flex-shrink-0"
                          :style="{ backgroundColor: product.fabricColorDetails.fields['Color Hex'] || '#64748b' }"
                        ></div>
                        <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ product.fabricColorDetails.fields['Collection Name'] || '' }}
                          <template v-if="product.fabricColorDetails.fields['Color Category']">
                            - {{ product.fabricColorDetails.fields['Color Category'] }}
                          </template>
                          <template v-if="product.fabricColorDetails.fields['Color Specific']">
                            - {{ product.fabricColorDetails.fields['Color Specific'] }}
                          </template>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Width Cell -->
                  <div class="w-[120px] p-2">
                    <UInput
                      v-model="product.width"
                      type="number"
                      placeholder="Width - mm"
                      class="w-full"
                      size="sm"
                    />
                  </div>
                  
                  <!-- Height Cell -->
                  <div class="w-[120px] p-2">
                    <UInput
                      v-model="product.height"
                      type="number"
                      placeholder="Height - mm"
                      class="w-full"
                      size="sm"
                    />
                  </div>
                  
                  <!-- Quantity Cell -->
                  <div class="w-[80px] p-2">
                    <UInput
                      v-model="product.quantity"
                      type="number"
                      placeholder="Qty"
                      min="1"
                      class="w-full"
                      size="sm"
                    />
                  </div>
                  
                  <!-- Motorized Cell -->
                  <div class="w-[100px] p-2 flex items-center">
                    <span class="text-xs text-gray-500 mr-2">Motor</span>
                    <UCheckbox
                      v-model="product.isMotorized"
                      :disabled="!['Roller Shades', 'Roman Shades'].includes(product.productType)"
                    />
                  </div>
                  
                  <!-- Control Cell (changes based on motorization) -->
                  <div class="w-[120px] p-2">
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
                  </div>
                  
                  <!-- Mount Location Cell -->
                  <div class="w-[120px] p-2">
                    <USelect
                      v-model="product.mountLocation"
                      :options="['Inside', 'Outside', 'Ceiling']"
                      placeholder="Mount"
                      size="sm"
                      class="w-full"
                    />
                  </div>
                  
                  <!-- Hardware Color Cell -->
                  <div class="w-[120px] p-2">
                    <USelect
                      v-model="product.hardwareColor"
                      :options="['White', 'Black', 'Silver', 'Bronze', 'Antique Gold']"
                      placeholder="Color"
                      size="sm"
                      class="w-full"
                    />
                  </div>
                  
                  <!-- Roll Direction Cell (for roller shades) -->
                  <div class="w-[140px] p-2">
                    <USelect
                      v-if="product.productType === 'Roller Shades'"
                      v-model="product.rollDirection"
                      :options="['Standard', 'Reverse']"
                      placeholder="Roll Direction"
                      size="sm"
                      class="w-full"
                    />
                    <span v-else class="text-sm text-gray-400">N/A</span>
                  </div>
                  
                  <!-- Notes Cell -->
                  <div class="w-[200px] p-2">
                    <UInput
                      v-model="product.notes"
                      placeholder="Notes"
                      class="w-full"
                      size="sm"
                    />
                  </div>
                  
                  <!-- Actions Cell -->
                  <div class="w-[100px] p-2">
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
                  </div>
                </div>
                
                <!-- Empty state -->
                <div v-if="orders[activeTabIndex].products.length === 0" class="text-center p-8 text-gray-500 dark:text-gray-400">
                    No products added yet. Click the button below to add your first product.
                </div>
              </div>
            </div>
          </div>
            
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
        
        <!-- Fabric Color Search Modal -->
        <FabricColorSearchModal
          v-if="editingProductIndex !== null && orders[activeTabIndex] && orders[activeTabIndex].products[editingProductIndex]"
          v-model="showFabricColorModal"
          :fabric-id="orders[activeTabIndex].products[editingProductIndex]?.fabricDetails?.id"
          :fabric-name="orders[activeTabIndex].products[editingProductIndex]?.fabricDetails?.fields['Fabric Name'] || ''"
          @select="selectFabricColor"
          @notification="showNotification"
          ref="fabricColorSearchModalRef"
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Navbar from '../components/Navbar.vue'
import ClientSearchModal from '../components/ClientSearchModal.vue'
import FabricSearchModal from '../components/FabricSearchModal.vue'
import FabricColorSearchModal from '../components/FabricColorSearchModal.vue'
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
const showFabricColorModal = ref(false)
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
    if (!product.fabricColorId && !product.fabricColorDetails) return false
    if (product.isMotorized && !product.motorType) return false
    if (!product.isMotorized && !product.controlSide) return false
    if (!product.mountLocation) return false
    if (product.productType === 'Roller Shades' && !product.rollDirection) return false
    if (product.quantity < 1) return false
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
    fabricColorId: null,
    fabricColorDetails: null,
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
    
    // Extract the client ID properly based on the object structure
    const clientId = order.client?.id || 
                    order.client?.fields?.['Customer ID'] || 
                    order.client?.fields?.ID ||
                    null
                    
    if (!clientId) {
      throw new Error('Client information is missing or invalid')
    }
    
    const orderData = {
      isExistingCustomer: true,
      selectedCustomerId: clientId,
      clientName: `${order.client.fields['First Name']} ${order.client.fields['Last Name']}`,
      installationRequired: false,
      country: 'United States',
      specialInstructions: order.specialInstructions,
      orderName: order.name, // Include the order name
      items: order.products.map(product => {
        // Ensure fabricId is correctly included
        const fabricId = product.fabricId || 
                        (product.fabricDetails?.fabricId) || 
                        (product.fabricDetails?.fields['Fabric ID']) || 
                        null
        
        // Ensure fabricColorId is correctly included
        const fabricColorId = product.fabricColorId || 
                            (product.fabricColorDetails?.id) || 
                            (product.fabricColorDetails?.fields['Color ID']) || 
                            null
        
        // Create a clean product object with only the necessary fields           
        return {
          productType: product.productType,
          fabricId: fabricId,
          fabricColorId: fabricColorId,
          width: product.width,
          height: product.height,
          quantity: product.quantity || 1,
          isMotorized: product.isMotorized || false,
          motorType: product.isMotorized ? product.motorType : null,
          controlSide: !product.isMotorized ? product.controlSide : null,
          mountLocation: product.mountLocation,
          rollDirection: product.productType === 'Roller Shades' ? product.rollDirection : null,
          hardwareColor: product.hardwareColor,
          chainType: (!product.isMotorized && product.productType === 'Roller Shades') ? product.chainType : null,
          notes: product.notes
        }
      })
    }
    
    console.log('Submitting order data:', orderData)
    
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
        description: result.message || `Order "${order.name}" submitted successfully!`,
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
    console.error('Order submission error:', error)
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
const fabricColorSearchModalRef = ref(null)

// Add functions to handle per-order client selection
function openOrderClientModal() {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  if (clientSearchModalRef.value) {
    clientSearchModalRef.value.reset()
  }
  showClientModal.value = true
}

// Reference to the table container for scroll indicators
const tableContainer = ref(null)

// Function to handle table scrolling
function handleTableScroll(event) {
  const container = event.target
  const leftIndicator = document.querySelector('.scroll-indicator-left')
  const rightIndicator = document.querySelector('.scroll-indicator-right')
  
  if (leftIndicator && rightIndicator) {
    // Show left indicator if scrolled right
    if (container.scrollLeft > 20) {
      leftIndicator.classList.add('opacity-100')
    } else {
      leftIndicator.classList.remove('opacity-100')
    }
    
    // Show right indicator if can scroll more right
    if (container.scrollLeft < (container.scrollWidth - container.clientWidth - 20)) {
      rightIndicator.classList.add('opacity-100')
    } else {
      rightIndicator.classList.remove('opacity-100')
    }
  }
}

// Initialize scroll indicators on mount
onMounted(() => {
  nextTick(() => {
    if (tableContainer.value) {
      // Trigger scroll handler to set initial state
      handleTableScroll({ target: tableContainer.value })
    }
  })
})

// Add function to open the fabric color modal
function openFabricColorModal(productIndex) {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  const product = orders.value[activeTabIndex.value].products[productIndex]
  
  if (!product.fabricDetails) {
    showNotification({
      title: 'Select Fabric Type First',
      description: 'Please select a fabric type before choosing a fabric color.',
      color: 'yellow'
    })
    return
  }
  
  editingProductIndex.value = productIndex
  if (fabricColorSearchModalRef.value) {
    fabricColorSearchModalRef.value.reset()
  }
  showFabricColorModal.value = true
}

// Add function to handle fabric color selection
function selectFabricColor(fabricColor) {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
  
  const orderIndex = activeTabIndex.value
  const colorId = fabricColor.id || fabricColor.fields['Color ID']
  
  orders.value[orderIndex].products[editingProductIndex.value].fabricColorDetails = fabricColor
  orders.value[orderIndex].products[editingProductIndex.value].fabricColorId = colorId
  
  showNotification({
    title: 'Fabric Color Selected',
    description: `${fabricColor.fields['Color Name']} has been selected.`,
    color: 'indigo'
  })
  
  // Reset editing product index
  editingProductIndex.value = null
}
</script>

<style>
/* Scrollbar styling for better UX */
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background-color: rgba(156, 163, 175, 0.1);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* Ensure consistent cell heights */
.min-w-max > div {
  min-height: 44px;
}
</style>