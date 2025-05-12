<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Loading state while auth initializes -->
      <div v-if="!isAuthInitialized" class="flex justify-center items-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
        <span class="ml-2 text-gray-600 dark:text-gray-400">Loading account...</span>
      </div>
      
      <!-- Not logged in state -->
      <div v-else-if="!isLoggedIn" class="text-center py-12">
        <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Please sign in to view your account information.
        </p>
        <LoginLink to="/api/login" external>
          <UButton color="primary" icon="i-heroicons-arrow-right-on-rectangle">
            Sign In
          </UButton>
        </LoginLink>
      </div>
      
      <!-- Logged in state -->
      <div v-else>
        <!-- Account Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6">
            <div class="flex items-center">
              <div class="mr-6">
                <img 
                  v-if="user.picture" 
                  :src="user.picture" 
                  class="h-24 w-24 rounded-full border-4 border-white shadow-md" 
                  alt="Profile" 
                />
                <div 
                  v-else 
                  class="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md"
                >
                  {{ user.given_name?.[0] || 'U' }}
                </div>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white">
                  {{ user.given_name }} {{ user.family_name }}
                </h1>
                <p class="text-blue-100">
                  {{ user.email }}
                </p>
                <p class="text-blue-200 text-sm mt-2">
                  Account type: <span class="font-semibold">Wholesale Customer</span>
                </p>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap gap-6">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ formatDate(user.updated_at) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p class="font-medium">
                  <UBadge color="green" variant="subtle">Active</UBadge>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Orders Placed</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ orders.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Account Content Tabs -->
        <UTabs :items="tabItems" class="mb-8">
          <template #default="{ activeTabValue }">
            <div class="py-4">
              <!-- Orders Tab -->
              <div v-if="activeTabValue === 'orders'">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Order History</h2>
                  <div class="space-x-2">
                    <UButton @click="fetchOrders" icon="i-heroicons-arrow-path" color="blue" size="sm">
                      Refresh Orders
                    </UButton>
                    <UButton to="/orders" icon="i-heroicons-plus" color="primary" size="sm">
                      New Order
                    </UButton>
                  </div>
                </div>
                
                <div v-if="isLoading" class="flex justify-center py-12">
                  <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
                </div>
                
                <div v-else-if="orders.length > 0">
                  <!-- Order Cards List -->
                  <div class="space-y-6">
                    <div 
                      v-for="order in orders" 
                      :key="order.id" 
                      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                    >
                      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Order #{{ order.id }}
                          </p>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ formatDate(order.createdAt) }}
                          </p>
                        </div>
                        <UBadge 
                          :color="getStatusColor(order.status)" 
                          variant="subtle"
                        >
                          {{ getStatusLabel(order.status) }}
                        </UBadge>
                      </div>
                      
                      <!-- Order Summary -->
                      <div class="px-6 py-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              Items
                            </p>
                            <p class="font-medium text-gray-900 dark:text-white">
                              {{ order.items?.length || 0 }} products
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              Shipping
                            </p>
                            <p class="font-medium text-gray-900 dark:text-white">
                              {{ order.shipping?.method || 'Standard' }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              Total
                            </p>
                            <p class="font-medium text-gray-900 dark:text-white">
                              {{ formatPrice(order.total) }}
                            </p>
                          </div>
                        </div>
                        
                        <!-- Shipping Information -->
                        <div v-if="order.shipping?.trackingNumber" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <div class="flex items-start">
                            <UIcon name="i-heroicons-truck" class="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                            <div>
                              <p class="font-medium text-blue-700 dark:text-blue-300">Shipping Status</p>
                              <p class="text-sm text-blue-600 dark:text-blue-400">
                                Tracking #: {{ order.shipping.trackingNumber }}
                              </p>
                              <p v-if="order.shipping.estimatedDate" class="text-sm text-blue-600 dark:text-blue-400">
                                Estimated delivery: {{ formatDate(order.shipping.estimatedDate) }}
                              </p>
                              <UButton
                                size="xs"
                                color="blue"
                                variant="link"
                                class="mt-1 px-0"
                                @click="trackOrder(order.shipping.trackingNumber)"
                              >
                                Track package
                              </UButton>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Order Products -->
                        <UAccordion :items="getOrderProducts(order)" class="mb-4" />
                        
                        <!-- Order Actions -->
                        <div class="flex justify-end space-x-2">
                          <UButton 
                            size="sm" 
                            color="gray" 
                            variant="ghost" 
                            icon="i-heroicons-document-duplicate"
                            @click="duplicateOrder(order)"
                          >
                            Duplicate
                          </UButton>
                          <UButton 
                            size="sm" 
                            color="primary" 
                            icon="i-heroicons-eye"
                            @click="viewOrderDetails(order)"
                          >
                            View Details
                          </UButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                  <UIcon name="i-heroicons-shopping-bag" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't placed any orders yet. Start by creating your first order.
                  </p>
                  <UButton to="/orders" color="primary" icon="i-heroicons-plus">
                    Create Your First Order
                  </UButton>
                </div>
              </div>
              
              <!-- Settings Tab -->
              <div v-else-if="activeTabValue === 'settings'">
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h3>
                  </div>
                  
                  <div class="px-6 py-4">
                    <div class="space-y-6">
                      <!-- Contact Information -->
                      <div>
                        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Contact Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <UFormGroup label="First Name" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              :model-value="user.given_name"
                              disabled
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Last Name" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              :model-value="user.family_name"
                              disabled
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Email Address" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              :model-value="user.email"
                              disabled
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                              }"
                            />
                          </UFormGroup>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          To update your profile information, please contact customer support.
                        </p>
                      </div>
                      
                      <!-- Company Information -->
                      <div>
                        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Company Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <UFormGroup label="Company Name" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="companyInfo.name"
                              placeholder="Enter company name"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Business Type" class="text-gray-600 dark:text-gray-300">
                            <USelect
                              v-model="companyInfo.type"
                              :options="businessTypes"
                              placeholder="Select business type"
                              :ui="{
                                base: 'relative',
                                form: 'form-select',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Tax ID / Business Number" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="companyInfo.taxId"
                              placeholder="Enter tax ID"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                        </div>
                      </div>
                      
                      <!-- Shipping Information -->
                      <div>
                        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Default Shipping Address</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <UFormGroup label="Address Line 1" class="text-gray-600 dark:text-gray-300 md:col-span-2">
                            <UInput
                              v-model="shippingInfo.address1"
                              placeholder="Enter address line 1"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Address Line 2" class="text-gray-600 dark:text-gray-300 md:col-span-2">
                            <UInput
                              v-model="shippingInfo.address2"
                              placeholder="Enter address line 2 (optional)"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="City" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="shippingInfo.city"
                              placeholder="Enter city"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="State / Province" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="shippingInfo.state"
                              placeholder="Enter state or province"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Postal Code" class="text-gray-600 dark:text-gray-300">
                            <UInput
                              v-model="shippingInfo.postalCode"
                              placeholder="Enter postal code"
                              :ui="{
                                base: 'relative',
                                form: 'form-input',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                          
                          <UFormGroup label="Country" class="text-gray-600 dark:text-gray-300">
                            <USelect
                              v-model="shippingInfo.country"
                              :options="countries"
                              placeholder="Select country"
                              :ui="{
                                base: 'relative',
                                form: 'form-select',
                                input: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                              }"
                            />
                          </UFormGroup>
                        </div>
                      </div>
                      
                      <!-- Save Button -->
                      <div class="flex justify-end">
                        <UButton 
                          color="primary" 
                          icon="i-heroicons-check" 
                          :loading="isSaving"
                          @click="saveSettings"
                        >
                          Save Changes
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Support Tab -->
              <div v-else-if="activeTabValue === 'support'">
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Customer Support</h3>
                  </div>
                  
                  <div class="px-6 py-4">
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                      Need assistance with your wholesale account or orders? Our support team is here to help.
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div class="flex items-center mb-4">
                          <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-blue-500 mr-2" />
                          <h4 class="text-md font-medium text-gray-900 dark:text-white">Email Support</h4>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 mb-3">
                          Send us an email and we'll respond within 24 hours.
                        </p>
                        <a href="mailto:support@windowtreatment.com" class="text-blue-600 dark:text-blue-400 font-medium">
                          support@windowtreatment.com
                        </a>
                      </div>
                      
                      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div class="flex items-center mb-4">
                          <UIcon name="i-heroicons-phone" class="w-6 h-6 text-blue-500 mr-2" />
                          <h4 class="text-md font-medium text-gray-900 dark:text-white">Phone Support</h4>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 mb-3">
                          Call us Monday-Friday, 9am-5pm EST.
                        </p>
                        <a href="tel:+15551234567" class="text-blue-600 dark:text-blue-400 font-medium">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>
                    
                    <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h4>
                      
                      <UAccordion :items="supportFaqs" class="mb-6" />
                      
                      <div class="text-center mt-6">
                        <UButton color="primary" variant="soft">
                          View All FAQs
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </div>
    
    <!-- Order Detail Modal -->
    <UModal v-model="showOrderDetailModal" :ui="{ width: 'max-w-3xl' }">
      <div v-if="selectedOrder" class="p-4">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Order #{{ selectedOrder.id }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Placed on {{ formatDate(selectedOrder.createdAt) }}
            </p>
          </div>
          <UBadge :color="getStatusColor(selectedOrder.status)" class="ml-2">
            {{ getStatusLabel(selectedOrder.status) }}
          </UBadge>
        </div>
        
        <!-- Order Items Table -->
        <div class="mb-6 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specs</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fabric</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(item, index) in selectedOrder.items" :key="index">
                <td class="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {{ item.productType }}
                  <span v-if="item.motorized" class="ml-1 text-xs text-blue-600 dark:text-blue-400">(Motorized)</span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div>{{ item.width }}mm × {{ item.height }}mm</div>
                  <div class="text-xs text-gray-400 mt-1">Mount: {{ item.mountLocation || 'Inside' }}</div>
                  <div v-if="item.hardwareColor" class="text-xs text-gray-400">Color: {{ item.hardwareColor }}</div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div>{{ item.fabric }}</div>
                  <div v-if="item.style" class="text-xs text-gray-400 mt-1">Style: {{ item.style }}</div>
                  <div v-if="item.control" class="text-xs text-gray-400">
                    {{ item.controlPosition || '' }} {{ item.control }}
                  </div>
                  <div v-if="item.rollDirection" class="text-xs text-gray-400">
                    {{ item.rollDirection }} roll
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ item.quantity }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <UBadge :color="getStatusColor(item.status)" size="sm">
                    {{ getStatusLabel(item.status) }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Order Shipping Information -->
        <div v-if="selectedOrder.shipping" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Shipping Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Method</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedOrder.shipping.method }}</p>
            </div>
            <div v-if="selectedOrder.shipping.estimatedDate">
              <p class="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedOrder.shipping.estimatedDate) }}</p>
            </div>
            <div v-if="selectedOrder.shipping.trackingNumber" class="md:col-span-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
              <div class="flex items-center">
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedOrder.shipping.trackingNumber }}</p>
                <UButton
                  size="xs"
                  color="blue"
                  variant="link"
                  class="ml-2"
                  @click="trackOrder(selectedOrder.shipping.trackingNumber)"
                >
                  Track package
                </UButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Order Total Information -->
        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(selectedOrder.total * 0.9) }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            <span class="text-gray-600 dark:text-gray-400">Tax</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(selectedOrder.total * 0.1) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatPrice(selectedOrder.total) }}</span>
          </div>
        </div>
        
        <!-- Modal Actions -->
        <div class="flex justify-end space-x-3">
          <UButton
            color="gray"
            variant="soft"
            @click="showOrderDetailModal = false"
          >
            Close
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-document-duplicate"
            @click="duplicateOrder(selectedOrder)"
          >
            Reorder
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../components/Navbar.vue'

