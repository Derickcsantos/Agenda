const express = require('express');
const router = express.Router();

// Dados de login fixos (usuários e senhas)
const usuarios = [
  { usuario: 'Derick', senha: '123' },
  { usuario: 'Paula', senha: '123' }
];

// Rota de login
router.post('/', (req, res) => {
  const { usuario, senha } = req.body;

  // Verificar se o usuário existe
  const usuarioAutenticado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if (usuarioAutenticado) {
    // Simulação de sessão: pode usar uma sessão real ou token JWT
    req.session.usuario = usuarioAutenticado.usuario; // Armazenar na sessão (se usar)
    res.status(200).json({ message: 'Login realizado com sucesso' }); // Envia uma resposta para o front-end
  } else {
    res.status(401).json({ message: 'Usuário ou senha incorretos' }); // Resposta de erro
  }
});

module.exports = router;
