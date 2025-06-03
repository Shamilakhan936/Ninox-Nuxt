<template>
  <div class="min-h-screen" style="background-color: #f7f7f5;">
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
          <div class="flex items-end gap-3">
            <!-- Order Tabs -->
            <div v-for="(order, index) in orders" :key="index" class="relative">
              <div
                :class="[
                  'transition-all duration-200 border-0 rounded-t-lg cursor-pointer',
                  activeTabIndex === index 
                    ? 'bg-white shadow-sm border-b-0' 
                    : 'bg-gray-100'
                ]"
                style="min-width: 200px; min-height: 55px;"
                @click="activeTabIndex !== index ? (activeTabIndex = index) : null"
              >
                <!-- Tab Header -->
                <button
                  :class="[
                    'w-full px-3 py-1 text-sm font-medium transition-all duration-200 flex items-center justify-center pointer-events-none',
                    activeTabIndex === index 
                      ? 'text-black' 
                      : 'text-gray-600'
                  ]"
                >
                  <span>{{ order.name }}</span>
              <UButton
                    v-if="orders.length > 1"
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                size="xs"
                    class="ml-2 opacity-60 hover:opacity-100 pointer-events-auto"
                    @click.stop="removeOrder(index)"
                    aria-label="Remove order"
              />
                </button>
                
                <!-- Client Selection Area (always present to maintain consistent height) -->
                <div 
                  class="px-3 pb-1 flex justify-center min-h-[24px] items-center"
                  :class="{ 'pointer-events-none': activeTabIndex !== index }"
                >
                  <div v-if="activeTabIndex === index">
                    <div v-if="orders[activeTabIndex].client" class="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs pointer-events-auto" style="background-color: #E5E5E5;">
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
                      class="px-3 py-0.5 rounded-full text-xs font-medium pointer-events-auto"
                      style="background-color: #BFB7B0; color: #FFFFFF; min-width: 120px;"
                  @click="openOrderClientModal"
            >
                      SELECT CLIENT
            </UButton>
          </div>
                  <!-- Empty space for inactive tabs to maintain consistent height -->
                  <div v-else class="h-[18px]"></div>
          </div>
        </div>
          </div>
            
            <!-- Create New Order Tab -->
          <div class="relative">
              <button
                :class="[
                  'px-3 py-1 text-sm font-medium transition-all duration-200 border-0 rounded-t-lg',
                  activeTabIndex === -1 
                    ? 'bg-white text-black shadow-sm border-b-0' 
                    : 'bg-gray-50 text-gray-400'
                ]"
                style="min-height: 55px; min-width: 140px;"
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

          <!-- Tab Content Area (seamlessly connected) -->
          <div v-if="activeTabIndex >= 0" class="bg-white rounded-b-lg shadow-sm border border-gray-100 -ml-12 pl-12 rounded-tl-lg relative -mt-px">
            <!-- Product Form Area -->
            <div class="p-6">
              <!-- Scroll Mode Toggle -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium" style="color: #2D2D2D;">Scroll Mode:</span>
                  <button
                    @click="toggleScrollMode"
                    :class="[
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                      isUnifiedScroll 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    ]"
                  >
                    <UIcon 
                      :name="isUnifiedScroll ? 'i-heroicons-arrows-right-left' : 'i-heroicons-queue-list'" 
                      class="w-3 h-3" 
                    />
                    {{ isUnifiedScroll ? 'Unified' : 'Individual' }}
                  </button>
                </div>
              </div>

              <!-- Individual Scroll Mode (Current Implementation) -->
              <div v-if="!isUnifiedScroll">
                <!-- Product rows with individual horizontal scrolling -->
                <div v-for="(product, pIndex) in orders[activeTabIndex].products" :key="pIndex" class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
                  <!-- Horizontal scrollable form fields container -->
                  <div class="product-form-container">
                    <div class="product-form-scroll">
                      <!-- Delete Button - Fixed at start -->
                      <div class="form-field-fixed">
                        <button
                          class="delete-product-button"
                          @click="removeProduct(pIndex)"
                          aria-label="Delete product"
                        >
                          ×
                        </button>
                      </div>
                      
                      <!-- Number - Fixed at start -->
                      <div class="form-field-fixed">
                        <span class="product-number">{{ pIndex + 1 }}.</span>
                      </div>
                      
                      <!-- Scrollable fields -->
                      <div 
                        class="form-fields-scroll"
                        :data-ref="`scrollContainer_${pIndex}`"
                        @scroll="updateCustomScrollbar($event, pIndex)"
                      >
                        <!-- Product Type -->
                        <div class="form-field">
                          <CrastinoDropdown
                            v-model="product.productType"
                            :options="productTypes"
                            placeholder="Type"
                            min-width="120px"
                          />
                        </div>
                        
                        <!-- Fabric Selection -->
                        <div class="form-field">
                          <button
                            class="select-rounded fabric-button"
                            style="min-width: 120px;"
                            @click="openFabricModal(pIndex)"
                          >
                            <span class="flex-1 text-left">
                              {{ product.fabricDetails ? product.fabricDetails.fields['Fabric Name'] : 'Fabric' }}
                            </span>
                            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 flex-shrink-0" />
                          </button>
                        </div>
                          
                        <!-- Fabric Color Selection -->
                        <div class="form-field">
                          <button
                            class="select-rounded fabric-button"
                            style="min-width: 120px;"
                            :disabled="!product.fabricDetails"
                            @click="openFabricColorModal(pIndex)"
                          >
                            <span class="flex-1 text-left">
                              {{ product.fabricColorDetails ? product.fabricColorDetails.fields['Color Name'] : 'Colour' }}
                            </span>
                            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 flex-shrink-0" />
                          </button>
                        </div>
                        
                        <!-- Dimensions -->
                        <div class="form-field-group">
                          <div class="input-rounded number-input">
                            <UInput
                              v-model="product.height"
                              type="number"
                              placeholder="Height"
                              class="input-rounded w-24"
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
                          <span class="text-xs mx-1" style="color: #6B6B6B;">×</span>
                          <div class="input-rounded number-input">
                            <UInput
                              v-model="product.width"
                              type="number"
                              placeholder="Width"
                              class="input-rounded w-24"
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
                        
                        <!-- Quantity -->
                        <div class="form-field">
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
                        
                        <!-- Conditional Fields for Curtains -->
                        <template v-if="product.productType === 'Curtains'">
                          <!-- Room -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.room"
                              :options="curtainOptions.rooms"
                              placeholder="Room"
                              min-width="120px"
                            />
                          </div>
                          
                          <!-- Curtain Style -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.curtainStyle"
                              :options="curtainOptions.curtainStyles"
                              placeholder="Style"
                              min-width="120px"
                            />
                          </div>
                          
                          <!-- Bottom Style -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.bottomStyle"
                              :options="curtainOptions.bottomStyles"
                              placeholder="Bottom"
                              min-width="100px"
                            />
                          </div>
                          
                          <!-- Heading Height -->
                          <div class="form-field">
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.headingHeight"
                                type="number"
                                placeholder="Head Height"
                                class="input-rounded w-28"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div class="number-btn" @mousedown="incrementValue(product, 'headingHeight', 1)">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="18,15 12,9 6,15"></polyline>
                                  </svg>
                                </div>
                                <div class="number-btn" @mousedown="incrementValue(product, 'headingHeight', -1)">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6,9 12,15 18,9"></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <!-- 2-Sided Checkbox -->
                          <div class="form-field">
                            <div class="flex items-center gap-1">
                              <UCheckbox
                                v-model="product.isTwoSided"
                                size="sm"
                              />
                              <span class="text-xs whitespace-nowrap" style="color: #6B6B6B;">2-Sided</span>
                            </div>
                          </div>
                          
                          <!-- Lining -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.lining"
                              :options="curtainOptions.liningOptions"
                              placeholder="Lining"
                              min-width="120px"
                            />
                          </div>
                        </template>
                        
                        <!-- Fields for Shades (Non-curtain products) -->
                        <template v-else-if="['Roller Shades', 'Roman Shades'].includes(product.productType)">
                          <!-- Motor Checkbox -->
                          <div class="form-field">
                            <div class="flex items-center gap-1">
                              <UCheckbox
                                v-model="product.isMotorized"
                                :disabled="!['Roller Shades', 'Roman Shades'].includes(product.productType)"
                                size="sm"
                              />
                              <span class="text-xs whitespace-nowrap" style="color: #6B6B6B;">Motor</span>
                            </div>
                          </div>
                          
                          <!-- Control/Motor Type -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-if="product.isMotorized"
                              v-model="product.motorType"
                              :options="getMotorTypes(product.productType)"
                              placeholder="Motor Type"
                              min-width="120px"
                            />
                            <CrastinoDropdown
                              v-else
                              v-model="product.controlSide"
                              :options="['Left', 'Right']"
                              placeholder="Side"
                              min-width="80px"
                            />
                          </div>
                          
                          <!-- Mount Location -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.mountLocation"
                              :options="['Inside', 'Outside', 'Ceiling']"
                              placeholder="Rail"
                              min-width="100px"
                            />
                          </div>
                          
                          <!-- Hardware Color -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.hardwareColor"
                              :options="['White', 'Black', 'Silver', 'Bronze', 'Antique Gold']"
                              placeholder="Hooks"
                              min-width="100px"
                            />
                          </div>
                        </template>
                        
                        <!-- Notes - Always present at the end -->
                        <div class="form-field">
                          <UInput
                            v-model="product.notes"
                            placeholder="Notes"
                            class="input-rounded w-24"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Custom Scrollbar Track (only show when needed) -->
                    <div 
                      v-if="scrollbarData[pIndex]?.isNeeded" 
                      class="custom-scrollbar-track"
                      @click="scrollToPosition($event, pIndex)"
                    >
                      <div 
                        class="custom-scrollbar-thumb"
                        :style="getScrollThumbStyle(pIndex)"
                        @mousedown="startScrollbarDrag($event, pIndex)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Unified Scroll Mode -->
              <div v-else>
                <!-- Product rows with unified horizontal scrolling -->
                <div v-for="(product, pIndex) in orders[activeTabIndex].products" :key="pIndex" class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
                  <!-- Horizontal scrollable form fields container -->
                  <div class="product-form-container unified-mode">
                    <div class="product-form-scroll">
                      <!-- Delete Button - Fixed at start -->
                      <div class="form-field-fixed">
                        <button
                          class="delete-product-button"
                          @click="removeProduct(pIndex)"
                          aria-label="Delete product"
                        >
                          ×
                        </button>
                      </div>
                      
                      <!-- Number - Fixed at start -->
                      <div class="form-field-fixed">
                        <span class="product-number">{{ pIndex + 1 }}.</span>
                      </div>
                      
                      <!-- Scrollable fields -->
                      <div 
                        class="form-fields-scroll unified-scroll"
                        :data-ref="`unifiedScrollContainer_${pIndex}`"
                        @scroll="updateUnifiedScrollbar"
                      >
                        <!-- Product Type -->
                        <div class="form-field">
                          <CrastinoDropdown
                            v-model="product.productType"
                            :options="productTypes"
                            placeholder="Type"
                            min-width="120px"
                          />
                        </div>
                        
                        <!-- Fabric Selection -->
                        <div class="form-field">
                          <button
                            class="select-rounded fabric-button"
                            style="min-width: 120px;"
                            @click="openFabricModal(pIndex)"
                          >
                            <span class="flex-1 text-left">
                              {{ product.fabricDetails ? product.fabricDetails.fields['Fabric Name'] : 'Fabric' }}
                            </span>
                            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 flex-shrink-0" />
                          </button>
                        </div>
                          
                        <!-- Fabric Color Selection -->
                        <div class="form-field">
                          <button
                            class="select-rounded fabric-button"
                            style="min-width: 120px;"
                            :disabled="!product.fabricDetails"
                            @click="openFabricColorModal(pIndex)"
                          >
                            <span class="flex-1 text-left">
                              {{ product.fabricColorDetails ? product.fabricColorDetails.fields['Color Name'] : 'Colour' }}
                            </span>
                            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 flex-shrink-0" />
                          </button>
                        </div>
                        
                        <!-- Dimensions -->
                        <div class="form-field-group">
                          <div class="input-rounded number-input">
                            <UInput
                              v-model="product.height"
                              type="number"
                              placeholder="Height"
                              class="input-rounded w-24"
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
                          <span class="text-xs mx-1" style="color: #6B6B6B;">×</span>
                          <div class="input-rounded number-input">
                            <UInput
                              v-model="product.width"
                              type="number"
                              placeholder="Width"
                              class="input-rounded w-24"
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
                        
                        <!-- Quantity -->
                        <div class="form-field">
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
                        
                        <!-- Conditional Fields for Curtains -->
                        <template v-if="product.productType === 'Curtains'">
                          <!-- Room -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.room"
                              :options="curtainOptions.rooms"
                              placeholder="Room"
                              min-width="120px"
                            />
                          </div>
                          
                          <!-- Curtain Style -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.curtainStyle"
                              :options="curtainOptions.curtainStyles"
                              placeholder="Style"
                              min-width="120px"
                            />
                          </div>
                          
                          <!-- Bottom Style -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.bottomStyle"
                              :options="curtainOptions.bottomStyles"
                              placeholder="Bottom"
                              min-width="100px"
                            />
                          </div>
                          
                          <!-- Heading Height -->
                          <div class="form-field">
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.headingHeight"
                                type="number"
                                placeholder="Head Height"
                                class="input-rounded w-28"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div class="number-btn" @mousedown="incrementValue(product, 'headingHeight', 1)">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="18,15 12,9 6,15"></polyline>
                                  </svg>
                                </div>
                                <div class="number-btn" @mousedown="incrementValue(product, 'headingHeight', -1)">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6,9 12,15 18,9"></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <!-- 2-Sided Checkbox -->
                          <div class="form-field">
                            <div class="flex items-center gap-1">
                              <UCheckbox
                                v-model="product.isTwoSided"
                                size="sm"
                              />
                              <span class="text-xs whitespace-nowrap" style="color: #6B6B6B;">2-Sided</span>
                            </div>
                          </div>
                          
                          <!-- Lining -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.lining"
                              :options="curtainOptions.liningOptions"
                              placeholder="Lining"
                              min-width="120px"
                            />
                          </div>
                        </template>
                        
                        <!-- Fields for Shades (Non-curtain products) -->
                        <template v-else-if="['Roller Shades', 'Roman Shades'].includes(product.productType)">
                          <!-- Motor Checkbox -->
                          <div class="form-field">
                            <div class="flex items-center gap-1">
                              <UCheckbox
                                v-model="product.isMotorized"
                                :disabled="!['Roller Shades', 'Roman Shades'].includes(product.productType)"
                                size="sm"
                              />
                              <span class="text-xs whitespace-nowrap" style="color: #6B6B6B;">Motor</span>
                            </div>
                          </div>
                          
                          <!-- Control/Motor Type -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-if="product.isMotorized"
                              v-model="product.motorType"
                              :options="getMotorTypes(product.productType)"
                              placeholder="Motor Type"
                              min-width="120px"
                            />
                            <CrastinoDropdown
                              v-else
                              v-model="product.controlSide"
                              :options="['Left', 'Right']"
                              placeholder="Side"
                              min-width="80px"
                            />
                          </div>
                          
                          <!-- Mount Location -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.mountLocation"
                              :options="['Inside', 'Outside', 'Ceiling']"
                              placeholder="Rail"
                              min-width="100px"
                            />
                          </div>
                          
                          <!-- Hardware Color -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.hardwareColor"
                              :options="['White', 'Black', 'Silver', 'Bronze', 'Antique Gold']"
                              placeholder="Hooks"
                              min-width="100px"
                            />
                          </div>
                        </template>
                        
                        <!-- Notes - Always present at the end -->
                        <div class="form-field">
                          <UInput
                            v-model="product.notes"
                            placeholder="Notes"
                            class="input-rounded w-24"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Custom Scrollbar Track - Show below the last product -->
                <div 
                  v-if="unifiedScrollbarData.isNeeded && orders[activeTabIndex].products.length > 0" 
                  class="custom-scrollbar-track unified-scrollbar"
                  @click="scrollUnifiedToPosition"
                >
                  <div 
                    class="custom-scrollbar-thumb"
                    :style="getUnifiedScrollThumbStyle()"
                    @mousedown="startUnifiedScrollbarDrag"
                  ></div>
                </div>
              </div>

              <!-- Add New Product Button -->
              <div class="flex justify-start mt-6">
                <button
                  class="add-product-button"
                  @click="addNewProduct"
                >
                  <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                  Add New Product
                </button>
              </div>
            </div>
          </div>
          
          <!-- "Add New Tab" View -->
          <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 -ml-12 pl-20">
            <div class="max-w-lg mx-auto text-center">
              <UIcon name="i-heroicons-plus-circle" class="w-16 h-16 mx-auto mb-4" style="color: #B8A082;" />
              <h3 class="text-xl font-medium mb-2" style="color: #2D2D2D;">Create a New Order</h3>
          
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
          
          <!-- Special Instructions and Submit Order - Only show for active orders with added separation -->
          <div v-if="activeTabIndex >= 0" class="mt-12 -ml-12 pl-12">
            <!-- Separator line for visual separation -->
            <div class="border-t border-gray-200 mb-8"></div>
            
            <div class="flex items-center gap-4">
              <!-- Special Instructions Field - No background -->
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
                  class="px-8 py-3 rounded-full font-medium"
                  style="background-color: #8A7C59; color: #F7F7F5;"
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
import CrastinoDropdown from '../components/CrastinoDropdown.vue'

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

