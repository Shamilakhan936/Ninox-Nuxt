export const useProductManagement = () => {
  const createDefaultProduct = () => {
    return {
      productType: '',
      fabricId: null,
      fabricDetails: null,
      fabricColorId: null,
      fabricColorDetails: null,
      width: null,
      height: null,
      quantity: 1,
      controlSide: 'Left',
      chainType: '',
      isMotorized: false,
      motorType: '',
      mountLocation: 'Inside',
      rollDirection: 'Standard',
      hardwareColor: 'White',
      notes: '',
      // Curtain-specific fields
      room: '',
      curtainStyle: '',
      bottomStyle: '',
      headingHeight: null,
      isTwoSided: false,
      lining: '',
      liningCollection: '',
      liningColour: '',
      numberOfPanels: null,
      hooksPp: null,
      hooksTotal: null,
      delivery: '',
      // Roman Shade-specific fields
      shadeStyle: '',
      controlType: 'Manual',
      control: '',
      systemColour: '',
      motorPosition: ''
    }
  }

  const addNewProduct = (orders, activeTabIndex) => {
    if (activeTabIndex < 0 || activeTabIndex >= orders.length) return
    orders[activeTabIndex].products.push(createDefaultProduct())
  }

  const removeProduct = (orders, activeTabIndex, index) => {
    if (activeTabIndex < 0 || activeTabIndex >= orders.length) return
    orders[activeTabIndex].products.splice(index, 1)
  }

  const incrementValue = (product, field, increment) => {
    const currentValue = parseInt(product[field]) || 0
    const newValue = Math.max(field === 'quantity' ? 1 : 0, currentValue + increment)
    product[field] = newValue
  }

  const calculateHooksTotal = (product) => {
    const hooksPp = parseInt(product.hooksPp) || 0
    const numberOfPanels = parseInt(product.numberOfPanels) || 0
    product.hooksTotal = hooksPp * numberOfPanels
  }

  const handleControlTypeChange = (product) => {
    if (product.controlType === 'Manual') {
      product.motorType = ''
      product.isMotorized = false
    } else if (product.controlType === 'Motorized') {
      product.isMotorized = true
    }
  }

  return {
    createDefaultProduct,
    addNewProduct,
    removeProduct,
    incrementValue,
    calculateHooksTotal,
    handleControlTypeChange
  }
} 