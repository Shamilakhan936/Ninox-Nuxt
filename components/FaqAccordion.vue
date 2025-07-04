<template>
    <div class=" mx-auto md:mt-20">
      <h2 class="text-3xl font-light mb-10 text-[#2D1713]">FAQ</h2>
      <div v-for="(item, idx) in faqs" :key="idx" class="mb-4">
        <div
          :class="[
            activeIndex === idx
              ? 'rounded-3xl border border-[#8A7C59] shadow-sm py-3'
              : 'rounded-full border border-[#E2E1E1] py-4',
            'bg-white transition-all duration-200'
          ]"
        >
          <button
            @click="toggle(idx)"
            class="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
          >
            <span class="text-base font-normal text-[#3D3935]">
              {{ item.question }}
            </span>
            <span
              :class="[
                'flex items-center justify-center rounded-full w-7 h-7 transition-all duration-200',
                activeIndex === idx
                  ? 'bg-[#8A7C59] text-[#ffff] rotate-180'
                  : 'bg-[#6F6259] text-[#ffff]'
              ]"
            >
              <svg v-if="activeIndex !== idx" width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity="0.1"/>
                <path d="M10 6v8M6 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity="0.1"/>
                <path d="M6 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
          </button>
          <transition name="fade">
            <div
              v-if="activeIndex === idx"
              class="px-6 pb-5 pt-0 font-normal text-[#6F6259] text-sm "
            >
              {{ item.answer }}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const faqs = [
    {
      question: 'Where can I report complaints?',
      answer: 'You can report complaints through the complaints section in your account dashboard.'
    },
    {
      question: 'How can I see the status of my complaints?',
      answer: 'You can view the status of your complaints in the complaints section after logging in.'
    },
    {
      question: 'Where can I find my credits?',
      answer: 'Your credits are listed in the credits section of your account dashboard.'
    },
    {
      question: 'What type of product warranty do you have?',
      answer:
        'All products carry a limited lifetime warranty. We will repair or replace any product due to workroom error so long as the product is not misused and abused. Replacement must be for the same window as the original order.'
    }
  ]
  
  const activeIndex = ref(3) 
  
  function toggle(idx) {
    activeIndex.value = activeIndex.value === idx ? null : idx
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: all 0.2s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    max-height: 0;
  }
  .fade-enter-to, .fade-leave-from {
    opacity: 1;
    max-height: 200px;
  }
  </style>