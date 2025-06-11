const express = require('express');
const cors = require('cors');
const registrousuario = require('./vista/profesional/UsuarioRutas');
const loginusuario = require('./vista/profesional/LoginRuta');
const path = require('path');
const loginControlador = require('./controlador/profesional/LoginControlador');
const UsuarioModelo = require('./modelo/UsuarioModelo');
const app = express();
const PORT = process.env.PORT || 4545;

// Middleware
app.use(cors({
  origin: '*', // Cambiar ['http://tu.com', 'http://yo.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: true // Habilita el envío de credenciales si es necesario
}));

// Middleware para parseo de solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));

// Rutas 
app.use('/', registrousuario);
app.use('/', loginusuario);

//app.use('/', articuloRoutes);
//app.use('/', loginRoutes);
// Middleware de manejo de errores


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});