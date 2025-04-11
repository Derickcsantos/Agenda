const adicionarCategoria = async (req, res, supabase) => {
  const { nome } = req.body;
  const { data, error } = await supabase.from('categorias').insert([{ nome }]);

  if (error) {
    return res.status(400).json({ error: 'Erro ao adicionar categoria', details: error.message });
  }

  res.json(data);
};

const listarCategorias = async (req, res, supabase) => {
  const { data, error } = await supabase
    .from('categorias')
    .select('id_categoria as id, nome_categoria as nome'); // Ajuste os campos aqui

  if (error) {
    return res.status(400).json({ error: 'Erro ao carregar categorias', details: error.message });
  }

  res.json(data);
};

const editarCategoria = async (req, res, supabase) => {
  const { id } = req.params;
  const { nome } = req.body;
  const { data, error } = await supabase.from('categorias').update({ nome }).match({ id });
  if (error) return res.status(400).json({ error: 'Erro ao editar categoria', details: error.message });
  res.json(data);
};

const deletarCategoria = async (req, res, supabase) => {
  const { id } = req.params;
  const { error } = await supabase.from('categorias').delete().match({ id });
  if (error) return res.status(400).json({ error: 'Erro ao excluir categoria', details: error.message });
  res.json({ message: 'Categoria excluída com sucesso' });
};

module.exports = {
  adicionarCategoria,
  listarCategorias,
  editarCategoria,
  deletarCategoria,
};
