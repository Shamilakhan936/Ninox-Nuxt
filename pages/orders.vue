<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <div class="border-b border-gray-200 p-4 bg-white">
      <h1 class="text-xl font-semibold text-gray-900">Window Treatment Order Entry</h1>
    </div>

    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Client search modal -->
      <UModal v-model="showClientModal" :ui="{ width: 'max-w-4xl' }">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Find Client</h3>
              <UButton
                icon="i-heroicons-x-mark"
                color="gray"
                variant="ghost"
                @click="showClientModal = false"
              />
            </div>
          </template>
          
          <!-- Search input -->
          <div class="mb-4">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <UInputGroup class="flex-grow">
                  <UInput
                    v-model="clientSearchTerm"
                    placeholder="Search by name, email or phone..."
                    @keyup.enter="triggerClientSearch"
                    autofocus
                  />
                  <UButton
                    color="gray"
                    @click="clientSearchTerm = ''"
                    v-if="clientSearchTerm"
                    icon="i-heroicons-x-mark"
                  />
                </UInputGroup>
                <UButton
                  icon="i-heroicons-magnifying-glass"
                  color="primary"
                  :loading="isLoadingClients"
                  @click="triggerClientSearch"
                >
                  Search
                </UButton>
              </div>
              <p class="text-xs text-gray-500">
                Enter at least 3 characters to search. More specific searches will yield better results.
              </p>
            </div>
          </div>
          
          <!-- Loading state -->
          <div v-if="isLoadingClients" class="flex justify-center py-8">
            <ULoader />
          </div>
          
          <!-- Error message -->
          <UAlert
            v-else-if="clientsError"
            color="red"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            class="mb-4"
          >
            {{ clientsError }}
          </UAlert>
          
          <!-- No results message -->
          <UAlert
            v-else-if="showClientResults && clients.length === 0 && clientSearchTerm"
            color="amber"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            class="mb-4"
          >
            No clients found matching "{{ clientSearchTerm }}". Please try a different search term.
          </UAlert>
          
          <!-- Search results -->
          <div v-if="showClientResults && clients.length > 0" class="border rounded-lg overflow-hidden">
            <div class="bg-gray-50 p-2 flex justify-between items-center">
              <span class="text-sm text-gray-600">
                Found {{ pagination.total }} client(s) matching "{{ clientSearchTerm }}"
                <span v-if="pagination.total > pagination.limit">
                  (showing {{ clients.length }} of {{ pagination.total }})
                </span>
              </span>
              
              <!-- Add pagination controls -->
              <div class="flex items-center space-x-2" v-if="pagination.totalPages > 1">
                <UButton 
                  icon="i-heroicons-chevron-left" 
                  size="xs" 
                  color="gray" 
                  variant="ghost"
                  :disabled="pagination.page === 1"
                  @click="changePage(pagination.page - 1)"
                />
                <span class="text-sm text-gray-600">
                  Page {{ pagination.page }} of {{ pagination.totalPages }}
                </span>
                <UButton 
                  icon="i-heroicons-chevron-right" 
                  size="xs" 
                  color="gray" 
                  variant="ghost"
                  :disabled="pagination.page === pagination.totalPages"
                  @click="changePage(pagination.page + 1)"
                />
              </div>
            </div>
            
            <UTable
              :columns="[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'company', label: 'Company' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'actions', label: '' }
              ]"
              :rows="formattedClients"
              hover
              :sort="{ column: 'name', direction: 'asc' }"
            >
              <template #company-data="{ row }">
                {{ row.company || '-' }}
              </template>
              <template #actions-data="{ row }">
                <UButton
                  color="primary"
                  variant="ghost"
                  size="xs"
                  @click="selectClientAndCloseModal(row._original)"
                >
                  Select
                </UButton>
              </template>
            </UTable>
          </div>
          
          <!-- Initial state message - only show if no search has been performed -->
          <div v-if="!showClientResults && !isLoadingClients && !clientsError" class="py-8 text-center text-gray-500">
            Enter a search term and click "Search" to find clients
          </div>
          
          <template #footer>
            <div class="flex justify-between">
              <UButton color="gray" variant="soft" @click="showClientModal = false">
                Cancel
              </UButton>
              <UButton 
                v-if="clients.length > 0" 
                color="primary" 
                @click="showClientModal = false"
              >
                Done
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <UCard class="max-w-4xl mx-auto">
        <form @submit.prevent="submitOrder">
          <!-- Customer Information Section -->
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
                Customer Information
              </h2>
              
              <!-- Client Registration Status -->
              <div class="mb-6 mt-4">
                <UFormGroup label="Client Status">
                  <URadioGroup 
                    v-model="clientRegistrationStatus" 
                    :options="[
                      { label: 'Existing Client', value: 'existing' },
                      { label: 'New Client', value: 'new' }
                    ]"
                    orientation="horizontal"
                    class="mb-2"
                    :ui="{ 
                      wrapper: 'flex flex-wrap gap-4',
                      container: 'bg-white border border-gray-300 rounded-lg p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50',
                      containerActive: 'ring-2 ring-primary-500 bg-primary-50 border-primary-500'
                    }"
                  />
                </UFormGroup>
              </div>
              
              <!-- Client search/selection section - only shown for existing clients -->
              <div v-if="clientRegistrationStatus === 'existing'" class="mb-6">
                <div class="flex items-center space-x-4 mb-4">
                  <UButton
                    icon="i-heroicons-user"
                    color="primary"
                    variant="soft"
                    @click="openClientModal"
                  >
                    Find Client
                  </UButton>
                </div>
                
                <!-- Selected client display -->
                <div v-if="selectedClient" class="mb-6">
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
                          {{ selectedClient.fields['First Name'] }} {{ selectedClient.fields['Last Name'] }}
                        </h3>
                        <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                          <div v-if="selectedClient.fields['Company']" class="mt-1 flex items-center text-sm text-gray-300">
                            <UIcon name="i-heroicons-building-office-2" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {{ selectedClient.fields['Company'] }}
                          </div>
                          <div v-if="selectedClient.fields['Email']" class="mt-1 flex items-center text-sm text-gray-300">
                            <UIcon name="i-heroicons-envelope" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {{ selectedClient.fields['Email'] }}
                          </div>
                          <div v-if="selectedClient.fields['Phone Number']" class="mt-1 flex items-center text-sm text-gray-300">
                            <UIcon name="i-heroicons-phone" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {{ selectedClient.fields['Phone Number'] }}
                          </div>
                        </div>
                      </div>
                      <div class="ml-2 flex-shrink-0">
                        <UButton
                          icon="i-heroicons-x-mark"
                          color="gray"
                          variant="ghost"
                          class="text-gray-400 hover:text-white"
                          @click="clearSelectedClient"
                          title="Clear selected client"
                        />
                      </div>
                    </div>
                    
                    <!-- Optional address information if available -->
                    <div v-if="hasAddressInfo" class="border-t border-gray-800 bg-gray-800 px-4 py-3">
                      <div class="flex items-center text-sm text-gray-300">
                        <UIcon name="i-heroicons-map-pin" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>
                          <template v-if="selectedClient.fields['Address']">{{ selectedClient.fields['Address'] }}</template>
                          <template v-else>
                            <template v-if="selectedClient.fields['Street']">{{ selectedClient.fields['Street'] }}</template>
                            <template v-if="selectedClient.fields['City']">
                              <template v-if="selectedClient.fields['Street']">, </template>
                              {{ selectedClient.fields['City'] }}
                            </template>
                            <template v-if="selectedClient.fields['State']">
                              <template v-if="selectedClient.fields['City'] || selectedClient.fields['Street']">, </template>
                              {{ selectedClient.fields['State'] }}
                            </template>
                            <template v-if="selectedClient.fields['Zip'] || selectedClient.fields['Postal Code']">
                              <template v-if="selectedClient.fields['State'] || selectedClient.fields['City'] || selectedClient.fields['Street']">, </template>
                              {{ selectedClient.fields['Zip'] || selectedClient.fields['Postal Code'] }}
                            </template>
                          </template>
                        </span>
                      </div>
                    </div>
                    
                    <!-- Optional notes section if available -->
                    <div v-if="selectedClient.fields['Notes']" class="border-t border-gray-800 bg-gray-800 px-4 py-3">
                      <h4 class="text-xs uppercase tracking-wide text-gray-400">Notes</h4>
                      <p class="mt-1 text-sm text-gray-300">{{ selectedClient.fields['Notes'] }}</p>
                    </div>
                  </UCard>
                </div>
              </div>
              
              <!-- Client form fields -->
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- Split customer name into first and last name -->
                <UFormGroup 
                  label="First Name"
                >
                  <UInput 
                    v-model="order.firstName" 
                    placeholder="Enter first name" 
                    :disabled="clientRegistrationStatus === 'existing' && selectedClient"
                  />
                </UFormGroup>
                
                <UFormGroup 
                  label="Last Name"
                >
                  <UInput 
                    v-model="order.lastName" 
                    placeholder="Enter last name" 
                    :disabled="clientRegistrationStatus === 'existing' && selectedClient"
                  />
                </UFormGroup>
                
                <UFormGroup 
                  label="Phone Number"
                >
                  <UInput 
                    v-model="order.phoneNumber" 
                    placeholder="Enter phone number" 
                    :disabled="clientRegistrationStatus === 'existing' && selectedClient"
                  />
                </UFormGroup>
                
                <UFormGroup 
                  label="Email"
                >
                  <UInput 
                    v-model="order.email" 
                    type="email" 
                    placeholder="Enter email address" 
                    :disabled="clientRegistrationStatus === 'existing' && selectedClient"
                  />
                </UFormGroup>
                
                <!-- Additional fields for new clients only -->
                <template v-if="clientRegistrationStatus === 'new'">
                  <UFormGroup label="Company (Optional)" class="sm:col-span-2">
                    <UInput v-model="order.company" placeholder="Enter company name if applicable" />
                  </UFormGroup>
                  
                  <UFormGroup label="Address (Optional)" class="sm:col-span-2">
                    <UInput v-model="order.address" placeholder="Enter street address" class="mb-2" />
                    <div class="grid grid-cols-2 gap-2">
                      <UInput v-model="order.city" placeholder="City" />
                      <UInput v-model="order.state" placeholder="State/Province" />
                    </div>
                    <UInput v-model="order.postalCode" placeholder="Postal/ZIP Code" class="mt-2" />
                  </UFormGroup>
                </template>
              </div>
            </div>

            <!-- After the Customer Information section and before the Product Items section -->
            <div class="space-y-6 mb-6">
              <div>
                <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
                  Sales Information
                </h2>
                
                <!-- Salesperson search/selection section -->
                <div class="mt-4">
                  <div class="flex items-center space-x-4 mb-4">
                    <UButton
                      icon="i-heroicons-user-group"
                      color="primary"
                      variant="soft"
                      @click="openSalespersonModal"
                    >
                      Select Salesperson
                    </UButton>
                  </div>
                  
                  <!-- Selected salesperson display -->
                  <div v-if="selectedSalesperson" class="mb-6">
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
                          <div class="h-12 w-12 rounded-full bg-green-900 flex items-center justify-center">
                            <UIcon name="i-heroicons-user-circle" class="h-6 w-6 text-green-400" />
                          </div>
                        </div>
                        <div class="flex-grow">
                          <h3 class="text-lg font-medium text-white">
                            {{ selectedSalesperson.fields['First Name'] }} {{ selectedSalesperson.fields['Last Name'] }}
                          </h3>
                          <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div v-if="selectedSalesperson.fields['Position']" class="mt-1 flex items-center text-sm text-gray-300">
                              <UIcon name="i-heroicons-briefcase" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                              {{ selectedSalesperson.fields['Position'] }}
                            </div>
                            <div v-if="selectedSalesperson.fields['Email']" class="mt-1 flex items-center text-sm text-gray-300">
                              <UIcon name="i-heroicons-envelope" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                              {{ selectedSalesperson.fields['Email'] }}
                            </div>
                            <div v-if="selectedSalesperson.fields['Phone']" class="mt-1 flex items-center text-sm text-gray-300">
                              <UIcon name="i-heroicons-phone" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                              {{ selectedSalesperson.fields['Phone'] }}
                            </div>
                          </div>
                        </div>
                        <div class="ml-2 flex-shrink-0">
                          <UButton
                            icon="i-heroicons-x-mark"
                            color="gray"
                            variant="ghost"
                            class="text-gray-400 hover:text-white"
                            @click="clearSelectedSalesperson"
                            title="Clear selected salesperson"
                          />
                        </div>
                      </div>
                    </UCard>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Items Section -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 border-b pb-2">
                Order Items
              </h2>

              <!-- List of products -->
              <div v-if="order.items.length > 0" class="mt-4 space-y-4">
                <UCard 
                  v-for="(item, index) in order.items" 
                  :key="index"
                  class="relative"
                  :ui="{
                    base: 'relative overflow-hidden',
                    ring: '',
                    divide: '',
                    header: { padding: 'p-0' },
                    body: { padding: 'p-0' },
                    footer: { padding: 'p-0' },
                    background: 'bg-gray-900',
                    rounded: 'rounded-lg',
                    shadow: 'shadow-md'
                  }"
                >
                  <!-- Product header with delete button -->
                  <div class="flex justify-between items-center p-4 border-b border-gray-800">
                    <h3 class="text-md font-semibold text-white">
                      Item #{{ index + 1 }}: {{ item.productType || 'Product' }}
                      <span class="ml-2 text-sm font-normal text-gray-400">
                        {{ item.material || 'No material selected' }}
                      </span>
                    </h3>
                    <UButton
                      color="red"
                      variant="ghost"
                      icon="i-heroicons-trash"
                      size="xs"
                      class="text-gray-400 hover:text-red-400"
                      @click="removeItem(index)"
                      title="Remove item"
                    />
                  </div>
                  
                  <!-- Product details in grid layout -->
                  <div class="grid grid-cols-2 gap-2 text-sm p-4 bg-gray-800">
                    <div class="text-gray-300">
                      <span class="text-gray-400">Dimensions:</span> 
                      {{ item.width || 0 }}mm × {{ item.height || 0 }}mm
                    </div>
                    <div class="text-gray-300">
                      <span class="text-gray-400">Quantity:</span> 
                      {{ item.quantity || 1 }}
                    </div>
                    <div v-if="item.isMotorized" class="text-gray-300">
                      <span class="text-gray-400">Motor Type:</span> 
                      {{ item.motorType }}
                    </div>
                    <div v-else class="text-gray-300">
                      <span class="text-gray-400">Control:</span> 
                      {{ item.controlSide || 'Left' }} side
                      <template v-if="item.chainType">
                        ({{ item.chainType }})
                      </template>
                    </div>
                  </div>
                  
                  <!-- Notes if present -->
                  <div v-if="item.notes" class="p-4 text-sm text-gray-300 border-t border-gray-800 bg-gray-800">
                    <span class="text-gray-400">Notes:</span> {{ item.notes }}
                  </div>
                  
                  <!-- Edit button -->
                  <div class="p-3 flex justify-end bg-gray-900 border-t border-gray-800">
                    <UButton
                      color="blue"
                      variant="solid"
                      size="sm"
                      class="bg-blue-700 hover:bg-blue-600"
                      @click="editItem(index)"
                    >
                      Edit
                    </UButton>
                  </div>
                </UCard>
              </div>
              
              <!-- Empty state -->
              <div v-else class="mt-4 p-8 text-center bg-gray-900 rounded-lg border border-dashed border-gray-700">
                <UIcon name="i-heroicons-shopping-bag" class="mx-auto h-12 w-12 text-gray-600" />
                <h3 class="mt-2 text-sm font-semibold text-white">No items in order</h3>
                <p class="mt-1 text-sm text-gray-400">Get started by adding your first product below.</p>
              </div>
              
              <!-- Add Item button -->
              <div class="mt-4 flex justify-center">
                <UButton
                  color="primary"
                  @click="openNewItemForm"
                  icon="i-heroicons-plus"
                >
                  Add Product
                </UButton>
              </div>
            </div>

            <!-- Product Form (only shown when adding/editing) -->
            <template v-if="showProductForm">
              <div class="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800 shadow-md">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-md font-semibold text-white">
                    {{ editingItemIndex === -1 ? 'Add New Product' : 'Edit Product' }}
                  </h3>
                  <UButton
                    icon="i-heroicons-x-mark"
                    color="gray"
                    variant="ghost"
                    class="text-gray-400 hover:text-white"
                    size="sm"
                    @click="cancelItemEdit"
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
                        v-model="currentItem.productType"
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
                        v-model="currentItem.material"
                        :options="materials[currentItem.productType] || []"
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
                        v-model="currentItem.width"
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
                        v-model="currentItem.height"
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
                        v-model="currentItem.quantity"
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
                    <template v-if="['Roller Blind', 'Roman Shade'].includes(currentItem.productType)">
                      <UFormGroup label="Motorized" class="text-gray-300">
                        <URadioGroup 
                          v-model="currentItem.isMotorized" 
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
                        v-if="currentItem.isMotorized" 
                        label="Motor Type" 
                        class="text-gray-300"
                      >
                        <USelect
                          v-model="currentItem.motorType"
                          :options="motorTypes[currentItem.productType] || []"
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
                    <template v-if="!currentItem.isMotorized">
                      <UFormGroup label="Control Side" class="text-gray-300">
                        <URadioGroup 
                          v-model="currentItem.controlSide" 
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
                        v-if="currentItem.productType === 'Roller Blind'" 
                        class="text-gray-300"
                      >
                        <USelect
                          v-model="currentItem.chainType"
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
                      v-model="currentItem.notes"
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
                    @click="cancelItemEdit"
                    class="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    Cancel
                  </UButton>
                  <UButton
                    color="green"
                    @click="saveCurrentItem"
                    variant="solid"
                  >
                    {{ editingItemIndex === -1 ? 'Add to Order' : 'Save Changes' }}
                  </UButton>
                </div>
              </div>
            </template>

            <!-- Order Notes -->
            <UFormGroup label="Order Notes">
              <UTextarea
                v-model="order.notes"
                placeholder="Enter any special instructions for the entire order"
                :rows="3"
              />
            </UFormGroup>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 flex justify-end space-x-3">
            <UButton
              color="gray"
              variant="soft"
              @click="resetForm"
            >
              Reset
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="order.items.length === 0"
            >
              Submit Order
            </UButton>
          </div>
        </form>
      </UCard>
    </div>

    <!-- Show toast message -->
    <UNotification
      v-if="notification.show"
      :title="notification.title"
      :description="notification.description"
      :color="notification.color"
      @close="notification.show = false"
    />

    <!-- Add the Salesperson search modal -->
    <UModal v-model="showSalespersonModal" :ui="{ width: 'max-w-4xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Select Salesperson</h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="showSalespersonModal = false"
            />
          </div>
        </template>
        
        <!-- Search input -->
        <div class="mb-4">
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <UInputGroup class="flex-grow">
                <UInput
                  v-model="salespersonSearchTerm"
                  placeholder="Search by name..."
                  @keyup.enter="triggerSalespersonSearch"
                  autofocus
                />
                <UButton
                  color="gray"
                  @click="salespersonSearchTerm = ''"
                  v-if="salespersonSearchTerm"
                  icon="i-heroicons-x-mark"
                />
              </UInputGroup>
              <UButton
                icon="i-heroicons-magnifying-glass"
                color="primary"
                :loading="isLoadingSalespeople"
                @click="triggerSalespersonSearch"
              >
                Search
              </UButton>
            </div>
            <p class="text-xs text-gray-500">
              Enter a name to search or leave blank to see all salespeople.
            </p>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="isLoadingSalespeople" class="flex justify-center py-8">
          <ULoader />
        </div>
        
        <!-- Error message -->
        <UAlert
          v-else-if="salespeopleError"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          class="mb-4"
        >
          {{ salespeopleError }}
        </UAlert>
        
        <!-- No results message -->
        <UAlert
          v-else-if="showSalespersonResults && salespeople.length === 0 && salespersonSearchTerm"
          color="amber"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          class="mb-4"
        >
          No salespeople found matching "{{ salespersonSearchTerm }}". Please try a different search term.
        </UAlert>
        
        <!-- Search results -->
        <div v-if="showSalespersonResults && salespeople.length > 0" class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-2 flex justify-between items-center">
            <span class="text-sm text-gray-600">
              Found {{ salespersonPagination.total }} salesperson(s)
              <span v-if="salespersonPagination.total > salespersonPagination.limit">
                (showing {{ salespeople.length }} of {{ salespersonPagination.total }})
              </span>
            </span>
            
            <!-- Add pagination controls -->
            <div class="flex items-center space-x-2" v-if="salespersonPagination.totalPages > 1">
              <UButton 
                icon="i-heroicons-chevron-left" 
                size="xs" 
                color="gray" 
                variant="ghost"
                :disabled="salespersonPagination.page === 1"
                @click="changeSalespersonPage(salespersonPagination.page - 1)"
              />
              <span class="text-sm text-gray-600">
                Page {{ salespersonPagination.page }} of {{ salespersonPagination.totalPages }}
              </span>
              <UButton 
                icon="i-heroicons-chevron-right" 
                size="xs" 
                color="gray" 
                variant="ghost"
                :disabled="salespersonPagination.page === salespersonPagination.totalPages"
                @click="changeSalespersonPage(salespersonPagination.page + 1)"
              />
            </div>
          </div>
          
          <UTable
            :columns="[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'position', label: 'Position' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'actions', label: '' }
            ]"
            :rows="formattedSalespeople"
            hover
            :sort="{ column: 'name', direction: 'asc' }"
          >
            <template #position-data="{ row }">
              {{ row.position || '-' }}
            </template>
            <template #actions-data="{ row }">
              <UButton
                color="primary"
                variant="ghost"
                size="xs"
                @click="selectSalespersonAndCloseModal(row._original)"
              >
                Select
              </UButton>
            </template>
          </UTable>
        </div>
        
        <!-- Initial state message - only show if no search has been performed -->
        <div v-if="!showSalespersonResults && !isLoadingSalespeople && !salespeopleError" class="py-8 text-center text-gray-500">
          Click "Search" to view all salespeople or enter a name to filter
        </div>
        
        <template #footer>
          <div class="flex justify-between">
            <UButton color="gray" variant="soft" @click="showSalespersonModal = false">
              Cancel
            </UButton>
            <UButton 
              v-if="salespeople.length > 0" 
              color="primary" 
              @click="showSalespersonModal = false"
            >
              Done
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Client search modal
const showClientModal = ref(false)
const clients = ref([])
const isLoadingClients = ref(false)
const clientsError = ref('')
const clientSearchTerm = ref('')
const selectedClient = ref(null)
const showClientResults = ref(false)

