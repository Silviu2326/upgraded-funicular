/**
 * ============================================================================
 * MOCKUP ROUTES - API para generación de rótulos y mockups
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const mockupService = require('../services/mockupService');

// ============================================================================
// ENDPOINT: Generar rótulo aislado (Paso 1)
// ============================================================================
router.post('/generar-rotulo', async (req, res) => {
  try {
    const {
      categoria,
      nombreNegocio,
      estiloVisual,
      colores,
      tipografia,
      material,
      colorLuzLed,
      sistemaIluminacion,
      espesor
    } = req.body;

    if (!categoria || !nombreNegocio) {
      return res.status(400).json({
        error: 'categoria y nombreNegocio son requeridos'
      });
    }

    console.log('Generando rótulo aislado...');
    console.log('Datos:', { categoria, nombreNegocio, estiloVisual });

    const resultado = await mockupService.generarRotuloAislado({
      categoria,
      nombreNegocio,
      estiloVisual: estiloVisual || 'moderno',
      colores: colores || [],
      tipografia,
      material,
      colorLuzLed,
      sistemaIluminacion,
      espesor
    });

    // Guardar imagen
    const guardado = await mockupService.guardarImagen(
      resultado, 
      'uploads/rotulos', 
      'rotulo-aislado'
    );

    res.json({
      success: true,
      rotulo: {
        base64: resultado.imagenBase64,
        url: guardado.url,
        tamanoKB: (resultado.imagenBase64.length * 0.75 / 1024).toFixed(1)
      },
      prompt: resultado.prompt,
      guardado: {
        imagen: guardado.imagen,
        nombreBase: guardado.nombreBase
      }
    });

  } catch (error) {
    console.error('Error generando rótulo:', error);
    res.status(500).json({
      error: 'Error generando rótulo',
      message: error.message
    });
  }
});

// ============================================================================
// ENDPOINT: Generar mockups (Paso 2)
// ============================================================================
router.post('/generar-mockups', async (req, res) => {
  try {
    const {
      rotuloBase64,  // Imagen del rótulo generado en paso 1
      categoria,
      nombreNegocio,
      fachada,
      tipoNegocio
    } = req.body;

    if (!rotuloBase64 || !categoria || !nombreNegocio) {
      return res.status(400).json({
        error: 'rotuloBase64, categoria y nombreNegocio son requeridos'
      });
    }

    console.log('Generando mockups...');
    console.log('Tipo negocio:', tipoNegocio);
    console.log('Fachada:', fachada);

    const mockups = await mockupService.generarMockups(rotuloBase64, {
      categoria,
      nombreNegocio,
      fachada,
      tipoNegocio
    });

    // Guardar mockups exitosos
    const mockupsGuardados = [];
    for (const mockup of mockups) {
      if (mockup.success) {
        const guardado = await mockupService.guardarImagen(
          mockup,
          `uploads/mockups/${mockup.tipo}`,
          `mockup-${mockup.tipo}`
        );
        mockupsGuardados.push({
          tipo: mockup.tipo,
          base64: mockup.imagenBase64,
          url: guardado.url,
          tamanoKB: (mockup.imagenBase64.length * 0.75 / 1024).toFixed(1),
          prompt: mockup.prompt
        });
      } else {
        mockupsGuardados.push({
          tipo: mockup.tipo,
          success: false,
          error: mockup.error
        });
      }
    }

    res.json({
      success: true,
      mockups: mockupsGuardados,
      total: mockups.length,
      exitosos: mockups.filter(m => m.success).length
    });

  } catch (error) {
    console.error('Error generando mockups:', error);
    res.status(500).json({
      error: 'Error generando mockups',
      message: error.message
    });
  }
});

// ============================================================================
// ENDPOINT: Generación completa (Paso 1 + Paso 2 en una sola llamada)
// ============================================================================
router.post('/generar-completo', async (req, res) => {
  console.log('📥 POST /generar-completo recibido');
  console.log('Body:', JSON.stringify(req.body, null, 2).substring(0, 500));
  
  try {
    const disenioData = req.body;
    
    if (!disenioData.categoria || !disenioData.nombreNegocio) {
      console.log('❌ Faltan datos requeridos');
      return res.status(400).json({
        error: 'categoria y nombreNegocio son requeridos'
      });
    }

    console.log('🎨 Iniciando generación completa...');
    console.log('Negocio:', disenioData.nombreNegocio);
    if (disenioData.textoAdicional) {
      console.log('Texto adicional:', disenioData.textoAdicional);
    }

    // PASO 1: Generar rótulo aislado
    console.log('\n📸 PASO 1: Generando rótulo aislado...');
    const inicioPaso1 = Date.now();
    
    const rotulo = await mockupService.generarRotuloAislado(disenioData);
    const tiempoPaso1 = Date.now() - inicioPaso1;
    
    console.log(`✅ Rótulo generado en ${(tiempoPaso1/1000).toFixed(1)}s`);

    // Guardar rótulo
    const rotuloGuardado = await mockupService.guardarImagen(
      rotulo,
      'uploads/rotulos',
      'rotulo-aislado'
    );

    // PASO 2: Generar mockups
    console.log('\n🏢 PASO 2: Generando mockups...');
    const inicioPaso2 = Date.now();
    
    const mockups = await mockupService.generarMockups(rotulo.imagenBase64, disenioData);
    const tiempoPaso2 = Date.now() - inicioPaso2;
    
    console.log(`✅ Mockups generados en ${(tiempoPaso2/1000).toFixed(1)}s`);

    // Guardar mockups
    const mockupsResultado = [];
    for (const mockup of mockups) {
      if (mockup.success) {
        const guardado = await mockupService.guardarImagen(
          mockup,
          `uploads/mockups/${mockup.tipo}`,
          `mockup-${mockup.tipo}`
        );
        mockupsResultado.push({
          tipo: mockup.tipo,
          success: true,
          base64: mockup.imagenBase64,
          url: guardado.url,
          tamanoKB: (mockup.imagenBase64.length * 0.75 / 1024).toFixed(1)
        });
      } else {
        mockupsResultado.push({
          tipo: mockup.tipo,
          success: false,
          error: mockup.error
        });
      }
    }

    const tiempoTotal = tiempoPaso1 + tiempoPaso2;

    console.log(`\n✅ Generación completa finalizada en ${(tiempoTotal/1000).toFixed(1)}s`);

    res.json({
      success: true,
      rotulo: {
        base64: rotulo.imagenBase64,
        url: rotuloGuardado.url,
        tamanoKB: (rotulo.imagenBase64.length * 0.75 / 1024).toFixed(1),
        prompt: rotulo.prompt
      },
      mockups: mockupsResultado,
      tiempos: {
        rotulo: tiempoPaso1,
        mockups: tiempoPaso2,
        total: tiempoTotal
      }
    });

  } catch (error) {
    console.error('Error en generación completa:', error);
    res.status(500).json({
      error: 'Error en generación completa',
      message: error.message
    });
  }
});

module.exports = router;
