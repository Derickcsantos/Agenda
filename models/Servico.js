const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true }
});

module.exports = mongoose.model('Servico', servicoSchema);
