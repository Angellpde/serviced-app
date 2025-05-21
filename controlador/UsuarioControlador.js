const modelo = require('../modelo/UsuarioModelo');

class UsuarioControlador {
  static async crearUsuario(req, res) {
    console.log('Recibida solicitud para crear usuario');
    console.log('Query params:', req.query);
    console.log('Body:', req.body);
    
    // Obtener datos de parámetros de consulta (URL) o del cuerpo (JSON)
    const doc = req.query.t1;
    const name = req.query.t2;
    const tel = req.query.t3;
    const email = req.query.t4;
    const contra = req.query.t5;
    // Parámetro opcional: tipo (por defecto 'Profesional')
    const tipo = req.query.tipo || 'Profesional';
    
    console.log('Datos extraídos:', { doc, name, tel, email, tipo, contraLength: contra?.length });

    // ------------👁️‍🗨️ validaciones👁️‍🗨️----------------
    // Validar campos vacíos❓❓❓❓❓----------------
    const errorCampos = UsuarioControlador.verCampos(doc, name, tel, email, contra);
    if (errorCampos) {
        console.log('Error de validación - campos vacíos:', errorCampos);
        return res.status(400).json({ error: errorCampos });
    }

    // Validar documento❓❓❓❓❓❓-------------------
    const verDoc = UsuarioControlador.verDoc(doc);
    if (verDoc) {
        console.log('Error de validación - documento:', verDoc);
        return res.status(400).json({ error: verDoc });
    }
    
    // Validar nombres completos ❓❓❓❓❓❓❓------------
    const verNom = UsuarioControlador.verNom(name);
    if (verNom) {
        console.log('Error de validación - nombre:', verNom);
        return res.status(400).json({ error: verNom});
    }
    
    // Validar teléfono❓❓❓❓❓❓❓-----------------------
    const verTel = UsuarioControlador.verTel(tel);
    if (verTel) {
        console.log('Error de validación - teléfono:', verTel);
        return res.status(400).json({ error: verTel });
    }
    
    // Validar correo❓❓❓❓❓❓❓--------------------------
    const verCor = UsuarioControlador.verCor(email);
    if (verCor) {
        console.log('Error de validación - correo:', verCor);
        return res.status(400).json({ error: verCor });
    }
    
    // Validar contraseña❓❓❓❓❓❓-----------------------
    const verCon = UsuarioControlador.verCon(contra);
    if (verCon) {
        console.log('Error de validación - contraseña:', verCon);
        return res.status(400).json({ error: verCon });
    }
    
    // Validar tipo (si se proporciona)
    if (tipo && !['Cliente', 'Profesional'].includes(tipo)) {
        console.log('Error de validación - tipo:', tipo);
        return res.status(400).json({ error: 'El tipo debe ser Profesional' });
    }

    try {
      console.log('Pasaron todas las validaciones, llamando al modelo...');
      const result = await modelo.crearUsuarios(doc, name, tel, email, contra, tipo);
      console.log('Usuario creado exitosamente:', result);
      res.status(201).json({ mensaje: 'Usuario creado', id: result.insertId, estado: 'Activo', tipo });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      console.error('Detalles del error:', err.message);
      res.status(500).json({ error: 'Hubo un error al crear el usuario', detalles: err.message });
    }
    
  }//cerrar crearUsuario
  
  static verCampos(doc, name, tel, email, contra) {
        if (!doc || !name || !tel || !email || !contra) {
            return 'Todos los campos son obligatorios.';
        }
        return null; // no encontro campos vacios
    }//cerrar verCampos
    
 static verDoc(doc) {
        if (!/^\d{8,10}$/.test(doc)) {
            return 'La identificación debe tener entre 8 y 10 dígitos numéricos.';
        } else {
            return null; // Todo bien
        }
    }//cerrar documento
    
    //verificar nombres completos
    static verNom(name) {
        const nom = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/;
        if (!nom.test(name)) {
            return 'Nombres y apellidos invalidos minimo 3 caracteres o maximo 100 solo letras minuscula o Mayuscula';
        } else {
            return null;
        }
    }
    
    //verificar telefono
    static verTel(tel) {
        if (!/^\d{10}$/.test(tel)) {
            return 'El teléfono debe tener exactamente 10 dígitos numéricos.';
        } else {
            return null; // todo bien
        }
    }
    
     //validar correo
    static verCor(email) {
        const er = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!er.test(email) || email.length > 200) {
            return 'Correo inválido. Ejemplo válido: ejemplo@email.com';
        } else {
            return null;
        }
    }//cerrar veremail
    
    static verCon(contra) {
        const key = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!key.test(contra)) {
            return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.';
        } else {
            return null;
        }
    }
}//cerrar clase

module.exports = UsuarioControlador;
