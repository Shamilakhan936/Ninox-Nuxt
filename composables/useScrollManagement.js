export const useScrollManagement = () => {
  // Reactive data for scrollbar
  const scrollbarData = ref({})
  const unifiedScrollbarData = ref({ isNeeded: false, width: 0, left: 0 })

  // Unified scrollbar drag variables
  let isUnifiedDragging = false
  let unifiedDragStartX = 0
  let unifiedDragStartScrollLeft = 0

  // Individual scrollbar drag variables
  let isDragging = false
  let dragStartX = 0
  let dragStartScrollLeft = 0
  let currentProductIndex = null

  // Price tooltip state
  const priceTooltip = ref({
    show: false,
    top: 0,
    left: 0
  })

  // Update custom scrollbar position and visibility
  const updateCustomScrollbar = (event, productIndex) => {
    const container = event.target
    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    
    // Check if scrolling is needed
    const isNeeded = scrollWidth > clientWidth
    
    if (!isNeeded) {
      scrollbarData.value[productIndex] = { isNeeded: false }
      return
    }
    
    const trackWidth = clientWidth - 12 // Account for padding in track
    const thumbWidth = Math.max(20, (clientWidth / scrollWidth) * trackWidth)
    const maxThumbPosition = trackWidth - thumbWidth
    const thumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * maxThumbPosition
    
    scrollbarData.value[productIndex] = {
      isNeeded: true,
      width: thumbWidth,
      left: thumbPosition + 6 // 6px offset from track edge
    }
  }

  // Get scroll thumb style
  const getScrollThumbStyle = (productIndex) => {
    const data = scrollbarData.value[productIndex]
    if (!data || !data.isNeeded) return { display: 'none' }
    
    return {
      width: `${data.width}px`,
      left: `${data.left}px`
    }
  }

  // Click on track to scroll to position
  const scrollToPosition = (event, productIndex) => {
    const container = getCurrentScrollContainer(productIndex)
    if (!container) return
    
    const track = event.currentTarget
    const trackRect = track.getBoundingClientRect()
    const clickX = event.clientX - trackRect.left
    
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    const trackWidth = trackRect.width - 12
    
    const scrollRatio = (clickX - 6) / trackWidth // 6px offset
    const newScrollLeft = scrollRatio * (scrollWidth - clientWidth)
    
    container.scrollLeft = Math.max(0, Math.min(scrollWidth - clientWidth, newScrollLeft))
  }

  // Handle scrollbar drag
  const startScrollbarDrag = (event, productIndex) => {
    isDragging = true
    currentProductIndex = productIndex
    dragStartX = event.clientX
    
    const container = getCurrentScrollContainer(productIndex)
    if (container) {
      dragStartScrollLeft = container.scrollLeft
    }
    
    document.addEventListener('mousemove', handleScrollbarDrag)
    document.addEventListener('mouseup', stopScrollbarDrag)
    event.preventDefault()
    event.stopPropagation() // Prevent track click
  }

  const handleScrollbarDrag = (event) => {
    if (!isDragging || currentProductIndex === null) return
    
    const container = getCurrentScrollContainer(currentProductIndex)
    if (!container) return
    
    const deltaX = event.clientX - dragStartX
    const containerWidth = container.clientWidth
    const scrollWidth = container.scrollWidth
    const trackWidth = containerWidth - 12
    
    const scrollRatio = deltaX / trackWidth
    const newScrollLeft = dragStartScrollLeft + (scrollRatio * (scrollWidth - containerWidth))
    
    container.scrollLeft = Math.max(0, Math.min(scrollWidth - containerWidth, newScrollLeft))
  }

  const stopScrollbarDrag = () => {
    isDragging = false
    currentProductIndex = null
    document.removeEventListener('mousemove', handleScrollbarDrag)
    document.removeEventListener('mouseup', stopScrollbarDrag)
  }

  const getCurrentScrollContainer = (productIndex) => {
    return document.querySelector(`[data-ref="scrollContainer_${productIndex}"]`)
  }

  // Update custom scrollbar for unified mode
  const updateUnifiedScrollbar = (event) => {
    const container = event.target
    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    
    // Sync all other unified scroll containers immediately
    syncUnifiedScrollContainers(scrollLeft, container)
    
    // Check if scrolling is needed
    const isNeeded = scrollWidth > clientWidth
    
    if (!isNeeded) {
      unifiedScrollbarData.value = { isNeeded: false }
      return
    }
    
    const trackWidth = clientWidth - 12 // Account for padding in track
    const thumbWidth = Math.max(20, (clientWidth / scrollWidth) * trackWidth)
    const maxThumbPosition = trackWidth - thumbWidth
    const thumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * maxThumbPosition
    
    unifiedScrollbarData.value = {
      isNeeded: true,
      width: thumbWidth,
      left: thumbPosition + 6 // 6px offset from track edge
    }
  }

  // Improved sync function with better event handling
  const syncUnifiedScrollContainers = (scrollLeft, sourceContainer) => {
    // Get current active tab index from the DOM or pass it as parameter
    const containers = []
    
    // Find all unified scroll containers
    document.querySelectorAll('[data-ref^="unifiedScrollContainer_"]').forEach((container) => {
      if (container !== sourceContainer) {
        containers.push(container)
        container.removeEventListener('scroll', updateUnifiedScrollbar)
      }
    })
    
    // Set scroll position for all containers
    containers.forEach(container => {
      container.scrollLeft = scrollLeft
    })
    
    // Re-enable scroll events after a short delay
    setTimeout(() => {
      containers.forEach(container => {
        container.addEventListener('scroll', updateUnifiedScrollbar)
      })
    }, 10)
  }

  // Initialize unified scrollbar
  const initializeUnifiedScrollbar = () => {
    nextTick(() => {
      // Find the first available container
      let firstContainer = null
      const containers = document.querySelectorAll('[data-ref^="unifiedScrollContainer_"]')
      
      if (containers.length > 0) {
        firstContainer = containers[0]
      }
      
      if (firstContainer) {
        // Reset all containers to scroll position 0
        setAllUnifiedScrollPositions(0)
        
        // Update scrollbar based on first container
        updateUnifiedScrollbar({ target: firstContainer })
      }
    })
  }

  // Helper function to set scroll position for all unified containers
  const setAllUnifiedScrollPositions = (scrollLeft) => {
    const containers = document.querySelectorAll('[data-ref^="unifiedScrollContainer_"]')
    
    // Collect all containers and remove event listeners
    const containerArray = Array.from(containers)
    
    containerArray.forEach(container => {
      container.removeEventListener('scroll', updateUnifiedScrollbar)
    })
    
    // Set scroll position for all containers
    containerArray.forEach(container => {
      container.scrollLeft = scrollLeft
    })
    
    // Re-enable scroll events after all containers are updated
    setTimeout(() => {
      containerArray.forEach(container => {
        container.addEventListener('scroll', updateUnifiedScrollbar)
      })
      
      // Update scrollbar position if we have containers
      if (containerArray.length > 0) {
        updateUnifiedScrollbar({ target: containerArray[0] })
      }
    }, 10)
  }

  // Click on unified track to scroll to position
  const scrollUnifiedToPosition = (event) => {
    const firstContainer = document.querySelector('[data-ref="unifiedScrollContainer_0"]')
    if (!firstContainer) return
    
    const track = event.currentTarget
    const trackRect = track.getBoundingClientRect()
    const clickX = event.clientX - trackRect.left
    
    const scrollWidth = firstContainer.scrollWidth
    const clientWidth = firstContainer.clientWidth
    const trackWidth = trackRect.width - 12
    
    const scrollRatio = (clickX - 6) / trackWidth // 6px offset
    const newScrollLeft = scrollRatio * (scrollWidth - clientWidth)
    const finalScrollLeft = Math.max(0, Math.min(scrollWidth - clientWidth, newScrollLeft))
    
    // Set scroll position for all containers
    setAllUnifiedScrollPositions(finalScrollLeft)
  }

  // Start unified scrollbar drag
  const startUnifiedScrollbarDrag = (event) => {
    isUnifiedDragging = true
    unifiedDragStartX = event.clientX
    
    const firstContainer = document.querySelector('[data-ref="unifiedScrollContainer_0"]')
    if (firstContainer) {
      unifiedDragStartScrollLeft = firstContainer.scrollLeft
    }
    
    document.addEventListener('mousemove', handleUnifiedScrollbarDrag)
    document.addEventListener('mouseup', stopUnifiedScrollbarDrag)
    event.preventDefault()
    event.stopPropagation()
  }

  // Handle unified scrollbar drag
  const handleUnifiedScrollbarDrag = (event) => {
    if (!isUnifiedDragging) return
    
    const firstContainer = document.querySelector('[data-ref="unifiedScrollContainer_0"]')
    if (!firstContainer) return
    
    const deltaX = event.clientX - unifiedDragStartX
    const containerWidth = firstContainer.clientWidth
    const scrollWidth = firstContainer.scrollWidth
    const trackWidth = containerWidth - 12
    
    const scrollRatio = deltaX / trackWidth
    const newScrollLeft = unifiedDragStartScrollLeft + (scrollRatio * (scrollWidth - containerWidth))
    const finalScrollLeft = Math.max(0, Math.min(scrollWidth - containerWidth, newScrollLeft))
    
    // Set scroll position for all containers
    setAllUnifiedScrollPositions(finalScrollLeft)
  }

  // Stop unified scrollbar drag
  const stopUnifiedScrollbarDrag = () => {
    isUnifiedDragging = false
    document.removeEventListener('mousemove', handleUnifiedScrollbarDrag)
    document.removeEventListener('mouseup', stopUnifiedScrollbarDrag)
  }

  // Get unified scroll thumb style
  const getUnifiedScrollThumbStyle = () => {
    const data = unifiedScrollbarData.value
    if (!data || !data.isNeeded) return { display: 'none' }
    
    return {
      width: `${data.width}px`,
      left: `${data.left}px`
    }
  }

  // Initialize scrollbars
  const initializeScrollbars = (activeTabIndex, orders) => {
    nextTick(() => {
      if (activeTabIndex.value >= 0 && orders.value[activeTabIndex.value]) {
        orders.value[activeTabIndex.value].products.forEach((_, index) => {
          const container = getCurrentScrollContainer(index)
          if (container) {
            updateCustomScrollbar({ target: container }, index)
          }
        })
      }
    })
  }

  // Price tooltip functions
  const showPriceTooltip = (event, productIndex) => {
    const iconElement = event.currentTarget
    const rect = iconElement.getBoundingClientRect()
    
    // Position tooltip above and to the right of the icon
    const tooltipTop = rect.top - 40 // 40px above the icon
    const tooltipLeft = rect.left + rect.width + 10 // 10px to the right of the icon
    
    // Ensure tooltip doesn't go off screen
    const tooltipWidth = 120 // Approximate tooltip width
    const tooltipHeight = 35 // Approximate tooltip height
    
    let finalTop = tooltipTop
    let finalLeft = tooltipLeft
    
    // Adjust if tooltip would go off the right edge
    if (finalLeft + tooltipWidth > window.innerWidth) {
      finalLeft = rect.left - tooltipWidth - 10 // Show to the left instead
    }
    
    // Adjust if tooltip would go off the top edge
    if (finalTop < 0) {
      finalTop = rect.bottom + 10 // Show below instead
    }
    
    priceTooltip.value = {
      show: true,
      top: finalTop,
      left: finalLeft
    }
  }

  const hidePriceTooltip = () => {
    priceTooltip.value.show = false
  }

  // Scroll mode toggle
  const toggleScrollMode = (isUnifiedScroll, showNotification) => {
    isUnifiedScroll.value = !isUnifiedScroll.value
    
    // Reset scrollbar data when switching modes
    if (isUnifiedScroll.value) {
      scrollbarData.value = {}
      nextTick(() => {
        initializeUnifiedScrollbar()
      })
    } else {
      unifiedScrollbarData.value = { isNeeded: false }
      nextTick(() => {
        // Initialize individual scrollbars - you'll need to pass the required params
      })
    }
    
    showNotification({
      title: 'Scroll Mode Changed',
      description: `Switched to ${isUnifiedScroll.value ? 'unified' : 'individual'} scrolling mode.`,
      color: 'blue'
    })
  }

  return {
    // Reactive data
    scrollbarData,
    unifiedScrollbarData,
    priceTooltip,
    
    // Individual scrollbar functions
    updateCustomScrollbar,
    getScrollThumbStyle,
    scrollToPosition,
    startScrollbarDrag,
    initializeScrollbars,
    
    // Unified scrollbar functions
    updateUnifiedScrollbar,
    getUnifiedScrollThumbStyle,
    scrollUnifiedToPosition,
    startUnifiedScrollbarDrag,
    initializeUnifiedScrollbar,
    
    // Price tooltip functions
    showPriceTooltip,
    hidePriceTooltip,
    
    // Scroll mode
    toggleScrollMode
  }
} 