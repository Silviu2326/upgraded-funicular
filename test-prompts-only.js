/**
 * ============================================================================
 * TEST RÁPIDO DE PROMPTS - Sin llamar a la API
 * Verifica que los prompts se generen correctamente
 * ============================================================================
 */

// Simulamos el servicio para extraer la lógica de generación de prompts
class MockPromptService {
  generarPromptTest(disenioData) {
    const {
      categoria,
      nombreNegocio,
      estiloVisual = 'moderno',
      colores = [],
      colorLuzLed,
      corporeaTipo,
      espesor,
      sistemaIluminacion,
      material
    } = disenioData;
    
    const textoCompleto = nombreNegocio;
    const colorDesc = colores.map(c => c.nombre || c.hex).join(' and ');
    
    let promptBase = '';
    
    if (categoria === 'letras-neon') {
      const colorLuz = colorLuzLed || 'warm white';
      
      promptBase = `[PRODUCT TYPE: REAL NEON SIGN - LED NEON FLEX TUBES]

⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
- Product: LED neon flex tubes (silicone/flex material, NOT solid letters)
- Construction: Continuous flexible LED tube forming letters
- NO solid materials (no aluminum, no PVC, no acrylic blocks)
- NO 3D channel letters with returns/sides

SPECIFICATIONS:
- Tube type: LED neon flex, 8-10mm diameter
- Color: ${colorDesc} glowing tubes with ${colorLuz} light emission
- Backing: Optional clear acrylic panel OR individual mounting
- Effect: Continuous glow along tube length

TEXT TO CREATE: "${textoCompleto}"
Style: ${estiloVisual}`;

    } else if (categoria === 'letras-corporeas') {
      const matDesc = material || 'aluminum';
      const depth = espesor || 8;
      
      let tipoIluminacion = '';
      if (sistemaIluminacion === 'trasera' || corporeaTipo?.includes('retroiluminada')) {
        tipoIluminacion = 'BACKLIT';
      } else if (sistemaIluminacion === 'frontal' || corporeaTipo?.includes('iluminada')) {
        tipoIluminacion = 'FRONT-LIT';
      } else {
        tipoIluminacion = 'NON-LIT';
      }

      promptBase = `[PRODUCT TYPE: 3D CHANNEL LETTERS - SOLID CONSTRUCTION]

⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
- Product: SOLID 3D channel letters with RETURNS/SIDES
- Material: ${matDesc} (solid, NOT flexible tubes)
- Construction: Front face + side returns + back block
- Depth: ${depth}cm thick visible on all sides
- NO neon tubes, NO LED flex, NO continuous glowing strips

SPECIFICATIONS:
- Material: ${matDesc} with ${colorDesc} finish
- Type: ${tipoIluminacion}

TEXT TO CREATE: "${textoCompleto}"
Style: ${estiloVisual}`;

    } else if (categoria === 'lonas-pancartas' || categoria === 'lonas') {
      promptBase = `[PRODUCT TYPE: PRINTED VINYL BANNER - FLEXIBLE FABRIC]

⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
- Product: FLAT printed vinyl banner/lona (flexible fabric)
- Material: PVC vinyl fabric, textile material
- Thickness: Thin flexible sheet (1-2mm max)
- NO rigid structure, NO 3D depth, NO solid materials
- NO lights, NO neon, NO illumination of any kind

SPECIFICATIONS:
- Material: Matte vinyl banner fabric
- Print: Flat ink on fabric surface
- Hardware: Metal grommets (ojales) at corners

TEXT: "${textoCompleto}" printed FLAT on fabric
Style: ${estiloVisual}`;
    }
    
    return promptBase;
  }
}

// Colores
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

