/**
 * ============================================================================
 * TEST COMPLETO DE TODAS LAS CATEGORÍAS DE RÓTULOS
 * Verifica que cada tipo genere el prompt correcto
 * ============================================================================
 */

const mockupService = require('./src/services/mockupService');

// Colores de consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(title, message, color = 'reset') {
  console.log(`${colors[color]}${colors.bright}[${title}]${colors.reset} ${message}`);
}

function logPrompt(prompt, maxLength = 500) {
  const lines = prompt.split('\n').slice(0, 20);
  console.log('\n' + colors.cyan + '─'.repeat(80) + colors.reset);
  lines.forEach(line => {
    console.log(colors.cyan + '│ ' + colors.reset + line.substring(0, 100));
  });
  if (prompt.split('\n').length > 20) {
    console.log(colors.cyan + '│ ' + colors.reset + '... [truncado]');
  }
  console.log(colors.cyan + '─'.repeat(80) + colors.reset + '\n');
}

// Configuraciones de test para cada categoría
const testCases = [
  {
    name: 'LETRAS NEÓN',
    category: 'letras-neon',
    data: {
      categoria: 'letras-neon',
      nombreNegocio: 'CAFÉ ROMA',
      estiloVisual: 'vintage',
      colores: [{ nombre: 'Dorado', hex: '#FFD700' }],
      colorLuzLed: 'blanco-calido'
    },
    validations: [
      'LED neon flex',
      'tubes',
      'NO solid',
      'glowing'
    ]
  },
  {
    name: 'LETRAS CORPÓREAS ALUMINIO',
    category: 'letras-corporeas',
    data: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'DENTAL CARE',
      estiloVisual: 'moderno',
      colores: [{ nombre: 'Blanco', hex: '#FFFFFF' }],
      corporeaTipo: 'aluminio-con-luz',
      espesor: 8,
      sistemaIluminacion: 'frontal'
    },
    validations: [
      'SOLID',
      '3D CHANNEL LETTERS',
      'aluminum',
      '8cm depth',
      'returns',
      'NO neon'
    ]
  },
  {
    name: 'LETRAS CORPÓREAS PVC RETROILUMINADA',
    category: 'letras-corporeas',
    data: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'HOTEL PARADISE',
      estiloVisual: 'elegante',
      colores: [{ nombre: 'Negro', hex: '#000000' }],
      corporeaTipo: 'pvc-retroiluminadas',
      espesor: 10,
      sistemaIluminacion: 'trasera'
    },
    validations: [
      'SOLID',
      'PVC',
      '10cm depth',
      'BACKLIT',
      'halo',
      'NO neon'
    ]
  },
  {
    name: 'LETRAS CORPÓREAS SIN LUZ',
    category: 'letras-corporeas',
    data: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'BOUTIQUE MODA',
      estiloVisual: 'minimalista',
      colores: [{ nombre: 'Dorado', hex: '#D4AF37' }],
      corporeaTipo: 'aluminio-sin-luz',
      espesor: 5
    },
    validations: [
      'SOLID',
      'aluminum',
      'NO illumination',
      'non-lit',
      'NO neon'
    ]
  },
  {
    name: 'LONA PUBLICITARIA',
    category: 'lonas-pancartas',
    data: {
      categoria: 'lonas-pancartas',
      nombreNegocio: 'GRAND OPENING 50% OFF',
      estiloVisual: 'llamativo',
      colores: [
        { nombre: 'Rojo', hex: '#FF0000' },
        { nombre: 'Amarillo', hex: '#FFFF00' }
      ],
      tipoNegocioLona: 'general',
      estiloLona: 'festivo'
    },
    validations: [
      'VINYL BANNER',
      'FLAT printed',
      'flexible fabric',
      'grommets',
      'NO 3D',
      'NO neon',
      'NO lights'
    ]
  },
  {
    name: 'LONA RESTAURANTE',
    category: 'lonas',
    data: {
      categoria: 'lonas',
      nombreNegocio: 'PIZZA ITALIANA DESDE 1990',
      estiloVisual: 'clasico',
      colores: [
        { nombre: 'Verde', hex: '#00A651' },
        { nombre: 'Blanco', hex: '#FFFFFF' },
        { nombre: 'Rojo', hex: '#DA291C' }
      ],
      tipoNegocioLona: 'restaurante',
      estiloLona: 'retro'
    },
    validations: [
      'VINYL BANNER',
      'printed',
      'textile',
      'NO neon',
      'NO LED',
      'flat'
    ]
  },
  {
    name: 'CORTE LÁSER METACRILATO',
    category: 'corte-laser',
    data: {
      categoria: 'corte-laser',
      nombreNegocio: 'SPA ZEN',
      estiloVisual: 'minimalista',
      colores: [{ nombre: 'Transparente', hex: '#E8F4F8' }],
      materialLaser: 'transparente'
    },
    validations: [
      'LASER CUT',
      'FLAT PANEL',
      'cut-outs',
      'acrylic',
      'NO 3D letters',
      'solid sheet'
    ]
  }
];

