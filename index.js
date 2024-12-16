const jsonServer = require("json-server");
const nodemailer = require("nodemailer");
const server = jsonServer.create();
const router = jsonServer.router("almacen.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 10000;

// Configuración del middleware JSON Server
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Configuración de transporte para enviar correos (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tu_correo@gmail.com", // Tu correo Gmail
    pass: "tu_contraseña_o_app_password", // Contraseña o App Password
  },
});

// Endpoint personalizado para enviar correos
server.post("/send-recovery-email", (req, res) => {
  const email = req.body.email; // Email que se envía desde el cliente

  // Leer el archivo almacen.json
  const users = router.db.get("users").value(); // Nombre del array en almacen.json
  const user = users.find((u) => u.email === email);

  if (user) {
    // Token de ejemplo (deberías generarlo dinámicamente)
    const token = "de3bwgnm15g";

    // Configuración del correo
    const mailOptions = {
      from: "tu_correo@gmail.com",
      to: email,
      subject: "Recuperación de contraseña",
      text: `Tu token de recuperación es: ${token}`,
    };

    // Enviar correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al enviar correo." });
      }
      res.status(200).json({
        message: "Solicitud de recuperación enviada.",
        token: token,
      });
    });
  } else {
    res.status(404).json({ message: "Correo no encontrado." });
  }
});

// Usar json-server router
server.use(router);

// Iniciar servidor
server.listen(port, () => {
  console.log(`JSON Server está corriendo en el puerto ${port}`);
});
