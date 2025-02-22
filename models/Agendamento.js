const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    email: { type: String, required: true },
    servico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico', required: true },
    data: { type: Date, required: true },
    hora: { type: String, required: true }
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);
