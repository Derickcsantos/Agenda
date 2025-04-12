// Configuração do calendário
function configurarCalendario() {
  return flatpickr("#data", {
    locale: "pt",
    minDate: "today",
    dateFormat: "d/m/Y",
    disable: [
      function(date) {
        // Desabilitar fins de semana (sábado e domingo)
        return (date.getDay() === 0 || date.getDay() === 6);
      }
    ],
    onChange: function(selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        const formattedDate = selectedDates[0].toISOString().split('T')[0];
        document.getElementById('data').value = formattedDate;
        carregarHorariosDisponiveis();
      }
    }
  });
}

// Função para carregar categorias com tratamento de erro
async function carregarCategorias() {
  try {
    const selectCategoria = document.getElementById('categoria');
    selectCategoria.innerHTML = '<option value="">Carregando...</option>';
    
    const response = await fetch('/api/categorias');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const categorias = await response.json();
    
    selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nome;
      selectCategoria.appendChild(option);
    });
    
    // Habilitar o select após carregar
    selectCategoria.disabled = false;
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    const selectCategoria = document.getElementById('categoria');
    selectCategoria.innerHTML = '<option value="">Erro ao carregar categorias</option>';
  }
}

// Função para validar etapas antes de avançar
function validarEtapa(etapa) {
  switch(etapa) {
    case 1:
      return document.getElementById('categoria').value !== '';
    case 2:
      return document.getElementById('servico').value !== '';
    case 3:
      return document.getElementById('funcionario').value !== '';
    case 4:
      return document.getElementById('data').value !== '';
    case 5:
      return document.querySelector('.hora-item.selected') !== null;
    case 6:
      return document.getElementById('nome').value !== '' && 
             document.getElementById('telefone').value !== '' && 
             document.getElementById('email').value !== '';
    default:
      return true;
  }
}

// Atualizar a barra de progresso
function atualizarProgresso(etapaAtual) {
  const steps = document.querySelectorAll('.progress-step');
  steps.forEach((step, index) => {
    if (index < etapaAtual) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
}

// Função para navegar entre etapas
function navegarParaEtapa(de, para) {
  if (de !== 6 || validarEtapa(de)) {
    document.getElementById(`step-${de}`).classList.remove('active');
    document.getElementById(`step-${para}`).classList.add('active');
    atualizarProgresso(para);
    
    // Rolar para o topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    return true;
  }
  return false;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Configurar calendário
  const calendar = configurarCalendario();
  
  // Carregar categorias
  carregarCategorias();
  
  // Event listeners para navegação
  document.getElementById('next-step-1').addEventListener('click', () => {
    if (validarEtapa(1)) navegarParaEtapa(1, 2);
    else alert('Por favor, selecione uma categoria');
  });
  
  document.getElementById('next-step-2').addEventListener('click', () => {
    if (validarEtapa(2)) navegarParaEtapa(2, 3);
    else alert('Por favor, selecione um serviço');
  });
  
  document.getElementById('next-step-3').addEventListener('click', () => {
    if (validarEtapa(3)) navegarParaEtapa(3, 4);
    else alert('Por favor, selecione um profissional');
  });
  
  document.getElementById('next-step-4').addEventListener('click', () => {
    if (validarEtapa(4)) navegarParaEtapa(4, 5);
    else alert('Por favor, selecione uma data');
  });
  
  document.getElementById('next-step-5').addEventListener('click', () => {
    if (validarEtapa(5)) navegarParaEtapa(5, 6);
    else alert('Por favor, selecione um horário');
  });
  
  document.getElementById('next-step-6').addEventListener('click', () => {
    if (validarEtapa(6)) navegarParaEtapa(6, 7);
    else alert('Por favor, preencha todos os campos');
  });
  
  // Botões de voltar
  for (let i = 2; i <= 7; i++) {
    document.getElementById(`back-step-${i}`).addEventListener('click', () => {
      navegarParaEtapa(i, i-1);
    });
  }
  
  // Carregar serviços quando a categoria mudar
  document.getElementById('categoria').addEventListener('change', async function() {
    if (this.value) {
      await carregarServicos();
      document.getElementById('servico').disabled = false;
    }
  });
  
  // Carregar funcionários quando o serviço mudar
  document.getElementById('servico').addEventListener('change', async function() {
    if (this.value) {
      await carregarFuncionarios();
      document.getElementById('funcionario').disabled = false;
    }
  });
  
  // Formatar telefone
  document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    if (value.length > 0) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    
    if (value.length > 6) {
      value = `${value.substring(0, 6)}-${value.substring(6)}`;
    }
    
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    
    e.target.value = value;
  });
});

