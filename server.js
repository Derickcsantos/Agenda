const express = require('express');
const path = require('path');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessão
app.use(session({
  secret: 'meuSegredo',
  resave: false,
  saveUninitialized: true,
}));

// API para adicionar uma categoria
app.post('/api/categorias', async (req, res) => {
  const { nome } = req.body;
  const { data, error } = await supabase.from('categorias').insert([{ nome }]);
  if (error) return res.status(400).json({ error: 'Erro ao adicionar categoria', details: error.message });
  res.json(data);
});

// API para editar uma categoria
app.put('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const { data, error } = await supabase.from('categorias').update({ nome }).match({ id });
  if (error) return res.status(400).json({ error: 'Erro ao editar categoria', details: error.message });
  res.json(data);
});

// API para excluir uma categoria
app.delete('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('categorias').delete().match({ id });
  if (error) return res.status(400).json({ error: 'Erro ao excluir categoria', details: error.message });
  res.json({ message: 'Categoria excluída com sucesso' });
});

// API para pegar todas as categorias
app.get('/api/categorias', async (req, res) => {
  const { data, error } = await supabase.from('categorias').select('*');
  if (error) return res.status(400).json({ error: 'Erro ao carregar categorias', details: error.message });
  res.json(data);
});

// API para adicionar um serviço
app.post('/api/servicos', async (req, res) => {
  const { nome, preco, duracao, categoria_id, imagem_url } = req.body;

  if (!nome || !preco || !duracao || !categoria_id) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  const precoFormatado = parseFloat(preco);
  const duracaoFormatada = parseInt(duracao, 10);

  if (isNaN(precoFormatado) || isNaN(duracaoFormatada)) {
    return res.status(400).json({ error: 'Preço ou duração inválido' });
  }

  const { data, error } = await supabase.from('servicos').insert([{
    nome,
    preco: precoFormatado,
    duracao: duracaoFormatada,
    categoria_id,
    imagem_url
  }]);

  if (error) return res.status(400).json({ error: 'Erro ao adicionar serviço', details: error.message });
  res.json(data);
});

// API para editar um serviço
app.put('/api/servicos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, preco, duracao, categoria_id, imagem_url } = req.body;

  const { data, error } = await supabase.from('servicos').update({ nome, preco, duracao, categoria_id, imagem_url }).match({ id });

  if (error) return res.status(400).json({ error: 'Erro ao editar serviço', details: error.message });
  res.json(data);
});

// API para excluir um serviço
app.delete('/api/servicos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('servicos').delete().match({ id });
  if (error) return res.status(400).json({ error: 'Erro ao excluir serviço', details: error.message });
  res.json({ message: 'Serviço excluído com sucesso' });
});

// API para pegar todos os serviços
app.get('/api/servicos', async (req, res) => {
  const { data, error } = await supabase.from('servicos').select('*');
  if (error) return res.status(400).json({ error: 'Erro ao carregar serviços', details: error.message });
  res.json(data);
});

app.get('/api/servicos/:categoriaId', async (req, res) => {
  const { categoriaId } = req.params;
  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('categoria_id', categoriaId);

  if (error) {
    return res.status(400).json({ error: 'Erro ao carregar serviços', details: error.message });
  }
  res.json(data);
});

// API para adicionar um funcionário
app.post('/api/funcionarios', async (req, res) => {
  const { nome, email, telefone, servicos } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  // Criação do funcionário
  const { data: funcionario, error: funcionarioError } = await supabase.from('funcionarios').insert([{
    nome, email, telefone
  }]);

  if (funcionarioError) return res.status(400).json({ error: 'Erro ao adicionar funcionário', details: funcionarioError.message });

  const funcionarioId = funcionario[0].id;

  // Adicionar serviços associados ao funcionário
  for (let servicoId of servicos) {
    const { error: assocError } = await supabase.from('funcionarios_servicos').insert([{ funcionario_id: funcionarioId, servico_id: servicoId }]);
    if (assocError) return res.status(400).json({ error: 'Erro ao associar serviço ao funcionário', details: assocError.message });
  }

  res.status(201).json(funcionario);
});

