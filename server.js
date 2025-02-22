const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/salao-de-beleza', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Middleware para lidar com JSON no corpo das requisições
app.use(express.json());

// Servir arquivos estáticos diretamente da raiz
app.use(express.static(__dirname)); // Serve arquivos na raiz

// Modelos Mongoose (Categoria, Serviço e Agendamento)
const Categoria = mongoose.model('Categoria', new mongoose.Schema({
  nome: { type: String, required: true }
}));

const Servico = mongoose.model('Servico', new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true }
}));

const Agendamento = mongoose.model('Agendamento', new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  servico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico', required: true },
  data: { type: Date, required: true },
  hora: { type: String, required: true }
}));

// Rota para a área administrativa
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html')); // Rendeiriza admin.html
});

// Rota para o formulário de agendamento
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Rendeiriza index.html
});

// API para adicionar uma nova categoria
app.post('/api/categorias', async (req, res) => {
  try {
    const categoria = new Categoria({ nome: req.body.nome });
    await categoria.save();
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao adicionar categoria' });
  }
});

// API para obter todas as categorias
app.get('/api/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao carregar categorias' });
  }
});

// API para adicionar um novo serviço
app.post('/api/servicos', async (req, res) => {
  try {
    const { nome, preco, categoria_id } = req.body;
    const servico = new Servico({ nome, preco, categoria_id });
    await servico.save();
    res.json(servico);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao adicionar serviço' });
  }
});

// API para obter todos os serviços de uma categoria
app.get('/api/servicos/:categoriaId', async (req, res) => {
    const categoriaId = req.params.categoriaId;
    try {
      const servicos = await Servico.find({ categoria_id: categoriaId });
      res.json(servicos);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao carregar serviços', error: err });
    }
  });

// API para obter todos os agendamentos
app.get('/api/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate('servico_id', 'nome preco') // Preenche os dados do serviço relacionado
      .exec();
    res.json(agendamentos);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao carregar agendamentos' });
  }
});

// Rota para agendar
app.post('/api/agendar', async (req, res) => {
    const { nome, telefone, email, servicoId, data, hora } = req.body;
  
    // Verificando se a data e hora já estão ocupadas
    const dataHora = new Date(`${data}T${hora}:00`); // Convertendo para um formato de data
    try {
      const agendamentoExistente = await Agendamento.findOne({ data: dataHora, servico_id: servicoId });
      if (agendamentoExistente) {
        return res.status(400).send('Erro: Já existe um agendamento para essa data e hora.');
      }
  
      // Criando um novo agendamento
      const novoAgendamento = new Agendamento({
        nome,
        telefone,
        email,
        servico_id: servicoId,
        data: dataHora,
        hora
      });
  
      // Salvando o agendamento no banco
      await novoAgendamento.save();
      res.send('Agendamento realizado com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao agendar: ' + err);
    }
  });

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
