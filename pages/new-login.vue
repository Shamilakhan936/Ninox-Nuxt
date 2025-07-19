<template>
  <div class=" bg-white  flex flex-col justify-center py-28 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-light text-[#2D1713]">
        Login
      </h2>
      <p class="mt-2 text-center text-sm text-[#6F6259] font-normal text-base ">
Our portal gives you instant access to sample orders, certificate downloads, and more — all just a click away.      </p>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white  py-8 px-4  sm:px-10">
        <form class="space-y-6">
          <div class="flex flex-col">
            <BaseInput
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Please enter"
              v-model="email"
              class="w-full"
              :vertical="true"
                    labelClass="text-sm font-light uppercase"
              
            />
          </div>
          <div class="flex flex-col">
            <BaseInput
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Please enter"
              v-model="password"
              class="w-full"
              :vertical="true"
                    labelClass="text-sm font-light uppercase"
            />
          </div>
          <div class="flex justify-center "> 
            <button type="submit" class=" flex justify-center py-4 px-5  mt-6 rounded-full  text-xs font-normal text-white bg-[#8A7C59] uppercase">
              Sign in
            </button>
          </div>
          <div class="pt-6 flex justify-center       ">
            <button type="button" class=" flex justify-center pb-0 pt-2 px-4 border-b border-[#8A7C59]  text-xs font-light text-[#3D3935] uppercase" @click="navigateTo('/registeration')">
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'

definePageMeta({
  title: 'Login'
})

const email = ref('')
const password = ref('')
</script> 