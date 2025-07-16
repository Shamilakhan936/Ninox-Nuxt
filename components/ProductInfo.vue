<template>
  <div class="flex flex-col md:flex-row  overflow-hidden mx-auto">
    <!-- Left: Image and Description -->
    <div class="flex flex-col items-center md:items-start md:w-[732px] w-full ">
      <img :src="image" alt="Product Image" class="md:w-[732px] md:h-[732px] object-cover" />
      <div class="w-full mt-6">
      
        <p class="text-[#848484] font-normal text-xs mb-[10px]">{{ description }}</p>
      </div>
    </div>
    <!-- Right: Name and Variants -->
    <div class="flex-1 flex flex-col px-8">
      <h2 class="text-xl font-light text-black  mb-6 w-[516px]">{{ name }}</h2>
      <div class="flex mb-6">
       
        <div class="flex flex-wrap gap-2" style="max-width: calc(7 * 3rem + 6 * 0.5rem);">
          <div
            v-for="variant in variants"
            :key="variant.value"
            class="flex flex-col items-center"
          >
            <div
              class="w-12 h-12 flex items-center justify-center   bg-[#D9D9D9] cursor-pointer hover:border-[#8A7C59] transition"
            ></div>
            <span class="text-xs text-[#3D3935] font-light mt-1">{{ variant.label }}</span>
            <div class="w-8 h-px bg-[#8A7C59] "></div>
          </div>
        </div>
      </div>
      <div>
        <p class="text-black text-sm font-normal">Please <button class="border-b border-[#8A7C59]">
            <a href="/login">login</a>
            </button> or <button class="border-b border-[#8A7C59]">
            <a href="/login">request access</a>
            </button> to place a commercial order.</p>
      </div>
       <div class="mt-8">
        <p class="text-black font-medium text-[14px] leading-4">Non-commercial buyer?</p>
        <p class="text-black text-sm font-normal mt-2">Go to the <button class="border-b border-[#8A7C59]">
            <a href="/login">storefinder</a>
            </button> to find a store near you. </p>
      </div>
      <ProductFaq :items="faqItems" class="mt-10" />
    </div>
  </div>
</template>

<script setup>
import ProductFaq from './ProductFaq.vue'
import { computed } from 'vue'

defineProps({
  image: String,
  name: String,
  description: String,
  variants: Array // [{label, value}]
})

