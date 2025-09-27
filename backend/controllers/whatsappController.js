const User = require('../models/User');
const axios = require('axios');

// @desc    Obtener configuración de WhatsApp
// @route   GET /api/whatsapp/config
// @access  Private
const getWhatsAppConfig = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Solo devolver configuración básica sin tokens sensibles
    const config = {
      phoneNumber: user.whatsappConfig.phoneNumber,
      isEnabled: user.whatsappConfig.isEnabled,
      hasTokens: !!(user.whatsappConfig.accessToken && user.whatsappConfig.phoneNumberId)
    };

    res.json({
      config
    });
  } catch (error) {
    console.error('Error en getWhatsAppConfig:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar configuración de WhatsApp
// @route   PUT /api/whatsapp/config
// @access  Private (Admin)
const updateWhatsAppConfig = async (req, res) => {
  try {
    const { phoneNumber, accessToken, phoneNumberId, isEnabled } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Actualizar configuración
    if (phoneNumber !== undefined) user.whatsappConfig.phoneNumber = phoneNumber;
    if (accessToken !== undefined) user.whatsappConfig.accessToken = accessToken;
    if (phoneNumberId !== undefined) user.whatsappConfig.phoneNumberId = phoneNumberId;
    if (isEnabled !== undefined) user.whatsappConfig.isEnabled = isEnabled;

    await user.save();

    res.json({
      message: 'Configuración de WhatsApp actualizada exitosamente',
      config: {
        phoneNumber: user.whatsappConfig.phoneNumber,
        isEnabled: user.whatsappConfig.isEnabled,
        hasTokens: !!(user.whatsappConfig.accessToken && user.whatsappConfig.phoneNumberId)
      }
    });
  } catch (error) {
    console.error('Error en updateWhatsAppConfig:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Subir imagen al estado de WhatsApp
// @route   POST /api/whatsapp/upload-status
// @access  Private (Admin)
const uploadToWhatsAppStatus = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No se proporcionó ninguna imagen'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.whatsappConfig.isEnabled) {
      return res.status(400).json({
        error: 'WhatsApp no está configurado o habilitado'
      });
    }

    const { accessToken, phoneNumberId } = user.whatsappConfig;
    const { caption } = req.body;

    if (!accessToken || !phoneNumberId) {
      return res.status(400).json({
        error: 'Configuración de WhatsApp incompleta'
      });
    }

    try {
      // Paso 1: Subir la imagen a WhatsApp Media API
      const mediaResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/media`,
        {
          file: req.file.path, // URL de Cloudinary
          type: 'image',
          messaging_product: 'whatsapp'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const mediaId = mediaResponse.data.id;

      // Paso 2: Crear el estado de WhatsApp
      const statusResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: 'status@broadcast', // Para estados
          type: 'image',
          image: {
            id: mediaId,
            caption: caption || `¡Mira nuestro delicioso menú! 🍽️\n\nVisita: ${process.env.FRONTEND_URL}/${user.restaurantId}`
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      res.json({
        message: 'Imagen subida al estado de WhatsApp exitosamente',
        data: {
          mediaId,
          statusId: statusResponse.data.messages[0].id,
          imageUrl: req.file.path
        }
      });

    } catch (whatsappError) {
      console.error('Error de WhatsApp API:', whatsappError.response?.data || whatsappError.message);
      
      let errorMessage = 'Error al subir a WhatsApp';
      
      if (whatsappError.response?.data?.error) {
        const error = whatsappError.response.data.error;
        errorMessage = error.message || error.error_user_msg || errorMessage;
      }

      return res.status(400).json({
        error: errorMessage,
        details: whatsappError.response?.data
      });
    }

  } catch (error) {
    console.error('Error en uploadToWhatsAppStatus:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// @desc    Webhook para verificación de WhatsApp
// @route   GET /api/whatsapp/webhook
// @access  Public
const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('Webhook verificado');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

// @desc    Webhook para recibir eventos de WhatsApp
// @route   POST /api/whatsapp/webhook
// @access  Public
const handleWebhook = (req, res) => {
  const body = req.body;

  if (body.object) {
    if (body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      console.log('Mensaje recibido:', JSON.stringify(message, null, 2));
      
      // Aquí puedes agregar lógica para procesar mensajes entrantes
      // Por ejemplo, responder automáticamente con el link del menú
    }

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};

// @desc    Enviar link del menú por WhatsApp
// @route   POST /api/whatsapp/send-menu-link
// @access  Private (Admin)
const sendMenuLink = async (req, res) => {
  try {
    const { phoneNumber, customMessage } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        error: 'Número de teléfono requerido'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.whatsappConfig.isEnabled) {
      return res.status(400).json({
        error: 'WhatsApp no está configurado o habilitado'
      });
    }

    const { accessToken, phoneNumberId } = user.whatsappConfig;

    if (!accessToken || !phoneNumberId) {
      return res.status(400).json({
        error: 'Configuración de WhatsApp incompleta'
      });
    }

    const menuUrl = `${process.env.FRONTEND_URL}/${user.restaurantId}`;
    const defaultMessage = `¡Hola! 👋\n\n🍽️ Te comparto nuestro menú digital:\n${menuUrl}\n\n¡Esperamos verte pronto!`;
    
    const message = customMessage || defaultMessage;

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      res.json({
        message: 'Link del menú enviado exitosamente',
        data: {
          messageId: response.data.messages[0].id,
          to: phoneNumber
        }
      });

    } catch (whatsappError) {
      console.error('Error de WhatsApp API:', whatsappError.response?.data || whatsappError.message);
      
      let errorMessage = 'Error al enviar mensaje por WhatsApp';
      
      if (whatsappError.response?.data?.error) {
        const error = whatsappError.response.data.error;
        errorMessage = error.message || error.error_user_msg || errorMessage;
      }

      return res.status(400).json({
        error: errorMessage,
        details: whatsappError.response?.data
      });
    }

  } catch (error) {
    console.error('Error en sendMenuLink:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getWhatsAppConfig,
  updateWhatsAppConfig,
  uploadToWhatsAppStatus,
  verifyWebhook,
  handleWebhook,
  sendMenuLink
};