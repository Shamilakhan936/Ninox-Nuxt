<template>
  <div class="min-h-screen bg-[#F7F7F5]">
    <Navbar />

    <!-- Two-column layout -->
    <div class="flex gap-8 px-20 pt-[90px] pb-[120px]">
      <!-- Sidebar -->
      <div class="w-[205px] shrink-0">
        <AccountSidebar
          :active-item="activeItem"
          :menu-items="menuItems"
          :show-order-upload="attrs.showOrderUpload"
          @menu-click="handleMenuClick"
          @order-upload-click="handleOrderUpload"
        />
      </div>

      <!-- Main content -->
      <div class="flex-grow">
        <slot />
      </div>
    </div>

    <!-- Order Upload Modal -->
    <UModal v-model="showOrderUploadModal">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Upload Order File</h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="closeOrderUploadModal"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div class="text-sm text-gray-600 mb-4">
            Upload a CSV or Excel file with your order data. The file should
            contain columns for product type, dimensions, fabric details, and
            quantities.
          </div>

          <UFormGroup label="Select File">
            <UInput
              type="file"
              accept=".csv,.xlsx,.xls"
              @change="handleFileSelection"
              ref="fileInput"
            />
          </UFormGroup>

          <div v-if="selectedFile" class="p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center">
              <UIcon
                name="i-heroicons-document"
                class="w-5 h-5 text-blue-600 mr-2"
              />
              <span class="text-sm font-medium">{{ selectedFile.name }}</span>
              <span class="text-xs text-gray-500 ml-2">
                ({{ formatFileSize(selectedFile.size) }})
              </span>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="closeOrderUploadModal">
              Cancel
            </UButton>
            <UButton
              color="primary"
              @click="handleFileUpload"
              :loading="isUploading"
              :disabled="!selectedFile"
            >
              Upload & Process
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Notification System -->
    <NotificationSystem
      v-model:notification="notification"
      :auto-hide="true"
      :duration="5000"
    />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, navigateTo } from "#imports";
import { useAttrs } from "vue";

// Components
import Navbar from "~/components/Navbar.vue";
import AccountSidebar from "~/components/ProfileSidebar.vue";
import NotificationSystem from "~/components/NotificationSystem.vue";
import Footer from "~/components/Footer.vue";

const { notification, showNotification } = useNotifications();
// Props from parent layout usage
const attrs = useAttrs();

const menuItems = attrs.menuItems || [
  { name: "My Account", action: "account", route: "/account" },
  { name: "Orders", action: "orders", route: "/account/orders" },
  { name: "Invoices", action: "invoices", route: "/account/invoices" },
  { name: "Credits", action: "credits", route: "/account/credits" },
  { name: "Shipments", action: "shipments", route: "/account/shipments" },
  { name: "Back Orders", action: "back-orders", route: "/account/back-orders" },
  { name: "Complaints", action: "complaints", route: "/account/complaints" },
];

const activeItem = ref(attrs.activeItem || "My Account");

// Watch for route changes to update active item
const route = useRoute();
watch(
  () => route.path,
  (path) => {
    const matched = menuItems.find((item) =>
      path.includes(item.route?.replace("/", ""))
    );
    activeItem.value = matched?.name || "My Account";
  },
  { immediate: true }
);

const handleMenuClick = (menuItem) => {
  if (menuItem.comingSoon || !menuItem.route) {
    showNotification({
      title: "Coming Soon",
      description: `${menuItem.name} section is coming soon.`,
      color: "blue",
    });
  } else {
    navigateTo(menuItem.route);
  }
};

const showOrderUploadModal = ref(false);
const selectedFile = ref(null);
const fileInput = ref(null);
const isUploading = ref(false);

const handleOrderUpload = () => {
  showOrderUploadModal.value = true;
};

const closeOrderUploadModal = () => {
  showOrderUploadModal.value = false;
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleFileSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleFileUpload = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    formData.append("userEmail", user.value.email);

    // Simulate API call for now - replace with actual upload endpoint
    await new Promise((resolve) => setTimeout(resolve, 2000));

    closeOrderUploadModal();

    showNotification({
      title: "Upload Successful",
      description: `File "${selectedFile.value.name}" has been uploaded and is being processed.`,
      color: "green",
    });

    // Optionally redirect to orders page
    setTimeout(() => {
      navigateTo("/table-orders");
    }, 1500);
  } catch (error) {
    console.error("Error uploading file:", error);
    showNotification({
      title: "Upload Failed",
      description: "There was an error uploading your file. Please try again.",
      color: "red",
    });
  } finally {
    isUploading.value = false;
  }
};
</script>
