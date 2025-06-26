export const useModalManagement = () => {
  const showClientModal = ref(false)
  const showFabricModal = ref(false)
  const showFabricColorModal = ref(false)
  const showProductDetailsModal = ref(false)
  const editingProductIndex = ref(null)
  const editingProduct = ref(null)

  const openClientModal = (clientSearchModalRef) => {
    if (clientSearchModalRef.value) {
      clientSearchModalRef.value.reset()
    }
    showClientModal.value = true
  }

  const openFabricModal = (orders, activeTabIndex, productIndex, fabricSearchModalRef) => {
    if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return null
    
    const product = orders.value[activeTabIndex.value].products[productIndex]
    
    if (!product.productType) {
      return {
        title: 'Select Product Type',
        description: 'Please select a product type before choosing a fabric.',
        color: 'yellow'
      }
    }
    
    editingProductIndex.value = productIndex
    if (fabricSearchModalRef.value) {
      fabricSearchModalRef.value.reset()
    }
    showFabricModal.value = true
    return null
  }

  const openFabricColorModal = (orders, activeTabIndex, productIndex, fabricColorSearchModalRef) => {
    if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return null
    
    const product = orders.value[activeTabIndex.value].products[productIndex]
    
    if (!product.fabricDetails) {
      return {
        title: 'Select Fabric Type First',
        description: 'Please select a fabric type before choosing a fabric color.',
        color: 'yellow'
      }
    }
    
    editingProductIndex.value = productIndex
    if (fabricColorSearchModalRef.value) {
      fabricColorSearchModalRef.value.reset()
    }
    showFabricColorModal.value = true
    return null
  }

  const selectFabric = (orders, activeTabIndex, fabric) => {
    if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return null
    
    const orderIndex = activeTabIndex.value
    const fabricId = fabric.fabricId || fabric.fields['Fabric ID'] || fabric.id
    
    orders.value[orderIndex].products[editingProductIndex.value].fabricDetails = fabric
    orders.value[orderIndex].products[editingProductIndex.value].fabricId = fabricId
    
    editingProductIndex.value = null
    
    return {
      title: 'Fabric Selected',
      description: `${fabric.fields['Fabric Name']} has been selected.`,
      color: 'blue'
    }
  }

  const selectFabricColor = (orders, activeTabIndex, fabricColor) => {
    if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return null
    
    const orderIndex = activeTabIndex.value
    const colorId = fabricColor.id || fabricColor.fields['Color ID']
    
    orders.value[orderIndex].products[editingProductIndex.value].fabricColorDetails = fabricColor
    orders.value[orderIndex].products[editingProductIndex.value].fabricColorId = colorId
    
    editingProductIndex.value = null
    
    return {
      title: 'Fabric Color Selected',
      description: `${fabricColor.fields['Color Name']} has been selected.`,
      color: 'indigo'
    }
  }

  return {
    showClientModal,
    showFabricModal,
    showFabricColorModal,
    showProductDetailsModal,
    editingProductIndex,
    editingProduct,
    openClientModal,
    openFabricModal,
    openFabricColorModal,
    selectFabric,
    selectFabricColor
  }
} 