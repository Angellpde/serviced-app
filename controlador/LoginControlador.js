
const loginModelo = require('../modelo/LoginModelo');

class loginControlador {
  // Validar correo y contraseña
  static async validarCredenciales(req, res) {
    const { t1: email, t2: contra } = req.query; // Renombramos t1 y t2 para mayor claridad

    if (!email || !contra) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
      const user = await loginModelo.validarCredenciales(email, contra);
      
      if (!user) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: user });
    } catch (err) {
      res.status(500).json({ error: `Hubo un error al validar las credenciales: ${err.message}` });
    }
  }
}

module.exports = loginControlador;