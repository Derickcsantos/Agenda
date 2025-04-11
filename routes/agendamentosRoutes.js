const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentosController');

router.post('/', agendamentosController.criarAgendamento);
router.get('/', agendamentosController.listarAgendamentos);
router.put('/:id', agendamentosController.editarAgendamento);
router.delete('/:id', agendamentosController.excluirAgendamento);
router.put('/concluido/:id', agendamentosController.marcarComoConcluido);

module.exports = router;
