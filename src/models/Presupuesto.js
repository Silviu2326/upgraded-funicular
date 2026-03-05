const mongoose = require('mongoose');

const PresupuestoSchema = new mongoose.Schema({
  // Referencias
  diseno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diseno',
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },

  // Información del proyecto
  nombreProyecto: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },

  // Configuración
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'corporeas',
      'neon',
      'vinilo',
      'lona',
      'bandejas',
      'rotulacion',
      'toldos',
      'senaletica',
    ],
  },
  material: {
    type: String,
    required: [true, 'El material es obligatorio'],
  },
  dimensiones: {
    ancho: {
      type: Number,
      required: [true, 'El ancho es obligatorio'],
      min: [0.1, 'El ancho debe ser mayor a 0'],
    },
    alto: {
      type: Number,
      required: [true, 'El alto es obligatorio'],
      min: [0.1, 'El alto debe ser mayor a 0'],
    },
    profundidad: {
      type: Number,
      default: 0,
    },
  },
  complejidad: {
    type: String,
    enum: ['baja', 'media', 'alta', 'premium'],
    default: 'media',
  },
  cantidad: {
    type: Number,
    default: 1,
    min: 1,
  },

  // Extras
  extras: [{
    concepto: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    incluido: {
      type: Boolean,
      default: true,
    },
  }],

  instalacion: {
    incluida: {
      type: Boolean,
      default: false,
    },
    precio: {
      type: Number,
      default: 0,
    },
    dificultad: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media',
    },
  },

  iluminacion: {
    incluida: {
      type: Boolean,
      default: false,
    },
    tipo: {
      type: String,
      enum: ['led', 'neon', 'spot', 'sin-iluminacion'],
      default: 'sin-iluminacion',
    },
    precio: {
      type: Number,
      default: 0,
    },
  },

  // Precios
  precios: {
    material: {
      type: Number,
      required: true,
    },
    extras: {
      type: Number,
      default: 0,
    },
    instalacion: {
      type: Number,
      default: 0,
    },
    iluminacion: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    iva: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },

  // Validez
  validez: {
    dias: {
      type: Number,
      default: 30,
    },
    fechaLimite: {
      type: Date,
    },
  },

  // Estado
  estado: {
    type: String,
    enum: ['pendiente', 'enviado', 'visto', 'aprobado', 'rechazado', 'expirado'],
    default: 'pendiente',
  },

  // Seguimiento
  emailEnviado: {
    type: Boolean,
    default: false,
  },
  fechaEnvio: {
    type: Date,
  },
  fechaAprobacion: {
    type: Date,
  },
  fechaRechazo: {
    type: Date,
  },
  motivoRechazo: {
    type: String,
  },

  // Notas internas
  notasInternas: {
    type: String,
  },

  // Historial de cambios
  historial: [{
    fecha: {
      type: Date,
      default: Date.now,
    },
    accion: String,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    detalles: String,
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar updatedAt
PresupuestoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calcular fecha límite de validez
  if (this.validez.dias && !this.validez.fechaLimite) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + this.validez.dias);
    this.validez.fechaLimite = fecha;
  }
  
  next();
});

// Método para verificar si está expirado
PresupuestoSchema.methods.estaExpirado = function() {
  if (this.estado === 'expirado') return true;
  if (this.validez.fechaLimite && new Date() > this.validez.fechaLimite) {
    this.estado = 'expirado';
    return true;
  }
  return false;
};

module.exports = mongoose.model('Presupuesto', PresupuestoSchema);
