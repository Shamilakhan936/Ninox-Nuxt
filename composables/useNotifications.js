export const useNotifications = () => {
  const notification = ref({
    show: false,
    title: '',
    description: '',
    color: 'green'
  })

  const showNotification = (notify) => {
    notification.value = {
      id: Date.now().toString(),
      show: true,
      title: notify.title || 'Notification',
      description: notify.description || '',
      color: notify.color || 'blue'
    }
  }

  return {
    notification,
    showNotification
  }
} 