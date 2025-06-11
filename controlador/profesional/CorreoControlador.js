const nodemailer = require('nodemailer');
require('dotenv').config(); // Asegúrate de tener esto para leer el .env

class CorreoControlador {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ✅ Verificamos conexión al servidor SMTP al iniciar
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Error al conectar al servidor SMTP:', error.message);
      } else {
        console.log('✅ Conexión SMTP exitosa');
      }
    });
  }

  async enviarBienvenida(name, email) {
    const mailOptions = {
      from: '"Servicio a Domicilio" <no-reply@servicio.com>',
      to: email,
      subject: '¡Bienvenido a la plataforma de servicio a domicilio!',
      text: `Hola ${name}, gracias por registrarte.`,
      html: `
        <h2>¡Hola ${name}!</h2>
        <p>Gracias por registrarte en nuestra plataforma.</p>
        <p><strong>Usuario:</strong> ${email}</p>
        <p>¡Te esperamos pronto!</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Correo enviado:', info.messageId);
    } catch (error) {
      console.error('❌ Error al enviar correo:', error.message);
      throw error;
    }
  }
}

module.exports = new CorreoControlador();
