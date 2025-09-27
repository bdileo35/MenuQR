const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas que requieren autenticación
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si no hay token
    if (!token) {
      return res.status(401).json({
        error: 'Acceso denegado. Token no proporcionado.'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar el usuario
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          error: 'Token inválido. Usuario no encontrado.'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          error: 'Cuenta desactivada. Contacta al administrador.'
        });
      }

      // Agregar usuario al objeto request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Token inválido.'
      });
    }
  } catch (error) {
    console.error('Error en middleware protect:', error);
    return res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
};

// Middleware para verificar que el usuario sea administrador
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'owner')) {
    next();
  } else {
    res.status(403).json({
      error: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
};

// Middleware para verificar que el usuario sea propietario
const ownerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(403).json({
      error: 'Acceso denegado. Se requieren permisos de propietario.'
    });
  }
};

// Middleware para verificar que el usuario pertenezca al restaurante
const checkRestaurantAccess = (req, res, next) => {
  const restaurantId = req.params.restaurantId || req.body.restaurantId || req.headers['x-restaurant-id'];
  
  if (!restaurantId) {
    return res.status(400).json({
      error: 'ID de restaurante requerido.'
    });
  }

  if (req.user.role === 'owner') {
    // Los propietarios pueden acceder a cualquier restaurante
    next();
  } else if (req.user.restaurantId === restaurantId) {
    // Los administradores solo pueden acceder a su propio restaurante
    next();
  } else {
    res.status(403).json({
      error: 'Acceso denegado. No tienes permisos para este restaurante.'
    });
  }
};

// Generar JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = {
  protect,
  adminOnly,
  ownerOnly,
  checkRestaurantAccess,
  generateToken
};