<template>
  <div class="min-h-screen bg-white py-12">
    <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumb :items="['Products','Crastino',  product.name]" class="mb-8" />
      <ProductInfo
        :image="product.image"
        :name="product.name"
        :description="product.description || 'This is a sample product description. Add more details here.'"
        :variants="product.variants || [
          { label: 'A', value: '001' },
          { label: 'B', value: '002' },
          { label: 'C', value: '003' },
     
        ]"
      />
    </div>
    <div v-else class="text-center text-gray-500 text-xl mt-20">Product not found.</div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ProductInfo from '@/components/ProductInfo.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

// Static products array (same as in products.vue)
const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 3%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order..',
    variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 4%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order..',
    variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 5%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order..',
    variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 6%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order..',
    variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 7%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order..',
   variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 8%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order..',
     variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 9%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order..',
    variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    name: 'Screen Essential 1000 Series 10%',
    price: '250 cm/98 in',
    description: '*Please keep in mind that colours can look different on screen. To ensure the best match, we recommend requesting samples before you order.',
    variants: [
      { value: 'A', label: '001' },
      { value: 'B', label: '002' },
      { value: 'C', label: '003' },
      { value: 'D', label: '004' },
      { value: 'E', label: '005' },
      { value: 'F', label: '006' },
      { value: 'G', label: '007' },
      { value: 'H', label: '008' },
       { value: 'I', label: '009' },
    ]
  },
]

const route = useRoute()
const productId = computed(() => Number(route.params.id))
const product = computed(() => products.find(p => p.id === productId.value))
</script> 