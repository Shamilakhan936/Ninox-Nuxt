<template>
    <!-- Custom Modal Overlay -->
    <div v-if="isOpen" class="modal-overlay" @click="close">
      <div class="modal-wrapper" @click.stop>
        <div class="admin-modal-container order-details-modal">
          <!-- Close button -->
          <button class="modal-close-button" @click="close">
            ×
          </button>
          
          <!-- Modal Title -->
          <div class="modal-title">Order Details</div>
          
          <!-- Divider line -->
          <div class="modal-divider" />
  
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="w-8 h-8 border-2 border-[#6F6259] border-t-transparent rounded-full animate-spin"></div>
          </div>
  
          <div v-else-if="orderDetails" class="modal-content">
            <!-- Order Header -->
            <div class="order-section">
              <div class="order-grid">
                <div>
                  <h4 class="field-label">Order Number</h4>
                  <p class="field-value">{{ orderDetails.order.uuid }}</p>
                </div>
                <div>
                  <h4 class="field-label">Status</h4>
                  <span class="status-badge">
                    {{ orderDetails.order.status }}
                  </span>
                </div>
                <div>
                  <h4 class="field-label">Order Date</h4>
                  <p class="field-value">{{ formatDate(orderDetails.order.createdAt) }}</p>
                </div>
                <div v-if="orderDetails.order.installationDate">
                  <h4 class="field-label">Installation Date</h4>
                  <p class="field-value">{{ formatDate(orderDetails.order.installationDate) }}</p>
                </div>
              </div>
            </div>
  
            <!-- Customer Information -->
            <div class="order-section">
              <h4 class="section-title">Customer Information</h4>
              <div class="order-grid">
                <div>
                  <h5 class="field-label">Customer</h5>
                  <p class="field-value">{{ orderDetails.order.customerFirstName }} {{ orderDetails.order.customerLastName }}</p>
                </div>
                <div>
                  <h5 class="field-label">Email</h5>
                  <p class="field-value">{{ orderDetails.order.customerEmail }}</p>
                </div>
                <div>
                  <h5 class="field-label">Country</h5>
                  <p class="field-value">{{ orderDetails.order.customerCountry }}</p>
                </div>
                <div>
                  <h5 class="field-label">Delivery Address</h5>
                  <p class="field-value address-text">{{ orderDetails.order.deliveryAddress }}</p>
                </div>
              </div>
            </div>
  
            <!-- Order Items -->
            <div class="order-section">
              <h4 class="section-title">Order Items ({{ orderDetails.orderItems?.length || 0 }})</h4>
              <div class="order-items-container">
                <div 
                  v-for="(item, index) in orderDetails.orderItems" 
                  :key="item.id"
                  class="order-item"
                >
                  <div class="item-header">
                    <div>
                      <h5 class="item-title">{{ item.productType }}</h5>
                      <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                    </div>
                    <span class="status-badge">
                      {{ item.status }}
                    </span>
                  </div>
                  
                  <div class="item-details-grid">
                    <div>
                      <span class="detail-label">Dimensions:</span>
                      <p class="detail-value">{{ item.width }}cm × {{ item.height }}cm</p>
                    </div>
                    <div v-if="item.mountLocation">
                      <span class="detail-label">Mount Location:</span>
                      <p class="detail-value">{{ item.mountLocation }}</p>
                    </div>
                    <div v-if="item.hardwareColor">
                      <span class="detail-label">Hardware Color:</span>
                      <p class="detail-value">{{ item.hardwareColor }}</p>
                    </div>
                  </div>
                  
                  <!-- Product-specific details -->
                  <div v-if="item.productDetails" class="product-details">
                    <h6 class="product-details-title">Product Details</h6>
                    <div class="product-details-grid">
                      <div v-if="item.productDetails.room" class="product-detail">
                        <span class="detail-label">Room:</span>
                        <span class="detail-value">{{ item.productDetails.room }}</span>
                      </div>
                      <div v-if="item.productDetails.controlType" class="product-detail">
                        <span class="detail-label">Control Type:</span>
                        <span class="detail-value">{{ item.productDetails.controlType }}</span>
                      </div>
                      <div v-if="item.productDetails.lining" class="product-detail">
                        <span class="detail-label">Lining:</span>
                        <span class="detail-value">{{ item.productDetails.lining }}</span>
                      </div>
                      <div v-if="item.productDetails.delivery" class="product-detail">
                        <span class="detail-label">Delivery:</span>
                        <span class="detail-value">{{ item.productDetails.delivery }}</span>
                      </div>
                    </div>
                  </div>
  
                  <div v-if="item.notes" class="item-notes">
                    <h6 class="notes-title">Notes</h6>
                    <p class="notes-text">{{ item.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Order Notes -->
            <div v-if="orderDetails.order.notes" class="order-section">
              <h4 class="section-title">Order Notes</h4>
              <div class="order-notes">
                <p class="notes-text">{{ orderDetails.order.notes }}</p>
              </div>
            </div>
          </div>
  
          <!-- Modal Footer -->
          <div class="modal-footer-buttons">
            <button @click="close" class="modal-close-action-button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: [String, Number],
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const loading = ref(false)
  const orderDetails = ref(null)
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  const fetchOrderDetails = async () => {
    if (!props.orderId) return
    
    loading.value = true
    try {
      const response = await $fetch(`/api/orders/${props.orderId}/details`)
      if (response.success) {
        orderDetails.value = response.data
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      loading.value = false
    }
  }
  
  const close = () => {
    isOpen.value = false
    orderDetails.value = null
  }
  
  // Watch for modal opening and orderId changes
  watch([() => props.modelValue, () => props.orderId], ([isOpenNew, orderIdNew]) => {
    if (isOpenNew && orderIdNew) {
      fetchOrderDetails()
    }
  })
  </script>
  
  <style scoped>
  /* Import Albert Sans font */
  @import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');
  
  /* Modal Overlay - Full screen backdrop */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  /* Modal Wrapper - Centering container */
  .modal-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
  }
  
  /* Modal Container */
  .admin-modal-container.order-details-modal {
    width: 100%;
    position: relative;
    min-height: 400px;
    max-width: 900px;
    margin: 0 auto;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: 'Albert Sans', sans-serif;
    background-color: #fff;
    border-radius: 8px;
    padding: 60px 56px 40px 56px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  /* Close button */
  .modal-close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #E5E5E5;
    background-color: #fff;
    color: #666;
    font-size: 18px;
    font-weight: 300;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-family: 'Albert Sans', sans-serif;
  }
  
  .modal-close-button:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
  }
  
  /* Modal Title */
  .modal-title {
    text-align: center;
    font-size: 30px;
    line-height: 40px;
    font-weight: 300;
    color: #000;
    margin-bottom: 16px;
  }
  
  /* Modal Divider */
  .modal-divider {
    background-color: rgba(61, 57, 53, 0.15);
    width: 100%;
    height: 1px;
    margin-bottom: 40px;
  }
  
  /* Modal Content */
  .modal-content {
    margin-bottom: 40px;
  }
  
  /* Order Sections */
  .order-section {
    margin-bottom: 32px;
    padding: 24px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
  }
  
  .order-section:first-child {
    background-color: #fff;
    border: 1px solid #e5e5e5;
  }
  
  /* Section Titles */
  .section-title {
    font-size: 18px;
    font-weight: 300;
    color: #2D1713;
    margin-bottom: 16px;
    font-family: 'Albert Sans', sans-serif;
  }
  
  /* Grid Layouts */
  .order-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .item-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin: 16px 0;
  }
  
  .product-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
  
  /* Field Styling */
  .field-label {
    font-size: 11px;
    font-weight: 400;
    color: #6F6259;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'Albert Sans', sans-serif;
  }
  
  .field-value {
    font-size: 14px;
    font-weight: 300;
    color: #2D1713;
    line-height: 1.4;
    font-family: 'Albert Sans', sans-serif;
  }
  
  .address-text {
    line-height: 1.6;
  }
  
  /* Status Badge */
  .status-badge {
    display: inline-block;
    background-color: #8A7C59;
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Albert Sans', sans-serif;
  }
  
  /* Order Items */
  .order-items-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .order-item {
    background-color: white;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 20px;
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .item-title {
    font-size: 16px;
    font-weight: 300;
    color: #2D1713;
    margin-bottom: 4px;
    font-family: 'Albert Sans', sans-serif;
  }
  
  .item-quantity {
    font-size: 12px;
    font-weight: 400;
    color: #6F6259;
    font-family: 'Albert Sans', sans-serif;
  }
  
  /* Detail Labels and Values */
  .detail-label {
    font-size: 11px;
    font-weight: 400;
    color: #6F6259;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Albert Sans', sans-serif;
  }
  
  .detail-value {
    font-size: 13px;
    font-weight: 300;
    color: #2D1713;
    margin-top: 2px;
    font-family: 'Albert Sans', sans-serif;
  }
  
  /* Product Details */
  .product-details {
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    margin-top: 16px;
  }
  
  .product-details-title {
    font-size: 14px;
    font-weight: 400;
    color: #2D1713;
    margin-bottom: 12px;
    font-family: 'Albert Sans', sans-serif;
  }
  
  .product-detail {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  /* Notes */
  .item-notes, .order-notes {
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    margin-top: 16px;
  }
  
  .order-notes {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #f0f0f0;
  }
  
  .notes-title {
    font-size: 14px;
    font-weight: 400;
    color: #2D1713;
    margin-bottom: 8px;
    font-family: 'Albert Sans', sans-serif;
  }
  
  .notes-text {
    font-size: 13px;
    font-weight: 300;
    color: #6F6259;
    line-height: 1.6;
    font-family: 'Albert Sans', sans-serif;
  }
  
  /* Footer Buttons */
  .modal-footer-buttons {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
  
  .modal-close-action-button {
    border-radius: 74px;
    background-color: #8a7c59;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 48px;
    text-align: center;
    font-size: 13px;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    letter-spacing: 0.1em;
    line-height: 13px;
    text-transform: uppercase;
    font-family: 'Albert Sans', sans-serif;
    white-space: nowrap;
  }
  
  .modal-close-action-button:hover {
    background-color: #6B5B42;
  }
  
  /* Scrollbar styling */
  .admin-modal-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .admin-modal-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .admin-modal-container::-webkit-scrollbar-thumb {
    background: #c9c7c5;
    border-radius: 3px;
  }
  
  .admin-modal-container::-webkit-scrollbar-thumb:hover {
    background: #8a7c59;
  }
  
  /* Animation */
  .modal-overlay {
    animation: fadeIn 0.2s ease-out;
  }
  
  .admin-modal-container {
    animation: slideIn 0.2s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .admin-modal-container.order-details-modal {
      padding: 40px 24px;
      margin: 10px;
      max-width: calc(100vw - 20px);
    }
    
    .modal-title {
      font-size: 24px;
      line-height: 32px;
    }
    
    .order-grid,
    .item-details-grid,
    .product-details-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .item-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
  }
  </style>