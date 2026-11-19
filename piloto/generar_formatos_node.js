// Genera los formatos imprimibles de la prueba piloto sin depender de Word.
// Salida: D:\Proyecto_UX\Prueba_piloto\Formatos_imprimibles
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BASE = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'formatos');
const PDFKIT = require(path.join(BASE, 'node_modules', 'pdfkit'));
const FUENTE = 'C:\\Windows\\Fonts\\arial.ttf';
const FUENTE_NEG = 'C:\\Windows\\Fonts\\arialbd.ttf';

const B = [];
const t = v => B.push({ k: 't', v });
const s = v => B.push({ k: 's', v });
const h = v => B.push({ k: 'h', v });
const p = v => B.push({ k: 'p', v });
const page = () => B.push({ k: 'page' });
const tbl = (rows, widths) => B.push({ k: 'tbl', rows, widths });

// ============================================================
// HOJA 1 — CONSENTIMIENTO
// ============================================================
t('1. CONSENTIMIENTO INFORMADO — PRUEBA PILOTO');
s('Evaluación de Experiencia de Usuario · Universidad Veracruzana · Facultad de Estadística e Informática · EE Evaluación de Experiencia de Usuario · Periodo agosto 2026–enero 2027 · Proyecto Biblioteca Alejandría.');
h('Propósito y procedimiento');
p('El propósito es evaluar la facilidad de uso, comprensión de navegación y formularios del módulo administrativo de préstamos. Se solicitará realizar tres tareas: registrar un préstamo, consultar disponibilidad de dos títulos y registrar una devolución. Durante la sesión se pedirá expresar pensamientos en voz alta y responder cuestionarios breves. Duración estimada: 20–30 minutos (confirmar con la duración real del piloto).');
h('Voluntariedad, riesgos y beneficios');
p('La participación es voluntaria. La persona puede no responder alguna pregunta o detener la sesión en cualquier momento, sin penalización. El riesgo previsto es mínimo y puede incluir incomodidad o cansancio leve. No se ofrece compensación económica. La contribución consiste en aportar observaciones para mejorar el sistema.');
h('Confidencialidad y uso de datos');
p('Los registros se identifican con un código (por ejemplo, P01), no con el nombre de la persona. No se capturan datos reales de lectores ni contraseñas. Los archivos se usan para este proyecto académico, con acceso limitado al equipo y se comparten anonimizados. Fecha de eliminación/resguardo al terminar el proyecto: ____________________.');
h('Grabaciones y uso de inteligencia artificial generativa');
p('Las grabaciones son opcionales y se autorizan por separado. La participación no depende de aceptar grabación. El equipo no debe subir audio, video, nombres ni datos personales a herramientas de IA generativa. La IAG, si se usa, se limita a apoyo de redacción o análisis de material anonimizado y se declara en el informe.');
tbl([
  ['Autorización opcional', 'Sí', 'No'],
  ['Acepto participar en la sesión.', '[  ]', '[  ]'],
  ['Autorizo grabación de pantalla.', '[  ]', '[  ]'],
  ['Autorizo grabación de audio/voz.', '[  ]', '[  ]']
], [300, 60, 60]);
p('Declaración: He leído la información anterior, pude hacer preguntas y acepto participar voluntariamente.');
p('Código de participante: ____________________     Fecha: ____ / ____ / ______');
p('Firma del participante: _______________________________________________________');
p('Nombre o firma del responsable que obtiene el consentimiento: ______________________________');

