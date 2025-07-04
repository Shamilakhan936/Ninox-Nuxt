<template>
  <div
    class="absolute left-[84px] top-[32px] w-[205px] flex flex-col gap-[30px] text-black z-10"
  >
    <!-- Active Item (My Account by default) -->
    <div class="flex items-center justify-between">
      <div class="text-[16px] leading-[27.82px] uppercase font-medium">
        {{ activeItem }}
      </div>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-[25px] h-[25px] text-black"
      />
    </div>

    <!-- Menu Items -->
    <div
      v-for="menuItem in menuItems"
      :key="menuItem.name"
      class="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
      @click="handleMenuClick(menuItem)"
    >
      <div class="text-[16px] leading-[27.82px] uppercase font-light">
        {{ menuItem.name }}
      </div>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-[25px] h-[25px] text-black"
      />
    </div>

    <!-- Order Upload (conditional) -->
    <div
      v-if="showOrderUpload"
      class="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
      @click="handleOrderUploadClick"
    >
      <div class="text-[16px] leading-[27.82px] uppercase font-light">
        Order Upload
      </div>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-[25px] h-[25px] text-black"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  activeItem: {
    type: String,
    default: "My Account",
  },
  menuItems: {
    type: Array,
    default: () => [
      { name: "Orders", action: "orders", route: "/table-orders" },
      { name: "Invoices", action: "invoices" },
      { name: "Credits", action: "credits" },
      { name: "Shipments", action: "shipments" },
      { name: "Back Orders", action: "back-orders" },
      { name: "Complaints", action: "complaints" },
    ],
  },
  showOrderUpload: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["menu-click", "order-upload-click"]);

const handleMenuClick = (menuItem) => {
  emit("menu-click", menuItem);
};

const handleOrderUploadClick = () => {
  emit("order-upload-click");
};

function isComplaintsActive(menuItem) {
  if (menuItem.name !== 'Complaints') return false
  return (
    route.path === '/account/complaints' ||
    route.path === '/account/complaintForm'
  )
}
</script>
