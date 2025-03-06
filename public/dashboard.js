  // Funções para Gerenciar Categorias
  async function carregarCategorias() {
    const response = await fetch('/api/categorias');
    const categorias = await response.json();
    const listaCategorias = document.getElementById('lista-categorias');
    listaCategorias.innerHTML = '';
    categorias.forEach(categoria => {
      const li = document.createElement('li');
      li.textContent = categoria.nome;
      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.innerHTML = `
        <button class="edit" onclick="editarCategoria(${categoria.id})">Editar</button>
        <button onclick="excluirCategoria(${categoria.id})">Excluir</button>
      `;
      li.appendChild(actions);
      listaCategorias.appendChild(li);
    });
  }

  document.getElementById('btn-add-categoria').addEventListener('click', async () => {
    if (nome) {
      await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
      });
      carregarCategorias();
    }
  });

  async function editarCategoria(id) {
    const response = await fetch(`/api/categorias/${id}`);
    const categoria = await response.json();
  
    // Preenche o modal com os dados da categoria
    document.getElementById('nome').value = categoria.nome;
  
    // Exibe o modal
    abrirModal();
  
    document.getElementById('form-editar').onsubmit = async (event) => {
      event.preventDefault();
      
      const nome = document.getElementById('nome').value;
      if (nome) {
        await fetch(`/api/categorias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome })
        });
        carregarCategorias();
        fecharModal();
      }
    };
  }
  


  async function excluirCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await fetch(`/api/categorias/${id}`, {
        method: 'DELETE'
      });
      carregarCategorias();
    }
  }

  // Funções para Gerenciar Serviços
  async function carregarServicos() {
    const response = await fetch('/api/servicos');
    const servicos = await response.json();
    const listaServicos = document.getElementById('lista-servicos');
    listaServicos.innerHTML = '';
    servicos.forEach(servico => {
      const li = document.createElement('li');
      li.textContent = `${servico.nome} - R$ ${servico.preco} - ${servico.duracao} min`;
      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.innerHTML = `
        <button class="edit" onclick="editarServico(${servico.id})">Editar</button>
        <button onclick="excluirServico(${servico.id})">Excluir</button>
      `;
      li.appendChild(actions);
      listaServicos.appendChild(li);
    });
  }

  document.getElementById('btn-add-servico').addEventListener('click', async () => {

    if (nome && preco && duracao && categoria_id) {
      await fetch('/api/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, duracao, categoria_id, imagem_url })
      });
      carregarServicos();
    }
  });

  async function editarServico(id) {
    const response = await fetch(`/api/servicos/${id}`);
    const servico = await response.json();
  
    // Preenche o modal com os dados do serviço
    document.getElementById('nome').value = servico.nome;
    document.getElementById('preco').value = servico.preco;
    document.getElementById('duracao').value = servico.duracao;
    document.getElementById('categoria_id').value = servico.categoria_id;
    document.getElementById('imagem_url').value = servico.imagem_url;
  
    // Exibe o modal
    abrirModal();
  
    document.getElementById('form-editar').onsubmit = async (event) => {
      event.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const preco = document.getElementById('preco').value;
      const duracao = document.getElementById('duracao').value;
      const categoria_id = document.getElementById('categoria_id').value;
      const imagem_url = document.getElementById('imagem_url').value;
  
      if (nome && preco && duracao && categoria_id) {
        await fetch(`/api/servicos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, preco, duracao, categoria_id, imagem_url })
        });
        carregarServicos();
        fecharModal();
      }
    };
  }
  
  async function excluirServico(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      await fetch(`/api/servicos/${id}`, {
        method: 'DELETE'
      });
      carregarServicos();
    }
  }

  async function carregarFuncionarios() {
const response = await fetch('/api/funcionarios');
const funcionarios = await response.json();
const listaFuncionarios = document.getElementById('lista-funcionarios');
listaFuncionarios.innerHTML = '';

funcionarios.forEach(funcionario => {
  const li = document.createElement('li');
  li.textContent = `${funcionario.nome} - ${funcionario.email}`;
  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.innerHTML = `
    <button onclick="carregarServicosPorFuncionario(${funcionario.id})">Ver Serviços</button>
  `;
  li.appendChild(actions);
  listaFuncionarios.appendChild(li);
});
}


  document.getElementById('btn-add-funcionario').addEventListener('click', async () => {

    if (nome && email && telefone) {
      await fetch('/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone })
      });
      carregarFuncionarios();
    }
  });

  async function editarFuncionario(id) {
    const response = await fetch(`/api/funcionarios/${id}`);
    const funcionario = await response.json();
  
    // Preenche o modal com os dados do funcionário
    document.getElementById('nome').value = funcionario.nome;
    document.getElementById('email').value = funcionario.email;
    document.getElementById('telefone').value = funcionario.telefone;
  
    // Exibe o modal
    abrirModal();
  
    document.getElementById('form-editar').onsubmit = async (event) => {
      event.preventDefault();
  
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
  
      if (nome && email && telefone) {
        await fetch(`/api/funcionarios/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, telefone })
        });
        carregarFuncionarios();
        fecharModal();
      }
    };
  }
  

  async function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      await fetch(`/api/funcionarios/${id}`, {
        method: 'DELETE'
      });
      carregarFuncionarios();
    }
  }

  async function carregarServicosPorFuncionario(funcionarioId) {
const response = await fetch(`/api/funcionarios/${funcionarioId}/servicos`);
const servicos = await response.json();
const listaServicosFuncionario = document.getElementById('lista-servicos-funcionario');
listaServicosFuncionario.innerHTML = ''; // Limpa a lista antes de adicionar os novos dados

servicos.forEach(servico => {
  const li = document.createElement('li');
  li.textContent = `${servico.nome} - R$ ${servico.preco} - ${servico.duracao} min`;
  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.innerHTML = `
    <button class="edit" onclick="editarServicoFuncionario(${funcionarioId}, ${servico.id})">Editar</button>
    <button onclick="excluirServicoFuncionario(${funcionarioId}, ${servico.id})">Excluir</button>
  `;
  li.appendChild(actions);
  listaServicosFuncionario.appendChild(li);
});
}

// Adicionar um novo serviço a um funcionário
document.getElementById('btn-add-servico-funcionario').addEventListener('click', async () => {

if (funcionarioId && servicoId) {
  await fetch(`/api/funcionarios/${funcionarioId}/servicos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ servico_id: servicoId })
  });
  carregarServicosPorFuncionario(funcionarioId);
}
});

