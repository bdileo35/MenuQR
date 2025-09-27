const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar conexión a base de datos
const connectDB = require('./config/database');

// Importar rutas
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

// Crear aplicación Express
const app = express();

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: {
    error: 'Demasiadas peticiones desde esta IP, intente nuevamente en 15 minutos.'
  }
});

// Middlewares de seguridad y utilidad
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(morgan('combined'));

// Configuración CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-app.vercel.app', 'https://menuqr.vercel.app'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-restaurant-id']
};

app.use(cors(corsOptions));

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MenuQR API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    message: '🍽️ MenuQR API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      menus: '/api/menus',
      whatsapp: '/api/whatsapp'
    }
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Error de cast de MongoDB
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido'
    });
  }
  
  // Error de duplicado (MongoDB)
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'El recurso ya existe'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado'
    });
  }
  
  // Error genérico del servidor
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
if (require.main === module) {
  // Conectar a base de datos
  connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor MenuQR ejecutándose en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;