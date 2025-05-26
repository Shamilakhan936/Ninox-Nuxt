<template>
  <div class="min-h-screen" style="background-color: #F5F2E8;">
    <!-- Navigation -->
    <Navbar />

    <!-- Page Content -->
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2" style="color: #2D2D2D;">Table Order Entry System</h1>
        <p style="color: #6B6B6B;">
          Create and manage multiple orders with a spreadsheet-like interface.
        </p>
      </div>
      
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" style="color: #6B6B6B;" />
      </div>
      
      <div v-else-if="hasPermission" class="space-y-6">
        <!-- Information Banner -->


        <!-- Elegant Tab Design with Physical Tab Look -->
        <div class="space-y-0">
          <!-- Tab Headers with Integrated Content -->
          <div class="flex items-end gap-1">
            <!-- Order Tabs -->
            <div v-for="(order, index) in orders" :key="index" class="relative">
              <div
                :class="[
                  'transition-all duration-200 border-0 rounded-t-lg',
                  activeTabIndex === index 
                    ? 'bg-white shadow-sm' 
                    : 'bg-gray-100'
                ]"
                style="min-width: 220px; min-height: 65px;"
              >
                <!-- Tab Header -->
                <button
                  :class="[
                    'w-full px-3 py-1.5 text-sm font-medium transition-all duration-200 flex items-center justify-center',
                    activeTabIndex === index 
                      ? 'text-black' 
                      : 'text-gray-600'
                  ]"
                  @click="activeTabIndex = index"
                >
                  <span>{{ order.name }}</span>
                  <UButton
                    v-if="orders.length > 1"
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark"
                    size="xs"
                    class="ml-2 opacity-60 hover:opacity-100"
                    @click.stop="removeOrder(index)"
                    aria-label="Remove order"
                  />
                </button>
                
                <!-- Client Selection Area (always present to maintain consistent height) -->
                <div class="px-3 pb-1.5 flex justify-center min-h-[28px] items-center">
                  <div v-if="activeTabIndex === index">
                    <div v-if="orders[activeTabIndex].client" class="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs" style="background-color: #E5E5E5;">
                      <span class="font-medium" style="color: #2D2D2D;">
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
                      class="px-3 py-0.5 rounded-full text-white text-xs font-medium"
                      style="background-color: #9CA3AF; min-width: 120px;"
                      @click="openOrderClientModal"
                    >
                      SELECT CLIENT
                    </UButton>
                  </div>
                  <!-- Empty space for inactive tabs to maintain consistent height -->
                  <div v-else class="h-[20px]"></div>
                </div>
                
                <!-- Order editing controls (if needed) -->
                <div v-if="isEditingOrderName && activeTabIndex === index" class="px-3 pb-1.5">
                  <div class="flex items-center">
                    <UInput
                      v-model="editedOrderName"
                      size="sm"
                      class="w-full input-rounded"
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
              </div>
            </div>
            
            <!-- Create New Order Tab -->
            <div class="relative">
              <button
                :class="[
                  'px-3 py-1.5 text-sm font-medium transition-all duration-200 border-0 rounded-t-lg',
                  activeTabIndex === -1 
                    ? 'bg-white text-black shadow-sm' 
                    : 'bg-gray-50 text-gray-400'
                ]"
                style="min-height: 65px; min-width: 160px;"
                @click="activeTabIndex = -1"
              >
                <div class="flex items-center justify-center h-full">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                    New Order
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          <!-- Tab Content Area (connected but extends further left) -->
          <div v-if="activeTabIndex >= 0" class="bg-white rounded-b-lg shadow-sm border border-gray-100 -ml-12 pl-12 rounded-tl-lg">
            <!-- Product Form Area -->
            <div class="p-6">
              <!-- Product rows -->
              <div v-for="(product, pIndex) in orders[activeTabIndex].products" :key="pIndex" class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
                <!-- Form Fields Row with integrated numbering -->
                <div class="flex flex-wrap gap-2 items-center">
                  <!-- Elegant Delete Button -->
                  <div class="flex-shrink-0">
                    <button
                      class="delete-product-button"
                      @click="removeProduct(pIndex)"
                      aria-label="Delete product"
                    >
                      ×
                    </button>
                  </div>
                  
                  <!-- Compact Number -->
                  <div class="flex-shrink-0">
                    <span class="product-number">{{ pIndex + 1 }}.</span>
                  </div>
                  
                  <!-- Product Type -->
                  <div class="flex-shrink-0">
                    <USelect
                      v-model="product.productType"
                      :options="productTypes"
                      placeholder="Type"
                      class="select-rounded min-w-[120px]"
                      size="sm"
                    />
                  </div>
                  
                  <!-- Fabric Selection - Simplified -->
                  <div class="flex-shrink-0">
                    <USelect
                      :model-value="product.fabricDetails ? product.fabricDetails.fields['Fabric Name'] : ''"
                      :options="[]"
                      placeholder="Fabric"
                      class="select-rounded min-w-[120px] cursor-pointer"
                      size="sm"
                      @click="openFabricModal(pIndex)"
                    />
                  </div>
                  
                  <!-- Fabric Color Selection - Simplified -->
                  <div class="flex-shrink-0">
                    <USelect
                      :model-value="product.fabricColorDetails ? product.fabricColorDetails.fields['Color Name'] : ''"
                      :options="[]"
                      placeholder="Colour"
                      class="select-rounded min-w-[120px] cursor-pointer"
                      size="sm"
                      :disabled="!product.fabricDetails"
                      @click="openFabricColorModal(pIndex)"
                    />
                  </div>

                  <!-- Dimensions with custom number controls -->
                  <div class="flex items-center gap-1">
                    <div class="input-rounded number-input">
                      <UInput
                        v-model="product.height"
                        type="number"
                        placeholder="Height"
                        class="input-rounded w-20"
                        size="sm"
                      />
                      <div class="number-controls">
                        <div class="number-btn" @mousedown="incrementValue(product, 'height', 1)">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="18,15 12,9 6,15"></polyline>
                          </svg>
                        </div>
                        <div class="number-btn" @mousedown="incrementValue(product, 'height', -1)">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span class="text-xs" style="color: #6B6B6B;">×</span>
                    <div class="input-rounded number-input">
                      <UInput
                        v-model="product.width"
                        type="number"
                        placeholder="Width"
                        class="input-rounded w-20"
                        size="sm"
                      />
                      <div class="number-controls">
                        <div class="number-btn" @mousedown="incrementValue(product, 'width', 1)">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="18,15 12,9 6,15"></polyline>
                          </svg>
                        </div>
                        <div class="number-btn" @mousedown="incrementValue(product, 'width', -1)">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Quantity with custom number controls -->
                  <div class="flex items-center">
                    <div class="input-rounded number-input">
                      <UInput
                        v-model="product.quantity"
                        type="number"
                        placeholder="1"
                        min="1"
                        class="input-rounded w-14"
                        size="sm"
                      />
                      <div class="number-controls">
                        <div class="number-btn" @mousedown="incrementValue(product, 'quantity', 1)">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="18,15 12,9 6,15"></polyline>
                          </svg>
                        </div>
                        <div class="number-btn" @mousedown="incrementValue(product, 'quantity', -1)">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Motor Checkbox -->
                  <div class="flex items-center gap-1">
                    <UCheckbox
                      v-model="product.isMotorized"
                      :disabled="!['Roller Shades', 'Roman Shades'].includes(product.productType)"
                      size="sm"
                    />
                    <span class="text-xs" style="color: #6B6B6B;">Motor</span>
                  </div>
                  
                  <!-- Control/Motor Type -->
                  <div v-if="product.isMotorized">
                    <USelect
                      v-model="product.motorType"
                      :options="getMotorTypes(product.productType)"
                      placeholder="Motor Type"
                      size="sm"
                      class="select-rounded min-w-[120px]"
                    />
                  </div>
                  <div v-else>
                    <USelect
                      v-model="product.controlSide"
                      :options="['Left', 'Right']"
                      placeholder="Side"
                      size="sm"
                      class="select-rounded min-w-[80px]"
                    />
                  </div>
                  
                  <!-- Mount Location -->
                  <div>
                    <USelect
                      v-model="product.mountLocation"
                      :options="['Inside', 'Outside', 'Ceiling']"
                      placeholder="Rail"
                      size="sm"
                      class="select-rounded min-w-[100px]"
                    />
                  </div>
                  
                  <!-- Hardware Color -->
                  <div>
                    <USelect
                      v-model="product.hardwareColor"
                      :options="['White', 'Black', 'Silver', 'Bronze', 'Antique Gold']"
                      placeholder="Hooks"
                      size="sm"
                      class="select-rounded min-w-[100px]"
                    />
                  </div>
                  
                  <!-- Notes - Much smaller and at the end -->
                  <div class="flex-shrink-0">
                    <UInput
                      v-model="product.notes"
                      placeholder="Notes"
                      class="input-rounded w-24"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Empty state -->
              <div v-if="orders[activeTabIndex].products.length === 0" class="text-center py-12" style="color: #6B6B6B;">
                <p class="text-lg mb-4">No products added yet.</p>
                <p>Click the button below to add your first product.</p>
              </div>
            </div>
            
            <!-- Add New Product Button -->
            <div class="px-6 pb-6">
              <div class="flex justify-start">
                <button
                  class="add-product-button"
                  @click="addNewProduct"
                >
                  <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                  Add New Product
                </button>
              </div>
            </div>
            
            <!-- Special Instructions and Submit Order -->
            <div class="px-6 pb-6 border-t pt-6" style="border-color: #F3F4F6;">
              <div class="flex items-center gap-4">
                <!-- Special Instructions Field -->
                <div class="flex-grow">
                  <UInput
                    v-model="orders[activeTabIndex].specialInstructions"
                    placeholder="Special instructions"
                    class="input-rounded"
                    size="lg"
                  />
                </div>
                
                <!-- Submit Order Button -->
                <div class="flex-shrink-0">
                  <UButton
                    class="px-8 py-3 rounded-full text-white font-medium"
                    style="background-color: #B8860B;"
                    :loading="isSubmitting"
                    :disabled="!isFormValid"
                    @click="submitCurrentOrder"
                  >
                    SUBMIT ORDER
                  </UButton>
                </div>
              </div>
            </div>
          </div>
          
          <!-- "Add New Tab" View -->
          <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 -ml-12 pl-20">
            <div class="max-w-lg mx-auto text-center">
              <UIcon name="i-heroicons-plus-circle" class="w-16 h-16 mx-auto mb-4" style="color: #B8A082;" />
              <h3 class="text-xl font-medium mb-2" style="color: #2D2D2D;">Create a New Order</h3>
              <p class="mb-6" style="color: #6B6B6B;">
                Each order can contain multiple products and has its own tab. You can switch between orders at any time using the tabs.
              </p>
            
              <div class="max-w-md mx-auto">
                <UFormGroup label="Order Name" class="mb-4">
                  <UInput v-model="newOrderName" placeholder="Enter a name for this order" class="input-rounded" size="lg" />
                </UFormGroup>
                
                <div class="flex justify-center">
                  <UButton
                    class="px-8 py-3 rounded-full text-white font-medium"
                    style="background-color: #B8A082;"
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
                  class="select-rounded"
                />
              </UFormGroup>

              <!-- Chain Type (for non-motorized) -->
              <UFormGroup v-if="!editingProduct.isMotorized && editingProduct.productType === 'Roller Shades'" label="Chain Type">
                <USelect
                  v-model="editingProduct.chainType"
                  :options="chainTypes"
                  placeholder="Select chain type"
                  class="select-rounded"
                />
              </UFormGroup>

              <!-- Roll Direction (for roller shades) -->
              <UFormGroup v-if="editingProduct.productType === 'Roller Shades'" label="Roll Direction">
                <USelect
                  v-model="editingProduct.rollDirection"
                  :options="['Standard', 'Reverse']"
                  placeholder="Select roll direction"
                  class="select-rounded"
                />
              </UFormGroup>

              <!-- Hardware Color -->
              <UFormGroup label="Hardware Color">
                <USelect
                  v-model="editingProduct.hardwareColor"
                  :options="['White', 'Black', 'Silver', 'Bronze', 'Antique Gold']"
                  placeholder="Select hardware color"
                  class="select-rounded"
                />
              </UFormGroup>
              
              <!-- Notes -->
              <UFormGroup label="Additional Notes">
                <UTextarea
                  v-model="editingProduct.notes"
                  placeholder="Enter any special instructions for this item"
                  :rows="3"
                  class="textarea-rounded"
                />
              </UFormGroup>
            </div>
            
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton
                  color="gray"
                  variant="soft"
                  class="rounded-full"
                  @click="showProductDetailsModal = false"
                >
                  Cancel
                </UButton>
                <UButton
                  color="primary"
                  class="rounded-full"
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
      <div v-else class="border p-6 rounded-lg shadow-sm text-center" style="background-color: #FEF2F2; border-color: #FECACA;">
        <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto mb-4" style="color: #DC2626;" />
        <h2 class="text-xl font-semibold mb-2" style="color: #DC2626;">Insufficient Permissions</h2>
        <p class="mb-4" style="color: #DC2626;">
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

