const conexion = require('./bd/conexion');
const bcrypt = require('bcrypt');

class UsuarioModelo {
  static async crearUsuarios(doc, name, tel, email, contra, rol = 'Profesional', intentosFallidos) {
    try {
      console.log('Iniciando creación de usuario en modelo:', { doc, name, tel, email, rol, intentosFallidos});
      
      // Cifrar la contraseña antes de guardarla
      const saltRounds = 10;
      const contraHash = await bcrypt.hash(contra, saltRounds);
      
      // Estado por defecto: Activo
      const estado = 'Activo';
      
      // Query para insertar el usuario en la base de datos incluyendo rol y estado
      const query = `INSERT INTO usuarios (documento, nombre, telefono, email, contrasena, rol, estado, intentosFallidos) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      console.log('Ejecutando query de inserción...');
      
      // Ejecutar la consulta con los parámetros, incluyendo rol y estado
      const result = await conexion.query(query, [doc, name, tel, email, contraHash, rol, estado, intentosFallidos]);
      
      console.log('Usuario creado con éxito:', result);
      return result;
    } catch (error) {
      console.error('Error en el modelo al crear usuario:', error);
      console.error('Detalles del error:', error.message);
      throw error;
    }
  }
  
  // Aquí puedes agregar otros métodos como buscarPorId, actualizar, eliminar, etc.
}

module.exports = UsuarioModelo;