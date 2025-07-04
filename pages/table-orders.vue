<template>
  <div class="ml-[86px]">
    <div class="container">
      <div class="mb-[90px]">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-[30px] font-light text-[#2d1713] mb-4">
            Hello, {{ userName || "User" }}
          </h1>
          <div class="text-lg font-medium" style="color: #6b6b6b">
            <div class="date-display">
              {{ currentDate }}
            </div>
          </div>
        </div>
        <p style="color: #6b6b6b">
          Create and manage multiple orders with a spreadsheet-like interface.
        </p>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin"
          style="color: #6b6b6b"
        />
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
                    : 'bg-gray-100',
                ]"
                style="min-width: 200px; min-height: 55px"
                @click="
                  activeTabIndex !== index ? (activeTabIndex = index) : null
                "
              >
                <!-- Tab Header -->
                <button
                  :class="[
                    'w-full px-3 py-1 text-sm font-medium transition-all duration-200 flex items-center justify-center pointer-events-none',
                    activeTabIndex === index ? 'text-black' : 'text-gray-600',
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
                    <div
                      v-if="orders[activeTabIndex].client"
                      class="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs pointer-events-auto"
                      style="background-color: #e5e5e5"
                    >
                      <span class="font-medium" style="color: #2d2d2d">
                        {{ orders[activeTabIndex].client.fields["First Name"] }}
                        {{ orders[activeTabIndex].client.fields["Last Name"] }}
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
                      style="
                        background-color: #bfb7b0;
                        color: #ffffff;
                        min-width: 120px;
                      "
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
                    : 'bg-gray-50 text-gray-400',
                ]"
                style="min-height: 55px; min-width: 140px"
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
          <div
            v-if="activeTabIndex >= 0"
            class="bg-white rounded-b-lg shadow-sm border border-gray-100 rounded-tl-lg relative -mt-px"
          >
            <!-- Product Form Area -->
            <div class="p-6">
              <!-- Scroll Mode Toggle -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium" style="color: #2d2d2d"
                    >Scroll Mode:</span
                  >
                  <button
                    @click="toggleScrollMode"
                    :class="[
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                      isUnifiedScroll
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200',
                    ]"
                  >
                    <UIcon
                      :name="
                        isUnifiedScroll
                          ? 'i-heroicons-arrows-right-left'
                          : 'i-heroicons-queue-list'
                      "
                      class="w-3 h-3"
                    />
                    {{ isUnifiedScroll ? "Unified" : "Individual" }}
                  </button>
                </div>
              </div>

              <!-- Individual Scroll Mode (Current Implementation) -->
              <div v-if="!isUnifiedScroll">
                <!-- Product rows with individual horizontal scrolling -->
                <div
                  v-for="(product, pIndex) in orders[activeTabIndex].products"
                  :key="pIndex"
                >
                  <!-- Roman Shades Product Row -->
                  <RomanShadesProductRow
                    v-if="product.productType === 'Roman Shades'"
                    :product="product"
                    :product-index="pIndex"
                    :product-types="productTypes"
                    :curtain-options="curtainOptions"
                    :roman-shade-options="romanShadeOptions"
                    :get-motor-types="getMotorTypes"
                    :is-unified-scroll="false"
                    :scrollbar-data="scrollbarData[pIndex]"
                    :scroll-thumb-style="getScrollThumbStyle(pIndex)"
                    @update:product="
                      orders[activeTabIndex].products[pIndex] = $event
                    "
                    @remove="removeProduct(pIndex)"
                    @open-fabric-modal="openFabricModal(pIndex)"
                    @open-fabric-color-modal="openFabricColorModal(pIndex)"
                    @show-price-tooltip="showPriceTooltip($event, pIndex)"
                    @hide-price-tooltip="hidePriceTooltip"
                    @scroll-to-position="scrollToPosition($event, pIndex)"
                    @start-scrollbar-drag="startScrollbarDrag($event, pIndex)"
                    @scroll="updateCustomScrollbar"
                  />

                  <!-- Curtains Product Row -->
                  <CurtainsProductRow
                    v-else-if="product.productType === 'Curtains'"
                    :product="product"
                    :product-index="pIndex"
                    :product-types="productTypes"
                    :curtain-options="curtainOptions"
                    :is-unified-scroll="false"
                    :scrollbar-data="scrollbarData[pIndex]"
                    :scroll-thumb-style="getScrollThumbStyle(pIndex)"
                    @update:product="
                      orders[activeTabIndex].products[pIndex] = $event
                    "
                    @remove="removeProduct(pIndex)"
                    @open-fabric-modal="openFabricModal(pIndex)"
                    @open-fabric-color-modal="openFabricColorModal(pIndex)"
                    @show-price-tooltip="showPriceTooltip($event, pIndex)"
                    @hide-price-tooltip="hidePriceTooltip"
                    @scroll-to-position="scrollToPosition($event, pIndex)"
                    @start-scrollbar-drag="startScrollbarDrag($event, pIndex)"
                    @scroll="updateCustomScrollbar"
                  />

                  <!-- Generic Product Row (for other types) -->
                  <div
                    v-else
                    class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0"
                  >
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
                          <!-- Room (for Curtains only now) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.room"
                              :options="curtainOptions.rooms"
                              placeholder="Room"
                              min-width="120px"
                            />
                          </div>

                          <!-- Product Type -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.productType"
                              :options="productTypes"
                              placeholder="Type"
                              min-width="120px"
                            />
                          </div>

                          <!-- Height -->
                          <div class="form-field">
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.height"
                                type="number"
                                placeholder="Height"
                                class="input-rounded w-24"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'height', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'height', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Width -->
                          <div class="form-field">
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.width"
                                type="number"
                                placeholder="Width"
                                class="input-rounded w-24"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'width', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'width', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
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
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'quantity', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'quantity', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Fabric Selection -->
                          <div class="form-field">
                            <button
                              class="select-rounded fabric-button"
                              style="min-width: 120px"
                              @click="openFabricModal(pIndex)"
                            >
                              <span class="flex-1 text-left">
                                {{
                                  product.fabricDetails
                                    ? product.fabricDetails.fields[
                                        "Fabric Name"
                                      ]
                                    : "Fabric"
                                }}
                              </span>
                              <UIcon
                                name="i-heroicons-chevron-down"
                                class="w-4 h-4 flex-shrink-0"
                              />
                            </button>
                          </div>

                          <!-- Fabric Color Selection -->
                          <div class="form-field">
                            <button
                              class="select-rounded fabric-button"
                              style="min-width: 120px"
                              :disabled="!product.fabricDetails"
                              @click="openFabricColorModal(pIndex)"
                            >
                              <span class="flex-1 text-left">
                                {{
                                  product.fabricColorDetails
                                    ? product.fabricColorDetails.fields[
                                        "Color Name"
                                      ]
                                    : "Colour"
                                }}
                              </span>
                              <UIcon
                                name="i-heroicons-chevron-down"
                                class="w-4 h-4 flex-shrink-0"
                              />
                            </button>
                          </div>

                          <!-- Curtain Style (for Curtains only) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.curtainStyle"
                              :options="curtainOptions.curtainStyles"
                              placeholder="Style"
                              min-width="120px"
                            />
                          </div>

                          <!-- Bottom Style (for Curtains) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.bottomStyle"
                              :options="curtainOptions.bottomStyles"
                              placeholder="Bottom"
                              min-width="100px"
                            />
                          </div>

                          <!-- # of Panels (for Curtains) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.numberOfPanels"
                              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                              placeholder="# Panels"
                              min-width="90px"
                              @update:modelValue="calculateHooksTotal(product)"
                            />
                          </div>

                          <!-- Lining (for Curtains only now) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.lining"
                              :options="curtainOptions.liningOptions"
                              placeholder="Lining"
                              min-width="120px"
                            />
                          </div>

                          <!-- Lining Collection (for Curtains only now) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' &&
                              product.lining &&
                              product.lining !== 'No Lining'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.liningCollection"
                              :options="curtainOptions.liningCollections"
                              placeholder="Lining Collection"
                              min-width="140px"
                            />
                          </div>

                          <!-- Lining Colour (for Curtains only now) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' &&
                              product.lining &&
                              product.lining !== 'No Lining'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.liningColour"
                              :options="curtainOptions.liningColours"
                              placeholder="Lining Colour"
                              min-width="130px"
                            />
                          </div>

                          <!-- Delivery (for Curtains only now) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.delivery"
                              :options="curtainOptions.deliveryOptions"
                              placeholder="Delivery"
                              min-width="120px"
                            />
                          </div>

                          <!-- Price Field (for Curtains only now) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <div
                              class="price-field-container"
                              style="min-width: 120px"
                            >
                              <div class="price-field">
                                <div
                                  class="price-icon-wrapper"
                                  @mouseenter="showPriceTooltip($event, pIndex)"
                                  @mouseleave="hidePriceTooltip"
                                >
                                  <UIcon
                                    name="i-heroicons-information-circle"
                                    class="price-info-icon"
                                  />
                                </div>
                                <div class="price-text">$125.50</div>
                              </div>
                            </div>
                          </div>

                          <!-- Notes - Always present -->
                          <div class="form-field">
                            <UInput
                              v-model="product.notes"
                              placeholder="Notes"
                              class="input-rounded w-24"
                              size="sm"
                            />
                          </div>

                          <!-- Hooks PP (for Curtains ONLY - removed Roman Shades) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.hooksPp"
                              :options="[1, 2, 3, 4, 5, 6, 7]"
                              placeholder="Hooks PP"
                              min-width="90px"
                              @update:modelValue="calculateHooksTotal(product)"
                            />
                          </div>

                          <!-- Hooks Total (for Curtains ONLY - removed Roman Shades) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.hooksTotal"
                              :options="[
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30,
                                35, 40, 45, 50, 60, 70,
                              ]"
                              placeholder="Hooks Total"
                              min-width="100px"
                              :disabled="true"
                            />
                          </div>

                          <!-- Heading Height (for Curtains ONLY - removed Roman Shades) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.headingHeight"
                                type="number"
                                placeholder="Head Height"
                                class="input-rounded w-28"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'headingHeight', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'headingHeight', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- 2-Sided Checkbox (for Curtains ONLY - removed Roman Shades) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <div class="flex items-center gap-1">
                              <UCheckbox
                                v-model="product.isTwoSided"
                                size="sm"
                              />
                              <span
                                class="text-xs whitespace-nowrap"
                                style="color: #6b6b6b"
                                >2-Sided</span
                              >
                            </div>
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
              </div>

              <!-- Unified Scroll Mode -->
              <div v-else>
                <!-- Product rows with unified horizontal scrolling -->
                <div
                  v-for="(product, pIndex) in orders[activeTabIndex].products"
                  :key="pIndex"
                >
                  <!-- Roman Shades Product Row -->
                  <RomanShadesProductRow
                    v-if="product.productType === 'Roman Shades'"
                    :product="product"
                    :product-index="pIndex"
                    :product-types="productTypes"
                    :curtain-options="curtainOptions"
                    :roman-shade-options="romanShadeOptions"
                    :get-motor-types="getMotorTypes"
                    :is-unified-scroll="true"
                    @update:product="
                      orders[activeTabIndex].products[pIndex] = $event
                    "
                    @remove="removeProduct(pIndex)"
                    @open-fabric-modal="openFabricModal(pIndex)"
                    @open-fabric-color-modal="openFabricColorModal(pIndex)"
                    @show-price-tooltip="showPriceTooltip($event, pIndex)"
                    @hide-price-tooltip="hidePriceTooltip"
                    @scroll="updateUnifiedScrollbar"
                  />

                  <!-- Curtains Product Row -->
                  <CurtainsProductRow
                    v-else-if="product.productType === 'Curtains'"
                    :product="product"
                    :product-index="pIndex"
                    :product-types="productTypes"
                    :curtain-options="curtainOptions"
                    :is-unified-scroll="true"
                    @update:product="
                      orders[activeTabIndex].products[pIndex] = $event
                    "
                    @remove="removeProduct(pIndex)"
                    @open-fabric-modal="openFabricModal(pIndex)"
                    @open-fabric-color-modal="openFabricColorModal(pIndex)"
                    @show-price-tooltip="showPriceTooltip($event, pIndex)"
                    @hide-price-tooltip="hidePriceTooltip"
                    @scroll="updateUnifiedScrollbar"
                  />

                  <!-- Generic Product Row (for other types) -->
                  <div
                    v-else
                    class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0"
                  >
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
                          <!-- Room (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.room"
                              :options="curtainOptions.rooms"
                              placeholder="Room"
                              min-width="120px"
                            />
                          </div>

                          <!-- Product Type -->
                          <div class="form-field">
                            <CrastinoDropdown
                              v-model="product.productType"
                              :options="productTypes"
                              placeholder="Type"
                              min-width="120px"
                            />
                          </div>

                          <!-- Height -->
                          <div class="form-field">
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.height"
                                type="number"
                                placeholder="Height"
                                class="input-rounded w-24"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'height', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'height', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Width -->
                          <div class="form-field">
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.width"
                                type="number"
                                placeholder="Width"
                                class="input-rounded w-24"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'width', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'width', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
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
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'quantity', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'quantity', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Fabric Selection -->
                          <div class="form-field">
                            <button
                              class="select-rounded fabric-button"
                              style="min-width: 120px"
                              @click="openFabricModal(pIndex)"
                            >
                              <span class="flex-1 text-left">
                                {{
                                  product.fabricDetails
                                    ? product.fabricDetails.fields[
                                        "Fabric Name"
                                      ]
                                    : "Fabric"
                                }}
                              </span>
                              <UIcon
                                name="i-heroicons-chevron-down"
                                class="w-4 h-4 flex-shrink-0"
                              />
                            </button>
                          </div>

                          <!-- Fabric Color Selection -->
                          <div class="form-field">
                            <button
                              class="select-rounded fabric-button"
                              style="min-width: 120px"
                              :disabled="!product.fabricDetails"
                              @click="openFabricColorModal(pIndex)"
                            >
                              <span class="flex-1 text-left">
                                {{
                                  product.fabricColorDetails
                                    ? product.fabricColorDetails.fields[
                                        "Color Name"
                                      ]
                                    : "Colour"
                                }}
                              </span>
                              <UIcon
                                name="i-heroicons-chevron-down"
                                class="w-4 h-4 flex-shrink-0"
                              />
                            </button>
                          </div>

                          <!-- Shade Style (for Roman Shades) -->
                          <div
                            v-if="product.productType === 'Roman Shades'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.shadeStyle"
                              :options="romanShadeOptions.shadeStyles"
                              placeholder="Shade Style"
                              min-width="120px"
                            />
                          </div>

                          <!-- Curtain Style (for Curtains) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.curtainStyle"
                              :options="curtainOptions.curtainStyles"
                              placeholder="Style"
                              min-width="120px"
                            />
                          </div>

                          <!-- Control Type (for Roman Shades) -->
                          <div
                            v-if="product.productType === 'Roman Shades'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.controlType"
                              :options="romanShadeOptions.controlTypes"
                              placeholder="Control Type"
                              min-width="120px"
                              @update:modelValue="
                                handleControlTypeChange(product)
                              "
                            />
                          </div>

                          <!-- Motor Type (for Roman Shades when motorized) -->
                          <div
                            v-if="
                              product.productType === 'Roman Shades' &&
                              product.controlType === 'Motorized'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.motorType"
                              :options="getMotorTypes('Roman Shades')"
                              placeholder="Motor Type"
                              min-width="120px"
                            />
                          </div>

                          <!-- Bottom Style (for Curtains) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.bottomStyle"
                              :options="curtainOptions.bottomStyles"
                              placeholder="Bottom"
                              min-width="100px"
                            />
                          </div>

                          <!-- # of Panels (for Curtains) -->
                          <div
                            v-if="product.productType === 'Curtains'"
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.numberOfPanels"
                              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                              placeholder="# Panels"
                              min-width="90px"
                              @update:modelValue="calculateHooksTotal(product)"
                            />
                          </div>

                          <!-- Lining (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.lining"
                              :options="curtainOptions.liningOptions"
                              placeholder="Lining"
                              min-width="120px"
                            />
                          </div>

                          <!-- Lining Collection (for Curtains and Roman Shades with lining) -->
                          <div
                            v-if="
                              (product.productType === 'Curtains' ||
                                product.productType === 'Roman Shades') &&
                              product.lining &&
                              product.lining !== 'No Lining'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.liningCollection"
                              :options="curtainOptions.liningCollections"
                              placeholder="Lining Collection"
                              min-width="140px"
                            />
                          </div>

                          <!-- Lining Colour (for Curtains and Roman Shades with lining) -->
                          <div
                            v-if="
                              (product.productType === 'Curtains' ||
                                product.productType === 'Roman Shades') &&
                              product.lining &&
                              product.lining !== 'No Lining'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.liningColour"
                              :options="curtainOptions.liningColours"
                              placeholder="Lining Colour"
                              min-width="130px"
                            />
                          </div>

                          <!-- Delivery (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.delivery"
                              :options="curtainOptions.deliveryOptions"
                              placeholder="Delivery"
                              min-width="120px"
                            />
                          </div>

                          <!-- Price Field (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <div
                              class="price-field-container"
                              style="min-width: 120px"
                            >
                              <div class="price-field">
                                <div
                                  class="price-icon-wrapper"
                                  @mouseenter="showPriceTooltip($event, pIndex)"
                                  @mouseleave="hidePriceTooltip"
                                >
                                  <UIcon
                                    name="i-heroicons-information-circle"
                                    class="price-info-icon"
                                  />
                                </div>
                                <div class="price-text">
                                  {{
                                    product.productType === "Curtains"
                                      ? "$125.50"
                                      : "$95.75"
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Notes - Always present -->
                          <div class="form-field">
                            <UInput
                              v-model="product.notes"
                              placeholder="Notes"
                              class="input-rounded w-24"
                              size="sm"
                            />
                          </div>

                          <!-- Hooks PP (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.hooksPp"
                              :options="[1, 2, 3, 4, 5, 6, 7]"
                              placeholder="Hooks PP"
                              min-width="90px"
                              @update:modelValue="calculateHooksTotal(product)"
                            />
                          </div>

                          <!-- Hooks Total (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <CrastinoDropdown
                              v-model="product.hooksTotal"
                              :options="[
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30,
                                35, 40, 45, 50, 60, 70,
                              ]"
                              placeholder="Hooks Total"
                              min-width="100px"
                              :disabled="true"
                            />
                          </div>

                          <!-- Heading Height (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <div class="input-rounded number-input">
                              <UInput
                                v-model="product.headingHeight"
                                type="number"
                                placeholder="Head Height"
                                class="input-rounded w-28"
                                size="sm"
                              />
                              <div class="number-controls">
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'headingHeight', 1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="18,15 12,9 6,15"
                                    ></polyline>
                                  </svg>
                                </div>
                                <div
                                  class="number-btn"
                                  @mousedown="
                                    incrementValue(product, 'headingHeight', -1)
                                  "
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <polyline
                                      points="6,9 12,15 18,9"
                                    ></polyline>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- 2-Sided Checkbox (for Curtains and Roman Shades) -->
                          <div
                            v-if="
                              product.productType === 'Curtains' ||
                              product.productType === 'Roman Shades'
                            "
                            class="form-field"
                          >
                            <div class="flex items-center gap-1">
                              <UCheckbox
                                v-model="product.isTwoSided"
                                size="sm"
                              />
                              <span
                                class="text-xs whitespace-nowrap"
                                style="color: #6b6b6b"
                                >2-Sided</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add New Product Button -->
              <div class="flex justify-start mt-6">
                <button class="add-product-button" @click="addNewProduct">
                  <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                  Add New Product
                </button>
              </div>
            </div>
          </div>

          <!-- "Add New Tab" View -->
          <div
            v-else
            class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 -ml-12 pl-20"
          >
            <div class="max-w-lg mx-auto text-center">
              <UIcon
                name="i-heroicons-plus-circle"
                class="w-16 h-16 mx-auto mb-4"
                style="color: #b8a082"
              />
              <h3 class="text-xl font-medium mb-2" style="color: #2d2d2d">
                Create a New Order
              </h3>

              <div class="max-w-md mx-auto">
                <UFormGroup label="Order Name" class="mb-4">
                  <UInput
                    v-model="newOrderName"
                    placeholder="Enter a name for this order"
                    class="input-rounded"
                    size="lg"
                  />
                </UFormGroup>

                <div class="flex justify-center">
                  <UButton
                    class="px-8 py-3 rounded-full text-white font-medium"
                    style="background-color: #b8a082"
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
          <div v-if="activeTabIndex >= 0" class="mt-12">
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
                  style="background-color: #8a7c59; color: #f7f7f5"
                  :loading="isSubmitting"
                  :disabled="!isFormValid"
                  @click="submitCurrentOrder"
                >
                  SUBMIT ORDER
                </UButton>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-3xl font-light mb-4 text-[#2D1713]">
              Recent Orders
            </h3>
            <OrdersTable :orders="dummyOrders" />
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
              <UFormGroup
                v-if="
                  !editingProduct.isMotorized &&
                  editingProduct.productType === 'Roller Shades'
                "
                label="Chain Type"
              >
                <USelect
                  v-model="editingProduct.chainType"
                  :options="chainTypes"
                  placeholder="Select chain type"
                  class="select-rounded"
                />
              </UFormGroup>

              <!-- Roll Direction (for roller shades) -->
              <UFormGroup
                v-if="editingProduct.productType === 'Roller Shades'"
                label="Roll Direction"
              >
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
                  :options="[
                    'White',
                    'Black',
                    'Silver',
                    'Bronze',
                    'Antique Gold',
                  ]"
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
          v-if="
            editingProductIndex !== null &&
            orders[activeTabIndex] &&
            orders[activeTabIndex].products[editingProductIndex]
          "
          v-model="showFabricModal"
          :product-type="
            orders[activeTabIndex].products[editingProductIndex]?.productType
          "
          @select="selectFabric"
          @notification="showNotification"
          ref="fabricSearchModalRef"
        />

        <!-- Fabric Color Search Modal -->
        <FabricColorSearchModal
          v-if="
            editingProductIndex !== null &&
            orders[activeTabIndex] &&
            orders[activeTabIndex].products[editingProductIndex]
          "
          v-model="showFabricColorModal"
          :fabric-id="
            orders[activeTabIndex].products[editingProductIndex]?.fabricDetails
              ?.id
          "
          :fabric-name="
            orders[activeTabIndex].products[editingProductIndex]?.fabricDetails
              ?.fields['Fabric Name'] || ''
          "
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
      <div
        v-else
        class="border p-6 rounded-lg shadow-sm text-center"
        style="background-color: #fef2f2; border-color: #fecaca"
      >
        <UIcon
          name="i-heroicons-lock-closed"
          class="w-12 h-12 mx-auto mb-4"
          style="color: #dc2626"
        />
        <h2 class="text-xl font-semibold mb-2" style="color: #dc2626">
          Insufficient Permissions
        </h2>
        <p class="mb-4" style="color: #dc2626">
          You don't have the necessary permissions to access the order entry
          system.
        </p>
        <UButton to="/api/logout" external color="red" variant="soft">
          Sign out
        </UButton>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="priceTooltip.show"
      class="price-tooltip-fixed"
      :style="{
        top: priceTooltip.top + 'px',
        left: priceTooltip.left + 'px',
      }"
    >
      <div class="price-tooltip-content">
        <div class="price-tooltip-background"></div>
        <div class="price-tooltip-text">
          <p class="price-breakdown-line">12kg 8x4x120cm</p>
          <p class="price-breakdown-line">Shipping $5</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
definePageMeta({ layout: "account-section" });
import { ref, computed, onMounted, watch, nextTick } from "vue";
import Navbar from "../components/Navbar.vue";
import ClientSearchModal from "../components/ClientSearchModal.vue";
import FabricSearchModal from "../components/FabricSearchModal.vue";
import FabricColorSearchModal from "../components/FabricColorSearchModal.vue";
import NotificationSystem from "../components/NotificationSystem.vue";
import CrastinoDropdown from "../components/CrastinoDropdown.vue";
import RomanShadesProductRow from "../components/RomanShadesProductRow.vue";
import CurtainsProductRow from "../components/CurtainsProductRow.vue";

// Import composables
import { useProductOptions } from "../composables/useProductOptions";
import { useProductManagement } from "../composables/useProductManagement";
import { useOrderManagement } from "../composables/useOrderManagement";
import { useModalManagement } from "../composables/useModalManagement";
import { useFormValidation } from "../composables/useFormValidation";
import { useNotifications } from "../composables/useNotifications";
import { useScrollManagement } from "../composables/useScrollManagement";
const dummyOrders = Array.from({ length: 10 }, () => ({
  order: "VF–2508227",
  date: "27/05/2025",
  billed: "Diddo ef.",
  total: "€314,56",
  status: "Complete",
}));
// User authentication and permissions
const client = useKindeClient();
const isLoading = ref(true);
const hasPermission = ref(true);

const auth = computed(() => {
  try {
    const nuxtApp = useNuxtApp();
    return nuxtApp.$auth || null;
  } catch (e) {
    console.error("Error accessing auth:", e);
    return null;
  }
});

const user = computed(() => {
  return auth.value?.user || {};
});

const userName = computed(() => {
  return user.value?.given_name || "User";
});

const currentDate = computed(() => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
});

// Use composables
const { productTypes, curtainOptions, romanShadeOptions, getMotorTypes } =
  useProductOptions();

const {
  createDefaultProduct,
  incrementValue,
  calculateHooksTotal,
  handleControlTypeChange,
} = useProductManagement();

const {
  showClientModal,
  showFabricModal,
  showFabricColorModal,
  editingProductIndex,
  openClientModal,
} = useModalManagement();

const { notification, showNotification } = useNotifications();

const {
  scrollbarData,
  unifiedScrollbarData,
  priceTooltip,
  updateCustomScrollbar,
  getScrollThumbStyle,
  scrollToPosition,
  startScrollbarDrag,
  initializeScrollbars,
  updateUnifiedScrollbar,
  getUnifiedScrollThumbStyle,
  scrollUnifiedToPosition,
  startUnifiedScrollbarDrag,
  initializeUnifiedScrollbar,
  showPriceTooltip,
  hidePriceTooltip,
  toggleScrollMode,
} = useScrollManagement();

// Local state
const isSubmitting = ref(false);
const activeTabIndex = ref(0);
const newOrderName = ref("");
const isUnifiedScroll = ref(false);

// Initialize orders with one default order
const orders = ref([
  {
    name: "Order #1",
    products: [createDefaultProduct()],
    specialInstructions: "",
    client: null,
  },
]);

// Template refs
const clientSearchModalRef = ref(null);
const fabricSearchModalRef = ref(null);
const fabricColorSearchModalRef = ref(null);

// Computed properties
const currentOrder = computed(() => {
  return activeTabIndex.value >= 0 && activeTabIndex.value < orders.value.length
    ? orders.value[activeTabIndex.value]
    : { name: "", products: [], specialInstructions: "" };
});

// Form validation
const isFormValid = computed(() => {
  const currentOrder = orders.value[activeTabIndex.value];
  if (!currentOrder) return false;

  // Must have a client
  if (!currentOrder.client) return false;

  // Current order must have at least one product
  if (currentOrder.products.length === 0) return false;

  // All products must have required fields
  for (const product of currentOrder.products) {
    if (!product.productType) return false;
    if (!product.width || !product.height) return false;
    if (!product.fabricId && !product.fabricDetails) return false;
    if (!product.fabricColorId && !product.fabricColorDetails) return false;
    if (product.isMotorized && !product.motorType) return false;
    if (!product.isMotorized && !product.controlSide) return false;
    if (!product.mountLocation) return false;
    if (product.productType === "Roller Shades" && !product.rollDirection)
      return false;
    if (product.quantity < 1) return false;
  }

  return true;
});

// Methods that use composables
const createNewOrder = () => {
  if (!newOrderName.value) return;

  orders.value.push({
    name: newOrderName.value,
    products: [createDefaultProduct()],
    specialInstructions: "",
    client: null,
  });

  activeTabIndex.value = orders.value.length - 1;
  newOrderName.value = "";

  showNotification({
    title: "New Order Created",
    description: `Order "${
      orders.value[activeTabIndex.value].name
    }" has been created with one product row ready.`,
    color: "green",
  });
};

const removeOrder = (index) => {
  if (orders.value.length <= 1) {
    showNotification({
      title: "Error",
      description:
        "Cannot remove the last order. You must have at least one order.",
      color: "red",
    });
    return;
  }

  const orderName = orders.value[index].name;
  orders.value.splice(index, 1);

  // If we removed the active tab, switch to the first tab
  if (
    activeTabIndex.value === index ||
    activeTabIndex.value >= orders.value.length
  ) {
    activeTabIndex.value = 0;
  }

  showNotification({
    title: "Order Removed",
    description: `Order "${orderName}" has been removed.`,
    color: "blue",
  });
};

const addNewProduct = () => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  orders.value[activeTabIndex.value].products.push(createDefaultProduct());
};

const removeProduct = (index) => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  orders.value[activeTabIndex.value].products.splice(index, 1);
};

const openOrderClientModal = () => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  if (clientSearchModalRef.value) {
    clientSearchModalRef.value.reset();
  }
  showClientModal.value = true;
};

const removeOrderClient = () => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;
  orders.value[activeTabIndex.value].client = null;
};

const selectClient = (client) => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  orders.value[activeTabIndex.value].client = client;

  showNotification({
    title: "Client Selected",
    description: `${client.fields["First Name"]} ${client.fields["Last Name"]} has been selected for this order.`,
    color: "blue",
  });
};

// Add the missing modal functions
const openFabricModal = (productIndex) => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  const product = orders.value[activeTabIndex.value].products[productIndex];

  if (!product.productType) {
    showNotification({
      title: "Select Product Type",
      description: "Please select a product type before choosing a fabric.",
      color: "yellow",
    });
    return;
  }

  editingProductIndex.value = productIndex;
  if (fabricSearchModalRef.value) {
    fabricSearchModalRef.value.reset();
  }
  showFabricModal.value = true;
};

