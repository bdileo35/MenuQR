const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { generateToken } = require('../middleware/authMiddleware');

// Validaciones para registro
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Ingresa un email válido'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('restaurantName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del restaurante debe tener entre 2 y 100 caracteres')
];

// Validaciones para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Ingresa un email válido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Validar entrada
    await Promise.all(registerValidation.map(validation => validation.run(req)));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { name, email, password, restaurantName, restaurantId: customRestaurantId, phone, address, plan } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'Ya existe un usuario con este email'
      });
    }

    // Usar el ID personalizado si se proporciona, sino generar uno
    let restaurantId;
    if (customRestaurantId) {
      restaurantId = customRestaurantId;
    } else {
      // Generar ID único para el restaurante
      const baseId = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      restaurantId = baseId;
      let counter = 1;
      
      // Verificar que el ID sea único
      while (await prisma.user.findUnique({ where: { restaurantId } })) {
        restaurantId = `${baseId}-${counter}`;
        counter++;
      }
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario y menú en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          restaurantName,
          restaurantId,
          role: 'ADMIN'
        }
      });

      // Crear menú con categorías por defecto
      const menu = await tx.menu.create({
        data: {
          restaurantId,
          restaurantName,
          ownerId: user.id,
          categories: {
            create: [
              { name: 'Entradas', description: 'Aperitivos y entradas', position: 0 },
              { name: 'Principales', description: 'Platos principales', position: 1 },
              { name: 'Postres', description: 'Postres y dulces', position: 2 },
              { name: 'Bebidas', description: 'Bebidas y refrescos', position: 3 }
            ]
          }
        }
      });

      return { user, menu };
    });

    // Generar token
    const token = generateToken(result.user.id);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        restaurantId: result.user.restaurantId,
        restaurantName: result.user.restaurantName,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt
      },
      menu: {
        id: result.menu.id,
        restaurantId: result.menu.restaurantId,
        url: `https://menu-qr-git-main-bdileo35s-projects.vercel.app/${restaurantId}`
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Validar entrada
    await Promise.all(loginValidation.map(validation => validation.run(req)));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Cuenta desactivada. Contacta al administrador'
      });
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generar token
    const token = generateToken(user.id);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        whatsappConfig: {
          phoneNumber: user.whatsappPhone,
          isEnabled: user.whatsappEnabled
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, restaurantName, avatar } = req.body;
    
    // Preparar datos para actualizar
    const updateData = {};
    if (name) updateData.name = name;
    if (restaurantName) updateData.restaurantName = restaurantName;
    if (avatar) updateData.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    // También actualizar el nombre del restaurante en el menú si cambió
    if (restaurantName) {
      await prisma.menu.updateMany({
        where: { ownerId: user.id },
        data: { restaurantName }
      });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario con password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Contraseña actual incorrecta'
      });
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    res.json({
      message: 'Contraseña cambiada exitosamente'
    });
  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  registerValidation,
  loginValidation
};