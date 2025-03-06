const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');

// Adicionar nova categoria
router.post('/', async (req, res) => {
    try {
        const novaCategoria = new Categoria({ nome: req.body.nome });
        await novaCategoria.save();
        res.status(201).json(novaCategoria);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar categoria', error });
    }
});

// Listar todas as categorias
router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao carregar categorias', error });
    }
});

// API para editar uma categoria
app.put('/api/categorias/:id', async (req, res) => {
    try {
      const categoria = await Categoria.findByIdAndUpdate(req.params.id, { nome: req.body.nome }, { new: true });
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      res.json(categoria);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao editar categoria' });
    }
  });
  
  // API para excluir uma categoria
  app.delete('/api/categorias/:id', async (req, res) => {
    try {
      const categoria = await Categoria.findByIdAndDelete(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      res.status(200).json({ message: 'Categoria excluída com sucesso' });
    } catch (err) {
      res.status(400).json({ error: 'Erro ao excluir categoria' });
    }
  });

module.exports = router;