// Define page meta
definePageMeta({
  title: 'My Account - Window Treatment Wholesale'
})

// State variables
const isLoading = ref(true)
const isAuthInitialized = ref(false)
const orders = ref([])
const isSaving = ref(false)
const showOrderDetailModal = ref(false)
const selectedOrder = ref(null)

// Create a safe way to access auth
const auth = computed(() => {
  try {
    const nuxtApp = useNuxtApp();
    return nuxtApp.$auth || null;
  } catch (e) {
    console.error("Error accessing auth:", e);
    return null;
  }
});

// Create a computed property for auth state
const isLoggedIn = computed(() => {
  return !!auth.value?.loggedIn;
});

// Create a computed property for user
const user = computed(() => {
  return auth.value?.user || {};
});

// Company information form
const companyInfo = ref({
  name: '',
  type: 'Contractor',
  taxId: ''
})

// Shipping information form
const shippingInfo = ref({
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States'
})

// Business types options
const businessTypes = [
  'Contractor',
  'Interior Designer',
  'Architect',
  'Retailer',
  'Distributor',
  'Other'
]

// Countries list
const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'New Zealand',
  // Add more countries as needed
]

// Tabs configuration
const tabItems = [
  {
    label: 'Orders',
    icon: 'i-heroicons-shopping-bag',
    slot: 'orders',
    value: 'orders'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    slot: 'settings',
    value: 'settings'
  },
  {
    label: 'Support',
    icon: 'i-heroicons-life-buoy',
    slot: 'support',
    value: 'support'
  }
]

