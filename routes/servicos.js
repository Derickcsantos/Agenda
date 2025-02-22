const express = require('express');
const router = express.Router();
const Servico = require('../models/Servico');

// Adicionar novo serviço
router.post('/', async (req, res) => {
    try {
        const novoServico = new Servico({
            nome: req.body.nome,
            preco: req.body.preco,
            categoria_id: req.body.categoria_id
        });
        await novoServico.save();
        res.status(201).json(novoServico);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar serviço', error });
    }
});

// Listar todos os serviços por categoria
router.get('/:categoriaId', async (req, res) => {
    try {
        const servicos = await Servico.find({ categoria_id: req.params.categoriaId });
        res.status(200).json(servicos);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao carregar serviços', error });
    }
});

module.exports = router;