// ============================================================
// HOJA 2 — GUION + TAREAS
// ============================================================
page();
t('2. GUION DEL MODERADOR + CONSIGNAS');
s('Imprimir 1 ejemplar para quien haga de moderador. Leer en voz alta los textos entre comillas. No dar pistas bajo ninguna circunstancia.');
h('1) Apertura y bienvenida');
p('“Hola, gracias por colaborar con nosotros en esta sesión. Mi nombre es __________________. Hoy realizaremos una evaluación de usabilidad del sistema Biblioteca Alejandría, específicamente del módulo administrativo de préstamos. Antes de comenzar, quiero aclarar que estamos evaluando el sistema, no tus habilidades. No existen respuestas correctas o incorrectas; cualquier dificultad que aparezca nos ayudará a identificar oportunidades de mejora.”');
h('2) Pensamiento en voz alta');
p('“Durante las tareas te pediremos que pienses en voz alta. Por favor, comenta qué estás buscando, qué esperas que ocurra, qué entiendes de los mensajes y qué dudas te surgen. No es necesario que expliques todo perfectamente; simplemente comparte lo que pasa por tu mente. Si te quedas en silencio, te recordaré que sigas hablando.”');
h('3) Presentación de cada tarea');
p('“Te voy a leer una situación y una meta. Resuélvela como lo harías en el sistema. No puedo decirte qué menú o botón utilizar porque queremos observar si la interfaz permite encontrar el camino. Cuando consideres que terminaste, di «listo». ¿Comenzamos?”');
h('T01 · Registrar préstamo');
p('“Imagina que trabajas en la biblioteca. Una persona registrada solicita llevarse dos libros que aparecen disponibles. Registra la operación para que quede constancia de quién se lleva los libros y cuándo debe devolverlos.”');
s('Éxito observable: usuario correcto + dos libros + fecha de devolución válida + confirmación verificable.');
h('T02 · Consultar disponibilidad');
p('“Un estudiante se acerca al mostrador para preguntar si existen ejemplares disponibles de dos títulos específicos de literatura. Verifica en el sistema si ambos se encuentran disponibles.”');
s('Éxito observable: localiza ambos títulos y consulta el estado de disponibilidad de cada uno.');
h('T03 · Registrar devolución');
p('“Un lector acude al mostrador a devolver los libros que tenía en préstamo. Actualiza el registro correspondiente para liberar los ejemplares en el inventario.”');
s('Éxito observable: préstamo correcto localizado + retorno registrado + inventario actualizado.');
h('4) Cierre');
p('“Gracias por participar. Terminamos las tareas. Ahora te pediremos responder un cuestionario general y unas preguntas breves sobre tu experiencia. Tus respuestas se analizan usando un código y cualquier grabación se utiliza según lo que autorizaste.”');
h('Datos de prueba (mismos para todos los participantes)');
tbl([
  ['Dato', 'Valor de prueba'],
  ['Usuario registrado para T01', 'Ana Piloto · ana.piloto@alejandria.test (id 24)'],
  ['Libro 1 y Libro 2 de T01', 'Cosmos (id 1) y Sapiens (id 37)'],
  ['Fecha de devolución a asignar', '2026-12-02'],
  ['Título 1 para T02', 'Así habló Zaratustra (id 25)'],
  ['Título 2 para T02', 'La interpretación de los sueños (id 2)'],
  ['Usuario/préstamo para T03', 'Luis Piloto (id 25) · préstamo 30'],
  ['Libros a devolver para T03', 'Código limpio (id 28) e Introducción a los algoritmos (id 29)']
], [190, 320]);
h('Acceso al sistema');
p('URL: http://localhost:3001/Biblioteca  ·  Bibliotecario: admin@alejandria.test / Admin2026');
tbl([
  ['Frases PERMITIDAS', 'Frases PROHIBIDAS'],
  ['¿Qué estás pensando en este momento?', 'Haz clic en préstamos.'],
  ['¿Qué esperabas que ocurriera?', 'El botón está arriba a la derecha.'],
  ['¿Qué te hace elegir esa opción?', 'Selecciona esta opción.'],
  ['Avísame cuando consideres que terminaste.', 'Eso está mal; intenta de nuevo.']
], [265, 245]);

