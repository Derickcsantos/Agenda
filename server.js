const express = require('express');
const path = require('path');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.set('supabase', supabase);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessão
app.use(session({
  secret: 'meuSegredo',
  resave: false,
  saveUninitialized: true,
}));

// Importar rotas
const agendamentosRoutes = require('./routes/agendamentosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const funcionariosRoutes = require('./routes/funcionariosRoutes');
const servicosRoutes = require('./routes/servicosRoutes');

// Usar rotas
app.use('/api/agendamentos', agendamentosRoutes); // Passando o supabase nas rotas
app.use('/api/categorias', categoriasRoutes); // Passando o supabase nas rotas
app.use('/api/funcionarios', funcionariosRoutes); // Passando o supabase nas rotas
app.use('/api/servicos', servicosRoutes); // Passando o supabase nas rotas

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});