// Support FAQs
const supportFaqs = [
  {
    label: 'How do I track my order?',
    content: 'You can track your order by visiting your account page and selecting the specific order. Tracking information will be available once your order has been shipped.',
    open: false
  },
  {
    label: 'What is your return policy?',
    content: 'We offer a 30-day return policy for most items. Custom orders may have different return terms. Please contact our support team for specific return instructions.',
    open: false
  },
  {
    label: 'How do I qualify for wholesale pricing?',
    content: 'Wholesale pricing is available to verified businesses in the home improvement, interior design, and related industries. Please contact our sales team to discuss volume discounts and special pricing.',
    open: false
  },
  {
    label: 'Do you offer installation services?',
    content: 'We provide installation services in select areas. During checkout, you can select installation if it\'s available in your location. We also offer installation guidance for contractors.',
    open: false
  }
]

// Fetch user orders safely
async function fetchOrders() {
  console.log("fetchOrders function called, isLoggedIn:", isLoggedIn.value);
  
  if (!isLoggedIn.value) return;
  
  isLoading.value = true;
  
  try {
    // Get the user's email from the auth object
    const userEmail = user.value?.email;
    
    if (!userEmail) {
      console.warn("No user email available");
      orders.value = [];
      isLoading.value = false;
      return;
    }
    
    console.log(`Fetching orders for ${userEmail}`);
    
    // Pass the email in the request body
    const response = await fetch('/api/ninox/user-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: userEmail }),
      credentials: 'include' // Include cookies
    });
    
    const data = await response.json();
    
    if (data.orders && Array.isArray(data.orders)) {
      orders.value = data.orders;
      console.log(`Loaded ${orders.value.length} orders successfully`);
    } else {
      console.warn('No valid orders data in response');
      orders.value = [];
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Watch for auth state changes
watch(() => isLoggedIn.value, (newValue) => {
  if (newValue) {
    fetchOrders();
  }
}, { immediate: true });

// Initialize component
onMounted(() => {
  // Allow a short delay for auth to initialize
  setTimeout(() => {
    isAuthInitialized.value = true;
    
    if (isLoggedIn.value) {
      fetchOrders();
    } else {
      isLoading.value = false;
    }
  }, 200);
});

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

// Format price
function formatPrice(price) {
  if (price === undefined || price === null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Get status label from numeric value
function getStatusLabel(status) {
  // Map status ID to human-readable text
  const statusMap = {
    1: 'Pending',
    2: 'Processing',
    3: 'Fabrication',
    4: 'Shipped',
    5: 'Delivered',
    6: 'Cancelled'
  };
  
  // If it's already a string, return it
  if (typeof status === 'string') {
    return status;
  }
  
  return statusMap[status] || 'Unknown';
}

// Get status color
function getStatusColor(status) {
  const statusValue = typeof status === 'string' ? status.toLowerCase() : status;
  
  const colorMap = {
    // String values
    'delivered': 'green',
    'shipped': 'blue',
    'processing': 'yellow',
    'pending': 'gray',
    'fabrication': 'purple',
    'cancelled': 'red',
    
    // Numeric values
    1: 'gray',    // Pending
    2: 'yellow',  // Processing
    3: 'purple',  // Fabrication
    4: 'blue',    // Shipped
    5: 'green',   // Delivered
    6: 'red'      // Cancelled
  };
  
  return colorMap[statusValue] || 'gray';
}

// Get formatted order products for accordion
function getOrderProducts(order) {
  if (!order.items || order.items.length === 0) return []
  
  return order.items.map(item => ({
    label: `${item.productType} (${item.quantity})`,
    content: `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Size & Mount</p>
          <p class="font-medium text-gray-900 dark:text-white">${item.width}mm × ${item.height}mm</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Mount: ${item.mountLocation || 'Inside'}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${item.rollDirection || ''} roll</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Materials & Style</p>
          <p class="font-medium text-gray-900 dark:text-white">${item.fabric || 'N/A'}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Style: ${item.style || 'N/A'}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Hardware: ${item.hardwareColor || 'Standard'}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Controls</p>
          <p class="font-medium text-gray-900 dark:text-white">${item.motorized ? 'Motorized' : 'Manual'}</p>
          ${item.control ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ${item.controlPosition || ''} ${item.control}
          </p>` : ''}
          ${item.includesRemote ? `<p class="text-xs text-gray-500 dark:text-gray-400">Includes remote</p>` : ''}
        </div>
      </div>
    `,
    open: false
  }))
}

// Order tracking function
function trackOrder(trackingNumber) {
  // For demo purposes, we'll show a notification
  // In a real app, you'd likely redirect to a tracking page or carrier's website
  alert(`Tracking order with number: ${trackingNumber}. In a production app, this would open the shipping carrier's tracking page.`);
}

// View order details
function viewOrderDetails(order) {
  selectedOrder.value = order;
  showOrderDetailModal.value = true;
}

// Duplicate order
function duplicateOrder(order) {
  // Here we redirect to the order page with the order ID as a parameter
  // This will allow the order form to be pre-filled with the order details
  navigateTo({
    path: '/orders',
    query: { duplicate: order.id }
  });
}

// Save settings function
async function saveSettings() {
  isSaving.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Show success notification (you'd use your notification system here)
  alert('Settings saved successfully!')
  
  isSaving.value = false
}
</script>
