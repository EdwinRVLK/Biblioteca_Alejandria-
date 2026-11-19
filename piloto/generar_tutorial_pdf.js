// Genera la versión PDF del tutorial de instalación a partir del .md versionado.
const fs = require('fs');
const path = require('path');
const PDFDocument = require(path.join(__dirname, '..', 'node_modules', 'pdfkit'));

const mdPath = path.join(__dirname, 'TUTORIAL_Instalacion.md');
const outPath = path.join(__dirname, 'formatos', 'Tutorial_Instalacion_Piloto.pdf');
const lineas = fs.readFileSync(mdPath, 'utf8').split(/\r?\n/);

const doc = new PDFDocument({ size: 'A4', margin: 42, info: { Title: 'Tutorial de instalacion - Piloto Biblioteca Alejandria' } });
const salida = fs.createWriteStream(outPath);
const listo = new Promise((res, rej) => { salida.on('finish', res); salida.on('error', rej); });
doc.pipe(salida);
doc.registerFont('n', 'C:\\Windows\\Fonts\\arial.ttf')
   .registerFont('b', 'C:\\Windows\\Fonts\\arialbd.ttf');

let y = 42;
const W = doc.page.width - 84;
const limite = doc.page.height - 42;

function escribir(texto, size, bold, color) {
  const fuente = bold ? 'b' : 'n';
  const alto = doc.heightOfString(texto, { width: W, font: fuente, fontSize: size }) + 3;
  if (y + alto > limite) { doc.addPage(); y = 42; }
  doc.font(fuente).fontSize(size).fillColor(color).text(texto, 42, y, { width: W });
  y += alto;
}

for (const crudo of lineas) {
  const texto = crudo.replace(/^#+\s*/, '').replace(/`/g, '');
  if (crudo.trim() === '') { y += 7; continue; }
  if (crudo.trim() === '---') {
    y += 3;
    if (y + 6 > limite) { doc.addPage(); y = 42; }
    doc.moveTo(42, y).lineTo(42 + W, y).lineWidth(0.5).strokeColor('#aaaaaa').stroke();
    y += 8;
    continue;
  }
  if (crudo.startsWith('# ')) { escribir(texto, 16, true, '#111111'); continue; }
  if (crudo.startsWith('## ')) { y += 5; escribir(texto, 12, true, '#222222'); continue; }
  if (crudo.startsWith('|')) {
    escribir(texto.replace(/\|/g, '  '), 8, false, '#333333');
    continue;
  }
  escribir(texto, 9, false, '#111111');
}

doc.end();
listo.then(() => console.log('PDF tutorial: ' + outPath + ' (' + fs.statSync(outPath).size + ' bytes)'))
     .catch(e => { console.error('ERROR:', e.message); process.exit(1); });
