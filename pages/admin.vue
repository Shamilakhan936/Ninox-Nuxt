<template>
  <div class="min-h-screen" style="background-color: #f7f7f5;">
    <!-- Navigation -->
    <Navbar />

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Loading state while auth initializes -->
      <div v-if="!isAuthInitialized" class="flex justify-center items-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" style="color: #6B6B6B;" />
        <span class="ml-2" style="color: #6B6B6B;">Loading admin panel...</span>
      </div>
      
      <!-- Not logged in state -->
      <div v-else-if="!isLoggedIn" class="text-center py-12">
        <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto mb-4" style="color: #6B6B6B;" />
        <h2 class="text-2xl font-bold mb-2" style="color: #2D2D2D;">Authentication Required</h2>
        <p class="mb-6" style="color: #6B6B6B;">
          Please sign in to access the admin panel.
        </p>
        <LoginLink to="/api/login" external>
          <button class="admin-primary-button">
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
            Sign In
          </button>
        </LoginLink>
      </div>
      
      <!-- Admin Panel -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2" style="color: #2D2D2D;">Admin Panel</h1>
          <p style="color: #6B6B6B;">Manage your application data</p>
        </div>

        <!-- Entity Tabs -->
        <div class="mb-6">
          <div class="border-b" style="border-color: #E5E5E5;">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="entity in entities"
                :key="entity.key"
                @click="activeEntity = entity.key"
                :class="[
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm admin-tab-button',
                  activeEntity === entity.key ? 'admin-tab-active' : 'admin-tab-inactive'
                ]"
              >
                <UIcon :name="entity.icon" class="w-4 h-4 inline mr-2" />
                {{ entity.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Entity Management Section -->
        <AdminEntityTable
          :entity="currentEntity"
          :data="currentData"
          :loading="loading"
          :error="error"
          @create="openCreateModal"
          @edit="openEditModal"
          @delete="confirmDelete"
          @retry="fetchData"
        />
      </div>
    </div>

    <!-- Entity Modal -->
    <AdminEntityModal
      :show="showModal"
      :entity="currentEntity"
      :editing-item="editingItem"
      :form-data="formData"
      :saving="saving"
      @close="closeModal"
      @save="saveItem"
      @update:form-data="formData = $event"
    />

    <!-- Delete Modal -->
    <AdminDeleteModal
      :show="showDeleteModal"
      :entity="currentEntity"
      :deleting="deleting"
      @close="showDeleteModal = false; deletingItem = null"
      @confirm="deleteItem"
    />

    <!-- Notification System -->
    <NotificationSystem 
      v-model:notification="notification" 
      :auto-hide="true" 
      :duration="5000"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AdminEntityTable from '../components/AdminEntityTable.vue'
import AdminEntityModal from '../components/AdminEntityModal.vue'
import AdminDeleteModal from '../components/AdminDeleteModal.vue'
import NotificationSystem from '../components/NotificationSystem.vue'

// Authentication
const auth = computed(() => {
  try {
    const nuxtApp = useNuxtApp();
    return nuxtApp.$auth || null;
  } catch (e) {
    console.error("Error accessing auth:", e);
    return null;
  }
});

const isLoggedIn = computed(() => !!auth.value?.loggedIn);
const user = computed(() => auth.value?.user || {});
const isAuthInitialized = ref(false);

// State
const activeEntity = ref('customers');
const loading = ref(false);
const error = ref(null);
const showModal = ref(false);
const showDeleteModal = ref(false);
const editingItem = ref(null);
const deletingItem = ref(null);
const saving = ref(false);
const deleting = ref(false);
const formData = ref({});

// Notification system
const notification = ref({
  show: false,
  title: '',
  description: '',
  color: 'green'
});

// Data storage for each entity
const entityData = ref({
  customers: [],
  suppliers: [],
  factories: [],
  orders: [],
  fabrics: [],
  fabricColours: [],
  orderItems: []
});

// Entity definitions - Updated to match actual database schema
const entities = [
  {
    key: 'customers',
    name: 'Customers',
    singular: 'Customer',
    icon: 'i-heroicons-users',
    endpoint: 'customers',
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'firstName', label: 'First Name', type: 'text' },
      { key: 'lastName', label: 'Last Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'phoneNumber', label: 'Phone', type: 'text' },
      { key: 'createdAt', label: 'Created', type: 'date' }
    ],
    fields: [
      { key: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'John' },
      { key: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Doe' },
      { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john.doe@example.com' },
      { key: 'country', label: 'Country', type: 'text', required: true, placeholder: 'United States' },
      { key: 'phoneNumber', label: 'Phone Number', type: 'text', required: false, placeholder: '+1 (555) 123-4567' },
      { key: 'deliveryAddress', label: 'Delivery Address', type: 'textarea', required: true, placeholder: 'Full delivery address' }
    ]
  },
  {
    key: 'suppliers',
    name: 'Suppliers',
    singular: 'Supplier',
    icon: 'i-heroicons-truck',
    endpoint: 'suppliers',
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'currency', label: 'Currency', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'contactEmail', label: 'Email', type: 'text' },
      { key: 'contactPhone', label: 'Phone', type: 'text' },
      { key: 'isActive', label: 'Active', type: 'status' }
    ],
    fields: [
      { key: 'name', label: 'Supplier Name', type: 'text', required: true, placeholder: 'Supplier name' },
      { key: 'currency', label: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'GBP', 'ISK'] },
      { key: 'location', label: 'Location', type: 'textarea', required: true, placeholder: 'Full supplier location/address' },
      { key: 'contactEmail', label: 'Contact Email', type: 'email', required: false, placeholder: 'contact@supplier.com' },
      { key: 'contactPhone', label: 'Contact Phone', type: 'text', required: false, placeholder: '+1 (555) 123-4567' }
    ]
  },
  {
    key: 'factories',
    name: 'Factories',
    singular: 'Factory',
    icon: 'i-heroicons-building-office-2',
    endpoint: 'factories',
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'contactEmail', label: 'Email', type: 'text' },
      { key: 'contactPhone', label: 'Phone', type: 'text' },
      { key: 'isActive', label: 'Active', type: 'status' }
    ],
    fields: [
      { key: 'name', label: 'Factory Name', type: 'text', required: true, placeholder: 'Factory name' },
      { key: 'location', label: 'Location', type: 'textarea', required: true, placeholder: 'Factory location/address' },
      { key: 'capacity', label: 'Production Capacity', type: 'number', required: false, placeholder: '1000' },
      { key: 'contactEmail', label: 'Contact Email', type: 'email', required: false, placeholder: 'contact@factory.com' },
      { key: 'contactPhone', label: 'Contact Phone', type: 'text', required: false, placeholder: '+1 (555) 123-4567' }
    ]
  },
  {
    key: 'orders',
    name: 'Orders',
    singular: 'Order',
    icon: 'i-heroicons-shopping-bag',
    endpoint: 'orders',
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'customerId', label: 'Customer ID', type: 'text' },
      { key: 'dateOrderCreated', label: 'Created', type: 'date' },
      { key: 'fulfillment', label: 'Fulfillment', type: 'text' },
      { key: 'installationDate', label: 'Installation', type: 'date' },
      { key: 'customerLocation', label: 'Location', type: 'text' }
    ],
    fields: [
      { key: 'customerId', label: 'Customer ID', type: 'number', required: true, placeholder: 'Customer ID (number)' },
      { key: 'status', label: 'Status', type: 'select', required: true, options: ['Defining Order', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
      { key: 'fulfillment', label: 'Fulfillment Type', type: 'select', required: false, options: ['Installation', 'Pickup', 'Delivery'] },
      { key: 'installationDate', label: 'Installation Date', type: 'date', required: false },
      { key: 'customerLocation', label: 'Customer Location', type: 'text', required: false, placeholder: 'Customer location' },
      { key: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Order notes' }
    ]
  },
  {
    key: 'fabrics',
    name: 'Fabrics',
    singular: 'Fabric',
    icon: 'i-heroicons-swatch',
    endpoint: 'fabrics',
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'publicName', label: 'Name', type: 'text' },
      { key: 'supplierId', label: 'Supplier ID', type: 'text' },
      { key: 'products', label: 'Products', type: 'text' },
      { key: 'transparency', label: 'Transparency', type: 'text' },
      { key: 'rollWidth', label: 'Width', type: 'text' },
      { key: 'externalPricePerMeter', label: 'Price/m', type: 'currency' }
    ],
    fields: [
      { key: 'supplierId', label: 'Supplier ID', type: 'number', required: true, placeholder: 'Supplier ID (number)' },
      { key: 'publicName', label: 'Public Name', type: 'text', required: true, placeholder: 'Fabric public name' },
      { key: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Fabric description' },
      { key: 'products', label: 'Products', type: 'text', required: false, placeholder: 'Pleated Shades, Curtains' },
      { key: 'transparency', label: 'Transparency', type: 'text', required: false, placeholder: 'Light Filtering' },
      { key: 'composition', label: 'Composition', type: 'text', required: false, placeholder: '100% PES' },
      { key: 'rollWidth', label: 'Roll Width', type: 'text', required: false, placeholder: '315cm' },
      { key: 'thickness', label: 'Thickness', type: 'text', required: false, placeholder: '1mm' },
      { key: 'weight', label: 'Weight', type: 'text', required: false, placeholder: '239g/m2' },
      { key: 'externalPricePerMeter', label: 'External Price/Meter', type: 'number', required: false, placeholder: '22.60' }
    ]
  },
  {
    key: 'fabricColours',
    name: 'Fabric Colours',
    singular: 'Fabric Colour',
    icon: 'i-heroicons-paint-brush',
    endpoint: 'fabric-colours',
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'fabricId', label: 'Fabric ID', type: 'text' },
      { key: 'collectionName', label: 'Collection', type: 'text' },
      { key: 'colourCategory', label: 'Category', type: 'text' },
      { key: 'colour', label: 'Colour', type: 'text' },
      { key: 'availableForSample', label: 'Sample Available', type: 'status' }
    ],
    fields: [
      { key: 'fabricId', label: 'Fabric ID', type: 'number', required: true, placeholder: 'Fabric ID (number)' },
      { key: 'collectionName', label: 'Collection Name', type: 'text', required: true, placeholder: 'Collection name' },
      { key: 'colourCategory', label: 'Colour Category', type: 'text', required: true, placeholder: 'Neutrals, Blues, Reds' },
      { key: 'colour', label: 'Colour', type: 'text', required: true, placeholder: 'Ocean Blue, Cream White' },
      { key: 'swatchImage', label: 'Swatch Image URL', type: 'text', required: false, placeholder: 'https://example.com/swatch.jpg' },
      { key: 'availableForSample', label: 'Available for Sample', type: 'select', required: true, options: ['true', 'false'] }
    ]
  },
  {
    key: 'orderItems',
    name: 'Order Items',
    singular: 'Order Item',
    icon: 'i-heroicons-list-bullet',
    endpoint: 'order-items',
    columns: [
      { key: 'id', label: 'ID', type: 'text' },
      { key: 'orderId', label: 'Order ID', type: 'text' },
      { key: 'productType', label: 'Product Type', type: 'text' },
      { key: 'quantity', label: 'Qty', type: 'number' },
      { key: 'width', label: 'Width', type: 'number' },
      { key: 'length', label: 'Length', type: 'number' },
      { key: 'status', label: 'Status', type: 'status' }
    ],
    fields: [
      { key: 'orderId', label: 'Order ID', type: 'number', required: true, placeholder: 'Order ID (number)' },
      { key: 'factoryId', label: 'Factory ID', type: 'number', required: true, placeholder: 'Factory ID (number)' },
      { key: 'fabricId', label: 'Fabric ID', type: 'number', required: true, placeholder: 'Fabric ID (number)' },
      { key: 'fabricColourId', label: 'Fabric Colour ID', type: 'number', required: true, placeholder: 'Fabric Colour ID (number)' },
      { key: 'productType', label: 'Product Type', type: 'select', required: true, options: ['roller_blinds', 'curtains', 'roman_shades', 'pleated_shades'] },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: '1' },
      { key: 'width', label: 'Width', type: 'number', required: true, placeholder: '100.50' },
      { key: 'length', label: 'Length', type: 'number', required: true, placeholder: '150.75' },
      { key: 'status', label: 'Status', type: 'select', required: true, options: ['Queued', 'In Production', 'Completed'] },
      { key: 'worksheetImage', label: 'Worksheet Image URL', type: 'text', required: false, placeholder: 'https://example.com/worksheet.jpg' }
    ]
  }
];