// Client registration status
const clientRegistrationStatus = ref('existing') // Default to existing client

// Format clients for display in the table
const formattedClients = computed(() => {
  return clients.value.map(client => ({
    _original: client,
    name: `${client.fields['First Name'] || ''} ${client.fields['Last Name'] || ''}`.trim(),
    email: client.fields['Email'] || '',
    phone: client.fields['Phone Number'] || '',
    company: client.fields['Company'] || ''
  }))
})

// Function to open client search modal
function openClientModal() {
  clientSearchTerm.value = ''
  showClientResults.value = false
  clients.value = []
  clientsError.value = ''
  pagination.value.page = 1
  showClientModal.value = true
}

// Function to trigger client search
async function triggerClientSearch() {
  if (!clientSearchTerm.value || clientSearchTerm.value.length < 3) {
    clientsError.value = 'Please enter at least 3 characters to search'
    return
  }
  
  clientsError.value = ''
  isLoadingClients.value = true
  showClientResults.value = true
  
  try {
    const response = await fetch(`/api/ninox/clients?page=${pagination.value.page}&limit=${pagination.value.limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: clientSearchTerm.value
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      clients.value = data.clients;
      pagination.value = data.pagination;
      
      if (data.clients.length === 0) {
        clientsError.value = data.message || 'No clients found matching your search';
      } else if (data.clients.length === 1) {
        // Auto-select if only one client is found
        notification.value = {
          show: true,
          title: 'Client Found',
          description: 'One client was found and has been selected.',
          color: 'blue'
        };
        setTimeout(() => {
          notification.value.show = false;
        }, 3000);
        
        selectClient(data.clients[0]);
      }
    } else {
      clientsError.value = data.error || 'Failed to search clients';
    }
  } catch (error) {
    clientsError.value = error.message || 'An error occurred while searching';
  } finally {
    isLoadingClients.value = false;
  }
}

// Function to select a client and close modal
function selectClientAndCloseModal(client) {
  selectClient(client)
  showClientModal.value = false
}

// Function to select a client
function selectClient(client) {
  selectedClient.value = client
  
  // Debug log to see the exact structure of the client data
  console.log('Client data received:', JSON.stringify(client, null, 2))
  
  // Populate form with client data
  order.value.firstName = client.fields['First Name'] || ''
  order.value.lastName = client.fields['Last Name'] || ''
  order.value.phoneNumber = client.fields['Phone Number'] || ''
  
  // Try all possible variations of the email field name
  const possibleEmailFields = ['Email', 'email', 'E-mail', 'e-mail', 'EMAIL', 'EmailAddress', 'Email Address']
  let emailFound = false
  
  for (const fieldName of possibleEmailFields) {
    if (client.fields[fieldName] !== undefined && client.fields[fieldName] !== null) {
      order.value.email = client.fields[fieldName]
      console.log(`Found email in field: ${fieldName} = ${order.value.email}`)
      emailFound = true
      break
    }
  }
  
  // If no email field was found, check all fields for anything that looks like an email
  if (!emailFound) {
    console.log('Email field not found by name, searching all fields...')
    
    for (const [key, value] of Object.entries(client.fields)) {
      if (typeof value === 'string' && value.includes('@') && value.includes('.')) {
        order.value.email = value
        console.log(`Found email-like value in field: ${key} = ${value}`)
        emailFound = true
        break
      }
    }
  }
  
  if (!emailFound) {
    console.log('No email field found in client data:', client.fields)
    order.value.email = '' // Clear the email if none found
  }
  
  // Store the client ID for later use
  order.value.clientId = client.id
}

// Function to clear selected client
function clearSelectedClient() {
  selectedClient.value = null
  order.value.clientId = null
  
  // Only clear the form fields if we're switching back to a new client
  if (clientRegistrationStatus.value === 'new') {
    order.value.firstName = ''
    order.value.lastName = ''
    order.value.phoneNumber = ''
    order.value.email = ''
  }
}

// Notification system
const notification = ref({
  show: false,
  title: '',
  description: '',
  color: 'green'
})

// Form data - updated for multiple items
const order = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  clientId: null,
  salespersonId: null,
  company: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  notes: '',
  items: []  // Array of items in the order
})

// Item form management
const showProductForm = ref(false)
const editingItemIndex = ref(-1)
const currentItem = ref({
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

// Open form to add a new item
function openNewItemForm() {
  // Reset the current item form
  currentItem.value = {
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
  }
  editingItemIndex.value = -1
  showProductForm.value = true
}

// Open form to edit an existing item
function editItem(index) {
  editingItemIndex.value = index
  currentItem.value = { ...order.value.items[index] }
  showProductForm.value = true
}

// Remove an item from the order
function removeItem(index) {
  order.value.items.splice(index, 1)
}

// Cancel item editing
function cancelItemEdit() {
  showProductForm.value = false
  editingItemIndex.value = -1
}

// Save the current item being edited/added
function saveCurrentItem() {
  // Validate item first
  if (!isItemValid.value) {
    showError(itemValidationErrors.value.join(', '))
    return
  }
  
  if (editingItemIndex.value === -1) {
    // Add new item
    order.value.items.push({ ...currentItem.value })
  } else {
    // Update existing item
    order.value.items[editingItemIndex.value] = { ...currentItem.value }
  }
  
  // Close the form
  showProductForm.value = false
  editingItemIndex.value = -1
}

// Item validation
const itemValidationErrors = ref([])

const isItemValid = computed(() => {
  itemValidationErrors.value = []
  
  if (!currentItem.value.productType) {
    itemValidationErrors.value.push('Product type is required')
  }
  
  if (!currentItem.value.material) {
    itemValidationErrors.value.push('Material is required')
  }
  
  if (!currentItem.value.width) {
    itemValidationErrors.value.push('Width is required')
  }
  
  if (!currentItem.value.height) {
    itemValidationErrors.value.push('Height is required')
  }
  
  // Validate motorization options
  if (['Roller Blind', 'Roman Shade'].includes(currentItem.value.productType)) {
    if (currentItem.value.isMotorized && !currentItem.value.motorType) {
      itemValidationErrors.value.push('Motor type is required for motorized options')
    }
  }
  
  return itemValidationErrors.value.length === 0
})

// Form validation for the whole order
const validationErrors = ref([])

const isValid = computed(() => {
  validationErrors.value = []
  
  // Customer information validation
  if (!order.value.firstName) {
    validationErrors.value.push('First name is required')
  }
  
  if (!order.value.lastName) {
    validationErrors.value.push('Last name is required')
  }
  
  if (!order.value.phoneNumber) {
    validationErrors.value.push('Phone number is required')
  }
  
  if (!order.value.email) {
    validationErrors.value.push('Email is required')
  } else if (!isValidEmail(order.value.email)) {
    validationErrors.value.push('Email format is invalid')
  }
  
  // Salesperson validation
  if (!order.value.salespersonId) {
    validationErrors.value.push('Salesperson is required')
  }
  
  // Order items validation
  if (order.value.items.length === 0) {
    validationErrors.value.push('At least one product is required')
  }
  
  return validationErrors.value.length === 0
})

// Reset the entire form
const resetForm = () => {
  order.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    clientId: null,
    salespersonId: null,
    company: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
    items: []
  }
  selectedClient.value = null
  selectedSalesperson.value = null // Clear salesperson selection
  validationErrors.value = []
  showProductForm.value = false
  editingItemIndex.value = -1
  clientRegistrationStatus.value = 'existing'
}

// Submit order - updated for multiple items
const submitOrder = async () => {
  // Validate form first
  if (!isValid.value) {
    showError(validationErrors.value.join(', '))
    return
  }
  
  isSubmitting.value = true
  try {
    // Create a payload that includes client registration status and combined name
    const payload = {
      ...order.value,
      customerName: `${order.value.firstName} ${order.value.lastName}`.trim(),
      isNewClient: clientRegistrationStatus.value === 'new'
    }
    
    const response = await fetch('/api/ninox/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const result = await response.json()
    
    if (result.success) {
      showSuccess(result.message || 'Order submitted successfully!')
      resetForm()
    } else {
      showError(result.error || 'Failed to submit order')
    }
  } catch (error: any) {
    showError(error.message || 'An unexpected error occurred')
  } finally {
    isSubmitting.value = false
  }
}

// Add these to your script setup section
const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1
})

// Add a function to change page
function changePage(newPage) {
  pagination.value.page = newPage
  triggerClientSearch()
}

// Add this computed property to determine if we have any address info to display
const hasAddressInfo = computed(() => {
  if (!selectedClient.value) return false
  
  return selectedClient.value.fields['Address'] ||
         selectedClient.value.fields['Street'] ||
         selectedClient.value.fields['City'] ||
         selectedClient.value.fields['State'] ||
         selectedClient.value.fields['Zip'] ||
         selectedClient.value.fields['Postal Code']
})

// Add a watch to clear the selected client when switching to "new client"
watch(clientRegistrationStatus, (newValue) => {
  if (newValue === 'new') {
    // Clear selected client when switching to "new client"
    selectedClient.value = null
    order.value.clientId = null
    
    // But don't clear the form fields so the user can keep editing them
  }
})

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

// Add motor options
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

// Notification helpers
const showSuccess = (message: string) => {
  notification.value = {
    show: true,
    title: 'Success',
    description: message,
    color: 'green'
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const showError = (message: string) => {
  notification.value = {
    show: true,
    title: 'Error',
    description: message,
    color: 'red'
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const isSubmitting = ref(false)

// Add these refs for salesperson search modal
const showSalespersonModal = ref(false)
const salespeople = ref([])
const isLoadingSalespeople = ref(false)
const salespeopleError = ref('')
const salespersonSearchTerm = ref('')
const selectedSalesperson = ref(null)
const showSalespersonResults = ref(false)

// Add pagination for salespeople
const salespersonPagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1
})

// Format salespeople for display in the table
const formattedSalespeople = computed(() => {
  return salespeople.value.map(person => ({
    _original: person,
    name: `${person.fields['First Name'] || ''} ${person.fields['Last Name'] || ''}`.trim(),
    email: person.fields['Email'] || '',
    phone: person.fields['Phone'] || '',
    position: person.fields['Position'] || ''
  }))
})

// Update order ref to include salesperson related data
order.value.salespersonId = null

// Function to open salesperson search modal
function openSalespersonModal() {
  salespersonSearchTerm.value = ''
  showSalespersonResults.value = false
  salespeople.value = []
  salespeopleError.value = ''
  salespersonPagination.value.page = 1
  showSalespersonModal.value = true
}

// Function to trigger salesperson search
async function triggerSalespersonSearch() {
  salespeopleError.value = ''
  isLoadingSalespeople.value = true
  showSalespersonResults.value = true
  
  try {
    const response = await fetch(`/api/ninox/salespeople?page=${salespersonPagination.value.page}&limit=${salespersonPagination.value.limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: salespersonSearchTerm.value
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      salespeople.value = data.salespeople;
      salespersonPagination.value = data.pagination;
      
      // Only show an error if no results are found with a search term
      if (data.salespeople.length === 0 && salespersonSearchTerm.value) {
        salespeopleError.value = data.message || 'No salespeople found matching your search';
      }
    } else {
      salespeopleError.value = data.error || 'Failed to search salespeople';
    }
  } catch (error) {
    salespeopleError.value = error.message || 'An error occurred while searching';
  } finally {
    isLoadingSalespeople.value = false;
  }
}

// Function to select a salesperson and close modal
function selectSalespersonAndCloseModal(person) {
  selectSalesperson(person)
  showSalespersonModal.value = false
}

// Function to select a salesperson
function selectSalesperson(person) {
  selectedSalesperson.value = person
  
  // Debug log to see the exact structure of the salesperson data
  console.log('Salesperson data received:', JSON.stringify(person, null, 2))
  
  // Populate form with salesperson data
  order.value.salespersonId = person.id
}

// Function to clear selected salesperson
function clearSelectedSalesperson() {
  selectedSalesperson.value = null
  order.value.salespersonId = null
}
</script>

<style>
/* Add any custom styles here if needed */
</style>