// API para consultar funcionários
app.get('/api/funcionarios', async (req, res) => {
  const { data, error } = await supabase.from('funcionarios').select('*');
  if (error) return res.status(400).json({ error: 'Erro ao carregar funcionários', details: error.message });
  res.json(data);
});

// API para pegar os funcionários por serviço
app.get('/api/funcionarios/:servicoId', async (req, res) => {
  const { servicoId } = req.params;
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('servico_id', servicoId);

  if (error) {
    return res.status(400).json({ error: 'Erro ao carregar funcionários', details: error.message });
  }
  res.json(data);
})

// API para pegar horários de disponibilidade de um funcionário
app.get('/api/horarios/:funcionarioId', async (req, res) => {
  const { funcionarioId } = req.params;
  const { data, error } = await supabase
    .from('funcionario_disponibilidade')
    .select('disponibilidade')
    .eq('funcionario_id', funcionarioId);

  if (error) {
    return res.status(400).json({ error: 'Erro ao carregar disponibilidade', details: error.message });
  }
  res.json(data);
});

// API para consultar agendamentos
app.get('/api/agendamentos', async (req, res) => {
  try {
    const { nome } = req.query;  // A consulta vai agora usar 'nome' em vez de 'nome_cliente'.
    const { data, error } = await supabase.from('agendamentos')
      .select('*')
      .ilike('nome', `%${nome}%`);  // A coluna correta é 'nome', então usamos isso para a pesquisa.

    if (error) throw new Error(error.message);
    res.json(data);
  } catch (err) {
    console.error('Erro ao consultar agendamentos:', err);
    res.status(500).json({ error: 'Erro ao consultar agendamentos', details: err.message });
  }
});

// API para adicionar um agendamento
app.post('/api/agendamentos', async (req, res) => {
  const { nome, telefone, email, servicoId, funcionarioId, data, hora } = req.body;

  const dataHora = new Date(`${data}T${hora}:00`);
  const dataHoraString = dataHora.toISOString();

  const { data: agendamentoExistente, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('data', dataHoraString)
    .eq('funcionario_id', funcionarioId);

  if (error) {
    console.error('Erro ao consultar agendamentos:', error);
    return res.status(500).json({ error: 'Erro ao verificar agendamento existente' });
  }

  if (Array.isArray(agendamentoExistente) && agendamentoExistente.length > 0) {
    return res.status(400).json({ error: 'Erro: Já existe um agendamento para essa data e hora.' });
  }

  const { data: novoAgendamento, error: insertError } = await supabase.from('agendamentos').insert([{
    nome, telefone, email, servico_id: servicoId, funcionario_id: funcionarioId, data: dataHoraString, hora
  }]);

  if (insertError) {
    console.error('Erro ao agendar:', insertError);
    return res.status(500).json({ error: 'Erro ao agendar', details: insertError.message });
  }

  res.json({ message: 'Agendamento realizado com sucesso!' });
});


// API para editar agendamento
app.put('/api/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email, servico_id, funcionario_id, data, hora } = req.body;
  const { data: updatedAgendamento, error } = await supabase.from('agendamentos').update({ nome, telefone, email, servico_id, funcionario_id, data, hora }).match({ id });
  if (error) return res.status(400).json({ error: 'Erro ao editar agendamento', details: error.message });
  res.json(updatedAgendamento);
});

// API para excluir agendamento
app.delete('/api/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('agendamentos').delete().match({ id });
  if (error) return res.status(400).json({ error: 'Erro ao excluir agendamento', details: error.message });
  res.json({ message: 'Agendamento excluído com sucesso' });
});

// API para marcar um agendamento como concluído
app.put('/api/agendamentos/concluido/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .update({ status: 'concluído' })
      .match({ id });

    if (error) {
      throw new Error(error.message);
    }

    res.json({ message: 'Agendamento marcado como concluído', agendamento: data });
  } catch (err) {
    console.error('Erro ao marcar como concluído:', err);
    res.status(500).json({ error: 'Erro ao marcar agendamento como concluído', details: err.message });
  }
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
