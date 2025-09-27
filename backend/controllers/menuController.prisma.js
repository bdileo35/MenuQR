const prisma = require('../lib/prisma');
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
  
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('La categoría es requerida'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede ser mayor a 500 caracteres')
];

const categoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre de la categoría debe tener entre 1 y 100 caracteres'),
  
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

    const menu = await prisma.menu.findFirst({ 
      where: { 
        restaurantId, 
        isActive: true 
      },
      include: {
        owner: {
          select: {
            name: true,
            restaurantName: true
          }
        },
        categories: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Calcular estadísticas
    const totalCategories = menu.categories.length;
    const totalItems = menu.categories.reduce((total, category) => total + category.items.length, 0);
    
    const publicMenu = {
      ...menu,
      stats: {
        totalCategories,
        totalItems
      }
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

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
      include: {
        owner: {
          select: {
            name: true,
            restaurantName: true
          }
        },
        categories: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!menu || !menu.isActive) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Calcular estadísticas
    const totalCategories = menu.categories.length;
    const totalItems = menu.categories.reduce((total, category) => total + category.items.length, 0);
    
    const publicMenu = {
      ...menu,
      stats: {
        totalCategories,
        totalItems
      }
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

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    res.json({
      categories: menu.categories
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
    const existingMenu = await prisma.menu.findFirst({ 
      where: { restaurantId: req.user.restaurantId }
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
      ownerId: req.user.id
    };

    if (description) menuData.description = description;

    // Agregar logo si se subió
    if (req.file) {
      menuData.logoUrl = req.file.path;
      menuData.logoPublicId = req.file.filename;
    }

    // Agregar configuraciones opcionales con defaults
    menuData.themeColors = theme?.colors || 'blue,white';
    menuData.contact = contact || '';
    menuData.whatsappPhone = settings?.whatsappPhone || '';
    menuData.welcomeMessage = settings?.welcomeMessage || `¡Bienvenido a ${restaurantName}!`;
    menuData.showPrices = settings?.showPrices !== undefined ? settings.showPrices : true;

    const menu = await prisma.menu.create({
      data: menuData,
      include: {
        owner: {
          select: {
            name: true,
            restaurantName: true
          }
        },
        categories: true
      }
    });

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

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (restaurantName) updateData.restaurantName = restaurantName;
    if (description !== undefined) updateData.description = description;
    if (theme?.colors) updateData.themeColors = theme.colors;
    if (contact !== undefined) updateData.contact = contact;
    if (settings?.whatsappPhone !== undefined) updateData.whatsappPhone = settings.whatsappPhone;
    if (settings?.welcomeMessage !== undefined) updateData.welcomeMessage = settings.welcomeMessage;
    if (settings?.showPrices !== undefined) updateData.showPrices = settings.showPrices;

    // Actualizar logo si se subió
    if (req.file) {
      // Eliminar logo anterior si existe
      if (menu.logoPublicId) {
        await deleteFromCloudinary(menu.logoPublicId);
      }
      
      updateData.logoUrl = req.file.path;
      updateData.logoPublicId = req.file.filename;
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        owner: {
          select: {
            name: true,
            restaurantName: true
          }
        },
        categories: {
          include: {
            items: true
          }
        }
      }
    });

    res.json({
      message: 'Menú actualizado exitosamente',
      menu: updatedMenu
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

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: {
          include: {
            items: true
          }
        }
      }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({
        error: 'No tienes permisos para eliminar este menú'
      });
    }

    // Eliminar imágenes de Cloudinary
    const imagesToDelete = [];
    
    if (menu.logoPublicId) {
      imagesToDelete.push(menu.logoPublicId);
    }

    // Recopilar todas las imágenes de items y categorías
    for (const category of menu.categories) {
      if (category.imagePublicId) {
        imagesToDelete.push(category.imagePublicId);
      }
      
      for (const item of category.items) {
        if (item.imagePublicId) {
          imagesToDelete.push(item.imagePublicId);
        }
      }
    }

    // Eliminar menú (esto eliminará en cascada las categorías e items)
    await prisma.menu.delete({
      where: { id: parseInt(id) }
    });

    // Eliminar imágenes de Cloudinary
    for (const publicId of imagesToDelete) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.warn(`Error eliminando imagen ${publicId}:`, err);
      }
    }

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

// @desc    Agregar categoría al menú
// @route   POST /api/menus/:id/categories
// @access  Private (Admin)
const addCategory = async (req, res) => {
  try {
    await Promise.all(categoryValidation.map(validation => validation.run(req)));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { name, description } = req.body;

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    // Obtener la próxima posición
    const lastCategory = await prisma.category.findFirst({
      where: { menuId: parseInt(id) },
      orderBy: { position: 'desc' }
    });

    const categoryData = {
      name,
      menuId: parseInt(id),
      position: (lastCategory?.position || 0) + 1
    };

    if (description) categoryData.description = description;

    // Agregar imagen si se subió
    if (req.file) {
      categoryData.imageUrl = req.file.path;
      categoryData.imagePublicId = req.file.filename;
    }

    const category = await prisma.category.create({
      data: categoryData,
      include: {
        items: true
      }
    });

    res.status(201).json({
      message: 'Categoría agregada exitosamente',
      category
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    
    console.error('Error en addCategory:', error);
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
    const { name, description, price, categoryId, allergens, isSpicy, isVegetarian, isGlutenFree } = req.body;

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category || category.menuId !== parseInt(id)) {
      return res.status(400).json({
        error: 'Categoría inválida'
      });
    }

    // Obtener la próxima posición en la categoría
    const lastItem = await prisma.menuItem.findFirst({
      where: { categoryId: parseInt(categoryId) },
      orderBy: { position: 'desc' }
    });

    const itemData = {
      name,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      position: (lastItem?.position || 0) + 1,
      isSpicy: isSpicy === 'true' || isSpicy === true,
      isVegetarian: isVegetarian === 'true' || isVegetarian === true,
      isGlutenFree: isGlutenFree === 'true' || isGlutenFree === true
    };

    if (description) itemData.description = description;
    if (allergens) itemData.allergens = allergens;

    // Agregar imagen si se subió
    if (req.file) {
      itemData.imageUrl = req.file.path;
      itemData.imagePublicId = req.file.filename;
    }

    const item = await prisma.menuItem.create({
      data: itemData,
      include: {
        category: true
      }
    });

    res.status(201).json({
      message: 'Item agregado exitosamente',
      item
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
    const { name, description, price, categoryId, allergens, isSpicy, isVegetarian, isGlutenFree, isAvailable } = req.body;

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    const item = await prisma.menuItem.findUnique({
      where: { id: parseInt(itemId) }
    });

    if (!item) {
      return res.status(404).json({
        error: 'Item no encontrado'
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (categoryId) updateData.categoryId = parseInt(categoryId);
    if (allergens !== undefined) updateData.allergens = allergens;
    if (isSpicy !== undefined) updateData.isSpicy = isSpicy === 'true' || isSpicy === true;
    if (isVegetarian !== undefined) updateData.isVegetarian = isVegetarian === 'true' || isVegetarian === true;
    if (isGlutenFree !== undefined) updateData.isGlutenFree = isGlutenFree === 'true' || isGlutenFree === true;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable === 'true' || isAvailable === true;

    // Actualizar imagen si se subió
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (item.imagePublicId) {
        await deleteFromCloudinary(item.imagePublicId);
      }
      
      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id: parseInt(itemId) },
      data: updateData,
      include: {
        category: true
      }
    });

    res.json({
      message: 'Item actualizado exitosamente',
      item: updatedItem
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

    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!menu) {
      return res.status(404).json({
        error: 'Menú no encontrado'
      });
    }

    // Verificar propiedad
    if (menu.ownerId !== req.user.id && req.user.role !== 'OWNER') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este menú'
      });
    }

    const item = await prisma.menuItem.findUnique({
      where: { id: parseInt(itemId) }
    });

    if (!item) {
      return res.status(404).json({
        error: 'Item no encontrado'
      });
    }

    // Eliminar imagen de Cloudinary si existe
    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    // Eliminar item
    await prisma.menuItem.delete({
      where: { id: parseInt(itemId) }
    });

    res.json({
      message: 'Item eliminado exitosamente'
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
  addCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
};