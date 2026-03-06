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
// ENDPOINT: Generación completa (2 rótulos + 2 mockups exteriores)
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

    console.log('🎨 Iniciando generación completa (2 rótulos + 2 mockups)...');
    console.log('Negocio:', disenioData.nombreNegocio);

    const resultados = [];
    const tiempos = [];

    // Generar 2 sets completos (rótulo + mockup exterior)
    for (let i = 1; i <= 2; i++) {
      console.log(`\n🔄 SET ${i}/2:`);
      const inicioSet = Date.now();

      // PASO 1: Generar rótulo (con variación para el segundo)
      console.log(`  📸 Generando rótulo ${i}...`);
      const rotuloData = i === 1 ? disenioData : { ...disenioData, variacion: 2 };
      const rotulo = await mockupService.generarRotuloAislado(rotuloData);
      
      // Guardar rótulo
      const rotuloGuardado = await mockupService.guardarImagen(
        rotulo,
        'uploads/rotulos',
        `rotulo-aislado-${i}`
      );

      // PASO 2: Generar mockup exterior
      console.log(`  🏢 Generando mockup exterior ${i}...`);
      // Variación 1: Vista de fachada cerrada, Variación 2: Vista amplia con contexto del negocio
      const tipoVista = i === 1 ? 'fachada-cerrada' : 'contexto-amplio';
      const mockup = await mockupService._generarMockupExterior(rotulo.imagenBase64, disenioData, tipoVista);
      
      // Guardar mockup
      let mockupGuardado = null;
      if (mockup.success) {
        mockupGuardado = await mockupService.guardarImagen(
          mockup,
          'uploads/mockups/exterior',
          `mockup-exterior-${i}`
        );
      }

      const tiempoSet = Date.now() - inicioSet;
      tiempos.push(tiempoSet);

      resultados.push({
        id: i,
        rotulo: {
          base64: rotulo.imagenBase64,
          url: rotuloGuardado.url,
          tamanoKB: (rotulo.imagenBase64.length * 0.75 / 1024).toFixed(1),
          prompt: rotulo.prompt
        },
        mockup: {
          tipo: 'exterior',
          success: mockup.success,
          base64: mockup.imagenBase64,
          url: mockupGuardado?.url || null,
          tamanoKB: mockup.imagenBase64 ? (mockup.imagenBase64.length * 0.75 / 1024).toFixed(1) : null,
          error: mockup.error || null
        }
      });

      console.log(`  ✅ Set ${i} completado en ${(tiempoSet/1000).toFixed(1)}s`);
    }

    const tiempoTotal = tiempos.reduce((a, b) => a + b, 0);
    console.log(`\n✅ Generación completa: 2 sets finalizados en ${(tiempoTotal/1000).toFixed(1)}s`);

    res.json({
      success: true,
      sets: resultados,
      tiempos: {
        set1: tiempos[0],
        set2: tiempos[1],
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
