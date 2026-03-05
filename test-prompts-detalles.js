/**
 * TEST DE PROMPTS DETALLADOS - Múltiples imágenes con prompts visibles
 * Ejecutar: node test-prompts-detalles.js
 */

const geminiImageService = require('./src/services/geminiImageService');
const diccionario = require('./src/config/diccionarioPrompts');
const fs = require('fs').promises;
const path = require('path');

// Configuración de tests
const TESTS = [
  {
    id: 1,
    nombre: 'Letras Neón - Bar Moderno',
    datos: {
      categoria: 'letras-neon',
      nombreNegocio: 'NOVA LOUNGE',
      estiloVisual: 'moderno',
      colores: [
        { id: 'azul', hex: '#0033A0', nombre: 'Azul' },
        { id: 'rosa', hex: '#FF33CC', nombre: 'Rosa' }
      ],
      tipografia: { id: 'bebas', nombre: 'Bebas Neue' },
      colorLuzLed: 'azul',
      tipoNegocio: 'eventos',
      fachada: 'oscura'
    }
  },
  {
    id: 2,
    nombre: 'Letras Corpóreas - Restaurante Elegante',
    datos: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'BISTRO ROYAL',
      estiloVisual: 'elegante',
      colores: [
        { id: 'dorado-metalico', hex: '#D4AF37', nombre: 'Dorado Metálico' },
        { id: 'negro', hex: '#1D1D1D', nombre: 'Negro' }
      ],
      tipografia: { id: 'playfair', nombre: 'Playfair Display' },
      tipoLetraCorporea: 'aluminio-con-luz',
      espesor: 10,
      colorLuzLed: 'blanco-calido',
      tipoNegocio: 'restaurante',
      fachada: 'marmol'
    }
  },
  {
    id: 3,
    nombre: 'Rótulo Luminoso - Tienda de Moda',
    datos: {
      categoria: 'rotulos',
      nombreNegocio: 'STYLE STUDIO',
      estiloVisual: 'minimalista',
      colores: [
        { id: 'blanco', hex: '#FFFFFF', nombre: 'Blanco' },
        { id: 'negro', hex: '#1D1D1D', nombre: 'Negro' }
      ],
      tipografia: { id: 'montserrat', nombre: 'Montserrat' },
      tipoNegocio: 'tienda_ropa',
      fachada: 'blanca'
    }
  }
];

async function guardarPrompt(nombre, prompt, metadata) {
  const content = `
================================================================================
PROMPT GENERADO - ${nombre}
================================================================================
FECHA: ${new Date().toISOString()}
MODELO: gemini-3.1-flash-image-preview

--------------------------------------------------------------------------------
CONFIGURACIÓN DEL DISEÑO:
--------------------------------------------------------------------------------
${JSON.stringify(metadata, null, 2)}

--------------------------------------------------------------------------------
PROMPT COMPLETO:
--------------------------------------------------------------------------------
${prompt}

--------------------------------------------------------------------------------
LONGITUD: ${prompt.length} caracteres
================================================================================
`;
  
  const filename = `PROMPT_${nombre.replace(/\s+/g, '_')}_${Date.now()}.txt`;
  const filepath = path.join(__dirname, 'uploads', filename);
  await fs.writeFile(filepath, content);
  return filename;
}

