<template>
  <div class="ml-[86px]">
    <div class="mb-[90px]">
      <h2 class="text-3xl font-light mb-6 text-[#2D1713]">
        Credit Notes History
      </h2>
      <p class="text-base font-normal text-[#6F6259] leading-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
        molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
        fringilla accumsan, risus. sem sollicitudin lacus, ut interdum tellus
        elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
        lectus.
      </p>
    </div>

    <CreditsSearchForm
      :fields="searchFields"
      button-label="Search"
      @submit="handleSearch"
    />

    <div>
      <h3 class="text-3xl font-light mb-4 text-[#2D1713]">
        Recent Credit Notes
      </h3>
      <CreditTable :credits="dummyCredits" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "account-section" });

import CreditsSearchForm from "~/components/SearchForm.vue";
import CreditTable from "~/components/CreditTable.vue";
const searchFields = [
  { key: "document", label: "Document no", type: "text", placeholder: "#" },
  { key: "from", label: "From", type: "date" },
  { key: "to", label: "To", type: "date" },
];

const handleSearch = (formValues) => {
  console.log("Search submitted with values:", formValues);
};
const dummyCredits = Array.from({ length: 10 }, () => ({
  document: "VF–2508227",
  date: "27/05/2025",
  billedTo: "Diddo ef.",
  total: "314,56",
  outstanding: "314,56",
}));
</script>
