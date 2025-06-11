const { intentos } = require('../../modelo/LoginModelo');
const modelo = require('../../modelo/UsuarioModelo');
const CorreoControlador = require('./CorreoControlador');

class UsuarioControlador {
  static async crearUsuario(req, res) {
    console.log('Recibida solicitud para crear usuario');
    console.log('Query params:', req.query);

    const doc = req.query.t1;
    const name = req.query.t2;
    const tel = req.query.t3;
    const email = req.query.t4;
    const contra = req.query.t5;
    const rol = req.query.rol || 'Profesional';
    const intentosFallidos = req.query.intentosFallidos || '0';

    console.log('Datos extraídos:', { doc, name, tel, email, rol });

    // Validaciones
    const errorCampos = UsuarioControlador.verCampos(doc, name, tel, email, contra);
    if (errorCampos) return res.status(400).json({ error: errorCampos });

    const verDoc = UsuarioControlador.verDoc(doc);
    if (verDoc) return res.status(400).json({ error: verDoc });

    const verNom = UsuarioControlador.verNom(name);
    if (verNom) return res.status(400).json({ error: verNom });

    const verTel = UsuarioControlador.verTel(tel);
    if (verTel) return res.status(400).json({ error: verTel });

    const verCor = UsuarioControlador.verCor(email);
    if (verCor) return res.status(400).json({ error: verCor });

    const verCon = UsuarioControlador.verCon(contra);
    if (verCon) return res.status(400).json({ error: verCon });

    if (rol && !['Cliente', 'Profesional'].includes(rol)) {
      return res.status(400).json({ error: 'El rol debe ser Profesional' });
    }

    try {
      const resultado = await modelo.crearUsuarios(doc, name, tel, email, contra, rol, intentosFallidos);
      console.log('✅ Usuario creado correctamente:', resultado);

      try {
        await CorreoControlador.enviarBienvenida(name, email);
        console.log('📧 Correo enviado a Mailtrap');
      } catch (correoError) {
        console.warn('⚠️ Usuario creado, pero el correo falló:', correoError.message);
      }

      return res.status(201).json({
        mensaje: 'Usuario creado con éxito',
        id: resultado.insertId,
        estado: 'Activo',
        rol,
        intentosFallidos
      });

    } catch (err) {
      if (err.message.includes('Duplicate entry')) {
        return res.status(409).json({
          error: 'Ya existe un usuario con estos datos. Intenta recuperar tu cuenta o iniciar sesión.'
        });
      }
      console.error('❌ Error inesperado:', err);
      return res.status(500).json({ error: 'Error no se pudo: ' + err.message });
    }
  }

  // Validaciones auxiliares (sin cambios)
  static verCampos(doc, name, tel, email, contra) {
    if (!doc || !name || !tel || !email || !contra) {
      return 'Todos los campos son obligatorios.';
    }
    return null;
  }

  static verDoc(doc) {
    return /^\d{8,10}$/.test(doc) ? null : 'La identificación debe tener entre 8 y 10 dígitos numéricos.';
  }

  static verNom(name) {
    const nom = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/;
    return nom.test(name) ? null : 'Nombres y apellidos inválidos. Mínimo 3 caracteres, máximo 100, solo letras.';
  }

  static verTel(tel) {
    return /^\d{10}$/.test(tel) ? null : 'El teléfono debe tener exactamente 10 dígitos numéricos.';
  }

  static verCor(email) {
    const er = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return er.test(email) && email.length <= 200 ? null : 'Correo inválido. Ejemplo válido: ejemplo@email.com';
  }

  static verCon(contra) {
    const key = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return key.test(contra) ? null : 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.';
  }
}

module.exports = UsuarioControlador;
