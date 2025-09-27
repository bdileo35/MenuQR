const Menu = require('../models/Menu');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');
const { validationResult, body, param } = require('express-validator');

// Validaciones
const menuValidation = [
  body('restaurantName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del restaurante debe tener entre 2 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede ser mayor a 500 caracteres')
];

const itemValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre del producto debe tener entre 1 y 100 caracteres'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede ser mayor a 500 caracteres')
];

// @desc    Obtener menú por ID de restaurante
// @route   GET /api/menus/restaurant/:restaurantId
// @access  Public
const getMenuByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menu = await Menu.findOne({ 
      restaurantId, 
      isActive: true 
    }).populate('owner', 'name restaurantName');

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Filtrar solo items disponibles para usuarios públicos
    const publicMenu = {
      ...menu.toObject(),
      items: menu.items.filter(item => item.isAvailable),
      stats: menu.getStats()
    };

    res.json({
      menu: publicMenu
    });
  } catch (error) {
    console.error('Error en getMenuByRestaurantId:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener menú por ID
// @route   GET /api/menus/:id
// @access  Public
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id).populate('owner', 'name restaurantName');

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    if (!menu.isActive) {
      return res.status(404).json({
        error: 'Menú no disponible'
      });
    }

    // Para acceso público, solo mostrar items disponibles
    const publicMenu = {
      ...menu.toObject(),
      items: menu.items.filter(item => item.isAvailable),
      stats: menu.getStats()
    };

    res.json({
      menu: publicMenu
    });
  } catch (error) {
    console.error('Error en getMenuById:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener categorías del menú
// @route   GET /api/menus/:id/categories
// @access  Public
const getMenuCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    const categories = menu.activeCategories;

    res.json({
      categories
    });
  } catch (error) {
    console.error('Error en getMenuCategories:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Crear nuevo menú
// @route   POST /api/menus
// @access  Private (Admin)
const createMenu = async (req, res) => {
  try {
    // Validar entrada
    await Promise.all(menuValidation.map(validation => validation.run(req)));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { restaurantName, description, theme, contact, settings } = req.body;

    // Verificar si ya existe un menú para este restaurante
    const existingMenu = await Menu.findOne({ 
      restaurantId: req.user.restaurantId 
    });

    if (existingMenu) {
      return res.status(400).json({
        error: 'Ya existe un menú para este restaurante'
      });
    }

    // Preparar datos del menú
    const menuData = {
      restaurantId: req.user.restaurantId,
      restaurantName,
      description,
      owner: req.user._id
    };

    // Agregar logo si se subió
    if (req.file) {
      menuData.logo = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    // Agregar configuraciones opcionales
    if (theme) menuData.theme = { ...menuData.theme, ...theme };
    if (contact) menuData.contact = contact;
    if (settings) menuData.settings = { ...menuData.settings, ...settings };

    const menu = new Menu(menuData);
    await menu.save();

    res.status(201).json({
      message: 'Menú creado exitosamente',
      menu
    });
  } catch (error) {
    // Eliminar archivo de Cloudinary si hubo error
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    
    console.error('Error en createMenu:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar menú
// @route   PUT /api/menus/:id
// @access  Private (Admin)
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurantName, description, theme, contact, settings } = req.body;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.owner.toString() !== req.user._id.toString() && req.user.role !== 'owner') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    // Actualizar campos
    if (restaurantName) menu.restaurantName = restaurantName;
    if (description) menu.description = description;
    if (theme) menu.theme = { ...menu.theme, ...theme };
    if (contact) menu.contact = { ...menu.contact, ...contact };
    if (settings) menu.settings = { ...menu.settings, ...settings };

    // Actualizar logo si se subió
    if (req.file) {
      // Eliminar logo anterior si existe
      if (menu.logo && menu.logo.publicId) {
        await deleteFromCloudinary(menu.logo.publicId);
      }
      
      menu.logo = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await menu.save();

    res.json({
      message: 'Menú actualizado exitosamente',
      menu
    });
  } catch (error) {
    // Eliminar archivo de Cloudinary si hubo error
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    
    console.error('Error en updateMenu:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar menú
// @route   DELETE /api/menus/:id
// @access  Private (Admin)
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.owner.toString() !== req.user._id.toString() && req.user.role !== 'owner') {
      return res.status(403).json({
        error: 'No tienes permisos para eliminar este menú'
      });
    }

    // Eliminar imágenes de Cloudinary
    if (menu.logo && menu.logo.publicId) {
      await deleteFromCloudinary(menu.logo.publicId);
    }

    // Eliminar imágenes de items y categorías
    for (const item of menu.items) {
      if (item.image && item.image.publicId) {
        await deleteFromCloudinary(item.image.publicId);
      }
    }

    for (const category of menu.categories) {
      if (category.image && category.image.publicId) {
        await deleteFromCloudinary(category.image.publicId);
      }
    }

    await Menu.findByIdAndDelete(id);

    res.json({
      message: 'Menú eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteMenu:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Agregar item al menú
// @route   POST /api/menus/:id/items
// @access  Private (Admin)
const addMenuItem = async (req, res) => {
  try {
    // Validar entrada
    await Promise.all(itemValidation.map(validation => validation.run(req)));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const itemData = req.body;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.owner.toString() !== req.user._id.toString() && req.user.role !== 'owner') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    // Agregar imagen si se subió
    if (req.file) {
      itemData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    // Agregar item usando el método del modelo
    await menu.addItem(itemData);

    res.status(201).json({
      message: 'Item agregado exitosamente',
      menu
    });
  } catch (error) {
    // Eliminar archivo de Cloudinary si hubo error
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    
    console.error('Error en addMenuItem:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar item del menú
// @route   PUT /api/menus/:id/items/:itemId
// @access  Private (Admin)
const updateMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const updateData = req.body;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.owner.toString() !== req.user._id.toString() && req.user.role !== 'owner') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    const item = menu.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        error: 'Item no encontrado'
      });
    }

    // Actualizar campos
    Object.keys(updateData).forEach(key => {
      if (key !== 'image') {
        item[key] = updateData[key];
      }
    });

    // Actualizar imagen si se subió
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (item.image && item.image.publicId) {
        await deleteFromCloudinary(item.image.publicId);
      }
      
      item.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await menu.save();

    res.json({
      message: 'Item actualizado exitosamente',
      menu
    });
  } catch (error) {
    // Eliminar archivo de Cloudinary si hubo error
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    
    console.error('Error en updateMenuItem:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar item del menú
// @route   DELETE /api/menus/:id/items/:itemId
// @access  Private (Admin)
const deleteMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.owner.toString() !== req.user._id.toString() && req.user.role !== 'owner') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    const item = menu.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        error: 'Item no encontrado'
      });
    }

    // Eliminar imagen de Cloudinary si existe
    if (item.image && item.image.publicId) {
      await deleteFromCloudinary(item.image.publicId);
    }

    // Eliminar item
    menu.items.pull(itemId);
    await menu.save();

    res.json({
      message: 'Item eliminado exitosamente',
      menu
    });
  } catch (error) {
    console.error('Error en deleteMenuItem:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getMenuByRestaurantId,
  getMenuById,
  getMenuCategories,
  createMenu,
  updateMenu,
  deleteMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
};