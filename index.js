const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('almacen.json'); // Archivo JSON
const middlewares = jsonServer.defaults();

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Personalizar POST para el endpoint "/users"
server.post('/users', (req, res) => {
  const users = router.db.get('users');
  const newUser = req.body;

  // Validar campos únicos, como email
  if (users.find({ email: newUser.email }).value()) {
    return res.status(400).send({ message: 'El email ya está registrado.' });
  }

  users.push(newUser).write();
  res.status(201).send(newUser);
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server está corriendo en el puerto 3000');
});
