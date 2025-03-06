const express = require('express');
const path = require('path'); // Certifique-se de importar o path
const router = express.Router();

// Middleware para verificar se o usuário está logado
const verificarLogin = (req, res, next) => {
  if (!req.session.usuario) {
    return res.status(401).send({ message: 'Acesso não autorizado. Faça login para acessar.' });
  }
  next();
};

// Rota para a área administrativa, protegida por login
router.get('/', verificarLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'admin.html')); // Rendeiriza admin.html
});

module.exports = router;
