<template>
  <div class="min-h-screen table-orders-container">
    <!-- Page Content -->
    <div class="container">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin"
          style="color: #6b6b6b"
        />
      </div>

      <div v-else-if="hasPermission" class="relative">
        <!-- Account Sidebar Component -->

        <!-- Main Content Area -->
        <div class="ml-[86px]">
          <!-- Title Section -->
          <div class="mb-[60px]">
            <h1 class="text-[30px] font-light text-[#2d1713] mb-4">
              Hello, {{ userName || "User" }}
            </h1>
            <p class="text-base font-normal leading-[24px] text-[#6f6259] max-w-[869px]">
              Welcome to your account dashboard. Here you can manage your
              personal information, view your company details, and access all
              your account features. Use the navigation menu to explore
              different sections of your account.
            </p>
          </div>

          <!-- Personal Information and Company Information Side by Side -->
          <div class="flex gap-[138px] mb-8">
            <!-- Personal Information -->
            <div class="flex-1 max-w-[402px]">
              <h2
                class="text-[16px] leading-[14px] uppercase tracking-[0.2em] font-light text-[#3d3935] mb-8"
              >
                Personal Information
              </h2>

              <div class="space-y-3 text-[#6f6259]">
  <div class="grid grid-cols-2 gap-x-4">
    <span class="text-base leading-[24px] font-medium pb-3">First name</span>
    <span class="text-base leading-[24px] font-light">{{ user.given_name || "-" }}</span>

    <span class="text-base leading-[24px] font-medium pb-3">Last name</span>
    <span class="text-base leading-[24px] font-light">{{ user.family_name || "-" }}</span>

    <span class="text-base leading-[24px] font-medium pb-3">E-mail</span>
    <span class="text-base leading-[24px] font-light">{{ user.email || "-" }}</span>

    <span class="text-base leading-[24px] font-medium pb-3">Phone number</span>
    <span class="text-base leading-[24px] font-light">{{ userProfile.phone || "-" }}</span>

    <span class="text-base leading-[24px] font-medium pb-3">Mobile number</span>
    <span class="text-base leading-[24px] font-light">{{ userProfile.mobile || "-" }}</span>

    <span class="text-base leading-[24px] font-medium pb-3">Language</span>
    <span class="text-base leading-[24px] font-light">{{ userProfile.language || "English" }}</span>

    <span class="text-base leading-[24px] font-medium pb-3">Administrator</span>
    <span class="text-base leading-[24px] font-light">{{ userProfile.isAdmin ? "Yes" : "No" }}</span>

    <span class="text-base leading-[24px] font-medium pb-3">User Profile</span>
    <span class="text-base leading-[24px] font-light">{{ userProfile.role || "Order products" }}</span>
  </div>
