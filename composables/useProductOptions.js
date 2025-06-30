export const useProductOptions = () => {
  const productTypes = [
    'Roller Shades',
    'Roman Shades',
    'Curtains'
  ]

  const chainTypes = [
    'Metal',
    'Plastic',
    'Cord'
  ]

  const motorTypes = {
    'Roller Shades': [
      'RF Motor',
      'WiFi Motor',
      'Battery Motor',
      'Hard-Wired Motor'
    ],
    'Roman Shades': [
      'RF Motor',
      'WiFi Motor',
      'Battery Motor',
      'Hard-Wired Motor'
    ]
  }

  const curtainOptions = {
    rooms: [
      'Living Room',
      'Bedroom', 
      'Dining Room',
      'Kitchen',
      'Office',
      'Bathroom',
      'Guest Room',
      'Other'
    ],
    curtainStyles: [
      'Tab Top',
      'Eyelet',
      'Pencil Pleat',
      'Pinch Pleat',
      'Wave',
      'Rod Pocket',
      'Grommet'
    ],
    bottomStyles: [
      'Straight',
      'Scalloped',
      'Pointed',
      'Rounded'
    ],
    liningOptions: [
      'No Lining',
      'Standard Lining',
      'Blackout Lining',
      'Thermal Lining',
      'Interlining'
    ],
    liningCollections: [
      'Basic Collection',
      'Premium Collection',
      'Luxury Collection',
      'Eco Collection',
      'Designer Collection'
    ],
    liningColours: [
      'White',
      'Cream',
      'Beige',
      'Light Grey',
      'Charcoal',
      'Black',
      'Ivory',
      'Natural'
    ],
    deliveryOptions: [
      'Standard',
      'Express',
      'Rush',
      'Next Day'
    ]
  }

  const romanShadeOptions = {
    shadeStyles: [
      'Flat Roman',
      'Hobbled Roman',
      'Balloon Roman',
      'Austrian Roman',
      'Relaxed Roman'
    ],
    controlTypes: [
      'Manual',
      'Motorized'
    ],
    systemColours: [
      'White',
      'Black',
      'Silver',
      'Bronze',
      'Antique Gold',
      'Natural Wood',
      'Dark Wood'
    ],
    motorModels: [
      'Standard Model',
      'Premium Model',
      'Smart Model',
      'Pro Model'
    ],
    motorPositions: [
      'Left',
      'Right',
      'Center'
    ],
    accessories: [
      'None',
      'Valance',
      'Side Panels',
      'Tiebacks',
      'Holdbacks'
    ]
  }

  const getMotorTypes = (productType) => {
    return motorTypes[productType] || []
  }

  return {
    productTypes,
    chainTypes,
    motorTypes,
    curtainOptions,
    romanShadeOptions,
    getMotorTypes
  }
} 