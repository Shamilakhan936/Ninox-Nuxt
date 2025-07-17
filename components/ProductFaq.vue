<template>
  <div>
    <div v-for="(item, idx) in items" :key="idx" class="border-t pt-6 pb-6 " style=" border: 1px solid #00000033]">
      <button
        class="w-full flex justify-between items-center focus:outline-none"
        @click="toggle(idx)"
      >
        <h2 class="text-xl font-light text-black uppercase">{{ item.title }}</h2>
        <svg :class="[openIndex === idx ? 'rotate-180' : '', 'transition-transform']" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#8A7C59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div v-if="openIndex === idx" class="text-[#3D3935] text-sm leading-relaxed mb-2 mt-6" v-html="item.content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { title: 'product information', content: 'Details about production info go here.' },
      { title: 'important characteristics', content: 'Details about characteristics and returns go here.' },
      { title: 'Other', content: 'Details about Other instructions go here.' }
    ]
  }
})

const openIndex = ref(null)
const toggle = idx => {
  openIndex.value = openIndex.value === idx ? null : idx
}
</script> 
<style scoped>
.text-xl {
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 1px;
}
</style>