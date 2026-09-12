// ===============================
// 📦 Conexión a MySQL (modo clásico con callbacks)
// ===============================
require('dotenv').config();
const mysql = require('mysql2');

// Crear conexión directa (configurable desde .env, con valores por defecto)
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'biblioteca',
  charset: 'utf8mb4'
});

// Conectar
connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err.stack);
    return;
  }
  console.log('✅ Conectado a la base de datos con id ' + connection.threadId);
});

module.exports = connection;