// Use runtime config for API base URL
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// Computed properties
const currentEntity = computed(() => {
  return entities.find(e => e.key === activeEntity.value) || entities[0];
});

const currentData = computed(() => {
  return entityData.value[activeEntity.value] || [];
});

// API functions
async function fetchData() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`/api/${currentEntity.value.endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    
    entityData.value[activeEntity.value] = responseData.data || responseData;
    
  } catch (err) {
    error.value = `Failed to fetch ${currentEntity.value.name.toLowerCase()}: ${err.message}`;
    console.error('Fetch error:', err);
  } finally {
    loading.value = false;
  }
}

async function saveItem() {
  saving.value = true;
  
  try {
    const url = editingItem.value 
      ? `/api/${currentEntity.value.endpoint}/${editingItem.value.id}`
      : `/api/${currentEntity.value.endpoint}`;
    
    const method = editingItem.value ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    await fetchData();
    
    showNotification({
      title: 'Success',
      description: `${currentEntity.value.singular} ${editingItem.value ? 'updated' : 'created'} successfully`,
      color: 'green'
    });
    
    closeModal();
  } catch (err) {
    showNotification({
      title: 'Error',
      description: `Failed to save ${currentEntity.value.singular.toLowerCase()}: ${err.message}`,
      color: 'red'
    });
  } finally {
    saving.value = false;
  }
}

async function deleteItem() {
  if (!deletingItem.value) return;
  
  deleting.value = true;
  
  try {
    const response = await fetch(`/api/${currentEntity.value.endpoint}/${deletingItem.value.id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    await fetchData();
    
    showNotification({
      title: 'Success',
      description: `${currentEntity.value.singular} deleted successfully`,
      color: 'green'
    });
    
    showDeleteModal.value = false;
    deletingItem.value = null;
  } catch (err) {
    showNotification({
      title: 'Error',
      description: `Failed to delete ${currentEntity.value.singular.toLowerCase()}: ${err.message}`,
      color: 'red'
    });
  } finally {
    deleting.value = false;
  }
}