async function editarServicoFuncionario(funcionarioId, servicoId) {
    const response = await fetch(`/api/funcionarios/${funcionarioId}/servicos/${servicoId}`);
    const servico = await response.json();
  
    // Preenche o modal com os dados do serviço do funcionário
    document.getElementById('nome').value = servico.nome;
    document.getElementById('preco').value = servico.preco;
    document.getElementById('duracao').value = servico.duracao;
  
    // Exibe o modal
    abrirModal();
  
    document.getElementById('form-editar').onsubmit = async (event) => {
      event.preventDefault();
  
      const nome = document.getElementById('nome').value;
      const preco = document.getElementById('preco').value;
      const duracao = document.getElementById('duracao').value;
  
      if (nome && preco && duracao) {
        await fetch(`/api/funcionarios/${funcionarioId}/servicos/${servicoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, preco, duracao })
        });
        carregarServicosPorFuncionario(funcionarioId);
        fecharModal();
      }
    };
  }
  

// Excluir um serviço de um funcionário
async function excluirServicoFuncionario(funcionarioId, servicoId) {
if (confirm('Tem certeza que deseja excluir este serviço do funcionário?')) {
  await fetch(`/api/funcionarios/${funcionarioId}/servicos/${servicoId}`, {
    method: 'DELETE'
  });
  carregarServicosPorFuncionario(funcionarioId);
}
}
  // Função para Gerenciar Agendamentos
  async function carregarAgendamentos() {
try {
  const response = await fetch('/api/agendamentos');
  const agendamentos = await response.json();

  if (!Array.isArray(agendamentos)) {
    console.error('Erro: agendamentos não é um array', agendamentos);
    return;
  }

  const listaAgendamentos = document.getElementById('lista-agendamentos');
  listaAgendamentos.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

  agendamentos.forEach(agendamento => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${agendamento.nome_cliente}</td>
      <td>${agendamento.data}</td>
      <td>${agendamento.hora}</td>
      <td class="actions">
        <button onclick="editarAgendamento(${agendamento.id})">Editar</button>
        <button onclick="excluirAgendamento(${agendamento.id})">Excluir</button>
      </td>
    `;
    listaAgendamentos.appendChild(tr);
  });
} catch (error) {
  console.error('Erro ao carregar agendamentos:', error);
}
}


