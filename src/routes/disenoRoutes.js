const express = require('express');
const router = express.Router();
const {
  crearDiseno,
  getDisenos,
  getDiseno,
  updateDiseno,
  deleteDiseno,
  generarPrompt,
  analizarLegibilidad,
  subirImagen,
  generarImagen,
  generarFondosLona,
} = require('../controllers/disenoController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadImagen } = require('../middleware/upload');
const geminiImageService = require('../services/geminiImageService');

router
  .route('/')
  .get(protect, getDisenos)
  .post(optionalAuth, crearDiseno);

router
  .route('/:id')
  .get(optionalAuth, getDiseno)
  .put(protect, updateDiseno)
  .delete(protect, deleteDiseno);

router
  .route('/:id/generar-prompt')
  .post(optionalAuth, generarPrompt);

router
  .route('/:id/legibilidad')
  .post(optionalAuth, analizarLegibilidad);

router
  .route('/:id/imagen')
  .post(protect, uploadImagen('imagen'), subirImagen);

router
  .route('/:id/generar-imagen')
  .post(optionalAuth, generarImagen);

router
  .route('/:id/generar-fondos-lona')
  .post(optionalAuth, generarFondosLona);

// Verificar disponibilidad del servicio de imágenes Gemini
router.get('/check/imagen-service', async (req, res) => {
  try {
    const disponibilidad = await geminiImageService.verificarDisponibilidad();
    res.json({
      success: true,
      data: disponibilidad,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
