<template>
  <div class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
    <!-- Horizontal scrollable form fields container -->
    <div class="product-form-container" :class="{ 'unified-mode': isUnifiedScroll }">
      <div class="product-form-scroll">
        <!-- Delete Button - Fixed at start -->
        <div class="form-field-fixed">
          <button
            class="delete-product-button"
            @click="$emit('remove')"
            aria-label="Delete product"
          >
            ×
          </button>
        </div>
        
        <!-- Number - Fixed at start -->
        <div class="form-field-fixed">
          <span class="product-number">{{ productIndex + 1 }}.</span>
        </div>
        
        <!-- Scrollable fields in the correct order -->
        <div 
          class="form-fields-scroll"
          :class="{ 'unified-scroll': isUnifiedScroll }"
          :data-ref="scrollDataRef"
          @scroll="handleScroll"
        >
          <!-- 1. Product Type -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.productType"
              :options="productTypes"
              placeholder="Type"
              min-width="120px"
              @update:model-value="$emit('update:product', { ...product, productType: $event })"
            />
          </div>
          
          <!-- 2. Room -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.room"
              :options="curtainOptions.rooms"
              placeholder="Room"
              min-width="120px"
              @update:model-value="$emit('update:product', { ...product, room: $event })"
            />
          </div>
          
          <!-- 3. Height -->
          <div class="form-field">
            <div class="input-rounded number-input">
              <UInput
                :model-value="product.height"
                type="number"
                placeholder="Height"
                class="input-rounded w-24"
                size="sm"
                @update:model-value="$emit('update:product', { ...product, height: $event })"
              />
              <div class="number-controls">
                <div class="number-btn" @mousedown="incrementValue('height', 1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18,15 12,9 6,15"></polyline>
                  </svg>
                </div>
                <div class="number-btn" @mousedown="incrementValue('height', -1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 4. Width -->
          <div class="form-field">
            <div class="input-rounded number-input">
              <UInput
                :model-value="product.width"
                type="number"
                placeholder="Width"
                class="input-rounded w-24"
                size="sm"
                @update:model-value="$emit('update:product', { ...product, width: $event })"
              />
              <div class="number-controls">
                <div class="number-btn" @mousedown="incrementValue('width', 1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18,15 12,9 6,15"></polyline>
                  </svg>
                </div>
                <div class="number-btn" @mousedown="incrementValue('width', -1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 5. Fabric Selection -->
          <div class="form-field">
            <button
              class="select-rounded fabric-button"
              style="min-width: 120px;"
              @click="$emit('open-fabric-modal')"
            >
              <span class="flex-1 text-left">
                {{ product.fabricDetails ? product.fabricDetails.fields['Fabric Name'] : 'Fabric' }}
              </span>
              <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 flex-shrink-0" />
            </button>
          </div>
            
          <!-- 6. Fabric Color Selection -->
          <div class="form-field">
            <button
              class="select-rounded fabric-button"
              style="min-width: 120px;"
              :disabled="!product.fabricDetails"
              @click="$emit('open-fabric-color-modal')"
            >
              <span class="flex-1 text-left">
                {{ product.fabricColorDetails ? product.fabricColorDetails.fields['Color Name'] : 'Fabric Colour' }}
              </span>
              <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 flex-shrink-0" />
            </button>
          </div>
          
          <!-- 7. Curtain Style -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.curtainStyle"
              :options="curtainOptions.curtainStyles"
              placeholder="Curtain Style"
              min-width="120px"
              @update:model-value="$emit('update:product', { ...product, curtainStyle: $event })"
            />
          </div>
          
          <!-- 8. Bottom Style -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.bottomStyle"
              :options="curtainOptions.bottomStyles"
              placeholder="Bottom Style"
              min-width="120px"
              @update:model-value="$emit('update:product', { ...product, bottomStyle: $event })"
            />
          </div>
          
          <!-- 9. # of Panels -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.numberOfPanels"
              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              placeholder="# Panels"
              min-width="90px"
              @update:model-value="handleNumberOfPanelsChange"
            />
          </div>
          
          <!-- 10. Hooks PP -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.hooksPp"
              :options="[1, 2, 3, 4, 5, 6, 7]"
              placeholder="Hooks PP"
              min-width="90px"
              @update:model-value="handleHooksPpChange"
            />
          </div>
          
          <!-- 11. Hooks Total -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.hooksTotal"
              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70]"
              placeholder="Hooks Total"
              min-width="100px"
              :disabled="true"
              @update:model-value="$emit('update:product', { ...product, hooksTotal: $event })"
            />
          </div>
          
          <!-- 12. Heading Height -->
          <div class="form-field">
            <div class="input-rounded number-input">
              <UInput
                :model-value="product.headingHeight"
                type="number"
                placeholder="Head Height"
                class="input-rounded w-28"
                size="sm"
                @update:model-value="$emit('update:product', { ...product, headingHeight: $event })"
              />
              <div class="number-controls">
                <div class="number-btn" @mousedown="incrementValue('headingHeight', 1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18,15 12,9 6,15"></polyline>
                  </svg>
                </div>
                <div class="number-btn" @mousedown="incrementValue('headingHeight', -1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 13. 2-Sided Checkbox -->
          <div class="form-field">
            <div class="flex items-center gap-1">
              <UCheckbox
                :model-value="product.isTwoSided"
                size="sm"
                @update:model-value="$emit('update:product', { ...product, isTwoSided: $event })"
              />
              <span class="text-xs whitespace-nowrap" style="color: #6B6B6B;">2-Sided</span>
            </div>
          </div>
          
          <!-- 14. Lining -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.lining"
              :options="curtainOptions.liningOptions"
              placeholder="Lining"
              min-width="120px"
              @update:model-value="$emit('update:product', { ...product, lining: $event })"
            />
          </div>
          
          <!-- 15. Lining Collection (when lining selected) -->
          <div v-if="product.lining && product.lining !== 'No Lining'" class="form-field">
            <CrastinoDropdown
              :model-value="product.liningCollection"
              :options="curtainOptions.liningCollections"
              placeholder="Lining Collection"
              min-width="140px"
              @update:model-value="$emit('update:product', { ...product, liningCollection: $event })"
            />
          </div>
          
          <!-- 16. Lining Collection Colour (when lining selected) -->
          <div v-if="product.lining && product.lining !== 'No Lining'" class="form-field">
            <CrastinoDropdown
              :model-value="product.liningColour"
              :options="curtainOptions.liningColours"
              placeholder="Lining Collection Colour"
              min-width="160px"
              @update:model-value="$emit('update:product', { ...product, liningColour: $event })"
            />
          </div>
          
          <!-- 17. Delivery -->
          <div class="form-field">
            <CrastinoDropdown
              :model-value="product.delivery"
              :options="curtainOptions.deliveryOptions"
              placeholder="Delivery"
              min-width="120px"
              @update:model-value="$emit('update:product', { ...product, delivery: $event })"
            />
          </div>
          
          <!-- 18. Price Field -->
          <div class="form-field">
            <div class="price-field-container" style="min-width: 120px;">
              <div class="price-field">
                <div 
                  class="price-icon-wrapper"
                  @mouseenter="$emit('show-price-tooltip', $event)"
                  @mouseleave="$emit('hide-price-tooltip')"
                >
                  <UIcon name="i-heroicons-information-circle" class="price-info-icon" />
                </div>
                <div class="price-text">$125.50</div>
              </div>
            </div>
          </div>
          
          <!-- 19. Notes -->
          <div class="form-field">
            <UInput
              :model-value="product.notes"
              placeholder="Notes"
              class="input-rounded w-24"
              size="sm"
              @update:model-value="$emit('update:product', { ...product, notes: $event })"
            />
          </div>
        </div>
      </div>
      
      <!-- Custom Scrollbar Track (only show when needed for individual scroll) -->
      <div 
        v-if="!isUnifiedScroll && scrollbarData?.isNeeded" 
        class="custom-scrollbar-track"
        @click="$emit('scroll-to-position', $event)"
      >
        <div 
          class="custom-scrollbar-thumb"
          :style="scrollThumbStyle"
          @mousedown="$emit('start-scrollbar-drag', $event)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CrastinoDropdown from './CrastinoDropdown.vue'

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  productIndex: {
    type: Number,
    required: true
  },
  productTypes: {
    type: Array,
    required: true
  },
  curtainOptions: {
    type: Object,
    required: true
  },
  isUnifiedScroll: {
    type: Boolean,
    default: false
  },
  scrollbarData: {
    type: Object,
    default: null
  },
  scrollThumbStyle: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits([
  'update:product',
  'remove',
  'open-fabric-modal',
  'open-fabric-color-modal',
  'show-price-tooltip',
  'hide-price-tooltip',
  'scroll-to-position',
  'start-scrollbar-drag',
  'scroll'
])

// Computed properties
const scrollDataRef = computed(() => {
  return props.isUnifiedScroll 
    ? `unifiedScrollContainer_${props.productIndex}` 
    : `scrollContainer_${props.productIndex}`
})

// Methods
const incrementValue = (field, increment) => {
  const currentValue = parseInt(props.product[field]) || 0
  const newValue = Math.max(0, currentValue + increment)
  emit('update:product', { ...props.product, [field]: newValue })
}

const handleNumberOfPanelsChange = (newNumberOfPanels) => {
  const updatedProduct = { ...props.product, numberOfPanels: newNumberOfPanels }
  calculateHooksTotal(updatedProduct)
}

const handleHooksPpChange = (newHooksPp) => {
  const updatedProduct = { ...props.product, hooksPp: newHooksPp }
  calculateHooksTotal(updatedProduct)
}

const calculateHooksTotal = (product) => {
  if (product.numberOfPanels && product.hooksPp) {
    product.hooksTotal = product.numberOfPanels * product.hooksPp
  }
  emit('update:product', product)
}

const handleScroll = (event) => {
  emit('scroll', event, props.productIndex)
}
</script> 