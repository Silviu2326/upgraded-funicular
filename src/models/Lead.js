const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    trim: true
  },
  aceptaComunicaciones: {
    type: Boolean,
    default: false
  },
  categoriaInteres: {
    type: String
  },
  nombreNegocio: {
    type: String
  },
  estado: {
    type: String,
    enum: ['nuevo', 'contactado', 'calificado', 'descartado'],
    default: 'nuevo'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
