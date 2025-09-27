const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'menuqr',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit', quality: 'auto' }
    ]
  },
});

// Configurar multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB por defecto
  },
  fileFilter: (req, file, cb) => {
    // Tipos de archivo permitidos
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Middleware para manejo de errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'El archivo es demasiado grande. Máximo 5MB permitido.'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Demasiados archivos. Solo se permite un archivo.'
      });
    }
    
    return res.status(400).json({
      error: 'Error al procesar el archivo: ' + err.message
    });
  }
  
  if (err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({
      error: err.message
    });
  }
  
  next(err);
};

// Función para eliminar imagen de Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Error eliminando imagen de Cloudinary:', error);
  }
};

// Middleware específico para diferentes tipos de upload
const uploadMenu = upload.single('image');
const uploadLogo = upload.single('logo');
const uploadMultiple = upload.array('images', 5);

module.exports = {
  upload,
  uploadMenu,
  uploadLogo,
  uploadMultiple,
  handleMulterError,
  deleteFromCloudinary,
  cloudinary
};