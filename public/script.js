document.addEventListener('DOMContentLoaded', function () {
    // Carregar categorias
    fetch('/api/categorias')
        .then(response => response.json())
        .then(categorias => {
            const categoriaSelect = document.getElementById('categoria');
            categorias.forEach(categoria => {
                console.log(categoria);  // Verifique o que está sendo retornado
                const option = document.createElement('option');
                option.value = categoria._id;
                option.textContent = categoria.nome;
                categoriaSelect.appendChild(option);
            });
            
        })
        .catch(error => {
            console.error('Erro ao carregar categorias:', error);
            alert('Erro ao carregar categorias!');
        });

        document.getElementById('categoria').addEventListener('change', function () {
            const categoriaId = this.value;
            console.log('Categoria selecionada:', categoriaId);  // Verifique se o valor está correto
        
            if (categoriaId) {
                fetch(`/api/servicos/${categoriaId}`)
                    .then(response => response.json())
                    .then(servicos => {
                        const servicoSelect = document.getElementById('servico');
                        servicoSelect.innerHTML = '<option value="">Selecione um serviço</option>';
                        if (servicos.length > 0) {
                            servicos.forEach(servico => {
                                const option = document.createElement('option');
                                option.value = servico._id;
                                option.textContent = servico.nome;
                                servicoSelect.appendChild(option);
                            });
                        } else {
                            const option = document.createElement('option');
                            option.value = '';
                            option.textContent = 'Nenhum serviço disponível para esta categoria';
                            servicoSelect.appendChild(option);
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao carregar serviços:', error);
                        alert('Erro ao carregar serviços!');
                    });
            } else {
                document.getElementById('servico').innerHTML = '<option value="">Selecione a categoria primeiro</option>';
            }
        });
        

    // Submeter o formulário de agendamento
    document.getElementById('form-agendamento').addEventListener('submit', function (e) {
        e.preventDefault();
        
        const data = new FormData(this);
        const agendamento = {
            nome: data.get('nome'),
            telefone: data.get('telefone'),
            email: data.get('email'),
            servicoId: data.get('servico'),
            data: data.get('data'),
            hora: data.get('hora')
        };
        
        // Enviar dados de agendamento para o servidor
        fetch('/api/agendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamento)
        })
        .then(response => response.text())
        .then(text => {
            if (text.includes('Erro')) {
                alert('Erro ao agendar: ' + text);
            } else {
                alert('Agendamento realizado com sucesso!');
            }
        })
        .catch(error => {
            console.error('Erro ao fazer o agendamento:', error);
            alert('Erro ao realizar agendamento');
        });
    });
});