// Helper function to create a default product
function createDefaultProduct() {
  return {
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
    notes: '',
    // Curtain-specific fields
    room: '',
    curtainStyle: '',
    bottomStyle: '',
    headingHeight: null,
    isTwoSided: false,
    lining: ''
  }
}

// State - Updated to include one default product
const isSubmitting = ref(false)
const activeTabIndex = ref(0)
const orders = ref([
  {
    name: 'Order #1',
    products: [createDefaultProduct()],
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

// Add curtain-specific options
const curtainOptions = {
  rooms: [
    'Living Room',
    'Bedroom', 
    'Dining Room',
    'Kitchen',
    'Office',
    'Bathroom',
    'Guest Room',
    'Other'
  ],
  curtainStyles: [
    'Tab Top',
    'Eyelet',
    'Pencil Pleat',
    'Pinch Pleat',
    'Wave',
    'Rod Pocket',
    'Grommet'
  ],
  bottomStyles: [
    'Straight',
    'Scalloped',
    'Pointed',
    'Rounded'
  ],
  liningOptions: [
    'No Lining',
    'Standard Lining',
    'Blackout Lining',
    'Thermal Lining',
    'Interlining'
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

// Function to create a new order - Updated to include one default product
function createNewOrder() {
  if (!newOrderName.value) return
  
  orders.value.push({
    name: newOrderName.value,
    products: [createDefaultProduct()],
    specialInstructions: '',
    client: null
  })
  
  activeTabIndex.value = orders.value.length - 1
  newOrderName.value = ''
  
  showNotification({
    title: 'New Order Created',
    description: `Order "${orders.value[activeTabIndex.value].name}" has been created with one product row ready.`,
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
    notes: '',
    // Curtain-specific fields
    room: '',
    curtainStyle: '',
    bottomStyle: '',
    headingHeight: null,
    isTwoSided: false,
    lining: ''
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

// Reactive data for scrollbar
const scrollbarData = ref({})

// Update custom scrollbar position and visibility
function updateCustomScrollbar(event, productIndex) {
  const container = event.target
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  
  // Check if scrolling is needed
  const isNeeded = scrollWidth > clientWidth
  
  if (!isNeeded) {
    scrollbarData.value[productIndex] = { isNeeded: false }
    return
  }
  
  const trackWidth = clientWidth - 12 // Account for padding in track
  const thumbWidth = Math.max(20, (clientWidth / scrollWidth) * trackWidth)
  const maxThumbPosition = trackWidth - thumbWidth
  const thumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * maxThumbPosition
  
  scrollbarData.value[productIndex] = {
    isNeeded: true,
    width: thumbWidth,
    left: thumbPosition + 6 // 6px offset from track edge
  }
}

// Get scroll thumb style
function getScrollThumbStyle(productIndex) {
  const data = scrollbarData.value[productIndex]
  if (!data || !data.isNeeded) return { display: 'none' }
  
  return {
    width: `${data.width}px`,
    left: `${data.left}px`
  }
}

// Click on track to scroll to position
function scrollToPosition(event, productIndex) {
  const container = getCurrentScrollContainer(productIndex)
  if (!container) return
  
  const track = event.currentTarget
  const trackRect = track.getBoundingClientRect()
  const clickX = event.clientX - trackRect.left
  
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  const trackWidth = trackRect.width - 12
  
  const scrollRatio = (clickX - 6) / trackWidth // 6px offset
  const newScrollLeft = scrollRatio * (scrollWidth - clientWidth)
  
  container.scrollLeft = Math.max(0, Math.min(scrollWidth - clientWidth, newScrollLeft))
}

// Handle scrollbar drag
let isDragging = false
let dragStartX = 0
let dragStartScrollLeft = 0
let currentProductIndex = null

function startScrollbarDrag(event, productIndex) {
  isDragging = true
  currentProductIndex = productIndex
  dragStartX = event.clientX
  
  const container = getCurrentScrollContainer(productIndex)
  if (container) {
    dragStartScrollLeft = container.scrollLeft
  }
  
  document.addEventListener('mousemove', handleScrollbarDrag)
  document.addEventListener('mouseup', stopScrollbarDrag)
  event.preventDefault()
  event.stopPropagation() // Prevent track click
}

function handleScrollbarDrag(event) {
  if (!isDragging || currentProductIndex === null) return
  
  const container = getCurrentScrollContainer(currentProductIndex)
  if (!container) return
  
  const deltaX = event.clientX - dragStartX
  const containerWidth = container.clientWidth
  const scrollWidth = container.scrollWidth
  const trackWidth = containerWidth - 12
  
  const scrollRatio = deltaX / trackWidth
  const newScrollLeft = dragStartScrollLeft + (scrollRatio * (scrollWidth - containerWidth))
  
  container.scrollLeft = Math.max(0, Math.min(scrollWidth - containerWidth, newScrollLeft))
}

function stopScrollbarDrag() {
  isDragging = false
  currentProductIndex = null
  document.removeEventListener('mousemove', handleScrollbarDrag)
  document.removeEventListener('mouseup', stopScrollbarDrag)
}

function getCurrentScrollContainer(productIndex) {
  return document.querySelector(`[data-ref="scrollContainer_${productIndex}"]`)
}

// Initialize scrollbars on mount and when content changes
onMounted(() => {
  nextTick(() => {
    initializeScrollbars()
  })
})

// Watch for changes that might affect scrollbar
watch(orders, () => {
  nextTick(() => {
    initializeScrollbars()
  })
}, { deep: true })

function initializeScrollbars() {
  if (activeTabIndex.value >= 0 && orders.value[activeTabIndex.value]) {
    orders.value[activeTabIndex.value].products.forEach((_, index) => {
      const container = getCurrentScrollContainer(index)
      if (container) {
        updateCustomScrollbar({ target: container }, index)
      }
    })
  }
}

// Add resize observer to handle window resizing
onMounted(() => {
  const resizeObserver = new ResizeObserver(() => {
    initializeScrollbars()
  })
  
  // Observe the main container
  const mainContainer = document.querySelector('.product-form-container')
  if (mainContainer) {
    resizeObserver.observe(mainContainer)
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})

// Add scroll mode state
const isUnifiedScroll = ref(false)

// Reactive data for scrollbar (updated to handle unified mode)  
const unifiedScrollbarData = ref({ isNeeded: false, width: 0, left: 0 })

// Unified scrollbar drag variables
let isUnifiedDragging = false
let unifiedDragStartX = 0
let unifiedDragStartScrollLeft = 0

// Toggle function for scroll mode
function toggleScrollMode() {
  isUnifiedScroll.value = !isUnifiedScroll.value
  
  // Reset scrollbar data when switching modes
  if (isUnifiedScroll.value) {
    scrollbarData.value = {}
    nextTick(() => {
      initializeUnifiedScrollbar()
    })
  } else {
    unifiedScrollbarData.value = { isNeeded: false }
    nextTick(() => {
      initializeScrollbars()
    })
  }
  
  showNotification({
    title: 'Scroll Mode Changed',
    description: `Switched to ${isUnifiedScroll.value ? 'unified' : 'individual'} scrolling mode.`,
    color: 'blue'
  })
}

// Update custom scrollbar for unified mode
function updateUnifiedScrollbar(event) {
  const container = event.target
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  
  // Sync all other unified scroll containers immediately
  syncUnifiedScrollContainers(scrollLeft, container)
  
  // Check if scrolling is needed
  const isNeeded = scrollWidth > clientWidth
  
  if (!isNeeded) {
    unifiedScrollbarData.value = { isNeeded: false }
    return
  }
  
  const trackWidth = clientWidth - 12 // Account for padding in track
  const thumbWidth = Math.max(20, (clientWidth / scrollWidth) * trackWidth)
  const maxThumbPosition = trackWidth - thumbWidth
  const thumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * maxThumbPosition
  
  unifiedScrollbarData.value = {
    isNeeded: true,
    width: thumbWidth,
    left: thumbPosition + 6 // 6px offset from track edge
  }
}

// Improved sync function with better event handling
function syncUnifiedScrollContainers(scrollLeft, sourceContainer) {
  if (activeTabIndex.value >= 0 && orders.value[activeTabIndex.value]) {
    // Temporarily disable all scroll events to prevent infinite loops
    const containers = []
    
    orders.value[activeTabIndex.value].products.forEach((_, index) => {
      const container = document.querySelector(`[data-ref="unifiedScrollContainer_${index}"]`)
      if (container && container !== sourceContainer) {
        containers.push(container)
        container.removeEventListener('scroll', updateUnifiedScrollbar)
      }
    })
    
    // Set scroll position for all containers
    containers.forEach(container => {
      container.scrollLeft = scrollLeft
    })
    
    // Re-enable scroll events after a short delay
    setTimeout(() => {
      containers.forEach(container => {
        container.addEventListener('scroll', updateUnifiedScrollbar)
      })
    }, 10)
  }
}

// Initialize unified scrollbar - improved
function initializeUnifiedScrollbar() {
  nextTick(() => {
    // Find the first available container
    let firstContainer = null
    if (activeTabIndex.value >= 0 && orders.value[activeTabIndex.value]) {
      for (let i = 0; i < orders.value[activeTabIndex.value].products.length; i++) {
        const container = document.querySelector(`[data-ref="unifiedScrollContainer_${i}"]`)
        if (container) {
          firstContainer = container
          break
        }
      }
    }
    
    if (firstContainer) {
      // Reset all containers to scroll position 0
      setAllUnifiedScrollPositions(0)
      
      // Update scrollbar based on first container
      updateUnifiedScrollbar({ target: firstContainer })
    }
  })
}

// Improved helper function to set scroll position for all unified containers
function setAllUnifiedScrollPositions(scrollLeft) {
  if (activeTabIndex.value >= 0 && orders.value[activeTabIndex.value]) {
    const containers = []
    
    // Collect all containers and remove event listeners
    orders.value[activeTabIndex.value].products.forEach((_, index) => {
      const container = document.querySelector(`[data-ref="unifiedScrollContainer_${index}"]`)
      if (container) {
        containers.push(container)
        container.removeEventListener('scroll', updateUnifiedScrollbar)
      }
    })
    
    // Set scroll position for all containers
    containers.forEach(container => {
      container.scrollLeft = scrollLeft
    })
    
    // Re-enable scroll events after all containers are updated
    setTimeout(() => {
      containers.forEach(container => {
        container.addEventListener('scroll', updateUnifiedScrollbar)
      })
      
      // Update scrollbar position if we have containers
      if (containers.length > 0) {
        updateUnifiedScrollbar({ target: containers[0] })
      }
    }, 10)
  }
}

// Click on unified track to scroll to position
function scrollUnifiedToPosition(event) {
  const firstContainer = document.querySelector('[data-ref="unifiedScrollContainer_0"]')
  if (!firstContainer) return
  
  const track = event.currentTarget
  const trackRect = track.getBoundingClientRect()
  const clickX = event.clientX - trackRect.left
  
  const scrollWidth = firstContainer.scrollWidth
  const clientWidth = firstContainer.clientWidth
  const trackWidth = trackRect.width - 12
  
  const scrollRatio = (clickX - 6) / trackWidth // 6px offset
  const newScrollLeft = scrollRatio * (scrollWidth - clientWidth)
  const finalScrollLeft = Math.max(0, Math.min(scrollWidth - clientWidth, newScrollLeft))
  
  // Set scroll position for all containers
  setAllUnifiedScrollPositions(finalScrollLeft)
}

// Start unified scrollbar drag
function startUnifiedScrollbarDrag(event) {
  isUnifiedDragging = true
  unifiedDragStartX = event.clientX
  
  const firstContainer = document.querySelector('[data-ref="unifiedScrollContainer_0"]')
  if (firstContainer) {
    unifiedDragStartScrollLeft = firstContainer.scrollLeft
  }
  
  document.addEventListener('mousemove', handleUnifiedScrollbarDrag)
  document.addEventListener('mouseup', stopUnifiedScrollbarDrag)
  event.preventDefault()
  event.stopPropagation()
}

// Handle unified scrollbar drag
function handleUnifiedScrollbarDrag(event) {
  if (!isUnifiedDragging) return
  
  const firstContainer = document.querySelector('[data-ref="unifiedScrollContainer_0"]')
  if (!firstContainer) return
  
  const deltaX = event.clientX - unifiedDragStartX
  const containerWidth = firstContainer.clientWidth
  const scrollWidth = firstContainer.scrollWidth
  const trackWidth = containerWidth - 12
  
  const scrollRatio = deltaX / trackWidth
  const newScrollLeft = unifiedDragStartScrollLeft + (scrollRatio * (scrollWidth - containerWidth))
  const finalScrollLeft = Math.max(0, Math.min(scrollWidth - containerWidth, newScrollLeft))
  
  // Set scroll position for all containers
  setAllUnifiedScrollPositions(finalScrollLeft)
}

// Stop unified scrollbar drag
function stopUnifiedScrollbarDrag() {
  isUnifiedDragging = false
  document.removeEventListener('mousemove', handleUnifiedScrollbarDrag)
  document.removeEventListener('mouseup', stopUnifiedScrollbarDrag)
}

// Get unified scroll thumb style
function getUnifiedScrollThumbStyle() {
  const data = unifiedScrollbarData.value
  if (!data || !data.isNeeded) return { display: 'none' }
  
  return {
    width: `${data.width}px`,
    left: `${data.left}px`
  }
}

// Update the watch function to reinitialize unified scrolling when switching modes
watch(isUnifiedScroll, (newValue) => {
  if (newValue) {
    nextTick(() => {
      initializeUnifiedScrollbar()
    })
  }
})
</script>

<style>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Apply Albert Sans to entire component */
.min-h-screen {
  font-family: 'Albert Sans', sans-serif;
}

/* Product numbering with exact Figma specifications */
.product-number {
  font-family: 'Albert Sans', sans-serif;
  font-weight: 300;
  font-size: 11.74px;
  line-height: 19.08px;
  letter-spacing: 0px;
  color: #000;
  margin-bottom: 8.81px;
  font-display: swap;
}

/* More comprehensive targeting with higher specificity - Default state */
.input-rounded input,
.input-rounded .ui-input input,
.input-rounded div input,
.select-rounded select,
.select-rounded .ui-select select,
.select-rounded div select,
.select-rounded button,
.select-rounded .ui-select button,
.select-rounded div button,
[data-headlessui-state] input,
[data-headlessui-state] select,
[data-headlessui-state] button,
.ui-input input,
.ui-select select,
.ui-select button,
div[class*="select"] button,
div[class*="input"] input {
  border: 0.5px solid #E5E5E5 !important; /* Lighter default border */
  background-color: #FFFFFF !important;
  color: #000 !important;
  border-radius: 48.44px !important;
  font-size: 11.74px !important;
  line-height: 19.08px !important;
  font-weight: 300 !important;
  padding: 8.8px 16.1px !important;
  height: 35px !important;
  box-sizing: border-box !important;
  font-family: 'Albert Sans', sans-serif !important;
  transition: border 0.2s ease !important;
}

/* Focus state with even higher specificity */
.input-rounded input:focus,
.input-rounded .ui-input input:focus,
.input-rounded div input:focus,
.select-rounded select:focus,
.select-rounded .ui-select select:focus,
.select-rounded div select:focus,
.select-rounded button:focus,
.select-rounded .ui-select button:focus,
.select-rounded div button:focus,
.select-rounded button:focus-visible,
.select-rounded .ui-select button:focus-visible,
.select-rounded div button:focus-visible,
[data-headlessui-state] input:focus,
[data-headlessui-state] select:focus,
[data-headlessui-state] button:focus,
[data-headlessui-state="open"] button,
[data-headlessui-state*="focus"] button,
.ui-input input:focus,
.ui-select select:focus,
.ui-select button:focus,
.ui-select button:focus-visible,
div[class*="select"] button:focus,
div[class*="select"] button:focus-visible,
div[class*="input"] input:focus,
/* Target any active/open dropdown states */
.ui-select[data-headlessui-state="open"] button,
.ui-select[data-headlessui-state*="open"] button,
button[data-headlessui-state="open"],
button[data-headlessui-state*="open"] {
  border: 1.5px solid #2D2D2D !important; /* Thicker BLACK border on focus */
  box-shadow: none !important;
  outline: none !important;
}

/* Ensure focus-within also works for container elements */
.input-rounded:focus-within,
.select-rounded:focus-within {
  /* This will apply to the container when any child has focus */
}

.input-rounded:focus-within input,
.input-rounded:focus-within .ui-input input,
.input-rounded:focus-within div input,
.select-rounded:focus-within select,
.select-rounded:focus-within .ui-select select,
.select-rounded:focus-within div select,
.select-rounded:focus-within button,
.select-rounded:focus-within .ui-select button,
.select-rounded:focus-within div button {
  border: 1.5px solid #2D2D2D !important;
}

/* Custom Dropdown Menu Styling */
[role="listbox"],
[role="menu"],
.ui-select-options,
.ui-select [role="listbox"],
div[data-headlessui-state] [role="listbox"],
div[data-headlessui-state] ul,
.select-rounded [role="listbox"],
.select-rounded ul {
  background-color: #FFFFFF !important;
  border: 0.5px solid #E5E5E5 !important;
  border-radius: 16px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  padding: 8px !important;
  margin-top: 4px !important;
  font-family: 'Albert Sans', sans-serif !important;
  max-height: 200px !important;
  overflow-y: auto !important;
  z-index: 50 !important;
}

/* Individual dropdown option styling */
[role="option"],
.ui-select-option,
.ui-select [role="option"],
div[data-headlessui-state] [role="option"],
div[data-headlessui-state] li,
.select-rounded [role="option"],
.select-rounded li {
  padding: 8px 12px !important;
  font-size: 11.74px !important;
  line-height: 19.08px !important;
  font-weight: 300 !important;
  font-family: 'Albert Sans', sans-serif !important;
  color: #2D2D2D !important;
  border-radius: 8px !important;
  margin: 2px 0 !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  background-color: transparent !important;
  border: none !important;
}

/* Dropdown option hover state */
[role="option"]:hover,
.ui-select-option:hover,
.ui-select [role="option"]:hover,
div[data-headlessui-state] [role="option"]:hover,
div[data-headlessui-state] li:hover,
.select-rounded [role="option"]:hover,
.select-rounded li:hover,
[data-headlessui-state="active"] {
  background-color: #F5F5F5 !important;
  color: #2D2D2D !important;
}

/* Selected/active dropdown option */
[role="option"][aria-selected="true"],
.ui-select-option[aria-selected="true"],
.ui-select [role="option"][aria-selected="true"],
div[data-headlessui-state] [role="option"][aria-selected="true"],
div[data-headlessui-state] li[aria-selected="true"],
.select-rounded [role="option"][aria-selected="true"],
.select-rounded li[aria-selected="true"],
[data-headlessui-state*="selected"] {
  background-color: #8A7C59 !important;
  color: #FFFFFF !important;
  font-weight: 400 !important;
}

/* Selected option hover state */
[role="option"][aria-selected="true"]:hover,
.ui-select-option[aria-selected="true"]:hover,
.ui-select [role="option"][aria-selected="true"]:hover,
div[data-headlessui-state] [role="option"][aria-selected="true"]:hover,
div[data-headlessui-state] li[aria-selected="true"]:hover,
.select-rounded [role="option"][aria-selected="true"]:hover,
.select-rounded li[aria-selected="true"]:hover,
[data-headlessui-state*="selected"]:hover {
  background-color: #6B5B42 !important;
  color: #FFFFFF !important;
}

/* Custom scrollbar for dropdown if needed */
[role="listbox"]::-webkit-scrollbar,
.ui-select-options::-webkit-scrollbar,
.select-rounded [role="listbox"]::-webkit-scrollbar {
  width: 4px !important;
}

[role="listbox"]::-webkit-scrollbar-track,
.ui-select-options::-webkit-scrollbar-track,
.select-rounded [role="listbox"]::-webkit-scrollbar-track {
  background: transparent !important;
}

[role="listbox"]::-webkit-scrollbar-thumb,
.ui-select-options::-webkit-scrollbar-thumb,
.select-rounded [role="listbox"]::-webkit-scrollbar-thumb {
  background-color: #E5E5E5 !important;
  border-radius: 2px !important;
}

[role="listbox"]::-webkit-scrollbar-thumb:hover,
.ui-select-options::-webkit-scrollbar-thumb:hover,
.select-rounded [role="listbox"]::-webkit-scrollbar-thumb:hover {
  background-color: #DBDAD8 !important;
}

/* Dropdown arrow styling */
.select-rounded svg,
.ui-select svg,
.select-rounded .ui-select svg {
  color: #6B6B6B !important;
  width: 14px !important;
  height: 14px !important;
  transition: transform 0.2s ease !important;
}

.select-rounded[data-headlessui-state="open"] svg,
.ui-select[data-headlessui-state="open"] svg,
.select-rounded .ui-select[data-headlessui-state="open"] svg {
  transform: rotate(180deg) !important;
}

/* Special instructions field styling - Updated border behavior */
.special-instructions,
.special-instructions input,
.special-instructions .ui-input input {
  border: 0.5px solid #E5E5E5 !important; /* Lighter default border */
  border-radius: 48.44px !important;
  background-color: #fff !important;
  height: 35px !important;
  font-size: 11.74px !important;
  line-height: 19.08px !important;
  font-weight: 300 !important;
  font-family: 'Albert Sans', sans-serif !important;
  padding: 8.8px 16.1px !important;
  transition: border 0.2s ease !important;
}

.special-instructions:focus,
.special-instructions input:focus,
.special-instructions .ui-input input:focus,
.special-instructions:focus-within input {
  border: 1.5px solid #2D2D2D !important; /* Thicker BLACK border on focus */
  box-shadow: none !important;
  outline: none !important;
}

/* Textarea styling - Updated border behavior */
.textarea-rounded textarea {
  border: 0.5px solid #E5E5E5 !important; /* Lighter default border */
  background-color: #FFFFFF !important;
  color: #000 !important;
  border-radius: 48.44px !important;
  font-size: 11.74px !important;
  line-height: 19.08px !important;
  font-weight: 300 !important;
  font-family: 'Albert Sans', sans-serif !important;
  transition: border 0.2s ease !important;
}

.textarea-rounded textarea:focus {
  border: 1.5px solid #2D2D2D !important; /* Thicker BLACK border on focus */
  box-shadow: none !important;
  outline: none !important;
}

/* Override any conflicting Nuxt UI styles with highest specificity */
.min-h-screen .input-rounded input:focus,
.min-h-screen .select-rounded button:focus,
.min-h-screen .select-rounded select:focus {
  border: 1.5px solid #2D2D2D !important;
  box-shadow: none !important;
  outline: none !important;
}

/* Tab styling to match Figma */
.tab-container {
  border-radius: 6.49px 6.49px 0px 0px !important;
  height: 61px !important;
  font-size: 13px !important;
  font-weight: 300 !important;
}

/* Active tab */
.tab-active {
  background-color: #fff !important;
  color: #000 !important;
}

/* Inactive tab */
.tab-inactive {
  background-color: #EAEAEA !important;
  color: #BFB7B0 !important;
}

/* Custom styling for number input spinners - updated colors */
.input-rounded input[type="number"] {
  -moz-appearance: textfield;
  padding-right: 40px !important;
}

.input-rounded input[type="number"]::-webkit-outer-spin-button,
.input-rounded input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

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
  background: rgba(138, 124, 89, 0.1);
  transform: scale(1.1);
}

.input-rounded.number-input .number-btn:active {
  background: rgba(138, 124, 89, 0.2);
  transform: scale(0.95);
}

.input-rounded.number-input .number-btn svg {
  width: 10px;
  height: 10px;
  color: #DBDAD8;
  stroke-width: 2.5;
}

.input-rounded.number-input .number-btn:hover svg {
  color: #8A7C59;
}

/* Enhanced rounded buttons to match Figma */
.rounded-full {
  border-radius: 74px !important;
}

/* Override button styling */
button.rounded-full {
  border: none !important;
  box-shadow: none !important;
}

/* Minimal Add New Product button styling - updated to match Figma */
.add-product-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 20px;
  color: #BFB7B0;
  font-size: 13px;
  font-weight: 300;
  font-family: 'Albert Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.add-product-button:hover {
  color: #8A7C59;
  background: rgba(138, 124, 89, 0.08);
}

.add-product-button:active {
  background: rgba(138, 124, 89, 0.15);
  transform: scale(0.98);
}

.add-product-button:focus {
  outline: none;
  box-shadow: none;
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
  color: #DBDAD8;
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

/* Checkbox styling to match Figma */
input[type="checkbox"] {
  border: 1px solid #8A7C59 !important;
  border-radius: 2px !important;
  background-color: #fff !important;
  width: 16px !important;
  height: 16px !important;
}

/* Typography updates to match Figma exactly */
.text-xs {
  font-size: 11.74px !important;
  line-height: 19.08px !important;
  font-weight: 300 !important;
  font-family: 'Albert Sans', sans-serif !important;
}

.text-sm {
  font-size: 13px !important;
  font-weight: 300 !important;
  font-family: 'Albert Sans', sans-serif !important;
}

/* Motor checkbox label styling */
.motor-label {
  font-size: 16px !important;
  line-height: 24px !important;
  color: #3D3935 !important;
  font-family: 'Albert Sans', sans-serif !important;
}

/* Reset text selection to default browser blue */
::selection {
  background-color: #0ea5e9 !important; /* Default browser blue */
  color: white !important;
}

::-moz-selection {
  background-color: #0ea5e9 !important; /* Default browser blue for Firefox */
  color: white !important;
}

/* Fabric button styling to match CrastinoDropdown exactly */
.fabric-button {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  border: 0.5px solid #E5E5E5 !important;
  background-color: #FFFFFF !important;
  color: #000 !important;
  border-radius: 48.44px !important;
  font-size: 11.74px !important;
  line-height: 19.08px !important;
  font-weight: 300 !important;
  padding: 8.8px 16.1px !important;
  height: 35px !important;
  box-sizing: border-box !important;
  font-family: 'Albert Sans', sans-serif !important;
  transition: border 0.2s ease !important;
  cursor: pointer !important;
  outline: none !important;
}

.fabric-button:hover {
  border: 1px solid #BFB7B0 !important;
}

.fabric-button:focus,
.fabric-button:focus-visible {
  border: 1.5px solid #2D2D2D !important;
  box-shadow: none !important;
}

.fabric-button:disabled {
  background-color: #F9F9F9 !important;
  color: #DBDAD8 !important;
  cursor: not-allowed !important;
  border: 0.5px solid #E5E5E5 !important;
}

.fabric-button:disabled:hover {
  border: 0.5px solid #E5E5E5 !important;
}

.fabric-button span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fabric-button svg {
  color: #6B6B6B !important;
  transition: transform 0.2s ease !important;
}

.fabric-button:disabled svg {
  color: #DBDAD8 !important;
}

/* Horizontal scrolling form container */
.product-form-container {
  position: relative;
  width: 100%;
  padding-bottom: 0; /* Remove default padding */
}

.product-form-scroll {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.form-field-fixed {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.form-fields-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
  padding-bottom: 2px;
  scroll-behavior: smooth;
  
  /* Hide default scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.form-fields-scroll::-webkit-scrollbar {
  display: none;
}

.form-field {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.form-field-group {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Custom scrollbar track - Only shows when needed */
.custom-scrollbar-track {
  position: relative;
  width: 100%;
  height: 9px;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  background-color: transparent;
  margin-top: 8px;
  cursor: pointer;
}

/* Custom scrollbar thumb - Figma design with perfect centering */
.custom-scrollbar-thumb {
  position: absolute;
  top: 1.5px; /* Adjusted for perfect vertical centering */
  border-radius: 10px;
  background-color: #d9d9d9;
  height: 5px;
  transition: background-color 0.2s ease;
  cursor: grab;
  min-width: 20px;
}

.custom-scrollbar-thumb:hover {
  background-color: #bfb7b0;
}

.custom-scrollbar-thumb:active {
  cursor: grabbing;
  background-color: #8a7c59;
}

/* Add padding to container when scrollbar is present */
.product-form-container:has(.custom-scrollbar-track) {
  padding-bottom: 17px; /* Space for scrollbar */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-fields-scroll {
    gap: 6px;
  }
  
  .form-field {
    min-width: fit-content;
  }
}

/* Unified scroll mode styles - Fixed alignment */
.unified-scroll-wrapper {
  position: relative;
  width: 100%;
}

.unified-fixed-actions {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background: white;
  display: flex;
  flex-direction: column;
}

.unified-fixed-action-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
  min-height: 48px; /* Exact same as unified-product-row */
  box-sizing: border-box;
}

.unified-fixed-action-row:last-child {
  border-bottom: none;
}

.unified-scroll-container {
  overflow-x: auto;
  overflow-y: visible;
  padding-left: 72px; /* Space for fixed delete/number columns */
  scroll-behavior: smooth;
  
  /* Hide default scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.unified-scroll-container::-webkit-scrollbar {
  display: none;
}

.unified-scroll-content {
  min-width: max-content;
}

.unified-product-row {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
  align-items: center;
  min-height: 48px; /* Exact same as unified-fixed-action-row */
  box-sizing: border-box;
}

.unified-product-row:last-child {
  border-bottom: none;
}

/* Ensure form fields in unified mode have the same styling as individual mode */
.unified-product-row .form-field {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.unified-product-row .form-field-group {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Remove any margins that could cause misalignment */
.unified-fixed-action-row .form-field-fixed {
  margin: 0;
  padding: 0;
}

.unified-fixed-action-row .product-number {
  margin-bottom: 0; /* Override the default margin-bottom */
}

/* Unified scrollbar positioning */
.unified-scrollbar {
  margin-left: 72px; /* Match the padding-left of scroll container */
  width: calc(100% - 72px);
}

/* Responsive adjustments for unified mode */
@media (max-width: 768px) {
  .unified-scroll-container {
    padding-left: 60px;
  }
  
  .unified-fixed-action-row {
    gap: 4px;
    padding: 8px 0;
  }
  
  .unified-fixed-action-row .form-field-fixed:first-child {
    width: 28px;
  }
  
  .unified-fixed-action-row .form-field-fixed:last-child {
    width: 32px;
  }
  
  .unified-scrollbar {
    margin-left: 60px;
    width: calc(100% - 60px);
  }
}

/* Unified scroll mode - just sync the scrolling */
.form-fields-scroll.unified-scroll {
  /* Inherits all existing styling from .form-fields-scroll */
}

.product-form-container.unified-mode {
  /* Inherits all existing styling from .product-form-container */
}

/* Unified scrollbar positioning - shows below all products */
.unified-scrollbar {
  margin-left: 80px; /* Match the fixed column widths (delete + number) */
  width: calc(100% - 80px);
  margin-top: 8px;
}

/* Ensure unified scroll containers have consistent behavior */
.form-fields-scroll.unified-scroll {
  scroll-behavior: auto; /* Remove smooth scrolling for better sync */
}

/* Remove individual scrollbars when in unified mode */
.product-form-container.unified-mode .custom-scrollbar-track:not(.unified-scrollbar) {
  display: none;
}
</style>