// ============================================================
// HOJA 3 — REGISTRO DE SESIÓN
// ============================================================
page();
t('3. REGISTRO DE SESIÓN — PRUEBA PILOTO');
s('Código P___  |  Una hoja reúne ficha general, desempeño por tarea, criterios, observación y SEQ. Anotar primero qué ocurrió y qué se dijo; interpretar después.');
tbl([
  ['Código: P___', 'Fecha / hora: __________', 'Modalidad / lugar: __________', 'Perfil y experiencia previa: __________'],
  ['Versión del sistema: ________', 'Dispositivo / SO: __________', 'Navegador / resolución / zoom: __________', 'Moderador / observador / control: __________'],
  ['Consentimiento  [ ] Sí  [ ] No', 'Grab. pantalla  [ ] Sí  [ ] No', 'Grab. audio  [ ] Sí  [ ] No', 'Estado  [ ] Válida  [ ] c/incid.  [ ] Inválida'],
  ['Hora inicio / fin: __________', 'Roles rotados (quién hizo qué): __________', '', '']
], [132, 132, 132, 132]);
h('Desempeño por tarea');
tbl([
  ['Tarea', 'Resultado', 'Tiempo mm:ss', 'Errores', 'Reintentos', 'Ayudas', 'SEQ 1–5'],
  ['T01', '[ ]T [ ]P [ ]A [ ]F', '', '', '', '', ''],
  ['T02', '[ ]T [ ]P [ ]A [ ]F', '', '', '', '', ''],
  ['T03', '[ ]T [ ]P [ ]A [ ]F', '', '', '', '', '']
], [40, 105, 72, 60, 72, 60, 50]);
s('Resultado: T = Total · P = Parcial · A = Con ayuda · F = Fracaso. SEQ: 1 Muy difícil · 2 Difícil · 3 Neutral · 4 Fácil · 5 Muy fácil. Ayuda = transcribir qué se dijo.');
h('Ficha de cumplimiento de criterios');
tbl([
  ['Criterio', '¿Cumple?', 'Observación'],
  ['T01 · Usuario correcto vinculado', '[ ] Sí   [ ] No', ''],
  ['T01 · Dos libros correctos añadidos', '[ ] Sí   [ ] No', ''],
  ['T01 · Fecha de devolución válida', '[ ] Sí   [ ] No', ''],
  ['T01 · Confirmación/estado verificable', '[ ] Sí   [ ] No', ''],
  ['T02 · Título 1 localizado y estado consultado', '[ ] Sí   [ ] No', ''],
  ['T02 · Título 2 localizado y estado consultado', '[ ] Sí   [ ] No', ''],
  ['T03 · Préstamo correcto localizado', '[ ] Sí   [ ] No', ''],
  ['T03 · Devolución registrada', '[ ] Sí   [ ] No', ''],
  ['T03 · Inventario/estado actualizado', '[ ] Sí   [ ] No', '']
], [300, 90, 129]);
h('Formato de observación detallada');
tbl([
  ['Hora / paso', 'Tarea', 'Acción observable', 'Cita literal (anonimizada)', 'Error / duda / retroceso / ayuda', 'Evidencia'],
  ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''],
  ['', '', '', '', '', ''], ['', '', '', '', '', '']
], [62, 38, 120, 130, 110, 59]);
h('Preguntas complementarias después de T01');
p('1. La ubicación de la opción para registrar un nuevo préstamo fue clara e intuitiva.');
s('[ ] Totalmente en desacuerdo   [ ] En desacuerdo   [ ] Neutral   [ ] De acuerdo   [ ] Totalmente de acuerdo');
p('2. El sistema me avisó oportunamente si el usuario estaba habilitado para recibir préstamos.');
s('[ ] Totalmente en desacuerdo   [ ] En desacuerdo   [ ] Neutral   [ ] De acuerdo   [ ] Totalmente de acuerdo');
p('3. Principal obstáculo o confusión: _____________________________________________________');

