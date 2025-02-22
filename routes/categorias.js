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

module.exports = router;
