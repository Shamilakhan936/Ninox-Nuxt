<template>
  <div class=" bg-white  flex flex-col justify-center py-24 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-lg">
      <h2 class="mt-6 text-center text-3xl font-light text-[#2D1713]">
        Sign up to the Crastino Client Portal
      </h2>
      <p class="mt-2 text-center text-sm text-[#6F6259] font-normal text-base ">
Access our portal to quickly order samples, download certificates, and more. Complete the form below and we’ll contact you shortly.     </p>
    </div>
    <div class="mt-8 w-full sm:mx-auto sm:w-full sm:max-w-xl">
      <div class="bg-white  py-8 px-4  sm:px-10">
        <form class="space-y-6">
            <div>
 <div>
    <p class="text-base font-light uppercase  text-[#6F6259] mb-6"> customer Information</p>
           <BaseInput
  id="email"
  name="email"
  type="email"
  label="Email"
  placeholder="Please enter*"
  v-model="email"
  class="w-full"
  :vertical="true"
  labelClass="text-sm font-light"
/>

          </div>
          <div class="md:flex items-center gap-4 mt-6 ">
            <BaseInput
              id="firstname"
              name="firstname"
              type="text"
              label="First Name"
              placeholder="Please enter*"
              v-model="firstName"
              class="w-full md:mb-0 mb-4"
                :vertical="true"
                  labelClass="text-sm font-light"


            />
             <BaseInput
              id="lastname"
              name="lastname"
              type="text"
              label="Last Name"
              placeholder="Please enter*"
              v-model="lastName"
              class="w-full"
                :vertical="true"
                  labelClass="text-sm font-light"


            />
          </div>
            </div>
          <div>
 <div>
    <p class="text-base font-light uppercase  text-[#6F6259] mb-6"> Company Information</p>
            <BaseInput
              id="companyName"
              name="companyName"
              type="text"
              label="COMPANY NAME"
              placeholder="Please enter*"
              v-model="companyName"
              class="w-full"
                :vertical="true"
                  labelClass="text-sm font-light"


            />
          </div>
          <div class="md:flex items-center gap-4 mt-6">
            <div class="flex flex-col w-full">
              <BaseSelect
                id="country"
                name="country"
                label="COUNTRY"
                :options="countryOptions"
                placeholder="Please select"
                v-model="country"
                class="md:mb-0 mb-4"
                  :vertical="true"
                labelClass="text-sm font-light"
              />
            </div>
            <div class="flex flex-col w-full">
              <BaseInput
                id="zip"
                name="zip"
                type="text"
                label="ZIP"
                placeholder="Please enter*"
                v-model="zip"
                class="w-full"
                  :vertical="true"
                    labelClass="text-sm font-light"


              />
            </div>
          </div>
           <div class="flex  flex-col items-center gap-4 mt-6">
            <div class="flex flex-col w-full">
              <BaseInput
                id="vat"
                name="vat"
                type="text"
                label="VAT"
                placeholder="Please enter*"
                v-model="vat"
                class="w-full"
                  :vertical="true"
                    labelClass="text-sm font-light"


              />
            </div>
            <div class="flex flex-col w-full">
              <BaseInput
                id="tax"
                name="tax"
                type="text"
                label="TAX ID NUMBER"
                placeholder="Please enter*"
                v-model="zip"
                class="w-full"
                  :vertical="true"
                    labelClass="text-sm font-light"


              />
            </div>
          </div>
          <div>
            <BusinessTypeSelector v-model="lineOfBusiness" class="mt-10" />

          </div>
          <div class="flex flex-col w-full mt-4">
              <BaseInput
                id="comment"
                name="comment"
                type="text"
                label="COMMENTS"
                placeholder="Please enter*"
                v-model="comment"
                class="w-full"
                  :vertical="true"
                    labelClass="text-sm font-light"


              />
            </div>
            </div>
            <div class="text-center">
                <p class="text-[#848484] font-normal text-xs">Fields marked with an asterisk (*) are mandatory.</p>
            </div>
          <div class="flex justify-center "> 
            <button type="submit" class=" flex justify-center py-4 px-5  mt-6 rounded-full  text-xs font-normal text-white bg-[#8A7C59] uppercase">
             request access
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
import BaseSelect from '@/components/BaseSelect.vue'

definePageMeta({
  title: 'Register'
})

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const companyName = ref('')
const country = ref('')
const countryOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'India',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'China',
  'Japan',
  'Brazil',
  'South Africa'
]
const zip = ref('')
const vat = ref('')
const tax = ref('')
const comment = ref('')

</script> 