const faqItems = [
  {
    title: 'product information',
    content: `
      <div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Category:</span> <span class="text-[#6F6259] font-light text-sm">Curtains</span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Composition:</span> <span class="text-[#6F6259] font-light text-sm">100% Trevira CS</span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Roll Width:</span> <span class="text-[#6F6259] font-light text-sm">295cm (116”)</span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Weight:</span> <span class="text-[#6F6259] font-light text-sm">289 g/lin. m  |  190 g/m2</span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Turnable:</span> <span class="text-[#6F6259] font-light text-sm">Yes</span></div>
      </div>
    `
  },
  {
    title: 'important characteristics',
    content: `
      <div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Lightfastness:</span> <span class="text-[#6F6259] font-light text-sm flex items-center gap-2">5 (ISO 1-8) <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 9C6.17 9 6.3126 8.9424 6.4278 8.8272C6.543 8.712 6.6004 8.5696 6.6 8.4V6C6.6 5.83 6.5424 5.6876 6.4272 5.5728C6.312 5.458 6.1696 5.4004 6 5.4C5.8304 5.3996 5.688 5.4572 5.5728 5.5728C5.4576 5.6884 5.4 5.8308 5.4 6V8.4C5.4 8.57 5.4576 8.7126 5.5728 8.8278C5.688 8.943 5.8304 9.0004 6 9ZM6 4.2C6.17 4.2 6.3126 4.1424 6.4278 4.0272C6.543 3.912 6.6004 3.7696 6.6 3.6C6.5996 3.4304 6.542 3.288 6.4272 3.1728C6.3124 3.0576 6.17 3 6 3C5.83 3 5.6876 3.0576 5.5728 3.1728C5.458 3.288 5.4004 3.4304 5.4 3.6C5.3996 3.7696 5.4572 3.9122 5.5728 4.0278C5.6884 4.1434 5.8308 4.2008 6 4.2ZM6 12C5.17 12 4.39 11.8424 3.66 11.5272C2.93 11.212 2.295 10.7846 1.755 10.245C1.215 9.7054 0.7876 9.0704 0.4728 8.34C0.158001 7.6096 0.000400759 6.8296 7.59493e-07 6C-0.00039924 5.1704 0.157201 4.3904 0.4728 3.66C0.7884 2.9296 1.2158 2.2946 1.755 1.755C2.2942 1.2154 2.9292 0.788 3.66 0.4728C4.3908 0.1576 5.1708 0 6 0C6.8292 0 7.6092 0.1576 8.33999 0.4728C9.07079 0.788 9.7058 1.2154 10.245 1.755C10.7842 2.2946 11.2118 2.9296 11.5278 3.66C11.8438 4.3904 12.0012 5.1704 12 6C11.9988 6.8296 11.8412 7.6096 11.5272 8.34C11.2132 9.0704 10.7858 9.7054 10.245 10.245C9.7042 10.7846 9.06919 11.2122 8.33999 11.5278C7.6108 11.8434 6.8308 12.0008 6 12ZM6 10.8C7.34 10.8 8.47499 10.335 9.40499 9.405C10.335 8.475 10.8 7.34 10.8 6C10.8 4.66 10.335 3.525 9.40499 2.595C8.47499 1.665 7.34 1.2 6 1.2C4.66 1.2 3.525 1.665 2.595 2.595C1.665 3.525 1.2 4.66 1.2 6C1.2 7.34 1.665 8.475 2.595 9.405C3.525 10.335 4.66 10.8 6 10.8Z" fill="#BFB7B0"/>
            </svg></span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Fire Resistant:</span> <span class="text-[#6F6259] font-light text-sm flex items-center gap-2">Yes <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 9C6.17 9 6.3126 8.9424 6.4278 8.8272C6.543 8.712 6.6004 8.5696 6.6 8.4V6C6.6 5.83 6.5424 5.6876 6.4272 5.5728C6.312 5.458 6.1696 5.4004 6 5.4C5.8304 5.3996 5.688 5.4572 5.5728 5.5728C5.4576 5.6884 5.4 5.8308 5.4 6V8.4C5.4 8.57 5.4576 8.7126 5.5728 8.8278C5.688 8.943 5.8304 9.0004 6 9ZM6 4.2C6.17 4.2 6.3126 4.1424 6.4278 4.0272C6.543 3.912 6.6004 3.7696 6.6 3.6C6.5996 3.4304 6.542 3.288 6.4272 3.1728C6.3124 3.0576 6.17 3 6 3C5.83 3 5.6876 3.0576 5.5728 3.1728C5.458 3.288 5.4004 3.4304 5.4 3.6C5.3996 3.7696 5.4572 3.9122 5.5728 4.0278C5.6884 4.1434 5.8308 4.2008 6 4.2ZM6 12C5.17 12 4.39 11.8424 3.66 11.5272C2.93 11.212 2.295 10.7846 1.755 10.245C1.215 9.7054 0.7876 9.0704 0.4728 8.34C0.158001 7.6096 0.000400759 6.8296 7.59493e-07 6C-0.00039924 5.1704 0.157201 4.3904 0.4728 3.66C0.7884 2.9296 1.2158 2.2946 1.755 1.755C2.2942 1.2154 2.9292 0.788 3.66 0.4728C4.3908 0.1576 5.1708 0 6 0C6.8292 0 7.6092 0.1576 8.33999 0.4728C9.07079 0.788 9.7058 1.2154 10.245 1.755C10.7842 2.2946 11.2118 2.9296 11.5278 3.66C11.8438 4.3904 12.0012 5.1704 12 6C11.9988 6.8296 11.8412 7.6096 11.5272 8.34C11.2132 9.0704 10.7858 9.7054 10.245 10.245C9.7042 10.7846 9.06919 11.2122 8.33999 11.5278C7.6108 11.8434 6.8308 12.0008 6 12ZM6 10.8C7.34 10.8 8.47499 10.335 9.40499 9.405C10.335 8.475 10.8 7.34 10.8 6C10.8 4.66 10.335 3.525 9.40499 2.595C8.47499 1.665 7.34 1.2 6 1.2C4.66 1.2 3.525 1.665 2.595 2.595C1.665 3.525 1.2 4.66 1.2 6C1.2 7.34 1.665 8.475 2.595 9.405C3.525 10.335 4.66 10.8 6 10.8Z" fill="#BFB7B0"/>
            </svg></span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Acoustic:</span> <span class="text-[#6F6259] font-light text-sm flex items-center gap-2">0.35/Class D (flat)  |  o.65/Class C (folded) <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 9C6.17 9 6.3126 8.9424 6.4278 8.8272C6.543 8.712 6.6004 8.5696 6.6 8.4V6C6.6 5.83 6.5424 5.6876 6.4272 5.5728C6.312 5.458 6.1696 5.4004 6 5.4C5.8304 5.3996 5.688 5.4572 5.5728 5.5728C5.4576 5.6884 5.4 5.8308 5.4 6V8.4C5.4 8.57 5.4576 8.7126 5.5728 8.8278C5.688 8.943 5.8304 9.0004 6 9ZM6 4.2C6.17 4.2 6.3126 4.1424 6.4278 4.0272C6.543 3.912 6.6004 3.7696 6.6 3.6C6.5996 3.4304 6.542 3.288 6.4272 3.1728C6.3124 3.0576 6.17 3 6 3C5.83 3 5.6876 3.0576 5.5728 3.1728C5.458 3.288 5.4004 3.4304 5.4 3.6C5.3996 3.7696 5.4572 3.9122 5.5728 4.0278C5.6884 4.1434 5.8308 4.2008 6 4.2ZM6 12C5.17 12 4.39 11.8424 3.66 11.5272C2.93 11.212 2.295 10.7846 1.755 10.245C1.215 9.7054 0.7876 9.0704 0.4728 8.34C0.158001 7.6096 0.000400759 6.8296 7.59493e-07 6C-0.00039924 5.1704 0.157201 4.3904 0.4728 3.66C0.7884 2.9296 1.2158 2.2946 1.755 1.755C2.2942 1.2154 2.9292 0.788 3.66 0.4728C4.3908 0.1576 5.1708 0 6 0C6.8292 0 7.6092 0.1576 8.33999 0.4728C9.07079 0.788 9.7058 1.2154 10.245 1.755C10.7842 2.2946 11.2118 2.9296 11.5278 3.66C11.8438 4.3904 12.0012 5.1704 12 6C11.9988 6.8296 11.8412 7.6096 11.5272 8.34C11.2132 9.0704 10.7858 9.7054 10.245 10.245C9.7042 10.7846 9.06919 11.2122 8.33999 11.5278C7.6108 11.8434 6.8308 12.0008 6 12ZM6 10.8C7.34 10.8 8.47499 10.335 9.40499 9.405C10.335 8.475 10.8 7.34 10.8 6C10.8 4.66 10.335 3.525 9.40499 2.595C8.47499 1.665 7.34 1.2 6 1.2C4.66 1.2 3.525 1.665 2.595 2.595C1.665 3.525 1.2 4.66 1.2 6C1.2 7.34 1.665 8.475 2.595 9.405C3.525 10.335 4.66 10.8 6 10.8Z" fill="#BFB7B0"/>
            </svg></span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Transparency:</span> <span class="text-[#6F6259] font-light text-sm flex items-center gap-2">Dense <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 9C6.17 9 6.3126 8.9424 6.4278 8.8272C6.543 8.712 6.6004 8.5696 6.6 8.4V6C6.6 5.83 6.5424 5.6876 6.4272 5.5728C6.312 5.458 6.1696 5.4004 6 5.4C5.8304 5.3996 5.688 5.4572 5.5728 5.5728C5.4576 5.6884 5.4 5.8308 5.4 6V8.4C5.4 8.57 5.4576 8.7126 5.5728 8.8278C5.688 8.943 5.8304 9.0004 6 9ZM6 4.2C6.17 4.2 6.3126 4.1424 6.4278 4.0272C6.543 3.912 6.6004 3.7696 6.6 3.6C6.5996 3.4304 6.542 3.288 6.4272 3.1728C6.3124 3.0576 6.17 3 6 3C5.83 3 5.6876 3.0576 5.5728 3.1728C5.458 3.288 5.4004 3.4304 5.4 3.6C5.3996 3.7696 5.4572 3.9122 5.5728 4.0278C5.6884 4.1434 5.8308 4.2008 6 4.2ZM6 12C5.17 12 4.39 11.8424 3.66 11.5272C2.93 11.212 2.295 10.7846 1.755 10.245C1.215 9.7054 0.7876 9.0704 0.4728 8.34C0.158001 7.6096 0.000400759 6.8296 7.59493e-07 6C-0.00039924 5.1704 0.157201 4.3904 0.4728 3.66C0.7884 2.9296 1.2158 2.2946 1.755 1.755C2.2942 1.2154 2.9292 0.788 3.66 0.4728C4.3908 0.1576 5.1708 0 6 0C6.8292 0 7.6092 0.1576 8.33999 0.4728C9.07079 0.788 9.7058 1.2154 10.245 1.755C10.7842 2.2946 11.2118 2.9296 11.5278 3.66C11.8438 4.3904 12.0012 5.1704 12 6C11.9988 6.8296 11.8412 7.6096 11.5272 8.34C11.2132 9.0704 10.7858 9.7054 10.245 10.245C9.7042 10.7846 9.06919 11.2122 8.33999 11.5278C7.6108 11.8434 6.8308 12.0008 6 12ZM6 10.8C7.34 10.8 8.47499 10.335 9.40499 9.405C10.335 8.475 10.8 7.34 10.8 6C10.8 4.66 10.335 3.525 9.40499 2.595C8.47499 1.665 7.34 1.2 6 1.2C4.66 1.2 3.525 1.665 2.595 2.595C1.665 3.525 1.2 4.66 1.2 6C1.2 7.34 1.665 8.475 2.595 9.405C3.525 10.335 4.66 10.8 6 10.8Z" fill="#BFB7B0"/>
          </svg></span></div>       
        </div>
    `
  },
  {
    title: 'Other',
    content: `
      <div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Produced in:</span> <span class="text-[#6F6259] font-light text-sm">Poland</span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Warranty:</span> <span class="text-[#6F6259] font-light text-sm">10 years</span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Roll length:</span> <span class="text-[#6F6259] font-light text-sm">Approx. 30 metres</span></div>
        <div class="flex py-1 faq"><span class="font-medium text-[#6F6259] text-base w-[350px]">Cleaning and Care:</span> <span class="text-[#6F6259] font-light text-sm ">Wash at max. 60°C/ 140°F, mild process <br>
        Do not bleach <br>
            Do not tumble dry <br>
          Iron at low temperature (max. 110°C) <br>
        Professional dry cleaning</span></div>

      </div>
    `
  }
]
</script> 
<style scoped>
.text-xl {
  font-size : 44px !important;
  line-height: 54px !important;
}
.text-xs {
  font-size : 12px !important;
  line-height: 16px !important;
  font-weight: 400 !important;
}
.text-sm {
  font-size : 14px !important;
  line-height: 16px !important;
  font-weight: 400 !important;
}
.faq .text-base {
  font-size: 14px !important;
  line-height: 24px !important;
}
.faq .text-sm {
 font-size: 14px !important;
  line-height: 24px !important;
}
</style>
