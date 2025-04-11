const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

module.exports = (supabase) => {
  // Rotas de categorias
  router.post('/', (req, res) => categoriasController.adicionarCategoria(req, res, supabase));
  router.get('/', (req, res) => categoriasController.listarCategorias(req, res, supabase));
  router.put('/:id', (req, res) => categoriasController.editarCategoria(req, res, supabase));
  router.delete('/:id', (req, res) => categoriasController.deletarCategoria(req, res, supabase));
  return router;
};