</div>

            </div>

            <!-- Company Information -->
            <div class="flex-1 max-w-[310px]">
              <h2
                class="text-[16px] leading-[14px] uppercase tracking-[0.2em] font-light text-[#3d3935] mb-8"
              >
                Company Information
              </h2>

              <div class="space-y-3 text-[#6f6259]">
                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >Name</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.name || "-"
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >E-mail</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.email || "-"
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >Website</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.website || "-"
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >Country</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.country || "-"
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >State</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.state || "-"
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >Street</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.street || "-"
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >Postal code</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.postalCode || "-"
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-[16px] leading-[24px] font-medium"
                    >City</span
                  >
                  <span class="text-[16px] leading-[24px] font-light">{{
                    companyInfo.city || "-"
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mb-[135px]">
            <button
              class="bg-[#8a7c59] text-white px-[18px] py-[16px] rounded-[74px] text-[13px] uppercase tracking-[0.1em] leading-[13px] font-light hover:bg-[#7a6c49] transition-colors"
              @click="openLanguageModal(userProfile.language)"
            >
              Change Language
            </button>

            <button
              class="bg-[#8a7c59] text-white px-[18px] py-[16px] rounded-[74px] text-[13px] uppercase tracking-[0.1em] leading-[13px] font-light hover:bg-[#7a6c49] transition-colors"
              @click="openPasswordModal"
            >
              Change Password
            </button>
          </div>

          <!-- User Accounts Section -->
          <div class="mb-[217px]">
            <h2 class="text-[30px] font-light text-[#2d1713] mb-[27px]">
              User Accounts
            </h2>

            <div
              v-if="otherUsers.length > 0"
              class="flex gap-[140px] text-[#6f6259]"
            >
              <div>
                <div class="text-[16px] leading-[24px] font-medium mb-4">
                  Name
                </div>
                <div
                  v-for="otherUser in otherUsers"
                  :key="otherUser.id"
                  class="text-[16px] leading-[24px] font-light mb-2"
                >
                  {{ otherUser.name }}
                </div>
              </div>

              <div>
                <div class="text-[16px] leading-[24px] font-medium mb-4">
                  E-mail
                </div>
                <div
                  v-for="otherUser in otherUsers"
                  :key="otherUser.id"
                  class="text-[16px] leading-[24px] font-light mb-2"
                >
                  {{ otherUser.email }}
                </div>
              </div>

              <div>
                <div class="text-[16px] leading-[24px] font-medium mb-4">
                  Administrator
                </div>
                <div
                  v-for="otherUser in otherUsers"
                  :key="otherUser.id"
                  class="text-[16px] leading-[24px] font-light mb-2"
                >
                  {{ otherUser.isAdmin ? "Yes" : "No" }}
                </div>
              </div>
            </div>

            <div v-else class="text-[#6f6259] text-[16px]">
              No other users found.
            </div>
          </div>
        </div>
      </div>

      <!-- Insufficient Permissions Message -->
      <div
        v-else
        class="border p-6 rounded-lg shadow-sm text-center"
        style="background-color: #fef2f2; border-color: #fecaca"
      >
        <UIcon
          name="i-heroicons-lock-closed"
          class="w-12 h-12 mx-auto mb-4"
          style="color: #dc2626"
        />
        <h2 class="text-xl font-semibold mb-2" style="color: #dc2626">
          Insufficient Permissions
        </h2>
        <p class="mb-4" style="color: #dc2626">
          You don't have the necessary permissions to access the account
          settings.
        </p>
        <UButton to="/api/logout" external color="red" variant="soft">
          Sign out
        </UButton>
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
              <span class="text-xs text-gray-500 ml-2"
                >({{ formatFileSize(selectedFile.size) }})</span
              >
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

    <!-- Language Change Modal -->
    <UModal v-model="showLanguageModal" class="languageModal">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Change Language</h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="closeLanguageModal"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Select Language">
            <USelect
              v-model="selectedLanguage"
              :options="languageOptions"
              placeholder="Choose your preferred language"
              class="selectStyles"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="closeLanguageModal">
              Cancel
            </UButton>
            <UButton
              color="primary"
              @click="handleUpdateLanguage"
              :loading="isUpdating"
            >
              Update Language
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Password Change Modal -->
    <UModal v-model="showPasswordModal" class="passwordModal">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Change Password</h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="closePasswordModal"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Current Password">
            <UInput
              v-model="passwordForm.current"
              type="password"
              placeholder="Enter current password"
              class="inputStyles"
            />
          </UFormGroup>

          <UFormGroup label="New Password">
            <UInput
              v-model="passwordForm.new"
              type="password"
              placeholder="Enter new password"
              class="inputStyles"
            />
          </UFormGroup>

          <UFormGroup label="Confirm New Password">
            <UInput
              v-model="passwordForm.confirm"
              type="password"
              placeholder="Confirm new password"
              class="inputStyles"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="closePasswordModal">
              Cancel
            </UButton>
            <UButton
              color="primary"
              @click="handleUpdatePassword"
              :loading="isUpdating"
              :disabled="!isPasswordFormValid"
            >
              Update Password
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
  </div>
</template>

<script setup>
definePageMeta({ layout: "account-section" });
import { ref, computed, onMounted, watch } from "vue";
import Navbar from "../components/Navbar.vue";
import NotificationSystem from "../components/NotificationSystem.vue";

// Import composables
import { useAccountManagement } from "../composables/useAccountManagement";
import { useAccountModals } from "../composables/useAccountModals";
import { useNotifications } from "../composables/useNotifications";

// User authentication and permissions
const isLoading = ref(true);
const hasPermission = ref(true);

const auth = computed(() => {
  try {
    const nuxtApp = useNuxtApp();
    return nuxtApp.$auth || null;
  } catch (e) {
    console.error("Error accessing auth:", e);
    return null;
  }
});

const user = computed(() => {
  return auth.value?.user || {};
});

const userName = computed(() => {
  return user.value?.given_name || "User";
});

// Use composables
const {
  userProfile,
  companyInfo,
  otherUsers,
  languageOptions,
  fetchUserProfile,
  updateLanguage,
  updatePassword,
} = useAccountManagement();

const {
  showLanguageModal,
  showPasswordModal,
  isUpdating,
  selectedLanguage,
  passwordForm,
  isPasswordFormValid,
  openLanguageModal,
  closeLanguageModal,
  openPasswordModal,
  closePasswordModal,
} = useAccountModals();

const { notification, showNotification } = useNotifications();

// Order Upload functionality
const showOrderUploadModal = ref(false);
const selectedFile = ref(null);
const isUploading = ref(false);
const fileInput = ref(null);

// Methods
const handleMenuClick = (menuItem) => {
  if (menuItem.route) {
    navigateTo(menuItem.route);
  } else {
    // Handle navigation or show coming soon notification
    showNotification({
      title: "Coming Soon",
      description: `${menuItem.name} section is coming soon.`,
      color: "blue",
    });
  }
};

const handleOrderUpload = () => {
  selectedFile.value = null;
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

const handleUpdateLanguage = async () => {
  isUpdating.value = true;

  try {
    const result = await updateLanguage(
      selectedLanguage.value,
      user.value.email
    );

    if (result.success) {
      closeLanguageModal();
      showNotification({
        title: "Language Updated",
        description: `Your language has been changed to ${selectedLanguage.value}.`,
        color: "green",
      });
    } else {
      showNotification({
        title: "Update Failed",
        description: result.error || "Failed to update language.",
        color: "red",
      });
    }
  } catch (error) {
    showNotification({
      title: "Error",
      description: "An error occurred while updating your language.",
      color: "red",
    });
  } finally {
    isUpdating.value = false;
  }
};

const handleUpdatePassword = async () => {
  isUpdating.value = true;

  try {
    const result = await updatePassword(passwordForm.value, user.value.email);

    if (result.success) {
      closePasswordModal();
      showNotification({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
        color: "green",
      });
    } else {
      showNotification({
        title: "Update Failed",
        description: result.error || "Failed to update password.",
        color: "red",
      });
    }
  } catch (error) {
    showNotification({
      title: "Error",
      description: "An error occurred while updating your password.",
      color: "red",
    });
  } finally {
    isUpdating.value = false;
  }
};

// Watch for auth state changes
watch(
  () => user.value?.email,
  (newEmail) => {
    if (newEmail) {
      fetchUserProfile(newEmail);
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(async () => {
  try {
    hasPermission.value = true;

    if (user.value?.email) {
      await fetchUserProfile(user.value.email);
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    hasPermission.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>
@import "~/assets/css/table-orders.css";
</style>
