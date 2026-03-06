const mongoose = require('mongoose');

const disenoSchema = new mongoose.Schema({
  // Información del usuario
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false,
  },
  
  // Datos del lead (si no está registrado)
  lead: {
    nombre: String,
    email: String,
    telefono: String,
  },

  // Información del negocio
  nombreNegocio: {
    type: String,
    required: [true, 'El nombre del negocio es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres'],
  },

  // Texto principal del rótulo
  texto: {
    type: String,
    required: [true, 'El texto del rótulo es obligatorio'],
    trim: true,
    maxlength: [100, 'El texto no puede tener más de 100 caracteres'],
  },

  // Categoría seleccionada
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'rotulos',
      'letras-neon',
      'rigidos-impresos',
      'letras-corporeas',
      'lonas-pancartas',
      'banderolas',
      'vinilos',
      'rollup',
      'photocall',
      'carteles-inmobiliarios',
      'mupis',
      'flybanner',
    ],
  },

  // Material seleccionado
  material: {
    type: String,
    enum: ['pvc', 'aluminio', 'metacrilato', 'acero', ''],
    default: '',
  },

  // Tipografía
  tipografia: {
    id: String,
    nombre: String,
    familia: String,
  },

  // Colores seleccionados (HSB + predefinidos)
  colores: [{
    nombre: String,
    hex: String,
  }],
  
  // Colores seleccionados del color picker HSB
  coloresSeleccionados: [{
    type: String,
  }],

  // Color de fondo
  colorFondo: {
    id: String,
    hex: String,
  },

  // Color del texto
  colorTexto: {
    id: String,
    hex: String,
  },

  // Orientación
  orientacion: {
    type: String,
    enum: ['horizontal', 'vertical', 'cuadrado'],
    default: 'horizontal',
  },

  // Texto adicional (teléfono, eslogan...)
  textoAdicional: {
    type: String,
    maxlength: [200, 'El texto adicional no puede tener más de 200 caracteres'],
  },

  // Logo
  logo: {
    url: String,
    publicId: String,
    modoIntegracion: {
      type: String,
      enum: ['exacto'],
      default: 'exacto',
    },
  },

  // Fachada seleccionada
  fachada: {
    type: String,
    default: 'blanca',
  },

  // Estilo visual
  estiloVisual: {
    type: String,
    enum: ['moderno', 'clasico', 'elegante', 'minimalista', 'llamativo', 'industrial', 'vintage', 'neon', 'luxury'],
    default: 'moderno',
  },

  // Extras
  iluminacion: {
    type: Boolean,
    default: false,
  },
  
  instalacion: {
    type: Boolean,
    default: false,
  },

  // Configuración específica por tipo de producto
  configEspecifica: {
    // Letras corpóreas
    tipoLetraCorporea: {
      type: String,
      enum: ['aluminio-sin-luz', 'pvc', 'aluminio-con-luz', 'pvc-retroiluminadas', 'metacrilato', 'pvc-impreso-uv', 'aluminio-retroiluminada', 'dibond-sin-relieve'],
    },
    espesor: {
      type: String,
      enum: ['3cm', '5cm', '8cm', '10cm', '13cm', '15cm', '16cm', '20cm', 'Sin relieve'],
    },
    colorLuzLed: {
      type: String,
      enum: ['blanco-calido', 'blanco-frio', 'rojo', 'verde', 'azul-celeste', 'azul', 'naranja', 'amarillo', 'rosa', 'morado'],
    },
    materialLaser: {
      type: String,
      enum: ['transparente', 'blanco', 'mdf', 'oro-espejo', 'plata-espejo', 'rosa-espejo'],
    },
    acabadoSuperficial: {
      type: String,
      enum: ['lacado-brillo', 'lacado-mate', 'cepillado', 'espejo'],
    },
    
    // Lonas
    tipoNegocioLona: {
      type: String,
      enum: ['bar', 'restaurante', 'tienda', 'peluqueria', 'gimnasio', 'oficina', 'taller', 'clinica', 
             'cafeteria', 'panaderia', 'floristeria', 'tienda-mascotas', 'tienda-ropa', 'ferreteria', 
             'optica', 'farmacia', 'general'],
    },
    estiloLona: {
      type: String,
      enum: ['festivo', 'elegante', 'retro', 'moderno', 'natural', 'urbano', 'playa', 'minimalista', 'industrial', 'vintage'],
    },
  },

  // Descripción del diseño
  descripcion: {
    original: String,
    mejorada: String,
    promptImagen: String,
  },

  // Dimensiones
  dimensiones: {
    ancho: {
      type: Number,
      required: [true, 'El ancho es obligatorio'],
      min: [10, 'El ancho mínimo es 10cm'],
      max: [500, 'El ancho máximo es 500cm'],
    },
    alto: {
      type: Number,
      required: [true, 'El alto es obligatorio'],
      min: [10, 'El alto mínimo es 10cm'],
      max: [500, 'El alto máximo es 500cm'],
    },
  },

  // Imágenes generadas
  imagenes: {
    original: {
      url: String,
      publicId: String,
    },
    sinFondo: {
      url: String,
      publicId: String,
    },
    hd: {
      url: String,
      publicId: String,
    },
    generada: {
      url: String,
      publicId: String,
      fecha: Date,
    },
    variaciones: [{
      url: String,
      publicId: String,
      colorVariante: String,
    }],
    fondosLona: [{
      id: Number,
      url: String,
      publicId: String,
      seleccionado: Boolean,
    }],
  },

  // Estado del diseño
  estado: {
    type: String,
    enum: ['pendiente', 'generando', 'completado', 'error'],
    default: 'pendiente',
  },

  // Progreso de generación
  progreso: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  // Presupuesto asociado
  presupuesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto',
  },

  // Metadata
  ipAddress: String,
  userAgent: String,

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual para obtener el precio estimado
disenoSchema.virtual('precioEstimado').get(function() {
  const preciosBase = {
    'rotulos': 89,
    'letras-neon': 45,
    'rigidos-impresos': 35,
    'letras-corporeas': 25,
    'lonas-pancartas': 12,
    'banderolas': 29,
    'vinilos': 18,
    'rollup': 49,
    'photocall': 89,
    'carteles-inmobiliarios': 15,
    'mupis': 35,
    'flybanner': 79,
  };

  const unidades = {
    'rotulos': 'm²',
    'letras-neon': 'letra',
    'rigidos-impresos': 'm²',
    'letras-corporeas': 'letra',
    'lonas-pancartas': 'm²',
    'banderolas': 'unidad',
    'vinilos': 'm²',
    'rollup': 'unidad',
    'photocall': 'unidad',
    'carteles-inmobiliarios': 'unidad',
    'mupis': 'unidad',
    'flybanner': 'unidad',
  };

  const precioBase = preciosBase[this.categoria] || 0;
  const area = (this.dimensiones.ancho * this.dimensiones.alto) / 10000;
  
  let precioEstimado = 0;
  
  if (unidades[this.categoria] === 'm²') {
    precioEstimado = precioBase * area;
  } else {
    const numLetras = this.texto ? this.texto.replace(/\s/g, '').length : 1;
    precioEstimado = precioBase * Math.max(1, numLetras);
  }

  // Extras
  if (this.iluminacion) precioEstimado += 150;
  if (this.instalacion) precioEstimado += 80;

  return Math.round(precioEstimado);
});

// Virtual para obtener área
disenoSchema.virtual('area').get(function() {
  return (this.dimensiones.ancho * this.dimensiones.alto) / 10000;
});

// Índices
disenoSchema.index({ createdAt: -1 });
disenoSchema.index({ categoria: 1 });
disenoSchema.index({ estado: 1 });
disenoSchema.index({ 'lead.email': 1 });
disenoSchema.index({ usuario: 1 });

module.exports = mongoose.model('Diseno', disenoSchema);