// Função para pesquisar agendamentos por nome do cliente
document.getElementById('btn-pesquisar-agendamentos').addEventListener('click', async () => {
const nome_cliente = prompt('Nome do cliente para buscar:');
if (nome_cliente) {
  const response = await fetch(`/api/agendamentos?nome_cliente=${nome_cliente}`);
  const agendamentos = await response.json();
  const listaAgendamentos = document.getElementById('lista-agendamentos');
  listaAgendamentos.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

  // Preenche a tabela com os agendamentos encontrados
  agendamentos.forEach(agendamento => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${agendamento.nome_cliente}</td>
      <td>${agendamento.data}</td>
      <td>${agendamento.hora}</td>
      <td class="actions">
        <button onclick="editarAgendamento(${agendamento.id})">Editar</button>
        <button onclick="excluirAgendamento(${agendamento.id})">Excluir</button>
      </td>
    `;
    listaAgendamentos.appendChild(tr);
  });
}
});

async function editarAgendamento(id) {
    const response = await fetch(`/api/agendamentos/${id}`);
    const agendamento = await response.json();
  
    // Preenche o modal com os dados do agendamento
    document.getElementById('nome').value = agendamento.nome_cliente;
    document.getElementById('telefone').value = agendamento.telefone;
    document.getElementById('email').value = agendamento.email;
    document.getElementById('data').value = agendamento.data;
    document.getElementById('hora').value = agendamento.hora;
  
    // Exibe o modal
    abrirModal();
  
    document.getElementById('form-editar').onsubmit = async (event) => {
      event.preventDefault();
  
      const nome = document.getElementById('nome').value;
      const telefone = document.getElementById('telefone').value;
      const email = document.getElementById('email').value;
      const data = document.getElementById('data').value;
      const hora = document.getElementById('hora').value;
  
      if (nome && telefone && email && data && hora) {
        await fetch(`/api/agendamentos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome_cliente: nome, telefone, email, data, hora })
        });
        carregarAgendamentos();
        fecharModal();
      }
    };
  }
  

// Função para excluir um agendamento
async function excluirAgendamento(id) {
if (confirm('Tem certeza que deseja excluir este agendamento?')) {
  await fetch(`/api/agendamentos/${id}`, {
    method: 'DELETE'
  });
  carregarAgendamentos();
}
}

function abrirModal() {
    document.getElementById('modal-editar').style.display = 'block';
  }
  
  function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
  }
  
  document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal);
  

  // Função para mostrar o modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
  }
  
  // Função para esconder o modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
  }
  
  // Ao clicar no botão de adicionar categoria
  document.getElementById('btn-add-categoria').addEventListener('click', () => {
    showModal('modal-categoria');
  });
  
  // Ao clicar no botão de adicionar serviço
  document.getElementById('btn-add-servico').addEventListener('click', () => {
    showModal('modal-servico');
  });
  
  // Ao clicar no botão de adicionar funcionário
  document.getElementById('btn-add-funcionario').addEventListener('click', () => {
    showModal('modal-funcionario');
  });
  
  // Ao clicar no botão de adicionar serviço ao funcionário
  document.getElementById('btn-add-servico-funcionario').addEventListener('click', () => {
    showModal('modal-servico-funcionario');
  });
  
  // Fechar o modal ao clicar no "X" de fechar
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const modalId = e.target.closest('.modal').id;
      closeModal(modalId);
    });
  });
  
  // Confirmar a adição da categoria
  document.getElementById('confirmar-categoria').addEventListener('click', async () => {
    const nome = document.getElementById('categoria-nome').value;
    if (nome) {
      await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
      });
      carregarCategorias();
      closeModal('modal-categoria');
    }
  });
  
  // Confirmar a adição do serviço
  document.getElementById('confirmar-servico').addEventListener('click', async () => {
    const nome = document.getElementById('servico-nome').value;
    const preco = document.getElementById('servico-preco').value;
    const duracao = document.getElementById('servico-duracao').value;
    const categoria_id = document.getElementById('servico-categoria').value;
    const imagem_url = document.getElementById('servico-imagem').value;
  
    if (nome && preco && duracao && categoria_id) {
      await fetch('/api/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, duracao, categoria_id, imagem_url })
      });
      carregarServicos();
      closeModal('modal-servico');
    }
  });
  
  // Confirmar a adição do funcionário
  document.getElementById('confirmar-funcionario').addEventListener('click', async () => {
    const nome = document.getElementById('funcionario-nome').value;
    const email = document.getElementById('funcionario-email').value;
    const telefone = document.getElementById('funcionario-telefone').value;
  
    if (nome && email && telefone) {
      await fetch('/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone })
      });
      carregarFuncionarios();
      closeModal('modal-funcionario');
    }
  });
  
  // Confirmar a adição do serviço ao funcionário
  document.getElementById('confirmar-servico-funcionario').addEventListener('click', async () => {
    const funcionarioId = document.getElementById('funcionario-id').value;
    const servicoId = document.getElementById('servico-id').value;
  
    if (funcionarioId && servicoId) {
      await fetch(`/api/funcionarios/${funcionarioId}/servicos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servico_id: servicoId })
      });
      carregarServicosPorFuncionario(funcionarioId);
      closeModal('modal-servico-funcionario');
    }
  });
  

// Carregar os agendamentos ao iniciar
carregarAgendamentos();

  // Carregar os dados iniciais;
  carregarCategorias();
  carregarServicos();
  carregarFuncionarios();
  carregarAgendamentos();