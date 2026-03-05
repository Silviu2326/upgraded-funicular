const express = require('express');
const router = express.Router();
const {
  crearLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  addInteraccion,
  convertirLead,
  getStats,
  contactarLead,
} = require('../controllers/leadController');
const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.route('/').post(crearLead);

// Rutas protegidas (solo admin)
router.route('/').get(protect, admin, getLeads);
router.route('/stats/resumen').get(protect, admin, getStats);
router.route('/:id').get(protect, admin, getLead);
router.route('/:id').put(protect, admin, updateLead);
router.route('/:id').delete(protect, admin, deleteLead);
router.route('/:id/interaccion').post(protect, admin, addInteraccion);
router.route('/:id/convertir').put(protect, admin, convertirLead);
router.route('/:id/contactar').put(protect, admin, contactarLead);

module.exports = router;
