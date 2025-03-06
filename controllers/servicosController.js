const Servico = require('../models/Servico');

exports.adicionarServico = async (req, res) => {
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
};

exports.getServicosPorCategoria = async (req, res) => {
  try {
    const servicos = await Servico.find({ categoria_id: req.params.categoriaId });
    res.status(200).json(servicos);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao carregar serviços', error });
  }
};

exports.editarServico = async (req, res) => {
  try {
    const servico = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    res.status(200).json(servico);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao editar serviço', error });
  }
};

exports.excluirServico = async (req, res) => {
  try {
    const servico = await Servico.findByIdAndDelete(req.params.id);
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    res.status(200).json({ message: 'Serviço excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao excluir serviço', error });
  }
};