const openFabricColorModal = (productIndex) => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  const product = orders.value[activeTabIndex.value].products[productIndex];

  if (!product.fabricDetails) {
    showNotification({
      title: "Select Fabric Type First",
      description:
        "Please select a fabric type before choosing a fabric color.",
      color: "yellow",
    });
    return;
  }

  editingProductIndex.value = productIndex;
  if (fabricColorSearchModalRef.value) {
    fabricColorSearchModalRef.value.reset();
  }
  showFabricColorModal.value = true;
};

const selectFabric = (fabric) => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  const orderIndex = activeTabIndex.value;
  const fabricId = fabric.fabricId || fabric.fields["Fabric ID"] || fabric.id;

  orders.value[orderIndex].products[editingProductIndex.value].fabricDetails =
    fabric;
  orders.value[orderIndex].products[editingProductIndex.value].fabricId =
    fabricId;

  showNotification({
    title: "Fabric Selected",
    description: `${fabric.fields["Fabric Name"]} has been selected.`,
    color: "blue",
  });

  // Reset editing product index
  editingProductIndex.value = null;
};

const selectFabricColor = (fabricColor) => {
  if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length)
    return;

  const orderIndex = activeTabIndex.value;
  const colorId = fabricColor.id || fabricColor.fields["Color ID"];

  orders.value[orderIndex].products[
    editingProductIndex.value
  ].fabricColorDetails = fabricColor;
  orders.value[orderIndex].products[editingProductIndex.value].fabricColorId =
    colorId;

  showNotification({
    title: "Fabric Color Selected",
    description: `${fabricColor.fields["Color Name"]} has been selected.`,
    color: "indigo",
  });

  // Reset editing product index
  editingProductIndex.value = null;
};

// Watch for tab changes
watch(activeTabIndex, (newIndex) => {
  if (newIndex === -1) {
    newOrderName.value = `Order #${orders.value.length + 1}`;
  }
});

// Lifecycle
onMounted(async () => {
  try {
    hasPermission.value = true;
  } catch (error) {
    console.error("Error checking permissions:", error);
    hasPermission.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>
@import "~/assets/css/table-orders.css";
</style>
