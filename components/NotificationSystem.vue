<template>
  <UNotification
    v-if="notification.show"
    :title="notification.title"
    :description="notification.description"
    :color="notification.color"
    @close="closeNotification"
  />
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
