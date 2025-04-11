const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const funcionariosController = require('../controllers/funcionariosController');

// Inicializando o cliente Supabase com as variáveis de ambiente
const supabase = createClient(
    'https://db.kblzgaeiljpqgjeiexvt.supabase.co', // URL do Supabase
    'postgresql://postgres:Basquete-1@db.kblzgaeiljpqgjeiexvt.supabase.co:5432/postgres' // URI de conexão
  );

// Rota para adicionar um novo funcionário
router.post('/', (req, res) => {
  funcionariosController.addFuncionario(supabase, req, res);
});

// Rota para listar todos os funcionários
router.get('/', (req, res) => {
  funcionariosController.getFuncionarios(supabase, req, res);
});

// Rota para listar funcionários por serviço
router.get('/:servicoId', (req, res) => {
  funcionariosController.getFuncionariosPorServico(supabase, req, res);
});

module.exports = router;
