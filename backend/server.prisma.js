const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const prisma = require('./lib/prisma');
require('dotenv').config();

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
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'OK',
      message: 'MenuQR API funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'Prisma SQLite - Conectado'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Error de conexión a la base de datos',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    message: '🍽️ MenuQR API',
    version: '1.0.0',
    database: 'Prisma SQLite',
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
  
  // Error de validación de Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'El recurso ya existe',
      field: err.meta?.target
    });
  }
  
  // Error de registro no encontrado en Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Recurso no encontrado'
    });
  }
  
  // Error de validación de Prisma
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Relación inválida',
      field: err.meta?.field_name
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

// Función para cerrar conexiones gracefully
const gracefulShutdown = async (signal) => {
  console.log(`\n🔄 Recibida señal ${signal}. Cerrando servidor...`);
  
  try {
    await prisma.$disconnect();
    console.log('📦 Prisma desconectado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al desconectar Prisma:', error);
    process.exit(1);
  }
};

// Manejar cierre graceful
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Iniciar servidor
if (require.main === module) {
  const server = app.listen(PORT, async () => {
    console.log(`🚀 Servidor MenuQR ejecutándose en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
    
    try {
      await prisma.$connect();
      console.log('📦 Prisma conectado a SQLite correctamente');
    } catch (error) {
      console.error('❌ Error conectando a Prisma:', error);
    }
  });
}

module.exports = app;