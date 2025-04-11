const express = require('express');
const router = express.Router();
const servicosController = require('../controllers/servicosController');

router.post('/', (req, res) => servicosController.addServico(req.app.get('supabase'), req, res)); // Passando o cliente supabase para o controlador
router.put('/:id', (req, res) => servicosController.updateServico(req.app.get('supabase'), req, res));
router.delete('/:id', (req, res) => servicosController.deleteServico(req.app.get('supabase'), req, res));
router.get('/', (req, res) => servicosController.getServicos(req.app.get('supabase'), req, res));

module.exports = router;
