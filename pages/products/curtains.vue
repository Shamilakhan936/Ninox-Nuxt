<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto py-8 py-[90px] px-4 sm:px-6 lg:px-8">
      <Breadcrumb :items="[{label:'Crastino', to: '/'}, {label:'Products'}, {label:'Curtains'}]" />
      <div class="flex flex-wrap items-center justify-between mt-8 px-[0px] max-w-full">
        <div class="flex flex-wrap items-center gap-6">
          <CrastinoDropdown
            v-model="selectedFlammability"
            :options="filters.flammability"
            placeholder="Flammability"
            class="w-48"
          />
          <CrastinoDropdown
            v-model="selectedWidth"
            :options="filters.width"
            placeholder="Width"
            class="w-48"
          />
          <CrastinoDropdown
            v-model="selectedColour"
            :options="filters.colour"
            placeholder="Colour"
            class="w-48"
          />
          <CrastinoDropdown
            v-model="selectedTransparency"
            :options="filters.transparency"
            placeholder="Transparency"
            class="w-48"
          />
        </div>
        <div class="flex items-center gap-6 md:mt-0 mt-4">
          <AllFiltersButton class="w-auto" @open-filters="showFiltersModal = true" />
          <p class="text-black text-xs font-normal">299 Products</p>
        </div>
      </div>
      <AllFiltersModal
        :open="showFiltersModal"
        :filters="filters"
        :values="filterValues"
        @apply-filters="applyFilters"
        @close="showFiltersModal = false"
      />

      <div class="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="cursor-pointer"
        >
          <ProductCard
            :image="product.image"
            :name="product.name"
            :price="product.price"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import CrastinoDropdown from '@/components/CrastinoDropdown.vue'
import AllFiltersButton from '@/components/AllFiltersButton.vue'
import AllFiltersModal from '@/components/AllFiltersModal.vue'
import ProductCard from '@/components/ProductCard.vue'

const filters = {
  flammability: [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ],
  width: [
    { label: '100cm', value: '100' },
    { label: '150cm', value: '150' },
    { label: '200cm', value: '200' }
  ],
  colour: [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' }
  ],
  transparency: [
    { label: 'Opaque', value: 'opaque' },
    { label: 'Semi-transparent', value: 'semi' },
    { label: 'Transparent', value: 'transparent' }
  ],
  acoustic: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ],
  categories: [
    { label: 'Curtains', value: 'curtains' },
    { label: 'Blinds', value: 'blinds' },
    { label: 'Shades', value: 'shades' }
  ],
  lightfastness: [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ],
  pattern: [
    { label: 'Solid', value: 'solid' },
    { label: 'Striped', value: 'striped' },
    { label: 'Floral', value: 'floral' }
  ],
  washable: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ],
  composition: [
    { label: 'Cotton', value: 'cotton' },
    { label: 'Polyester', value: 'polyester' },
    { label: 'Blend', value: 'blend' }
  ],
  turnable: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ],
  metallised: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ],
  environmental: [
    { label: 'Recycled', value: 'recycled' },
    { label: 'Organic', value: 'organic' },
    { label: 'Low Emission', value: 'low-emission' }
  ],
  inStock: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ],
  pilling: [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ],
  fabricName: [
    { label: 'Fabric A', value: 'fabric-a' },
    { label: 'Fabric B', value: 'fabric-b' }
  ],
  environmentalDesign: [
    { label: 'Sustainable', value: 'sustainable' },
    { label: 'Eco Certified', value: 'eco' }
  ],
  sortBy: [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest', value: 'newest' }
  ]
}

const filterValues = ref(Object.fromEntries(Object.keys(filters).map(key => [key, ''])))
const showFiltersModal = ref(false)

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

function applyFilters(newValues) {
  Object.entries(newValues).forEach(([k, v]) => {
    if (k in filterValues.value) filterValues.value[k] = v
  })
  selectedFlammability.value = newValues.flammability
  selectedWidth.value = newValues.width
  selectedColour.value = newValues.colour
  selectedTransparency.value = newValues.transparency
  selectedAcoustic.value = newValues.acoustic
  selectedCategories.value = newValues.categories
  selectedLightfastness.value = newValues.lightfastness
  selectedPattern.value = newValues.pattern
  selectedWashable.value = newValues.washable
  selectedComposition.value = newValues.composition
  selectedTurnable.value = newValues.turnable
  selectedMetallised.value = newValues.metallised
  selectedEnvironmental.value = newValues.environmental
  selectedInStock.value = newValues.inStock
  selectedPilling.value = newValues.pilling
  selectedFabricName.value = newValues.fabricName
  selectedEnvironmentalDesign.value = newValues.environmentalDesign
  selectedSortBy.value = newValues.sortBy
  showFiltersModal.value = false
}

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
@import url("https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap");

.min-h-screen {
  font-family: "Albert Sans", sans-serif;
}
</style>