// As outras funções (carregarServicos, carregarFuncionarios, carregarHorariosDisponiveis, etc.)
// podem permanecer as mesmas que você já tinha, apenas certifique-se de que estão bem integradas
// com o novo sistema de validação e navegação
  // Função para carregar serviços via API com base na categoria
  async function carregarServicos() {
    const categoriaId = document.getElementById('categoria').value;
    const response = await fetch(`/api/servicos/${categoriaId}`);
    const servicos = await response.json();
    const selectServico = document.getElementById('servico');
    selectServico.innerHTML = ''; // Limpar antes de preencher
    servicos.forEach(servico => {
      const option = document.createElement('option');
      option.value = servico.id;
      option.textContent = servico.nome;
      selectServico.appendChild(option);
    });
  }

  // Função para carregar funcionários via API com base no serviço
  async function carregarFuncionarios() {
    const servicoId = document.getElementById('servico').value;
    const response = await fetch(`/api/funcionarios?servico_id=${servicoId}`);
    const funcionarios = await response.json();
    const selectFuncionario = document.getElementById('funcionario');
    selectFuncionario.innerHTML = '';

    funcionarios.forEach(funcionario => {
      const option = document.createElement('option');
      option.value = funcionario.id;
      option.textContent = funcionario.nome;
      selectFuncionario.appendChild(option);
    });
  }

  // Função para carregar horários disponíveis via API
  async function carregarHorariosDisponiveis() {
    const funcionarioId = document.getElementById('funcionario').value;
    const servicoId = document.getElementById('servico').value;  // Assumindo que você tem um campo para o serviço
    const dataSelecionada = document.getElementById('data').value;

    if (!funcionarioId || !servicoId || !dataSelecionada) return;

    try {
      const response = await fetch(`/api/horarios/${funcionarioId}?servico_id=${servicoId}&data=${dataSelecionada}`);
      const horarios = await response.json();

      const listaHorarios = document.getElementById('hora');
      listaHorarios.innerHTML = ''; // Limpar a lista antes de adicionar novos itens

      if (horarios.length > 0) {
        horarios.forEach(hora => {
          const div = document.createElement('div');
          div.classList.add('hora-item');
          div.textContent = hora;
          div.setAttribute('data-hora', hora);
          
          // Adiciona o evento de clique para marcar como selecionado
          div.addEventListener('click', () => selecionarHora(div));
          
          listaHorarios.appendChild(div);
        });
      } else {
        const div = document.createElement('div');
        div.classList.add('hora-item');
        div.textContent = 'Nenhum horário disponível';
        listaHorarios.appendChild(div);
      }
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    }
  }

  // Função para selecionar a hora
  function selecionarHora(item) {
    const allItems = document.querySelectorAll('.hora-item');
    allItems.forEach(i => i.classList.remove('selected'));

    item.classList.add('selected');
    const horaSelecionada = item.getAttribute('data-hora');
    document.getElementById('resumo-hora').textContent = horaSelecionada;
  }

  // Função para formatar a data
  function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Atualizar o resumo
  function atualizarResumo() {
    document.getElementById('resumo-categoria').textContent = document.getElementById('categoria').selectedOptions[0].textContent;
    document.getElementById('resumo-servico').textContent = document.getElementById('servico').selectedOptions[0].textContent;
    document.getElementById('resumo-funcionario').textContent = document.getElementById('funcionario').selectedOptions[0].textContent;
    document.getElementById('resumo-data').textContent = formatarData(document.getElementById('data').value);
    document.getElementById('resumo-hora').textContent = document.getElementById('resumo-hora').textContent;
    document.getElementById('resumo-nome').textContent = document.getElementById('nome').value;
    document.getElementById('resumo-telefone').textContent = document.getElementById('telefone').value;
    document.getElementById('resumo-email').textContent = document.getElementById('email').value;
  }

  // Inicializar o flatpickr para o campo de data
  flatpickr("#data", {
    minDate: "today",
    onChange: function(selectedDates, dateStr, instance) {
      carregarHorariosDisponiveis();
    }
  });

  // Navegação entre as etapas
  document.getElementById('next-step-1').addEventListener('click', () => {
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
  });

  document.getElementById('next-step-2').addEventListener('click', () => {
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
  });

  document.getElementById('next-step-3').addEventListener('click', () => {
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-4').classList.remove('hidden');
  });

  document.getElementById('next-step-4').addEventListener('click', () => {
    document.getElementById('step-4').classList.add('hidden');
    document.getElementById('step-5').classList.remove('hidden');
    carregarHorariosDisponiveis();  // Carregar os horários ao passar para a etapa 5
  });

  document.getElementById('next-step-5').addEventListener('click', () => {
    document.getElementById('step-5').classList.add('hidden');
    document.getElementById('step-6').classList.remove('hidden');
  });

  document.getElementById('next-step-6').addEventListener('click', () => {
    document.getElementById('step-6').classList.add('hidden');
    document.getElementById('step-7').classList.remove('hidden');
    atualizarResumo();
  });

  // Função para enviar o agendamento ao banco de dados
  document.getElementById('form-agendamento').addEventListener('submit', async (event) => {
    event.preventDefault();
    const dadosAgendamento = {
      categoria: document.getElementById('categoria').value,
      servico: document.getElementById('servico').value,
      funcionario: document.getElementById('funcionario').value,
      data: document.getElementById('data').value,
      hora: document.getElementById('resumo-hora').textContent,
      nome: document.getElementById('nome').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('email').value
    };

    console.log(dadosAgendamento);

    try {
      const response = await fetch('/api/agendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAgendamento)
      });

      if (response.ok) {
        alert('Agendamento confirmado!');
      } else {
        alert('Erro ao confirmar o agendamento. Tente novamente.');
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor. Verifique sua conexão.');
    }
  });

  // Botões de "voltar" entre as etapas
  document.getElementById('back-step-2').addEventListener('click', () => {
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
  });

  document.getElementById('back-step-3').addEventListener('click', () => {
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
  });

  document.getElementById('back-step-4').addEventListener('click', () => {
    document.getElementById('step-4').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
  });

  document.getElementById('back-step-5').addEventListener('click', () => {
    document.getElementById('step-5').classList.add('hidden');
    document.getElementById('step-4').classList.remove('hidden');
  });

  document.getElementById('back-step-6').addEventListener('click', () => {
    document.getElementById('step-6').classList.add('hidden');
    document.getElementById('step-5').classList.remove('hidden');
  });

  document.getElementById('back-step-7').addEventListener('click', () => {
    document.getElementById('step-7').classList.add('hidden');
    document.getElementById('step-6').classList.remove('hidden');
  });

  // Inicializar
  window.onload = function () {
    carregarCategorias();
    document.getElementById('categoria').addEventListener('change', carregarServicos);
    document.getElementById('servico').addEventListener('change', carregarFuncionarios);
  };
