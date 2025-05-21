<template>
  <UModal :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Select Fabric Color</h3>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="$emit('update:model-value', false)"
          />
        </div>
      </template>
      
      <!-- Search and Filters -->
      <div class="mb-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search by color name..."
          icon="i-heroicons-magnifying-glass"
          class="mb-2"
          @input="debouncedSearch"
        />
        
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Showing fabric colors for: <span class="font-medium">{{ fabricName }}</span>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
        <div class="flex">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
          <div>
            <h3 class="text-sm font-medium text-red-800 dark:text-red-300">Error loading fabric colors</h3>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>
      
      <!-- No results state -->
      <div v-else-if="fabricColors.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        <UIcon name="i-heroicons-swatch" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No fabric colors found for this fabric type.</p>
      </div>
      
      <!-- Results grid -->
      <div v-else class="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
        <div
          v-for="color in fabricColors"
          :key="color.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="selectColor(color)"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-6 h-6 rounded-full"
              :style="{ backgroundColor: color.fields['Color Hex'] || '#64748b' }"
            ></div>
            <div class="overflow-hidden">
              <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ color.fields['Color Name'] }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ color.fields['Collection Name'] || props.fabricName }}
                <template v-if="color.fields['Color Category']">
                  - {{ color.fields['Color Category'] }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-between">
          <UButton
            color="gray"
            variant="ghost"
            @click="$emit('update:model-value', false)"
          >
            Cancel
          </UButton>
          <UButton
            v-if="fabricColors.length > 0"
            color="indigo"
            @click="loadMore"
            :disabled="!hasMore || isLoading"
          >
            {{ isLoading ? 'Loading...' : 'Load More' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import debounce from 'lodash/debounce';

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  fabricType: {
    type: String,
    default: ''
  },
  fabricName: {
    type: String,
    default: ''
  },
  fabricId: {
    type: [String, Number],
    default: null
  }
});

// Emits
const emit = defineEmits(['update:model-value', 'select', 'notification']);

// State
const searchQuery = ref('');
const fabricColors = ref([]);
const isLoading = ref(false);
const error = ref(null);
const page = ref(1);
const hasMore = ref(true);

// Methods
const debouncedSearch = debounce(() => {
  page.value = 1;
  fetchFabricColors();
}, 300);

// Reset the search state
function reset() {
  searchQuery.value = '';
  fabricColors.value = [];
  error.value = null;
  page.value = 1;
  hasMore.value = true;
}

// Load more results
function loadMore() {
  page.value++;
  fetchFabricColors(true);
}

// Select a fabric color
function selectColor(color) {
  emit('select', color);
  emit('update:model-value', false);
}

// Fetch fabric colors
async function fetchFabricColors(append = false) {
  if (!props.fabricId) {
    error.value = 'No fabric type selected';
    return;
  }
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`/api/ninox/fabric-colors?fabricId=${props.fabricId}&search=${searchQuery.value}&page=${page.value}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch fabric colors');
    }
    
    if (append) {
      fabricColors.value = [...fabricColors.value, ...data.colors];
    } else {
      fabricColors.value = data.colors;
    }
    
    hasMore.value = data.hasMore;
  } catch (err) {
    console.error('Error fetching fabric colors:', err);
    error.value = err.message;
    emit('notification', {
      title: 'Error',
      description: err.message,
      color: 'red'
    });
  } finally {
    isLoading.value = false;
  }
}

// Watch for modal open
watch(() => props.modelValue, (newVal) => {
  if (newVal && props.fabricId) {
    reset();
    fetchFabricColors();
  }
});

// Watch for fabric type changes
watch(() => props.fabricId, (newVal) => {
  if (props.modelValue && newVal) {
    reset();
    fetchFabricColors();
  }
});

// Expose methods
defineExpose({
  reset
});
</script>