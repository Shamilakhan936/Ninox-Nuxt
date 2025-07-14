<template>
  <div class="ml-[86px]">
    <h1 class="text-3xl font-light mb-5 text-[#2D1713]">
      Create your Complaint
    </h1>
    <p class="text-base text-[#6F6259] mb-12 font-normal">
      Fields marked with an asterisk (*) are mandatory.
    </p>

    <form class="flex flex-col space-y-6">
      <BaseInput
        label="E-mail"
        v-model="form.email"
        placeholder="esraeliasson@gmail.com"
      />

      <BaseInput
        label="Your Complaint Reference"
        v-model="form.complaintReference"
        placeholder="Your Complaint Reference"
      />

      <BaseInput
        label="Article Number"
        v-model="form.articleNumber"
        placeholder="Article Number"
      />

      <BaseInput
        label="Your Article Reference"
        v-model="form.articleReference"
        placeholder="Your Article Reference"
      />

      <BaseSelect
        label="Complaint Reason"
        v-model="form.complaintReason"
        :options="reasons"
        placeholder="Complaint Reason"
      />

      <BaseTextarea
        label="Complaint Description"
        v-model="form.complaintDescription"
        placeholder="Complaint Description."
      />
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: "account-section" });
const form = reactive({
  email: "",
  complaintReference: "",
  articleNumber: "",
  articleReference: "",
  complaintReason: "",
  complaintDescription: "",
});

const reasons = [
  "Damaged Item",
  "Wrong Item Delivered",
  "Late Delivery",
  "Other",
];
</script>
