// Não é mais necessário importar o supabaseClient aqui
// const supabase = require('../supabaseClient');  // Remover esta linha

async function addServico(supabase, req, res) {
  const { nome, preco, duracao, categoria_id, imagem_url } = req.body;
  try {
    const { data, error } = await supabase.from('servicos').insert([{
      nome, preco, duracao, categoria_id, imagem_url
    }]);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao adicionar serviço', details: error.message });
  }
}

async function updateServico(supabase, req, res) {
  const { id } = req.params;
  const { nome, preco, duracao, categoria_id, imagem_url } = req.body;
  try {
    const { data, error } = await supabase.from('servicos').update({ nome, preco, duracao, categoria_id, imagem_url }).match({ id });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao editar serviço', details: error.message });
  }
}

async function deleteServico(supabase, req, res) {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('servicos').delete().match({ id });
    if (error) throw error;
    res.json({ message: 'Serviço excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir serviço', details: error.message });
  }
}

async function getServicos(supabase, req, res) {
  try {
    const { data, error } = await supabase.from('servicos').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao carregar serviços', details: error.message });
  }
}

module.exports = { addServico, updateServico, deleteServico, getServicos };
