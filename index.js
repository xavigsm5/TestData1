const jsonServer = require("json-server");
const nodemailer = require("nodemailer");
const server = jsonServer.create();
const router = jsonServer.router("almacen.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 10000;


server.use(middlewares);
server.use(jsonServer.bodyParser);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tvmagis1515", 
    pass: "magistv1515", 
  },
});


server.post("/send-recovery-email", (req, res) => {
  const email = req.body.email; 

  
  const users = router.db.get("users").value(); 
  const user = users.find((u) => u.email === email);

  if (user) {
    
    const token = "de3bwgnm15g";

   
    const mailOptions = {
      from: "tu_correo@gmail.com",
      to: email,
      subject: "Recuperación de contraseña",
      text: `Tu token de recuperación es: ${token}`,
    };

    
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


server.use(router);


server.listen(port, () => {
  console.log(`JSON Server está corriendo en el puerto ${port}`);
});
