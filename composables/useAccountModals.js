export const useAccountModals = () => {
  // Modal states
  const showLanguageModal = ref(false)
  const showPasswordModal = ref(false)
  const isUpdating = ref(false)
  
  // Form data
  const selectedLanguage = ref('English')
  const passwordForm = ref({
    current: '',
    new: '',
    confirm: ''
  })

  // Computed properties
  const isPasswordFormValid = computed(() => {
    return passwordForm.value.current && 
           passwordForm.value.new && 
           passwordForm.value.confirm &&
           passwordForm.value.new === passwordForm.value.confirm &&
           passwordForm.value.new.length >= 8
  })

  // Modal management
  const openLanguageModal = (currentLanguage) => {
    selectedLanguage.value = currentLanguage || 'English'
    showLanguageModal.value = true
  }

  const closeLanguageModal = () => {
    showLanguageModal.value = false
    selectedLanguage.value = 'English'
  }

  const openPasswordModal = () => {
    passwordForm.value = {
      current: '',
      new: '',
      confirm: ''
    }
    showPasswordModal.value = true
  }

  const closePasswordModal = () => {
    showPasswordModal.value = false
    passwordForm.value = {
      current: '',
      new: '',
      confirm: ''
    }
  }

  return {
    // State
    showLanguageModal,
    showPasswordModal,
    isUpdating,
    selectedLanguage,
    passwordForm,
    
    // Computed
    isPasswordFormValid,
    
    // Methods
    openLanguageModal,
    closeLanguageModal,
    openPasswordModal,
    closePasswordModal
  }
} 