async function generarImagenConPrompt(testCase) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🎨 TEST #${testCase.id}: ${testCase.nombre.toUpperCase()}`);
  console.log('='.repeat(80));
  
  // Mostrar configuración
  console.log('\n📋 CONFIGURACIÓN:');
  console.log(`   Categoría: ${testCase.datos.categoria}`);
  console.log(`   Negocio: "${testCase.datos.nombreNegocio}"`);
  console.log(`   Estilo: ${testCase.datos.estiloVisual}`);
  console.log(`   Colores: ${testCase.datos.colores.map(c => c.nombre).join(' + ')}`);
  console.log(`   Tipografía: ${testCase.datos.tipografia.nombre}`);
  
  // Construir prompt usando el diccionario
  const prompt = diccionario.construirPrompt(testCase.datos);
  const keywords = diccionario.getKeywords(
    testCase.datos.categoria, 
    testCase.datos.estiloVisual,
    testCase.datos.tipoLetraCorporea ? [testCase.datos.tipoLetraCorporea.split('-')[0]] : []
  );
  
  // Mostrar prompt
  console.log('\n📝 PROMPT GENERADO:');
  console.log('-'.repeat(80));
  console.log(prompt);
  console.log('-'.repeat(80));
  console.log(`📊 Longitud: ${prompt.length} caracteres`);
  console.log(`🔑 Keywords: ${keywords.slice(0, 5).join(', ')}...`);
  
  // Guardar prompt en archivo
  const promptFile = await guardarPrompt(testCase.nombre, prompt, testCase.datos);
  console.log(`💾 Prompt guardado: ${promptFile}`);
  
  // Generar imagen
  console.log('\n⏳ Generando imagen con Gemini...');
  const inicio = Date.now();
  
  try {
    const resultado = await geminiImageService.generarImagenRotulo({
      ...testCase.datos,
      descripcion: { mejorada: prompt }
    });
    
    const duracion = ((Date.now() - inicio) / 1000).toFixed(1);
    
    if (resultado.tipo === 'imagen') {
      // Guardar imagen
      const filename = `TEST_${testCase.id}_${testCase.nombre.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const filepath = await geminiImageService.guardarImagen(
        resultado.imagen.base64,
        filename
      );
      
      console.log(`\n✅ IMAGEN GENERADA EXITOSAMENTE`);
      console.log(`   ⏱️  Tiempo: ${duracion} segundos`);
      console.log(`   📊 Tamaño base64: ${resultado.imagen.base64.length.toLocaleString()} caracteres`);
      console.log(`   🖼️  Archivo: ${filename}`);
      console.log(`   📁 Ruta: ${filepath}`);
      
      return {
        exito: true,
        test: testCase,
        prompt,
        promptFile,
        imagenFile: filename,
        duracion,
        tamano: resultado.imagen.base64.length
      };
    } else {
      console.log('\n⚠️  No se generó imagen (modo prompt)');
      return {
        exito: false,
        test: testCase,
        prompt,
        promptFile,
        error: 'Tipo de respuesta no es imagen'
      };
    }
    
  } catch (error) {
    console.log('\n❌ ERROR:');
    console.log(`   ${error.message}`);
    return {
      exito: false,
      test: testCase,
      prompt,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST DE PROMPTS DETALLADOS - GEMINI IMAGE GENERATION');
  console.log('='.repeat(80));
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log(`🤖 Modelo: gemini-3.1-flash-image-preview`);
  console.log(`🎯 Tests a ejecutar: ${TESTS.length}`);
  
  const resultados = [];
  
  for (const test of TESTS) {
    const resultado = await generarImagenConPrompt(test);
    resultados.push(resultado);
    
    // Pausa entre tests
    if (TESTS.indexOf(test) < TESTS.length - 1) {
      console.log('\n⏸️  Pausa de 2 segundos...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  // Resumen final
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE RESULTADOS');
  console.log('='.repeat(80));
  
  const exitosos = resultados.filter(r => r.exito);
  const fallidos = resultados.filter(r => !r.exito);
  
  console.log(`\n✅ Exitosos: ${exitosos.length}/${TESTS.length}`);
  console.log(`❌ Fallidos: ${fallidos.length}/${TESTS.length}`);
  
  if (exitosos.length > 0) {
    console.log('\n📁 Archivos generados:');
    exitosos.forEach(r => {
      console.log(`   ✓ ${r.imagenFile}`);
      console.log(`     └─ Prompt: ${r.promptFile}`);
    });
  }
  
  if (fallidos.length > 0) {
    console.log('\n⚠️  Tests fallidos:');
    fallidos.forEach(r => {
      console.log(`   ✗ ${r.test.nombre}`);
      console.log(`     └─ Error: ${r.error}`);
    });
  }
  
  // Guardar resumen
  const resumenContent = `
RESUMEN DE TESTS - ${new Date().toISOString()}
================================================================================
Total: ${TESTS.length}
Exitosos: ${exitosos.length}
Fallidos: ${fallidos.length}

TESTS:
${resultados.map(r => `
${r.exito ? '✅' : '❌'} ${r.test.nombre}
   Prompt: ${r.prompt?.substring(0, 100)}...
   ${r.exito ? `Imagen: ${r.imagenFile}` : `Error: ${r.error}`}
`).join('\n')}

ARCHIVOS GENERADOS:
${exitosos.map(r => `- ${r.imagenFile}`).join('\n')}
`;
  
  await fs.writeFile(
    path.join(__dirname, 'uploads', `RESUMEN_TEST_${Date.now()}.txt`),
    resumenContent
  );
  
  console.log('\n' + '='.repeat(80));
  console.log('🏁 TEST COMPLETADO');
  console.log('='.repeat(80));
  
  process.exit(fallidos.length > 0 ? 1 : 0);
}

// Ejecutar tests
runTests().catch(err => {
  console.error('\n❌ ERROR FATAL:', err);
  process.exit(1);
});