// ============================================================
// HOJA 4 — SUS + ENTREVISTA
// ============================================================
page();
t('4. SUS + ENTREVISTA FINAL');
s('Código P___  |  Escala: 1 Totalmente en desacuerdo · 2 En desacuerdo · 3 Neutral · 4 De acuerdo · 5 Totalmente de acuerdo.');
p('Indicación: “Marca qué tan de acuerdo estás con cada afirmación respecto al sistema en general”.');
tbl([
  ['#', 'Afirmación', 'Respuesta'],
  ['1', 'Creo que me gustaría utilizar este sistema con frecuencia.', '1  2  3  4  5'],
  ['2', 'Encontré el sistema innecesariamente complejo.', '1  2  3  4  5'],
  ['3', 'Pensé que el sistema era fácil de utilizar.', '1  2  3  4  5'],
  ['4', 'Creo que necesitaría el apoyo de una persona con conocimientos técnicos para poder utilizar este sistema.', '1  2  3  4  5'],
  ['5', 'Encontré que las diversas funciones del sistema estaban bien integradas.', '1  2  3  4  5'],
  ['6', 'Pensé que había demasiada inconsistencia en este sistema.', '1  2  3  4  5'],
  ['7', 'Imagino que la mayoría de las personas aprendería a utilizar este sistema muy rápidamente.', '1  2  3  4  5'],
  ['8', 'Encontré el sistema muy incómodo de usar.', '1  2  3  4  5'],
  ['9', 'Me sentí muy seguro/a al utilizar el sistema.', '1  2  3  4  5'],
  ['10', 'Necesité aprender muchas cosas antes de poder comenzar a utilizar el sistema.', '1  2  3  4  5']
], [28, 410, 81]);
h('Cálculo del puntaje SUS');
p('Reactivos impares (1, 3, 5, 7, 9): contribución = respuesta − 1. Reactivos pares (2, 4, 6, 8, 10): contribución = 5 − respuesta. Sumar las diez contribuciones y multiplicar por 2.5. Puntaje final: 0 a 100.');
p('I1 ___  I2 ___  I3 ___  I4 ___  I5 ___  I6 ___  I7 ___  I8 ___  I9 ___  I10 ___   |   Suma ajustada ____   |   SUS ____ / 100');
s('Si falta un reactivo, no inventar ni completar: registrar el cuestionario como incompleto. El SUS no es un porcentaje de tareas correctas.');
h('Entrevista final breve');
p('¿Qué parte del sistema te resultó más fácil y por qué?');
p('_______________________________________________________________________________________');
p('¿En qué momento tuviste más dificultad o duda?');
p('_______________________________________________________________________________________');
p('¿Qué esperabas que ocurriera y qué ocurrió realmente?');
p('_______________________________________________________________________________________');
p('¿Qué cambiarías primero del sistema?');
p('_______________________________________________________________________________________');
p('¿Hubo algún mensaje, estado o confirmación que no entendieras?');
p('_______________________________________________________________________________________');

// ============================================================
// HOJA 5 — BITÁCORA (EQUIPO)
// ============================================================
page();
t('5. BITÁCORA DEL PILOTO Y CONTROL DE VERSIÓN (EQUIPO)');
s('No va por participante. Se llena al terminar el ensayo. Sirve para decidir los ajustes antes de la aplicación principal.');
h('Resumen del piloto');
p('N.º de participantes: ____     Fecha: ____________     Duración real total: ____ min     Códigos: P___, P___');
s('Con la duración real, actualizar el tiempo estimado (20–30 min) en el consentimiento (Hoja 1).');
h('Bitácora de incidencias y desviaciones');
tbl([
  ['Fecha / hora', 'Código sesión', 'Incidencia / desviación', 'Efecto en tarea o dato', 'Acción tomada', '¿Afecta validez?'],
  ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', '']
], [75, 68, 130, 105, 95, 46]);
h('Control de versiones y condiciones');
tbl([
  ['Elemento', 'Valor / identificación'],
  ['Versión del sistema / commit', '______________________________________________'],
  ['Fecha de congelamiento', '______________________________________________'],
  ['Navegador y versión', '______________________________________________'],
  ['Equipo / resolución', '______________________________________________'],
  ['Datos de prueba / estado inicial', '______________________________________________'],
  ['Cambios durante la aplicación', '______________________________________________'],
  ['Ubicación segura de originales', '______________________________________________'],
  ['Copia anonimizada / responsable', '______________________________________________'],
  ['Fecha de eliminación / resguardo', '______________________________________________']
], [210, 309]);
h('Cambios al protocolo derivados del piloto (redacción de tareas, tiempos, formularios, equipo, datos de prueba, consentimiento)');
p('_______________________________________________________________________________________');
p('_______________________________________________________________________________________');

