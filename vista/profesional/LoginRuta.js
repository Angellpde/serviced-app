const express = require('express');
const LoginControlador = require('../../controlador/profesional/LoginControlador');
const router = express.Router();

router.post('/login', LoginControlador.validarCredencial);
module.exports = router; 