// ============================================================
// Datos ficticios para la prueba piloto de Biblioteca Alejandría
// Se ejecuta desde Iniciar_Piloto.ps1 después de restaurar la BD.
// ============================================================
const path = require('path');
const base = process.argv[2] || path.resolve(__dirname, '..');
require(path.join(base, 'node_modules', 'dotenv')).config({ path: path.join(base, '.env') });
const mysql = require(path.join(base, 'node_modules', 'mysql2'));
const bcrypt = require(path.join(base, 'node_modules', 'bcryptjs'));

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'biblioteca',
  charset: 'utf8mb4'
});

const q = (sql, params = []) => new Promise((res, rej) =>
  db.query(sql, params, (err, rows) => err ? rej(err) : res(rows))
);

const CORREOS = [
  'admin@alejandria.test',
  'ana.piloto@alejandria.test',
  'luis.piloto@alejandria.test'
];

(async () => {
  // 1) Limpiar préstamos previos de los usuarios ficticios (FK primero)
  const previos = await q(
    'SELECT id_usuario FROM usuario WHERE correo IN (?)', [CORREOS]
  );
  const ids = previos.map(r => r.id_usuario);
  if (ids.length) {
    const prestamos = await q(
      'SELECT id_prestamo FROM prestamo WHERE id_usuario IN (?)', [ids]
    );
    const idsP = prestamos.map(r => r.id_prestamo);
    if (idsP.length) {
      await q('DELETE FROM detalle_prestamo WHERE id_prestamo IN (?)', [idsP]);
      await q('DELETE FROM prestamo WHERE id_prestamo IN (?)', [idsP]);
    }
    await q('DELETE FROM usuario WHERE id_usuario IN (?)', [ids]);
  }

  // 2) Usuarios ficticios
  const hashAdmin = bcrypt.hashSync('Admin2026', 10);
  const hashPiloto = bcrypt.hashSync('Piloto2026', 10);
  const rAdmin = await q(
    `INSERT INTO usuario (nombre, correo, rol, contrasena, num_prestamos)
     VALUES (?, ?, ?, ?, 0)`,
    ['Bibliotecario Piloto', CORREOS[0], 'bibliotecario', hashAdmin]
  );
  const rAna = await q(
    `INSERT INTO usuario (nombre, correo, rol, contrasena, num_prestamos)
     VALUES (?, ?, ?, ?, 0)`,
    ['Ana Piloto', CORREOS[1], 'alumno', hashPiloto]
  );
  const rLuis = await q(
    `INSERT INTO usuario (nombre, correo, rol, contrasena, num_prestamos)
     VALUES (?, ?, ?, ?, 0)`,
    ['Luis Piloto', CORREOS[2], 'alumno', hashPiloto]
  );

  // 3) Préstamo inicial para T03 (Luis ya tiene 2 libros prestados)
  const rPrestamo = await q(
    `INSERT INTO prestamo (id_usuario, fecha, fecha_vencimiento, total_prestamos, entregado)
     VALUES (?, '2026-11-02', '2026-12-02', 2, 0)`,
    [rLuis.insertId]
  );
  await q(
    'INSERT INTO detalle_prestamo (id_prestamo, id_libro) VALUES ?',
    [[[rPrestamo.insertId, 28], [rPrestamo.insertId, 29]]]
  );

  console.log('=== DATOS FICTICIOS LISTOS ===');
  console.log('Administrador : Bibliotecario Piloto | ' + CORREOS[0] + ' | Admin2026');
  console.log('T01 usuario   : Ana Piloto (id ' + rAna.insertId + ') - sin préstamos vencidos');
  console.log('T01 libros    : Cosmos (id 1) y Sapiens (id 37)');
  console.log('T02 títulos   : Así habló Zaratustra (id 25) y La interpretación de los sueños (id 2)');
  console.log('T03 usuario   : Luis Piloto (id ' + rLuis.insertId + ') - préstamo ' + rPrestamo.insertId);
  console.log('T03 libros    : Código limpio (id 28) e Introducción a los algoritmos (id 29)');
  db.end();
})().catch(err => {
  console.error('ERROR al sembrar datos:', err.message);
  db.end();
  process.exit(1);
});
