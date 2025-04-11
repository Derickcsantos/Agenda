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

document.getElementById('btn-pesquisar-agendamentos').addEventListener('click', async () => {
    const nome_cliente = prompt('Nome do cliente para buscar:');
    if (nome_cliente) {
        try {
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
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            alert('Erro ao buscar agendamentos.');
        }
    }
});

// Função para editar agendamento
async function editarAgendamento(id) {
    try {
        const response = await fetch(`/api/agendamentos/${id}`);
        const agendamento = await response.json();

        // Preenche o modal com os dados do agendamento
        document.getElementById('agendamento-nome').value = agendamento.nome_cliente;
        document.getElementById('agendamento-telefone').value = agendamento.telefone;
        document.getElementById('agendamento-email').value = agendamento.email;
        document.getElementById('agendamento-data').value = agendamento.data;
        document.getElementById('agendamento-hora').value = agendamento.hora;

        // Exibe o modal
        showModal('modal-editar-agendamento');

        document.getElementById('form-editar-agendamento').onsubmit = async (event) => {
            event.preventDefault();

            const nome = document.getElementById('agendamento-nome').value;
            const telefone = document.getElementById('agendamento-telefone').value;
            const email = document.getElementById('agendamento-email').value;
            const data = document.getElementById('agendamento-data').value;
            const hora = document.getElementById('agendamento-hora').value;

            if (nome && telefone && email && data && hora) {
                await fetch(`/api/agendamentos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome_cliente: nome, telefone, email, data, hora })
                });
                carregarAgendamentos();
                closeModal('modal-editar-agendamento');
            } else {
                alert('Todos os campos são obrigatórios.');
            }
        };
    } catch (error) {
        console.error('Erro ao editar agendamento:', error);
        alert('Erro ao editar agendamento.');
    }
}

// Função para excluir agendamento
async function excluirAgendamento(id) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        try {
            await fetch(`/api/agendamentos/${id}`, {
                method: 'DELETE'
            });
            carregarAgendamentos();
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
            alert('Erro ao excluir agendamento.');
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
    closeModal('modal-editar-agendamento');
});

// Fechar o modal ao clicar no "X" de fechar
const modalCloseButtons = document.querySelectorAll('.modal-close');
modalCloseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const modalId = e.target.closest('.modal').id;
        closeModal(modalId);
    });
});
