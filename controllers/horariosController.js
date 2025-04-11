const supabase = require('../supabaseClient');  // Supabase client

async function getHorarios(req, res) {
  const { funcionarioId } = req.params;
  const { servico_id, data } = req.query;

  if (!servico_id || !data) {
    return res.status(400).json({ error: 'Serviço e data são obrigatórios' });
  }

  try {
    const { data: agendamentos, error: agendamentosError } = await supabase
      .from('agendamentos')
      .select('hora_inicio, hora_fim')
      .eq('id_funcionario', funcionarioId)
      .eq('data', data)
      .eq('id_servico', servico_id);

    if (agendamentosError) {
      return res.status(400).json({ error: 'Erro ao carregar agendamentos', details: agendamentosError.message });
    }

    const horariosIniciais = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
    const agendamentosEmMinutos = agendamentos.map(agendamento => {
      const [horaInicio, minutoInicio] = agendamento.hora_inicio.split(":").map(Number);
      const [horaFim, minutoFim] = agendamento.hora_fim.split(":").map(Number);
      return { inicio: horaInicio * 60 + minutoInicio, fim: horaFim * 60 + minutoFim };
    });

    const horariosDisponiveis = horariosIniciais.filter(hora => {
      const [horaInicio, minutoInicio] = hora.split(":").map(Number);
      const horarioEmMinutos = horaInicio * 60 + minutoInicio;

      return !agendamentosEmMinutos.some(agendamento => {
        const fimHorario = horarioEmMinutos + 30;  // A duração do serviço é 30 minutos
        return (horarioEmMinutos >= agendamento.inicio && horarioEmMinutos < agendamento.fim) ||
               (fimHorario > agendamento.inicio && fimHorario <= agendamento.fim);
      });
    });

    res.json(horariosDisponiveis);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar horários', details: error.message });
  }
}

module.exports = { getHorarios };
