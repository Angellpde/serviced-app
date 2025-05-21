const express = require('express');
const LoginControlador = require('../controlador/LoginControlador');
const router = express.Router();

router.post('/login', LoginControlador.validarCredenciales);
module.exports = router; 