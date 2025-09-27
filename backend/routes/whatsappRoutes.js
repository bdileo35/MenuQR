const express = require('express');
const router = express.Router();
const {
  uploadToWhatsAppStatus,
  getWhatsAppConfig,
  updateWhatsAppConfig,
  verifyWebhook,
  handleWebhook,
  sendMenuLink
} = require('../controllers/whatsappController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Rutas públicas para webhook
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);

// Todas las demás rutas de WhatsApp requieren autenticación
router.use(protect);

// Configuración de WhatsApp
router.get('/config', getWhatsAppConfig);
router.put('/config', adminOnly, updateWhatsAppConfig);

// Subida de imágenes al estado de WhatsApp
router.post('/upload-status', adminOnly, upload.single('image'), uploadToWhatsAppStatus);

// Enviar link del menú
router.post('/send-menu-link', adminOnly, sendMenuLink);

module.exports = router;