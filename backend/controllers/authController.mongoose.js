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

    const { name, email, password, restaurantName } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Ya existe un usuario con este email'
      });
    }

    // Generar ID único para el restaurante
    const baseId = restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let restaurantId = baseId;
    let counter = 1;
    
    // Verificar que el ID sea único
    while (await User.findOne({ restaurantId }) || await Menu.findOne({ restaurantId })) {
      restaurantId = `${baseId}-${counter}`;
      counter++;
    }

    // Crear nuevo usuario
    const user = new User({
      name,
      email,
      password,
      restaurantId,
      restaurantName,
      role: 'admin' // Por defecto, los usuarios registrados son administradores
    });

    await user.save();

    // Crear menú inicial vacío con categorías por defecto
    const menu = new Menu({
      restaurantId,
      restaurantName,
      owner: user._id,
      categories: [
        { name: 'Entradas', description: 'Aperitivos y entradas', position: 0, isActive: true },
        { name: 'Principales', description: 'Platos principales', position: 1, isActive: true },
        { name: 'Postres', description: 'Postres y dulces', position: 2, isActive: true },
        { name: 'Bebidas', description: 'Bebidas y refrescos', position: 3, isActive: true }
      ],
      items: []
    });

    await menu.save();

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      menu: {
        id: menu._id,
        restaurantId: menu.restaurantId,
        url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${restaurantId}`
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

    // Buscar usuario y incluir password para comparación
    const user = await User.findOne({ email }).select('+password');
    
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
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await user.updateLastLogin();

    // Generar token
    const token = generateToken(user._id);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        avatar: user.avatar,
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
    const user = req.user;
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        whatsappConfig: user.whatsappConfig,
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
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Actualizar campos permitidos
    if (name) user.name = name;
    if (restaurantName) user.restaurantName = restaurantName;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
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
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

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