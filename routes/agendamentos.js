const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');

// Adicionar novo agendamento
router.post('/', async (req, res) => {
    try {
        const novoAgendamento = new Agendamento({
            nome: req.body.nome,
            telefone: req.body.telefone,
            email: req.body.email,
            servico_id: req.body.servicoId,
            data: req.body.data,
            hora: req.body.hora
        });
        await novoAgendamento.save();
        res.status(201).json(novoAgendamento);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao agendar', error });
    }
});

// Listar todos os agendamentos
router.get('/', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find().populate('servico_id');
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao carregar agendamentos', error });
    }
});

module.exports = router;
