export const useAccountManagement = () => {
  // Reactive state
  const userProfile = ref({
    phone: '',
    mobile: '',
    language: 'English',
    isAdmin: false,
    role: 'Order products'
  })

  const companyInfo = ref({
    name: '',
    email: '',
    website: '',
    country: '',
    state: '',
    street: '',
    postalCode: '',
    city: ''
  })

  const otherUsers = ref([])
  const isLoading = ref(false)

  // Language options
  const languageOptions = [
    'English',
    'Icelandic', 
    'Danish',
    'Swedish',
    'Norwegian'
  ]

  // Fetch user profile data
  const fetchUserProfile = async (userEmail) => {
    if (!userEmail) return

    isLoading.value = true
    
    try {
      // This would be replaced with actual API call
      const response = await fetch('/api/ninox/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      })
      
      const data = await response.json()
      
      if (data.profile) {
        userProfile.value = { ...userProfile.value, ...data.profile }
      }
      
      if (data.company) {
        companyInfo.value = { ...companyInfo.value, ...data.company }
      }
      
      if (data.users) {
        otherUsers.value = data.users
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Update user language
  const updateLanguage = async (newLanguage, userEmail) => {
    try {
      const response = await fetch('/api/ninox/update-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: userEmail,
          language: newLanguage 
        })
      })
      
      if (response.ok) {
        userProfile.value.language = newLanguage
        return { success: true }
      } else {
        throw new Error('Failed to update language')
      }
    } catch (error) {
      console.error('Error updating language:', error)
      return { success: false, error: error.message }
    }
  }

  // Update user password
  const updatePassword = async (passwordData, userEmail) => {
    try {
      const response = await fetch('/api/ninox/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: userEmail,
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      })
      
      if (response.ok) {
        return { success: true }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    // State
    userProfile,
    companyInfo,
    otherUsers,
    isLoading,
    languageOptions,
    
    // Methods
    fetchUserProfile,
    updateLanguage,
    updatePassword
  }
} 