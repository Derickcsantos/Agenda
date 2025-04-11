const { createClient } = require('@supabase/supabase-js');

// Função para validar os dados de entrada
function validarDadosFuncionario(data) {
  const { nome, email, telefone, servicos } = data;
  if (!nome || !email || !telefone || !Array.isArray(servicos) || servicos.length === 0) {
    return 'Dados inválidos: nome, email, telefone e serviços são obrigatórios.';
  }
  return null; // Dados válidos
}

async function addFuncionario(supabase, req, res) {
  const { nome, email, telefone, servicos } = req.body;

  // Validação dos dados de entrada
  const erroValidacao = validarDadosFuncionario(req.body);
  if (erroValidacao) {
    return res.status(400).json({ error: erroValidacao });
  }

  try {
    // Iniciar uma transação
    const { data: funcionario, error } = await supabase
      .from('funcionarios')
      .insert([{ nome, email, telefone }])
      .select();

    if (error) {
      return res.status(500).json({ error: 'Erro ao inserir funcionário', details: error.message });
    }

    const funcionarioId = funcionario[0].id;

    // Associar o funcionário aos serviços na mesma transação
    const associados = await supabase.from('funcionarios_servicos').upsert(
      servicos.map((servicoId) => ({ funcionario_id: funcionarioId, servico_id: servicoId })),
      { onConflict: ['funcionario_id', 'servico_id'] } // Evita duplicação de associações
    );

    if (associados.error) {
      return res.status(500).json({ error: 'Erro ao associar serviços ao funcionário', details: associados.error.message });
    }

    // Responde com o funcionário adicionado
    res.status(201).json(funcionario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno', details: error.message });
  }
}

async function getFuncionarios(supabase, req, res) {
  try {
    const { data, error } = await supabase.from('funcionarios').select('*');

    if (error) {
      return res.status(500).json({ error: 'Erro ao carregar funcionários', details: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno', details: error.message });
  }
}

async function getFuncionariosPorServico(supabase, req, res) {
  const { servicoId } = req.params;
  try {
    const { data, error } = await supabase
      .from('funcionarios_servicos')
      .select('funcionarios.id, funcionarios.nome, funcionarios.email, funcionarios.telefone')
      .eq('servico_id', servicoId);

    if (error) {
      return res.status(500).json({ error: 'Erro ao carregar funcionários por serviço', details: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno', details: error.message });
  }
}

module.exports = { addFuncionario, getFuncionarios, getFuncionariosPorServico };
