const express = require('express');
const router = express.Router();
const {
  calcularPresupuesto,
  crearPresupuesto,
  getPresupuestos,
  getPresupuesto,
  updatePresupuesto,
  deletePresupuesto,
  aprobarPresupuesto,
  enviarPresupuesto,
} = require('../controllers/presupuestoController');
const { protect, optionalAuth } = require('../middleware/auth');

router
  .route('/calcular')
  .post(calcularPresupuesto);

router
  .route('/')
  .get(protect, getPresupuestos)
  .post(optionalAuth, crearPresupuesto);

router
  .route('/:id')
  .get(protect, getPresupuesto)
  .put(protect, updatePresupuesto)
  .delete(protect, deletePresupuesto);

router
  .route('/:id/aprobar')
  .put(protect, aprobarPresupuesto);

router
  .route('/:id/enviar')
  .post(protect, enviarPresupuesto);

module.exports = router;
