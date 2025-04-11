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

// Editar um serviço
router.put('/:id', async (req, res) => {
    try {
        console.log('Editando serviço com ID:', req.params.id);
        const servico = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!servico) {
            console.log('Serviço não encontrado!');
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        console.log('Serviço editado:', servico);
        res.status(200).json(servico);
    } catch (error) {
        console.error('Erro ao editar serviço:', error);
        res.status(400).json({ message: 'Erro ao editar serviço', error });
    }
});



// Excluir um serviço
router.delete('/:id', async (req, res) => {
    try {
        const servico = await Servico.findByIdAndDelete(req.params.id);
        if (!servico) {
            console.log('Serviço não encontrado para exclusão!');
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        console.log('Serviço excluído:', servico);
        res.status(200).json({ message: 'Serviço excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        res.status(400).json({ message: 'Erro ao excluir serviço', error });
    }
});



module.exports = router;