async function runTest(testCase) {
  log('TEST', `Probando: ${testCase.name}`, 'blue');
  
  try {
    // Llamar al servicio
    console.log('Enviando petición a Gemini...');
    const startTime = Date.now();
    
    const result = await mockupService.generarRotuloAislado(testCase.data);
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Generación completada en ${duration}ms`);
    
    // Verificar que se recibió imagen
    if (!result.imagenBase64) {
      log('ERROR', 'No se recibió imagen base64', 'red');
      return false;
    }
    
    // Mostrar prompt generado
    log('PROMPT', 'Prompt generado:', 'yellow');
    logPrompt(result.prompt);
    
    // Validar contenido del prompt
    log('VALIDACIÓN', 'Verificando palabras clave...', 'cyan');
    const promptLower = result.prompt.toLowerCase();
    const missingKeywords = [];
    
    for (const keyword of testCase.validations) {
      const found = promptLower.includes(keyword.toLowerCase());
      if (found) {
        console.log(`  ✅ "${keyword}"`);
      } else {
        console.log(`  ❌ "${keyword}" NO ENCONTRADO`);
        missingKeywords.push(keyword);
      }
    }
    
    // Verificar prohibiciones según categoría
    log('PROHIBICIONES', 'Verificando que NO tenga elementos incorrectos...', 'cyan');
    let hasErrors = false;
    
    if (testCase.category === 'lonas-pancartas' || testCase.category === 'lonas') {
      const forbidden = ['neon tube', 'led strip', '3d letter', 'channel letter'];
      for (const word of forbidden) {
        if (promptLower.includes(word)) {
          console.log(`  ❌ PROBLEMA: Contiene "${word}" (no debería estar)`);
          hasErrors = true;
        }
      }
    }
    
    if (testCase.category === 'letras-corporeas') {
      const forbidden = ['neon tube', 'flexible tube', 'glass tube', 'led neon'];
      for (const word of forbidden) {
        if (promptLower.includes(word)) {
          console.log(`  ❌ PROBLEMA: Contiene "${word}" (corpóreas son sólidas, no tubos)`);
          hasErrors = true;
        }
      }
    }
    
    if (testCase.category === 'letras-neon') {
      const forbidden = ['solid letter', 'channel letter', 'pvc block', 'aluminum block'];
      for (const word of forbidden) {
        if (promptLower.includes(word)) {
          console.log(`  ❌ PROBLEMA: Contiene "${word}" (neón son tubos, no sólidos)`);
          hasErrors = true;
        }
      }
    }
    
    if (!hasErrors) {
      console.log('  ✅ No contiene elementos prohibidos');
    }
    
    // Resumen
    if (missingKeywords.length === 0 && !hasErrors) {
      log('RESULTADO', '✅ TEST PASADO', 'green');
    } else {
      log('RESULTADO', '⚠️ TEST CON ADVERTENCIAS', 'yellow');
      if (missingKeywords.length > 0) {
        console.log(`   Palabras clave faltantes: ${missingKeywords.join(', ')}`);
      }
    }
    
    return { success: true, missingKeywords, hasErrors, duration };
    
  } catch (error) {
    log('ERROR', error.message, 'red');
    console.error(error);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'TEST DE CATEGORÍAS DE RÓTULOS' + ' '.repeat(27) + '║');
  console.log('║' + ' '.repeat(15) + 'Verificación de prompts por tipo de producto' + ' '.repeat(22) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('\n');
  
  const results = [];
  
  for (let i = 0; i < testCases.length; i++) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TEST ${i + 1} de ${testCases.length}`);
    console.log('='.repeat(80) + '\n');
    
    const result = await runTest(testCases[i]);
    results.push({
      name: testCases[i].name,
      category: testCases[i].category,
      ...result
    });
    
    // Esperar entre tests para no saturar la API
    if (i < testCases.length - 1) {
      console.log('\n⏳ Esperando 2 segundos antes del siguiente test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Resumen final
  console.log('\n\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(30) + 'RESUMEN FINAL' + ' '.repeat(35) + '║');
  console.log('╠' + '═'.repeat(78) + '╣');
  
  let passed = 0;
  let failed = 0;
  
  results.forEach((r, idx) => {
    const status = r.success && !r.hasErrors ? '✅ PASÓ' : '❌ FALLÓ';
    const color = r.success && !r.hasErrors ? colors.green : colors.red;
    console.log(`║ ${idx + 1}. ${r.name.padEnd(40)} ${status.padEnd(10)} ${(r.duration ? r.duration + 'ms' : 'N/A').padStart(10)} ║`);
    
    if (r.success && !r.hasErrors) passed++;
    else failed++;
    
    if (r.missingKeywords && r.missingKeywords.length > 0) {
      console.log(`║    ⚠️  Faltan: ${r.missingKeywords.join(', ').substring(0, 50)}${r.missingKeywords.join(', ').length > 50 ? '...' : ''}${' '.repeat(50)} ║`);
    }
  });
  
  console.log('╠' + '═'.repeat(78) + '╣');
  console.log(`║ TOTAL: ${(passed + '/' + results.length).padEnd(10)} | PASADOS: ${colors.green}${(passed + '').padEnd(3)}${colors.reset} | FALLADOS: ${colors.red}${failed}${colors.reset}${' '.repeat(25)} ║`);
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Ejecutar tests
console.log('Iniciando tests...');
console.log('API Key configurada:', process.env.GEMINI_API_KEY ? '✅ Sí' : '❌ No');

if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY no está configurada');
  process.exit(1);
}

runAllTests().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
