<template>
  <div class="ml-[86px]">
    <div class="mb-[60px]">
      <h2 class="text-3xl font-light mb-6 text-[#2D1713]">My Complaints and Returns</h2>
      <p class="text-base font-normal text-[#6F6259] ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus. sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. 
      </p>
      <button
        type="button"
        class="bg-[#8A7C59] rounded-full uppercase text-white py-3 px-5 mt-8"
        @click="goToComplaintForm"
      >
       + Add complaint
      </button>
    </div>

    <ComplaintSearchBar/>

    <div>
      <h3 class="text-3xl font-light mb-4 text-[#2D1713]">Recent Complaints</h3>
      <ComplaintTable :complaints="dummyComplaints" />
    </div>
    <FaqAccordion/>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goToComplaintForm() {
  router.push('/account/complaintForm')
}

definePageMeta({ layout: "account-section" });

import ComplaintSearchBar from "~/components/ComplaintSearchBar.vue";
import ComplaintTable from "~/components/ComplaintTable.vue";

const handleSearch = (formValues) => {
  console.log("Search submitted with values:", formValues);
};
const dummyComplaints = Array.from({ length: 10 }, () => ({
  complaint: "VF–2508227",
  status: "27/05/2025",
  reported: "Diddo ef.",
  reference: "314,56",
  article: "314,56",
  reason: "314,56",
}));
</script>
