const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede ser mayor a 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No incluir en queries por defecto
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'admin'
  },
  restaurantId: {
    type: String,
    required: [true, 'El ID del restaurante es requerido'],
    trim: true
  },
  restaurantName: {
    type: String,
    required: [true, 'El nombre del restaurante es requerido'],
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  whatsappConfig: {
    phoneNumber: {
      type: String,
      default: null
    },
    accessToken: {
      type: String,
      default: null
    },
    phoneNumberId: {
      type: String,
      default: null
    },
    isEnabled: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para mejorar performance
userSchema.index({ email: 1 });
userSchema.index({ restaurantId: 1 });
userSchema.index({ createdAt: -1 });

// Middleware para hashear password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear la password si ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  try {
    // Hashear password con costo 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para actualizar último login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('User', userSchema);