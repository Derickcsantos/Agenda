exports.verificarLogin = (req, res, next) => {
    if (!req.session.usuario) {
      return res.status(401).send({ message: 'Acesso não autorizado. Faça login para acessar.' });
    }
    next();
  };
  
  exports.adminPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
  };
  