// Modal functions
function openCreateModal() {
  editingItem.value = null;
  formData.value = {};
  showModal.value = true;
}

function openEditModal(item) {
  editingItem.value = item;
  formData.value = { ...item };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingItem.value = null;
  formData.value = {};
}

function confirmDelete(item) {
  deletingItem.value = item;
  showDeleteModal.value = true;
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

// Watchers
watch(activeEntity, () => {
  fetchData();
});

// Lifecycle
onMounted(() => {
  setTimeout(() => {
    isAuthInitialized.value = true;
    if (isLoggedIn.value) {
      fetchData();
    }
  }, 200);
});

// Page meta
definePageMeta({
  title: 'Admin Panel',
  middleware: ['auth-logged-in']
});
</script>

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Apply Albert Sans to entire component */
.min-h-screen {
  font-family: 'Albert Sans', sans-serif;
}

/* Tab styling */
.admin-tab-button {
  font-family: 'Albert Sans', sans-serif;
  font-weight: 300;
  transition: all 0.2s ease;
}

.admin-tab-active {
  border-color: #8A7C59;
  color: #8A7C59;
}

.admin-tab-inactive {
  border-color: transparent;
  color: #6B6B6B;
}

.admin-tab-inactive:hover {
  color: #8A7C59;
  border-color: #BFB7B0;
}

/* Button styling */
.admin-primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8.8px 16.1px;
  background-color: #8A7C59;
  color: #FFFFFF;
  border: none;
  border-radius: 48.44px;
  font-size: 11.74px;
  line-height: 19.08px;
  font-weight: 300;
  font-family: 'Albert Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 35px;
  min-width: fit-content;
}

.admin-primary-button:hover {
  background-color: #6B5B42;
}

.admin-primary-button:disabled {
  background-color: #BFB7B0;
  cursor: not-allowed;
}

/* Typography matching */
.text-2xl {
  font-size: 24px !important;
  line-height: 32px !important;
  font-weight: 400 !important;
  font-family: 'Albert Sans', sans-serif !important;
}

.text-lg {
  font-size: 16px !important;
  line-height: 24px !important;
  font-weight: 400 !important;
  font-family: 'Albert Sans', sans-serif !important;
}

.text-sm {
  font-size: 13px !important;
  font-weight: 300 !important;
  font-family: 'Albert Sans', sans-serif !important;
}

/* Reset text selection to browser default */
::selection {
  background-color: Highlight !important;
  color: HighlightText !important;
}

::-moz-selection {
  background-color: Highlight !important;
  color: HighlightText !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-2xl {
    font-size: 20px !important;
    line-height: 28px !important;
  }
  
  .admin-tab-button {
    font-size: 12px !important;
    padding: 8px 4px !important;
  }
  
  .admin-primary-button {
    padding: 6px 12px !important;
    font-size: 10px !important;
    height: 30px !important;
  }
}
</style>