// Add function to handle number input increments
function incrementValue(product, field, increment) {
  const currentValue = parseInt(product[field]) || 0;
  const newValue = Math.max(field === 'quantity' ? 1 : 0, currentValue + increment);
  product[field] = newValue;
}
</script>

<style>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Product numbering with exact specifications - much lighter weight */
.product-number {
  font-family: 'Albert Sans', sans-serif;
  font-weight: 100; /* Changed from 300 to 100 for much lighter appearance */
  font-size: 11.74px;
  line-height: 19.08px;
  letter-spacing: 0px;
  color: #9CA3AF;
  margin-bottom: 8.81px; /* paragraph spacing */
  font-display: swap; /* Ensures proper font loading */
}

/* Rounded styling for all form elements with very light borders */
.input-rounded input {
  border: 1px solid #F3F4F6 !important;
  background-color: #FFFFFF !important;
  color: #2D2D2D !important;
  border-radius: 24px !important;
  font-size: 14px !important;
  padding: 12px 16px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.input-rounded input:focus {
  border-color: #E5E7EB !important;
  box-shadow: 0 0 0 1px #E5E7EB !important;
}

/* Custom styling for number input spinners */
.input-rounded input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  padding-right: 40px !important; /* Make room for custom spinners */
}

/* Webkit browsers (Chrome, Safari, Edge) */
.input-rounded input[type="number"]::-webkit-outer-spin-button,
.input-rounded input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Custom spinner container */
.input-rounded {
  position: relative;
}

