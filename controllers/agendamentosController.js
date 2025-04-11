const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://db.kblzgaeiljpqgjeiexvt.supabase.co',
  'postgresql://postgres:Basquete-1@db.kblzgaeiljpqgjeiexvt.supabase.co:5432/postgres'
);

module.exports = {
  criarAgendamento: async (req, res) => {
    try {
      const { nome, telefone, email, servicoId, funcionarioId, data, hora } = req.body;
      const dataHora = new Date(`${data}T${hora}:00`);
      const dataHoraString = dataHora.toISOString();

      const { data: agendamentoExistente, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('data', dataHoraString)
        .eq('id_funcionario', funcionarioId)
        .eq('id_servico', servicoId);

      if (error) {
        return res.status(500).json({ error: 'Erro ao verificar agendamento existente' });
      }

      if (Array.isArray(agendamentoExistente) && agendamentoExistente.length > 0) {
        return res.status(400).json({ error: 'Erro: Já existe um agendamento para essa data e hora.' });
      }

      const { data: novoAgendamento, error: insertError } = await supabase.from('agendamentos').insert([{
        nome, telefone, email, id_servico: servicoId, id_funcionario: funcionarioId, data: dataHoraString, hora
      }]);

      if (insertError) {
        return res.status(500).json({ error: 'Erro ao agendar', details: insertError.message });
      }

      res.json({ message: 'Agendamento realizado com sucesso!' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar agendamento', details: err.message });
    }
  },

  listarAgendamentos: async (req, res) => {
    try {
      const { nome } = req.query;
      const { data, error } = await supabase.from('agendamentos')
        .select('*')
        .ilike('nome', `%${nome}%`);

      if (error) throw new Error(error.message);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao consultar agendamentos', details: err.message });
    }
  },

  editarAgendamento: async (req, res) => {
    const { id } = req.params;
    const { nome, telefone, email, servico_id, funcionario_id, data, hora } = req.body;
    const { data: updatedAgendamento, error } = await supabase.from('agendamentos').update({ nome, telefone, email, servico_id, funcionario_id, data, hora }).match({ id });
    if (error) return res.status(400).json({ error: 'Erro ao editar agendamento', details: error.message });
    res.json(updatedAgendamento);
  },

  excluirAgendamento: async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('agendamentos').delete().match({ id });
    if (error) return res.status(400).json({ error: 'Erro ao excluir agendamento', details: error.message });
    res.json({ message: 'Agendamento excluído com sucesso' });
  },

  marcarComoConcluido: async (req, res) => {
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
      res.status(500).json({ error: 'Erro ao marcar agendamento como concluído', details: err.message });
    }
  }
};
