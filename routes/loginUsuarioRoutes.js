// routes/loginUsuarioRoutes.js
const express = require("express");
const router = express.Router();
const loginUsuarioController = require("../controllers/loginUsuarioController");

// 🔐 Ruta de login de usuario
// Queda como: POST /api/loginUsuario
router.post("/loginUsuario", loginUsuarioController.loginUsuario);

module.exports = router;