// ============================================================
// RENDER PDF
// ============================================================
function renderPDF() {
  const doc = new PDFKIT({ size: 'A4', margin: 36, compress: true, info: { Title: 'Formatos Piloto - Biblioteca Alejandría', Author: 'Equipo UX' } });
  const file = path.join(OUT, 'Formatos_Piloto_Biblioteca_Alejandria.pdf');
  const salida = fs.createWriteStream(file);
  const listo = new Promise((res, rej) => { salida.on('finish', res); salida.on('error', rej); });
  doc.pipe(salida);
  doc.registerFont('normal', FUENTE).registerFont('bold', FUENTE_NEG);
  let y = 36;
  const ancho = 595.28 - 72;

  function nuevaPagina() { doc.addPage(); y = 36; }
  function asegurar(alto) { if (y + alto > 800) nuevaPagina(); }

  function linea(v, fuente, size, color) {
    const alto = doc.heightOfString(v, { width: ancho, font: fuente, fontSize: size }) + 4;
    asegurar(alto);
    doc.font(fuente).fontSize(size).fillColor(color).text(v, 36, y, { width: ancho, align: 'left' });
    y += alto;
  }
  function tabla(rows, widths) {
    const escala = ancho / widths.reduce((a, b) => a + b, 0);
    const w = widths.map(x => x * escala);
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].map(c => String(c == null ? '' : c));
      const altoCelda = Math.max(...cells.map((c, j) => doc.heightOfString(c, { width: w[j] - 8, font: 'normal', fontSize: 7 }) + 6));
      asegurar(altoCelda);
      let x = 36;
      for (let j = 0; j < cells.length; j++) {
        doc.rect(x, y, w[j], altoCelda).lineWidth(0.5).strokeColor('#888888').stroke();
        doc.font(i === 0 ? 'bold' : 'normal').fontSize(7).fillColor('#111111')
          .text(cells[j], x + 4, y + 3, { width: w[j] - 8, align: 'left' });
        x += w[j];
      }
      y += altoCelda;
    }
    y += 4;
  }

  for (const b of B) {
    if (b.k === 'page') { nuevaPagina(); continue; }
    if (b.k === 't') { y += 2; linea(b.v, 'bold', 12.5, '#111111'); y += 1; continue; }
    if (b.k === 'h') { y += 4; linea(b.v, 'bold', 9, '#222222'); continue; }
    if (b.k === 'p') { linea(b.v, 'normal', 8, '#111111'); y += 1; continue; }
    if (b.k === 's') { linea(b.v, 'normal', 7, '#555555'); y += 1; continue; }
    if (b.k === 'tbl') { y += 2; tabla(b.rows, b.widths); }
  }
  doc.end();
  return listo.then(() => file);
}

