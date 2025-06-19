<template>
  <div class="bg-white rounded-lg shadow-sm admin-card">
    <!-- Header with Add Button -->
    <div class="px-6 py-4 border-b flex justify-between items-center" style="border-color: #E5E5E5;">
      <h2 class="text-lg font-medium" style="color: #2D2D2D;">
        {{ entity.name }} Management
      </h2>
      <button @click="$emit('create')" class="admin-add-button">
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Add {{ entity.singular }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-6 text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto mb-2" style="color: #6B6B6B;" />
      <p style="color: #6B6B6B;">Loading {{ entity.name.toLowerCase() }}...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-6 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 mx-auto mb-2" style="color: #EF4444;" />
      <p style="color: #EF4444;">{{ error }}</p>
      <button @click="$emit('retry')" class="admin-retry-button mt-3">Retry</button>
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full admin-table">
        <thead class="admin-table-header">
          <tr>
            <th v-for="column in entity.columns" :key="column.key" class="admin-table-th">
              {{ column.label }}
            </th>
            <th class="admin-table-th text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white admin-table-body">
          <tr v-for="item in data" :key="item.id" class="admin-table-row">
            <td v-for="column in entity.columns" :key="column.key" class="admin-table-td">
              <span v-if="column.type === 'date'">
                {{ formatDate(item[column.key]) }}
              </span>
              <span v-else-if="column.type === 'currency'">
                {{ formatCurrency(item[column.key]) }}
              </span>
              <span v-else-if="column.type === 'status'" class="admin-status-badge" :data-color="getStatusColor(item[column.key])">
                {{ item[column.key] }}
              </span>
              <span v-else>
                {{ item[column.key] || '-' }}
              </span>
            </td>
            <td class="admin-table-td text-right">
              <div class="flex justify-end space-x-2">
                <button @click="$emit('edit', item)" class="admin-action-button edit-button">
                  <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
                </button>
                <button @click="$emit('delete', item)" class="admin-action-button delete-button">
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="data.length === 0" class="p-12 text-center admin-empty-state">
        <UIcon :name="entity.icon" class="w-12 h-12 mx-auto mb-4" style="color: #BFB7B0;" />
        <h3 class="text-lg font-medium mb-2" style="color: #2D2D2D;">
          No {{ entity.name.toLowerCase() }} found
        </h3>
        <p class="mb-4" style="color: #6B6B6B;">
          Get started by creating your first {{ entity.singular.toLowerCase() }}.
        </p>
        <button @click="$emit('create')" class="admin-primary-button">
          Add {{ entity.singular }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  entity: {
    type: Object,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['create', 'edit', 'delete', 'retry']);

// Utility functions
function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString();
}

function formatCurrency(amount) {
  if (amount == null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function getStatusColor(status) {
  const statusColors = {
    'Active': 'green',
    'Inactive': 'gray',
    'Pending': 'yellow',
    'Processing': 'blue',
    'Shipped': 'indigo',
    'Delivered': 'green',
    'Cancelled': 'red',
    'Yes': 'green',
    'No': 'red',
    'Limited': 'yellow',
    'Maintenance': 'orange'
  };
  return statusColors[status] || 'gray';
}
</script>

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Admin card styling */
.admin-card {
  border: 1px solid #E5E5E5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Button styling */
.admin-primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8.8px 16.1px;
  background-color: #8A7C59;
  color: #FFFFFF;
  border: none;
  border-radius: 48.44px;
  font-size: 11.74px;
  line-height: 19.08px;
  font-weight: 300;
  font-family: 'Albert Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 35px;
  min-width: fit-content;
}

.admin-primary-button:hover {
  background-color: #6B5B42;
}

.admin-add-button {
  display: flex;
  align-items: center;
  padding: 8.8px 16.1px;
  background-color: #8A7C59;
  color: #FFFFFF;
  border: none;
  border-radius: 48.44px;
  font-size: 11.74px;
  line-height: 19.08px;
  font-weight: 300;
  font-family: 'Albert Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 35px;
}

.admin-add-button:hover {
  background-color: #6B5B42;
}

.admin-retry-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8.8px 16.1px;
  background-color: transparent;
  color: #6B6B6B;
  border: 0.5px solid #E5E5E5;
  border-radius: 48.44px;
  font-size: 11.74px;
  line-height: 19.08px;
  font-weight: 300;
  font-family: 'Albert Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 35px;
}

.admin-retry-button:hover {
  border-color: #BFB7B0;
  color: #2D2D2D;
}

/* Table styling */
.admin-table {
  font-family: 'Albert Sans', sans-serif;
}

.admin-table-header {
  background-color: #F9F9F9;
}

.admin-table-th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11.74px;
  font-weight: 400;
  color: #6B6B6B;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #E5E5E5;
}

.admin-table-body {
  font-family: 'Albert Sans', sans-serif;
}

.admin-table-row {
  transition: background-color 0.2s ease;
}

.admin-table-row:hover {
  background-color: #FAFAFA;
}

.admin-table-td {
  padding: 12px 16px;
  font-size: 11.74px;
  line-height: 19.08px;
  font-weight: 300;
  color: #2D2D2D;
  border-bottom: 1px solid #F0F0F0;
  white-space: nowrap;
}

/* Action buttons */
.admin-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
}

.edit-button {
  color: #6B6B6B;
}

.edit-button:hover {
  background-color: rgba(138, 124, 89, 0.1);
  color: #8A7C59;
}

.delete-button {
  color: #6B6B6B;
}

.delete-button:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

/* Status badge styling */
.admin-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-status-badge[data-color="green"] {
  background-color: #DCFCE7;
  color: #166534;
}

.admin-status-badge[data-color="red"] {
  background-color: #FEE2E2;
  color: #DC2626;
}

.admin-status-badge[data-color="yellow"] {
  background-color: #FEF3C7;
  color: #D97706;
}

.admin-status-badge[data-color="blue"] {
  background-color: #DBEAFE;
  color: #2563EB;
}

.admin-status-badge[data-color="gray"] {
  background-color: #F3F4F6;
  color: #6B7280;
}

.admin-status-badge[data-color="indigo"] {
  background-color: #E0E7FF;
  color: #4338CA;
}

.admin-status-badge[data-color="orange"] {
  background-color: #FED7AA;
  color: #EA580C;
}

/* Empty state styling */
.admin-empty-state {
  font-family: 'Albert Sans', sans-serif;
}

/* Typography matching */
.text-lg {
  font-size: 16px !important;
  line-height: 24px !important;
  font-weight: 400 !important;
  font-family: 'Albert Sans', sans-serif !important;
}
</style>