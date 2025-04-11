// Funções para Gerenciar Categorias
async function carregarCategorias() {
  try {
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
  } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      alert('Erro ao carregar categorias.');
  }
}

document.getElementById('btn-add-categoria').addEventListener('click', () => {
  showModal('modal-categoria');
});

async function editarCategoria(id) {
  try {
      const response = await fetch(`/api/categorias/${id}`);
      const categoria = await response.json();

      // Preenche o modal com os dados da categoria
      document.getElementById('categoria-nome').value = categoria.nome;

      // Exibe o modal
      showModal('modal-categoria');

      document.getElementById('form-editar-categoria').onsubmit = async (event) => {
          event.preventDefault();

          const nome = document.getElementById('categoria-nome').value;
          if (nome) {
              await fetch(`/api/categorias/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nome })
              });
              carregarCategorias();
              closeModal('modal-categoria');
          } else {
              alert('O nome da categoria é obrigatório.');
          }
      };
  } catch (error) {
      console.error('Erro ao editar categoria:', error);
      alert('Erro ao editar categoria.');
  }
}

async function excluirCategoria(id) {
  if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
          await fetch(`/api/categorias/${id}`, {
              method: 'DELETE'
          });
          carregarCategorias();
      } catch (error) {
          console.error('Erro ao excluir categoria:', error);
          alert('Erro ao excluir categoria.');
      }
  }
}

// Funções para Gerenciar Serviços
async function carregarServicos() {
  try {
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
  } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      alert('Erro ao carregar serviços.');
  }
}

document.getElementById('btn-add-servico').addEventListener('click', () => {
  showModal('modal-servico');
});

async function editarServico(id) {
  try {
      const response = await fetch(`/api/servicos/${id}`);
      const servico = await response.json();

      // Preenche o modal com os dados do serviço
      document.getElementById('servico-nome').value = servico.nome;
      document.getElementById('servico-preco').value = servico.preco;
      document.getElementById('servico-duracao').value = servico.duracao;
      document.getElementById('servico-categoria').value = servico.categoria_id;
      document.getElementById('servico-imagem').value = servico.imagem_url;

      // Exibe o modal
      showModal('modal-servico');

      document.getElementById('form-editar-servico').onsubmit = async (event) => {
          event.preventDefault();

          const nome = document.getElementById('servico-nome').value;
          const preco = document.getElementById('servico-preco').value;
          const duracao = document.getElementById('servico-duracao').value;
          const categoria_id = document.getElementById('servico-categoria').value;
          const imagem_url = document.getElementById('servico-imagem').value;

          if (nome && preco && duracao && categoria_id) {
              await fetch(`/api/servicos/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nome, preco, duracao, categoria_id, imagem_url })
              });
              carregarServicos();
              closeModal('modal-servico');
          } else {
              alert('Todos os campos são obrigatórios.');
          }
      };
  } catch (error) {
      console.error('Erro ao editar serviço:', error);
      alert('Erro ao editar serviço.');
  }
}

async function excluirServico(id) {
  if (confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
          await fetch(`/api/servicos/${id}`, {
              method: 'DELETE'
          });
          carregarServicos();
      } catch (error) {
          console.error('Erro ao excluir serviço:', error);
          alert('Erro ao excluir serviço.');
      }
  }
}

// Funções para Gerenciar Funcionários
async function carregarFuncionarios() {
  try {
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
              <button class="edit" onclick="editarFuncionario(${funcionario.id})">Editar</button>
              <button onclick="excluirFuncionario(${funcionario.id})">Excluir</button>
          `;
          li.appendChild(actions);
          listaFuncionarios.appendChild(li);
      });
  } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      alert('Erro ao carregar funcionários.');
  }
}

document.getElementById('btn-add-funcionario').addEventListener('click', () => {
  showModal('modal-funcionario');
});

async function editarFuncionario(id) {
  try {
      const response = await fetch(`/api/funcionarios/${id}`);
      const funcionario = await response.json();

      // Preenche o modal com os dados do funcionário
      document.getElementById('funcionario-nome').value = funcionario.nome;
      document.getElementById('funcionario-email').value = funcionario.email;
      document.getElementById('funcionario-telefone').value = funcionario.telefone;

      // Exibe o modal
      showModal('modal-funcionario');

      document.getElementById('form-editar-funcionario').onsubmit = async (event) => {
          event.preventDefault();

          const nome = document.getElementById('funcionario-nome').value;
          const email = document.getElementById('funcionario-email').value;
          const telefone = document.getElementById('funcionario-telefone').value;

          if (nome && email && telefone) {
              await fetch(`/api/funcionarios/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nome, email, telefone })
              });
              carregarFuncionarios();
              closeModal('modal-funcionario');
          } else {
              alert('Todos os campos são obrigatórios.');
          }
      };
  } catch (error) {
      console.error('Erro ao editar funcionário:', error);
      alert('Erro ao editar funcionário.');
  }
}

async function excluirFuncionario(id) {
  if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
          await fetch(`/api/funcionarios/${id}`, {
              method: 'DELETE'
          });
          carregarFuncionarios();
      } catch (error) {
          console.error('Erro ao excluir funcionário:', error);
          alert('Erro ao excluir funcionário.');
      }
  }
}

// Funções para manipulação de modais
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
}

document.getElementById('btn-fechar-modal').addEventListener('click', () => {
  closeModal('modal-categoria');
  closeModal('modal-servico');
  closeModal('modal-funcionario');
});

// Fechar o modal ao clicar no "X" de fechar
const modalCloseButtons = document.querySelectorAll('.modal-close');
modalCloseButtons.forEach(button => {
  button.addEventListener('click', (e) => {
      const modalId = e.target.closest('.modal').id;
      closeModal(modalId);
  });
});
