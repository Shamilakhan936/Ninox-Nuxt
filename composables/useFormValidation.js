export const useFormValidation = () => {
  const isFormValid = computed(() => {
    const currentOrder = orders.value[activeTabIndex.value]
    if (!currentOrder) return false
    
    // Must have a client
    if (!currentOrder.client) return false
    
    // Current order must have at least one product
    if (currentOrder.products.length === 0) return false
    
    // All products must have required fields
    for (const product of currentOrder.products) {
      if (!product.productType) return false
      if (!product.width || !product.height) return false
      if (!product.fabricId && !product.fabricDetails) return false
      if (!product.fabricColorId && !product.fabricColorDetails) return false
      if (product.isMotorized && !product.motorType) return false
      if (!product.isMotorized && !product.controlSide) return false
      if (!product.mountLocation) return false
      if (product.productType === 'Roller Shades' && !product.rollDirection) return false
      if (product.quantity < 1) return false
    }
    
    return true
  })

  return {
    isFormValid
  }
} 