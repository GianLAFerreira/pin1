const express = require('express');
const { connectToDatabase } = require('./database');
const { cadastrarCliente } = require('./public/controller/clienteController');
const { login } = require('./public/controller/clienteController');
const { listarProdutos, cadastrarProduto, isFornecedor } = require('./public/controller/produtoController');
const { listarCarrinho, salvarCarrinho, salvarCartao, obterCartoes} = require('./public/controller/carrinhoController');
const { realizarPagamento } = require('./public/controller/pagamentoController');

const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Rotas
app.post('/login', login);
app.post('/cadastrarCliente', cadastrarCliente);

app.post('/isFornecedor', isFornecedor);
app.post('/listarProdutos', listarProdutos);
app.post('/cadastrarProduto', cadastrarProduto);

app.post('/salvarCarrinho', salvarCarrinho);
app.post('/listarCarrinho', listarCarrinho);
app.post('/salvarCartao', salvarCartao);
app.post('/obterCartoes', obterCartoes);


app.post('/realizarPagamento', realizarPagamento);

app.use(express.static(__dirname + '/public'));
  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Conectar ao banco de dados
connectToDatabase();