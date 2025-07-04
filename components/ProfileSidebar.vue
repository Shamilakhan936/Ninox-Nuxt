<template>
  <div
    class="sticky top-[100px] w-[205px] flex flex-col gap-[30px] text-black z-10"
  >
    <!-- Sidebar Menu Items -->
    <div
      v-for="menuItem in menuItems"
      :key="menuItem.name"
      class="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
      @click="handleMenuClick(menuItem)"
    >
      <div
        :class="[
          'leading-[27.82px] uppercase font-light transition-all',
          menuItem.name === currentActiveItem
            ? 'text-base font-medium text-black'
            : 'text-[16px] font-light',
        ]"
      >
        {{ menuItem.name }}
      </div>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-[25px] h-[25px] text-black"
      />
    </div>

    <!-- Order Upload Button -->
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
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  activeItem: {
    type: String,
    default: "My Account",
  },
  menuItems: {
    type: Array,
    default: () => [
      { name: "My Account", action: "account", route: "/account" },
      { name: "Orders", action: "orders", route: "/account/orders" },
      { name: "Invoices", action: "invoices", route: "/account/invoices" },
      { name: "Credits", action: "credits", route: "/account/credits" },
      { name: "Shipments", action: "shipments", route: "/account/shipments" },
      { name: "Back Orders", action: "back-orders", comingSoon: true },
      { name: "Complaints", action: "complaints", route: "/account/complaints" },
    ],
  },
  showOrderUpload: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["menu-click", "order-upload-click"]);

const currentActiveItem = ref(props.activeItem);

// Watch for prop changes
watch(
  () => props.activeItem,
  (newVal) => {
    currentActiveItem.value = newVal;
  }
);

// Menu click handler
const handleMenuClick = (menuItem) => {
  currentActiveItem.value = menuItem.name;
  emit("menu-click", menuItem);
};

// Upload click handler
const handleOrderUploadClick = () => {
  emit("order-upload-click");
};
</script>
