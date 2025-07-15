<template>
  <div class="min-h-screen" style="background-color: #ffffff">
    <div class="container mx-auto py-8 py-[90px] px-4 sm:px-6 lg:px-8">
      <Breadcrumb :items="['Crastino', 'Products', 'Curtains']" />
      <div class="flex flex-wrap items-center justify-between mb-6 mt-8 px-[0px] max-w-full">
        <div class="flex flex-wrap items-center gap-4">
          <BaseSelectProduct
            v-model="selectedFlammability"
            :options="flammabilityOptions"
            class="w-48"
          />
          <BaseSelectProduct
            v-model="selectedWidth"
            :options="widthOptions"
            class="w-48"
          />
          <BaseSelectProduct
            v-model="selectedColour"
            :options="colourOptions"
            class="w-48"
          />
          <BaseSelectProduct
            v-model="selectedTransparency"
            :options="transparencyOptions"
            class="w-48"
          />
        </div>
        <div class="flex items-center gap-6">
          <AllFiltersButton class="w-auto" @open-filters="showFiltersModal = true" />
          <p class="text-black text-xs font-normal">299 Products</p>
        </div>
      </div>
     <AllFiltersModal
      :open="showFiltersModal"
      :flammability="selectedFlammability"
      :width="selectedWidth"
      :colour="selectedColour"
      :transparency="selectedTransparency"
      :acoustic="selectedAcoustic"
      :categories="selectedCategories"
      :lightfastness="selectedLightfastness"
      :pattern="selectedPattern"
      :washable="selectedWashable"
      :composition="selectedComposition"
      :turnable="selectedTurnable"
      :metallised="selectedMetallised"
      :environmental="selectedEnvironmental"

      :inStock="selectedInStock"
      :pilling="selectedPilling"
      :fabricName="selectedFabricName"
      :environmentalDesign="selectedEnvironmentalDesign"
      :sortBy="selectedSortBy"

      :flammabilityOptions="flammabilityOptions"
      :widthOptions="widthOptions"
      :colourOptions="colourOptions"
      :transparencyOptions="transparencyOptions"
      :acousticOptions="acousticOptions"
      :categoriesOptions="categoriesOptions"
      :lightfastnessOptions="lightfastnessOptions"
      :patternOptions="patternOptions"
      :washableOptions="washableOptions"
      :compositionOptions="compositionOptions"
      :turnableOptions="turnableOptions"
      :metallisedOptions="metallisedOptions"
      :environmentalOptions="environmentalOptions"
      :inStockOptions="inStockOptions"
      :pillingOptions="pillingOptions"
      :fabricNameOptions="fabricNameOptions"
      :environmentalDesignOptions="environmentalDesignOptions"
      :sortByOptions="sortByOptions"
      @close="showFiltersModal = false"
      @apply-filters="applyFilters"
    />

      <!-- Product Cards Grid -->
      <div class="grid grid-cols-4 gap-6 mt-8">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :image="product.image"
          :name="product.name"
          :price="product.price"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import NextArrow from "~/assets/icons/NextArrow.vue";
import BaseSelectProduct from '@/components/BaseSelectProduct.vue'
import AllFiltersButton from '@/components/AllFiltersButton.vue'
import AllFiltersModal from '@/components/AllFiltersModal.vue'
import ProductCard from '@/components/ProductCard.vue'

// Options for each selector with label as default option
const flammabilityOptions = [
  { label: 'Flammability', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]
const widthOptions = [
  { label: 'Width', value: '' },
  { label: '100cm', value: '100' },
  { label: '150cm', value: '150' },
  { label: '200cm', value: '200' }
]
const colourOptions = [
  { label: 'Colour', value: '' },
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' }
]
const transparencyOptions = [
  { label: 'Transparency', value: '' },
  { label: 'Opaque', value: 'opaque' },
  { label: 'Semi-transparent', value: 'semi' },
  { label: 'Transparent', value: 'transparent' }
]
const acousticOptions = [
  { label: 'Acoustic', value: '' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
]
const categoriesOptions = [
  { label: 'Categories', value: '' },
  { label: 'Curtains', value: 'curtains' },
  { label: 'Blinds', value: 'blinds' },
  { label: 'Shades', value: 'shades' }
]
const lightfastnessOptions = [
  { label: 'Lightfastness', value: '' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]
const patternOptions = [
  { label: 'Pattern', value: '' },
  { label: 'Solid', value: 'solid' },
  { label: 'Striped', value: 'striped' },
  { label: 'Floral', value: 'floral' }
]
const washableOptions = [
  { label: 'Washable', value: '' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
]
const compositionOptions = [
  { label: 'Composition', value: '' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Polyester', value: 'polyester' },
  { label: 'Blend', value: 'blend' }
]
const turnableOptions = [
  { label: 'Turnable', value: '' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
]
const metallisedOptions = [
  { label: 'Metallised', value: '' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
]
const environmentalOptions = [
  { label: 'Environmental', value: '' },
  { label: 'Recycled', value: 'recycled' },
  { label: 'Organic', value: 'organic' },
  { label: 'Low Emission', value: 'low-emission' }
]
const inStockOptions = [
  { label: 'In-Stock', value: '' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const pillingOptions = [
  { label: 'Pilling', value: '' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const fabricNameOptions = [
  { label: 'Fabric Name', value: '' },
  { label: 'Fabric A', value: 'fabric-a' },
  { label: 'Fabric B', value: 'fabric-b' },
]

const environmentalDesignOptions = [
  { label: 'Environmental Design', value: '' },
  { label: 'Sustainable', value: 'sustainable' },
  { label: 'Eco Certified', value: 'eco' },
]

const sortByOptions = [
  { label: 'Sort by (1)', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

// State for selected values
const selectedFlammability = ref('')
const selectedWidth = ref('')
const selectedColour = ref('')
const selectedTransparency = ref('')
const selectedAcoustic = ref('')
const selectedCategories = ref('')
const selectedLightfastness = ref('')
const selectedPattern = ref('')
const selectedWashable = ref('')
const selectedComposition = ref('')
const selectedTurnable = ref('')
const selectedMetallised = ref('')
const selectedEnvironmental = ref('')
const selectedInStock = ref('')
const selectedPilling = ref('')
const selectedFabricName = ref('')
const selectedEnvironmentalDesign = ref('')
const selectedSortBy = ref('')

const showFiltersModal = ref(false)

function applyFilters(filters) {
  selectedFlammability.value = filters.flammability
  selectedWidth.value = filters.width
  selectedColour.value = filters.colour
  selectedTransparency.value = filters.transparency
  selectedAcoustic.value = filters.acoustic
  selectedCategories.value = filters.categories
  selectedLightfastness.value = filters.lightfastness
  selectedPattern.value = filters.pattern
  selectedWashable.value = filters.washable
  selectedComposition.value = filters.composition
  selectedTurnable.value = filters.turnable
  selectedMetallised.value = filters.metallised
  selectedEnvironmental.value = filters.environmental
  selectedInStock.value = filters.inStock
  selectedPilling.value = filters.pilling
  selectedFabricName.value = filters.fabricName
  selectedEnvironmentalDesign.value = filters.environmentalDesign
  selectedSortBy.value = filters.sortBy


   showFiltersModal.value = false 
}

// Example static products array (replace with backend data in future)
const products = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
  },
])
</script>

<style scoped>
/* Import Albert Sans font */
@import url("https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap");

.min-h-screen {
  font-family: "Albert Sans", sans-serif;
}
</style>
