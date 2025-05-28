<template>
  <transition name="notification" appear>
    <div 
      v-if="notification.show" 
      :class="[
        'notification-container',
        `notification-${notification.color}`
      ]"
    >
      <!-- Close button -->
      <button 
        class="notification-close"
        @click="closeNotification"
        aria-label="Close notification"
      >
        ×
      </button>
      
      <!-- Content -->
      <div class="notification-content">
        <!-- Icon based on color/type -->
        <div class="notification-icon">
          <svg v-if="notification.color === 'green'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="notification.color === 'red'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="notification.color === 'yellow'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <svg v-else viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Text content -->
        <div class="notification-text">
          <div class="notification-title">{{ notification.title }}</div>
          <div v-if="notification.description" class="notification-description">
            {{ notification.description }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    default: () => ({ 
      show: false, 
      title: '', 
      description: '', 
      color: 'green' 
    })
  },
  autoHide: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['update:notification', 'close'])

// Local timer for auto-hiding
let hideTimer = null

// Watch for changes to the notification
watch(() => props.notification.show, (isShown) => {
  // If notification is shown and auto-hide is enabled
  if (isShown && props.autoHide) {
    clearTimeout(hideTimer)
    hideTimer = setTimeout(closeNotification, props.duration)
  }
})

// Close the notification
function closeNotification() {
  clearTimeout(hideTimer)
  const updatedNotification = { ...props.notification, show: false }
  emit('update:notification', updatedNotification)
  emit('close')
}

// Clean up timer on component unmount
onBeforeUnmount(() => {
  clearTimeout(hideTimer)
})
</script>

<style scoped>
/* Import Albert Sans font */
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

.notification-container {
  position: fixed;
  top: 24px;
  right: 24px;
  min-width: 320px;
  max-width: 480px;
  background-color: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #E5E5E5;
  padding: 20px;
  z-index: 1000;
  font-family: 'Albert Sans', sans-serif;
  transition: all 0.3s ease;
}

.notification-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #6B6B6B;
  font-size: 16px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: 'Albert Sans', sans-serif;
}

.notification-close:hover {
  background-color: #F5F5F5;
  color: #2D2D2D;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-right: 24px;
}

.notification-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #2D2D2D;
  margin-bottom: 4px;
  font-family: 'Albert Sans', sans-serif;
}

.notification-description {
  font-size: 12px;
  font-weight: 300;
  line-height: 16px;
  color: #6B6B6B;
  font-family: 'Albert Sans', sans-serif;
}

/* Color variants */
.notification-green {
  border-left: 4px solid #8A7C59;
}

.notification-green .notification-icon {
  color: #8A7C59;
}

.notification-red {
  border-left: 4px solid #EF4444;
}

.notification-red .notification-icon {
  color: #EF4444;
}

.notification-yellow {
  border-left: 4px solid #F59E0B;
}

.notification-yellow .notification-icon {
  color: #F59E0B;
}

.notification-blue {
  border-left: 4px solid #3B82F6;
}

.notification-blue .notification-icon {
  color: #3B82F6;
}

.notification-indigo {
  border-left: 4px solid #6366F1;
}

.notification-indigo .notification-icon {
  color: #6366F1;
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-enter-to,
.notification-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .notification-container {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
    max-width: none;
  }
}
</style>