// ============================================================
// RENDER DOCX (OOXML mínimo + ZIP sin compresión)
// ============================================================
function esc(x) {
  return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function parrafo(texto, bold, size) {
  return '<w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr>'
    + (bold ? '<w:b/>' : '') + '<w:sz w:val="' + size + '"/></w:rPr><w:t xml:space="preserve">'
    + esc(texto) + '</w:t></w:r></w:p>';
}
function tablaDocx(rows, widths) {
  const tw = widths.map(w => Math.round(w * 20));
  let x = '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>'
    + ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(k =>
        '<w:' + k + ' w:val="single" w:sz="4" w:color="888888"/>').join('')
    + '</w:tblBorders></w:tblPr><w:tblGrid>' + tw.map(w => '<w:gridCol w:w="' + w + '"/>').join('') + '</w:tblGrid>';
  rows.forEach((row, i) => {
    x += '<w:tr>';
    row.forEach((cell, j) => {
      x += '<w:tc><w:tcPr><w:tcW w:w="' + (tw[j] || 2000) + '" w:type="dxa"/></w:tcPr>'
        + parrafo(cell, i === 0, 15) + '</w:tc>';
    });
    x += '</w:tr>';
  });
  return x + '</w:tbl>' + parrafo('', false, 10);
}
function renderDOCX() {
  let body = '';
  for (const b of B) {
    if (b.k === 'page') body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    else if (b.k === 't') body += parrafo(b.v, true, 26);
    else if (b.k === 'h') body += parrafo(b.v, true, 19);
    else if (b.k === 'p') body += parrafo(b.v, false, 17);
    else if (b.k === 's') body += parrafo(b.v, false, 15);
    else if (b.k === 'tbl') body += tablaDocx(b.rows, b.widths);
  }
  const doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    + '<w:body>' + body + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>'
    + '<w:pgMar w:top="567" w:right="567" w:bottom="567" w:left="567"/></w:sectPr>'
    + '</w:body></w:document>';
  const types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    + '</Types>';
  const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    + '</Relationships>';
  const archivos = [
    ['[Content_Types].xml', Buffer.from(types, 'utf8')],
    ['_rels/.rels', Buffer.from(rels, 'utf8')],
    ['word/document.xml', Buffer.from(doc, 'utf8')]
  ];
  const file = path.join(OUT, 'Formatos_Piloto_Biblioteca_Alejandria.docx');
  fs.writeFileSync(file, zip(archivos));
  return file;
}
const CRC_TAB = (() => {
  const tab = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    tab[n] = c;
  }
  return tab;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TAB[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function zip(archivos) {
  const partes = [], centrales = [];
  let offset = 0;
  const fecha = 0, hora = 0;
  for (const [nombre, data] of archivos) {
    const nb = Buffer.from(nombre, 'utf8');
    const crc = crc32(data);
    const local = Buffer.alloc(30 + nb.length);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8); local.writeUInt16LE(hora, 10); local.writeUInt16LE(fecha, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nb.length, 26); local.writeUInt16LE(0, 28);
    nb.copy(local, 30);
    partes.push(local, data);
    const c = Buffer.alloc(46 + nb.length);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6);
    c.writeUInt16LE(0, 8); c.writeUInt16LE(0, 10); c.writeUInt16LE(hora, 12); c.writeUInt16LE(fecha, 14);
    c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(data.length, 24);
    c.writeUInt16LE(nb.length, 28); c.writeUInt16LE(0, 30); c.writeUInt16LE(0, 32);
    c.writeUInt16LE(0, 34); c.writeUInt16LE(0, 36); c.writeUInt32LE(0, 38); c.writeUInt32LE(offset, 42);
    nb.copy(c, 46);
    centrales.push(c);
    offset += local.length + data.length;
  }
  const cdSize = centrales.reduce((a, b) => a + b.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(0, 4); eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(centrales.length, 8); eocd.writeUInt16LE(centrales.length, 10);
  eocd.writeUInt32LE(cdSize, 12); eocd.writeUInt32LE(offset, 16); eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...partes, ...centrales, eocd]);
}

fs.mkdirSync(OUT, { recursive: true });
renderPDF().then(pdf => {
  const docx = renderDOCX();
  console.log('PDF : ' + pdf + ' (' + fs.statSync(pdf).size + ' bytes)');
  console.log('DOCX: ' + docx + ' (' + fs.statSync(docx).size + ' bytes)');
  console.log('Bloques: ' + B.length);
}).catch(e => { console.error('ERROR:', e.message); process.exit(1); });