.input-rounded input[type="number"] + .spinner-buttons {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.input-rounded .spinner-btn {
  width: 20px;
  height: 12px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 10px;
  color: #6B7280;
}

.input-rounded .spinner-btn:hover {
  background: #F3F4F6;
  border-color: #D1D5DB;
  color: #374151;
}

.input-rounded .spinner-btn:active {
  background: #E5E7EB;
  transform: scale(0.95);
}

/* Alternative approach: Style the default spinners more elegantly */
.input-rounded input[type="number"]::-webkit-outer-spin-button,
.input-rounded input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  width: 24px;
  height: 12px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.input-rounded input[type="number"]:hover::-webkit-outer-spin-button,
.input-rounded input[type="number"]:hover::-webkit-inner-spin-button,
.input-rounded input[type="number"]:focus::-webkit-outer-spin-button,
.input-rounded input[type="number"]:focus::-webkit-inner-spin-button {
  opacity: 1;
}

/* Even better approach: Custom styled number inputs */
.input-rounded.number-input {
  position: relative;
  display: inline-block;
}

.input-rounded.number-input input[type="number"] {
  padding-right: 32px !important;
}

.input-rounded.number-input .number-controls {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.input-rounded.number-input:hover .number-controls,
.input-rounded.number-input input:focus + .number-controls {
  opacity: 1;
}

.input-rounded.number-input .number-btn {
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.input-rounded.number-input .number-btn:hover {
  background: rgba(184, 160, 130, 0.1);
  transform: scale(1.1);
}

.input-rounded.number-input .number-btn:active {
  background: rgba(184, 160, 130, 0.2);
  transform: scale(0.95);
}

.input-rounded.number-input .number-btn svg {
  width: 10px;
  height: 10px;
  color: #9CA3AF;
  stroke-width: 2.5;
}

.input-rounded.number-input .number-btn:hover svg {
  color: #B8A082;
}

.select-rounded select {
  border: 1px solid #F3F4F6 !important;
  background-color: #FFFFFF !important;
  color: #2D2D2D !important;
  border-radius: 24px !important;
  font-size: 14px !important;
  padding: 12px 16px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.select-rounded select:focus {
  border-color: #E5E7EB !important;
  box-shadow: 0 0 0 1px #E5E7EB !important;
}

.textarea-rounded textarea {
  border: 1px solid #F3F4F6 !important;
  background-color: #FFFFFF !important;
  color: #2D2D2D !important;
  border-radius: 16px !important;
  font-size: 14px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.textarea-rounded textarea:focus {
  border-color: #E5E7EB !important;
  box-shadow: 0 0 0 1px #E5E7EB !important;
}

/* Enhanced rounded buttons with subtle borders */
.rounded-full {
  border-radius: 50px !important;
}

/* Override any button borders to be very light */
button.rounded-full {
  border: 1px solid #F3F4F6 !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

/* Special handling for action buttons that shouldn't have visible borders */
button[style*="background-color: #B8A082"],
button[style*="background-color: #B8860B"],
button[style*="background-color: #9CA3AF"] {
  border: 1px solid transparent !important;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
}

/* Minimal Add New Product button styling */
.add-product-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 20px;
  color: #9CA3AF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.add-product-button:hover {
  color: #B8A082;
  background: rgba(184, 160, 130, 0.08);
}

.add-product-button:active {
  background: rgba(184, 160, 130, 0.15);
  transform: scale(0.98);
}

.add-product-button:focus {
  outline: none;
  box-shadow: none;
}

/* Smaller form elements styling */
.input-rounded input {
  border: 1px solid #F3F4F6 !important;
  background-color: #FFFFFF !important;
  color: #2D2D2D !important;
  border-radius: 20px !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.select-rounded select {
  border: 1px solid #F3F4F6 !important;
  background-color: #FFFFFF !important;
  color: #2D2D2D !important;
  border-radius: 20px !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

/* Make fabric and color selects look like regular selects */
.select-rounded {
  position: relative;
}

.select-rounded::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #9CA3AF;
  pointer-events: none;
}

/* Elegant delete button styling */
.delete-product-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: #D1D5DB;
  font-size: 16px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  line-height: 1;
}

.delete-product-button:hover {
  color: #EF4444;
  background: rgba(239, 68, 68, 0.08);
  transform: scale(1.1);
}

.delete-product-button:active {
  background: rgba(239, 68, 68, 0.15);
  transform: scale(0.95);
}

.delete-product-button:focus {
  outline: none;
  box-shadow: none;
}
</style>