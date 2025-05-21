const express = require('express');
const UsuarioControlador = require('../controlador/UsuarioControlador');
const router = express.Router();


// Mantener la ruta original para peticiones con body JSON
router.post('/usuarios', UsuarioControlador.crearUsuario);


module.exports = router;