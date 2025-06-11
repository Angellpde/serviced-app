 const dbService = require('./bd/conexion');
const crypto = require('crypto');

class loginModelo {
  //busca por correo el usuario para el login
  static async buscarCorreo(email) {
    const query = 'SELECT id, nombre, email, rol, contrasena, estado FROM usuarios WHERE email = ? AND rol = ?';
    try {
      const result = await dbService.query(query, [email, "Profesional"]);
      return result.length ? result[0] : null;
    } catch (err) {
      throw new Error(`Error al buscar el usuario: ${err.message}`);
    }
  }//cerrar buscarcorreo
    //este genera el token para no estar verificando contraseña
  static generarLlaveSegura() {
    return crypto.randomBytes(32).toString('hex');
  }
    //cuando se entra al sistema genera un registro con una llave
    //ya que con esta sera la que mantiene la secion
  static async guardarToken({ id, nombre, rol, email, llave }) {
    const query = 'INSERT INTO token (id, nombre, rol, email, llave) VALUES (?, ?, ?, ?, ?)';
    try {
      await dbService.query(query, [id, nombre, rol, email, llave]);
    } catch (err) {
      throw new Error(`Error al guardar el token: ${err.message}`);
    }
  }//cerrar guardar token
  //esta hace que aumente el campo cada vez que no pueda entrar
  static async incrementarIntentoFallido(email) {
  const query = `UPDATE usuarios SET intentosFallidos = intentosFallidos + 1 WHERE email = ?`;
  await dbService.query(query, [email]);

  // Obtener intentos actualizados
  const result = await dbService.query('SELECT intentosFallidos FROM usuarios WHERE email = ?', [email]);
  const intentos = result[0]?.intentosFallidos || 0;

  // Si llegó a 3 initentos fallidos, bloquear usuario
  if (intentos >= 3) {
    await dbService.query('UPDATE usuarios SET estado = "Bloqueado" WHERE email = ?', [email]);
  }
}

//esta recetea a cero cuando logra entrar
static async resetearIntentosFallidos(email) {
  const query = 'UPDATE usuarios SET intentosFallidos = 0 WHERE email = ?';
  await dbService.query(query, [email]);
}
//esta verifica los intentos para bloquear si pasa o llega a 3
static async intentos(email) {
  const result = await dbService.query('SELECT intentosFallidos FROM usuarios WHERE email = ?', [email]);
  return result[0]?.intentosFallidos || 0;
}
//esta para verificar si ya tiene secion abierta
static async buscartoken(email) {
    const query = 'SELECT id, email, llave  FROM token WHERE email = ?';
    try {
      const result = await dbService.query(query, [email]);
      return result.length ? result[0] : null;
    } catch (err) {
      throw new Error(`No existe token: ${err.message}`);
    }
  }//cerrar buscarcorreo
  
}

module.exports = loginModelo;