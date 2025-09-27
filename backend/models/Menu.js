const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede ser mayor a 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede ser mayor a 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  originalPrice: {
    type: Number,
    min: [0, 'El precio original no puede ser negativo'],
    default: null
  },
  image: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    }
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spicyLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0 // 0: no picante, 1: poco, 2: medio, 3: muy picante
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'lactose', 'nuts', 'eggs', 'soy', 'shellfish', 'fish']
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: 0,
      default: null
    },
    protein: {
      type: Number,
      min: 0,
      default: null
    },
    carbs: {
      type: Number,
      min: 0,
      default: null
    },
    fat: {
      type: Number,
      min: 0,
      default: null
    }
  },
  preparationTime: {
    type: Number,
    min: 0,
    default: null // en minutos
  },
  tags: [{
    type: String,
    trim: true
  }],
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  position: {
    type: Number,
    default: 0
  }
});

const menuSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: [true, 'El ID del restaurante es requerido'],
    unique: true,
    trim: true
  },
  restaurantName: {
    type: String,
    required: [true, 'El nombre del restaurante es requerido'],
    trim: true
  },
  logo: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede ser mayor a 500 caracteres']
  },
  categories: [categorySchema],
  items: [menuItemSchema],
  theme: {
    primaryColor: {
      type: String,
      default: '#2563eb'
    },
    secondaryColor: {
      type: String,
      default: '#64748b'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#1f2937'
    },
    fontFamily: {
      type: String,
      default: 'Inter'
    }
  },
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String
    }
  },
  settings: {
    showPrices: {
      type: Boolean,
      default: true
    },
    showImages: {
      type: Boolean,
      default: true
    },
    showDescriptions: {
      type: Boolean,
      default: true
    },
    showNutritionalInfo: {
      type: Boolean,
      default: false
    },
    allowOrdering: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      default: '$'
    },
    language: {
      type: String,
      default: 'es'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar performance
menuSchema.index({ restaurantId: 1 });
menuSchema.index({ owner: 1 });
menuSchema.index({ createdAt: -1 });
menuSchema.index({ 'items.category': 1 });
menuSchema.index({ 'items.isAvailable': 1 });

// Virtual para obtener categorías activas
menuSchema.virtual('activeCategories').get(function() {
  return this.categories.filter(cat => cat.isActive).sort((a, b) => a.position - b.position);
});

// Virtual para obtener items disponibles por categoría
menuSchema.virtual('itemsByCategory').get(function() {
  const itemsByCategory = {};
  
  this.items.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    if (item.isAvailable) {
      itemsByCategory[item.category].push(item);
    }
  });
  
  // Ordenar items por posición
  Object.keys(itemsByCategory).forEach(category => {
    itemsByCategory[category].sort((a, b) => a.position - b.position);
  });
  
  return itemsByCategory;
});

// Método para agregar categoría
menuSchema.methods.addCategory = function(categoryData) {
  // Establecer posición si no se proporciona
  if (!categoryData.position) {
    categoryData.position = this.categories.length;
  }
  
  this.categories.push(categoryData);
  return this.save();
};

// Método para agregar item
menuSchema.methods.addItem = function(itemData) {
  // Establecer posición si no se proporciona
  if (!itemData.position) {
    const categoryItems = this.items.filter(item => item.category === itemData.category);
    itemData.position = categoryItems.length;
  }
  
  this.items.push(itemData);
  return this.save();
};

// Método para obtener estadísticas
menuSchema.methods.getStats = function() {
  return {
    totalItems: this.items.length,
    availableItems: this.items.filter(item => item.isAvailable).length,
    totalCategories: this.categories.length,
    activeCategories: this.categories.filter(cat => cat.isActive).length,
    popularItems: this.items.filter(item => item.isPopular).length,
    vegetarianItems: this.items.filter(item => item.isVegetarian).length,
    veganItems: this.items.filter(item => item.isVegan).length
  };
};

module.exports = mongoose.model('Menu', menuSchema);