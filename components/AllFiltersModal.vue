<template>
  <div v-if="open" class="fixed inset-0 z-[99999]">
     <div
      class="fixed inset-0 bg-[#3D3935] bg-opacity-20 transition-opacity duration-300"
      @click="emit('close')"
    ></div>
    <div
      class="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-lg px-8 transition-transform duration-300 z-[99999]"
      style="transform: translateX(0);"
    >
      <!-- Header -->
      <div class="flex justify-end gap-6 py-8">    
    
        <button
          class="text-[#3D3935] font-light text-xs uppercase p-0 border-b border-[#8A7C59] hover:border-[#6F6259] cursor-pointer transition-all"
          @click="resetFilters"
        >
           Reset Filters
        </button>
        <button
          class="px-4 py-2 rounded-full text-sm font-normal uppercase bg-[#8A7C59] text-white font-semibold hover:bg-[#6F6259] transition"
          @click="applyFilters"
        >
          Save
        </button>
      </div>

      <!-- Filter Selectors -->
            <div
        class="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#aaa] scrollbar-track-[#eee] "
        style="max-height: calc(100vh - 130px);" 
      >

      <div class="flex flex-col gap-[11px] mb-6">
        <BaseSelectProduct v-model="localFlammability" :options="flammabilityOptions" />
        <BaseSelectProduct v-model="localWidth" :options="widthOptions" />
        <BaseSelectProduct v-model="localColour" :options="colourOptions" />
        <BaseSelectProduct v-model="localTransparency" :options="transparencyOptions" />
        <BaseSelectProduct v-model="localAcoustic" :options="acousticOptions" />
        <BaseSelectProduct v-model="localCategories" :options="categoriesOptions" />
        <BaseSelectProduct v-model="localLightfastness" :options="lightfastnessOptions" />
        <BaseSelectProduct v-model="localPattern" :options="patternOptions" />
        <BaseSelectProduct v-model="localWashable" :options="washableOptions" />
        <BaseSelectProduct v-model="localComposition" :options="compositionOptions" />
        <BaseSelectProduct v-model="localTurnable" :options="turnableOptions" />
        <BaseSelectProduct v-model="localMetallised" :options="metallisedOptions" />
        <BaseSelectProduct v-model="localEnvironmental" :options="environmentalOptions" />
        <BaseSelectProduct v-model="localInStock" :options="inStockOptions"/>
        <BaseSelectProduct v-model="localPilling" :options="pillingOptions"/>
        <BaseSelectProduct v-model="localFabricName" :options="fabricNameOptions"/>
        <BaseSelectProduct v-model="localEnvironmentalDesign" :options="environmentalDesignOptions"/>
        <BaseSelectProduct v-model="localSortBy" :options="sortByOptions"/>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseSelectProduct from './BaseSelectProduct.vue'

// Props
const props = defineProps({
  open: Boolean,
  flammability: String,
  width: String,
  colour: String,
  transparency: String,
  acoustic: String,
  categories: String,
  lightfastness: String,
  pattern: String,
  washable: String,
  composition: String,
  turnable: String,
  metallised: String,
  environmental: String,
  inStock: String,
  pilling: String,
  fabricName: String,
  environmentalDesign: String,
  sortBy: String,
  flammabilityOptions: Array,
  widthOptions: Array,
  colourOptions: Array,
  transparencyOptions: Array,
  acousticOptions: Array,
  categoriesOptions: Array,
  lightfastnessOptions: Array,
  patternOptions: Array,
  washableOptions: Array,
  compositionOptions: Array,
  turnableOptions: Array,
  metallisedOptions: Array,
  environmentalOptions: Array,
  inStockOptions: Array,
  pillingOptions: Array,
  fabricNameOptions: Array,
  environmentalDesignOptions: Array,
  sortByOptions: Array,
})

// Emits
const emit = defineEmits(['close', 'apply-filters'])

// Local filter state
const localFlammability = ref(props.flammability)
const localWidth = ref(props.width)
const localColour = ref(props.colour)
const localTransparency = ref(props.transparency)
const localAcoustic = ref(props.acoustic)
const localCategories = ref(props.categories)
const localLightfastness = ref(props.lightfastness)
const localPattern = ref(props.pattern)
const localWashable = ref(props.washable)
const localComposition = ref(props.composition)
const localTurnable = ref(props.turnable)
const localMetallised = ref(props.metallised)
const localEnvironmental = ref(props.environmental)
const localInStock = ref(props.inStock)
const localPilling = ref(props.pilling)
const localFabricName = ref(props.fabricName)
const localEnvironmentalDesign = ref(props.environmentalDesign)
const localSortBy = ref(props.sortBy)

// Reset values when drawer opens
watch(() => props.open, (val) => {
  if (val) {
    localFlammability.value = props.flammability
    localWidth.value = props.width
    localColour.value = props.colour
    localTransparency.value = props.transparency
    localAcoustic.value = props.acoustic
    localCategories.value = props.categories
    localLightfastness.value = props.lightfastness
    localPattern.value = props.pattern
    localWashable.value = props.washable
    localComposition.value = props.composition
    localTurnable.value = props.turnable
    localMetallised.value = props.metallised
    localEnvironmental.value = props.environmental
    localInStock.value = props.inStock
    localPilling.value = props.pilling
    localFabricName.value = props.fabricName
    localEnvironmentalDesign.value = props.environmentalDesign
    localSortBy.value = props.sortBy
  }
})

// Apply filters
function applyFilters() {
  emit('apply-filters', {
    flammability: localFlammability.value,
    width: localWidth.value,
    colour: localColour.value,
    transparency: localTransparency.value,
    acoustic: localAcoustic.value,
    categories: localCategories.value,
    lightfastness: localLightfastness.value,
    pattern: localPattern.value,
    washable: localWashable.value,
    composition: localComposition.value,
    turnable: localTurnable.value,
    metallised: localMetallised.value,
    environmental: localMetallised.value,
    inStock: localInStock.value,
    pilling: localPilling.value,
    fabricName: localFabricName.value,
    environmentalDesign: localEnvironmentalDesign.value,
    sortBy: localSortBy.value,
  })
  emit('close')
}

function resetFilters() {
  // Clear local values
  localFlammability.value = ''
  localWidth.value = ''
  localColour.value = ''
  localTransparency.value = ''
  localAcoustic.value = ''
  localCategories.value = ''
  localLightfastness.value = ''
  localPattern.value = ''
  localWashable.value = ''
  localComposition.value = ''
  localTurnable.value = ''
  localMetallised.value = ''
  localEnvironmental.value = ''
  localInStock.value = ''
  localPilling.value = ''
  localFabricName.value = ''
  localEnvironmentalDesign.value = ''
  localSortBy.value = ''

  emit('apply-filters', {
    flammability: '',
    width: '',
    colour: '',
    transparency: '',
    acoustic: '',
    categories: '',
    lightfastness: '',
    pattern: '',
    washable: '',
    composition: '',
    turnable: '',
    metallised: '',
    environmental: '',
    inStock: '',
    pilling: '',
    fabricName: '',
    environmentalDesign: '',
    sortBy: '',
  })
  emit('close')
}

</script>
<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #EDEBE7; /* light background */
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #C9C7C5; /* muted gray-brown */
  border-radius: 10px;
}
</style>
