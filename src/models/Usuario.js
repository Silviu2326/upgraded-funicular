const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres'],
  },

  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido',
    ],
  },

  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false,
  },

  telefono: {
    type: String,
    trim: true,
  },

  // Empresa/Negocio
  empresa: {
    nombre: String,
    direccion: String,
    ciudad: String,
    codigoPostal: String,
    provincia: String,
    cif: String,
  },

  // Rol
  rol: {
    type: String,
    enum: ['usuario', 'admin', 'diseñador'],
    default: 'usuario',
  },

  // Avatar
  avatar: {
    url: String,
    publicId: String,
  },

  // Estado
  activo: {
    type: Boolean,
    default: true,
  },

  verificado: {
    type: Boolean,
    default: false,
  },

  // Tokens
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Metadata
  lastLogin: Date,
  ipAddress: String,

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual para diseños del usuario
usuarioSchema.virtual('disenos', {
  ref: 'Diseno',
  localField: '_id',
  foreignField: 'usuario',
});

// Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para generar JWT
usuarioSchema.methods.getJwtToken = function() {
  return jwt.sign(
    { id: this._id, rol: this.rol },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

// Método para generar token de reseteo de password
usuarioSchema.methods.getResetPasswordToken = function() {
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutos

  return resetToken;
};

// Índices
usuarioSchema.index({ email: 1 });
usuarioSchema.index({ resetPasswordToken: 1 });

module.exports = mongoose.model('Usuario', usuarioSchema);