// Tests
const testCases = [
  {
    name: 'NEÓN',
    data: {
      categoria: 'letras-neon',
      nombreNegocio: 'CAFÉ ROMA',
      estiloVisual: 'vintage',
      colores: [{ nombre: 'Dorado', hex: '#FFD700' }],
      colorLuzLed: 'blanco-calido'
    },
    mustInclude: ['LED neon flex', 'tubes', 'NO solid', 'glowing'],
    mustExclude: ['SOLID', 'channel letters', 'PVC block']
  },
  {
    name: 'CORPÓREAS ALUMINIO',
    data: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'HOTEL',
      estiloVisual: 'moderno',
      colores: [{ nombre: 'Blanco', hex: '#FFFFFF' }],
      corporeaTipo: 'aluminio-con-luz',
      espesor: 8,
      sistemaIluminacion: 'frontal'
    },
    mustInclude: ['SOLID', '3D CHANNEL LETTERS', 'aluminum', '8cm', 'FRONT-LIT'],
    mustExclude: ['neon flex', 'tube', 'glass']
  },
  {
    name: 'CORPÓREAS PVC SIN LUZ',
    data: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'SHOP',
      estiloVisual: 'minimalista',
      colores: [{ nombre: 'Negro', hex: '#000000' }],
      corporeaTipo: 'pvc',
      espesor: 5
    },
    mustInclude: ['SOLID', 'PVC', '5cm', 'NON-LIT', 'NO illumination'],
    mustExclude: ['neon', 'glowing', 'backlight']
  },
  {
    name: 'LONA',
    data: {
      categoria: 'lonas-pancartas',
      nombreNegocio: 'PROMO 50%',
      estiloVisual: 'llamativo',
      colores: [{ nombre: 'Rojo', hex: '#FF0000' }]
    },
    mustInclude: ['VINYL BANNER', 'FLAT printed', 'flexible fabric', 'grommets'],
    mustExclude: ['neon', 'LED', '3D', 'solid', 'channel']
  }
];

const service = new MockPromptService();

console.log('\n');
console.log('╔' + '═'.repeat(78) + '╗');
console.log('║' + ' '.repeat(25) + 'TEST RÁPIDO DE PROMPTS' + ' '.repeat(29) + '║');
console.log('╚' + '═'.repeat(78) + '╝');
console.log('\n');

let totalPassed = 0;
let totalFailed = 0;

testCases.forEach((test, idx) => {
  console.log(`\n${'─'.repeat(80)}`);
  log('TEST', `${idx + 1}. ${test.name}`, 'blue');
  console.log('─'.repeat(80) + '\n');
  
  const prompt = service.generarPromptTest(test.data);
  const promptLower = prompt.toLowerCase();
  
  console.log(colors.cyan + 'PROMPT GENERADO:' + colors.reset);
  console.log(prompt);
  console.log('\n');
  
  // Verificar inclusiones
  console.log(colors.yellow + 'VERIFICANDO DEBE INCLUIR:' + colors.reset);
  let passed = true;
  
  test.mustInclude.forEach(keyword => {
    const found = promptLower.includes(keyword.toLowerCase());
    if (found) {
      console.log(`  ✅ "${keyword}"`);
    } else {
      console.log(`  ❌ "${keyword}" NO ENCONTRADO`);
      passed = false;
    }
  });
  
  // Verificar exclusiones
  console.log('\n' + colors.yellow + 'VERIFICANDO NO DEBE INCLUIR:' + colors.reset);
  test.mustExclude.forEach(keyword => {
    const found = promptLower.includes(keyword.toLowerCase());
    if (!found) {
      console.log(`  ✅ "${keyword}" correctamente ausente`);
    } else {
      console.log(`  ❌ "${keyword}" ENCONTRADO (no debería estar)`);
      passed = false;
    }
  });
  
  // Resultado
  if (passed) {
    log('RESULTADO', '✅ PASÓ', 'green');
    totalPassed++;
  } else {
    log('RESULTADO', '❌ FALLÓ', 'red');
    totalFailed++;
  }
});

console.log('\n\n');
console.log('╔' + '═'.repeat(78) + '╗');
console.log('║' + ' '.repeat(30) + 'RESUMEN' + ' '.repeat(39) + '║');
console.log('╠' + '═'.repeat(78) + '╣');
console.log(`║ TOTAL: ${testCases.length.toString().padEnd(5)} | PASADOS: ${colors.green}${totalPassed.toString().padEnd(3)}${colors.reset} | FALLADOS: ${colors.red}${totalFailed}${colors.reset}${' '.repeat(33)} ║`);
console.log('╚' + '═'.repeat(78) + '╝');
console.log('\n');

process.exit(totalFailed > 0 ? 1 : 0);
