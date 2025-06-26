import { useProductManagement } from './useProductManagement'

export const useOrderManagement = () => {
  const { createDefaultProduct } = useProductManagement()

  const createNewOrder = (orders, newOrderName, activeTabIndex) => {
    if (!newOrderName.value) return null
    
    const newOrder = {
      name: newOrderName.value,
      products: [createDefaultProduct()],
      specialInstructions: '',
      client: null
    }
    
    orders.value.push(newOrder)
    activeTabIndex.value = orders.value.length - 1
    newOrderName.value = ''
    
    return {
      title: 'New Order Created',
      description: `Order "${newOrder.name}" has been created with one product row ready.`,
      color: 'green'
    }
  }

  const removeOrder = (orders, activeTabIndex, index) => {
    if (orders.value.length <= 1) {
      return {
        title: 'Error',
        description: 'Cannot remove the last order. You must have at least one order.',
        color: 'red'
      }
    }
    
    const orderName = orders.value[index].name
    orders.value.splice(index, 1)
    
    // If we removed the active tab, switch to the first tab
    if (activeTabIndex.value === index || activeTabIndex.value >= orders.value.length) {
      activeTabIndex.value = 0
    }
    
    return {
      title: 'Order Removed',
      description: `Order "${orderName}" has been removed.`,
      color: 'blue'
    }
  }

  const removeOrderClient = (orders, activeTabIndex) => {
    if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return
    orders.value[activeTabIndex.value].client = null
  }

  const selectClient = (orders, activeTabIndex, client) => {
    if (activeTabIndex.value < 0 || activeTabIndex.value >= orders.value.length) return null
    
    orders.value[activeTabIndex.value].client = client
    
    return {
      title: 'Client Selected',
      description: `${client.fields['First Name']} ${client.fields['Last Name']} has been selected for this order.`,
      color: 'blue'
    }
  }

  return {
    createNewOrder,
    removeOrder,
    removeOrderClient,
    selectClient
  }
} 