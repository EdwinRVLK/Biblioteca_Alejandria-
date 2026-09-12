// controllers/loginUsuarioController.js
const db = require('../MySQL/db');
const bcrypt = require('bcrypt');

exports.loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  console.log('🔐 Intentando login para:', correo);

  try {
    const query = 'SELECT * FROM usuario WHERE correo = ?';

    db.query(query, [correo], async (err, results) => {
      if (err) {
        console.error('❌ Error en consulta:', err);
        return res.status(500).json({ success: false, message: 'Error del servidor' });
      }

      if (results.length === 0) {
        console.log('❌ Usuario no encontrado:', correo);
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      const usuario = results[0];
      console.log('✅ Usuario encontrado:', usuario.nombre);

      let contrasenaValida = false;

      // ✅ Si la contraseña ya está cifrada con bcrypt ($2a$ / $2b$)
      if (usuario.contrasena.startsWith('$2a$') || usuario.contrasena.startsWith('$2b$')) {
        contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
      } else {
        // ⚠️ Contraseña antigua en texto plano: compara directo y luego la cifra
        if (contrasena === usuario.contrasena) {
          contrasenaValida = true;
          const hashed = await bcrypt.hash(contrasena, 10);
          db.query('UPDATE usuario SET contrasena = ? WHERE id_usuario = ?', [hashed, usuario.id_usuario]);
          console.log(`🔄 Contraseña de ${correo} fue cifrada automáticamente.`);
        }
      }

      if (!contrasenaValida) {
        console.log('❌ Contraseña incorrecta para:', correo);
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      console.log('✅ Login exitoso para:', usuario.nombre);

      return res.json({
        success: true,
        message: 'Login exitoso',
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol,
          foto: usuario.foto,
          num_prestamos: usuario.num_prestamos
        }
      });
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};
