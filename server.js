const express = require('express');
const { connectToDatabase } = require('./database');
const { cadastrarCliente } = require('./public/controller/clienteController');
const { login } = require('./public/controller/clienteController');
const { listarProdutos } = require('./public/controller/produtoController');
const { listarCarrinho } = require('./public/controller/carrinhoController');
const { salvarCarrinho } = require('./public/controller/carrinhoController');
const { verificarToken } = require('./public/js/token');



const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Rotas
app.post('/cliente', cadastrarCliente);
app.post('/login', login);
app.post('/produto', verificarToken, listarProdutos);
app.post('/carrinho', verificarToken, salvarCarrinho);
app.post('/listarCarrinho', verificarToken, listarCarrinho);

app.use(express.static(__dirname + '/public'));
  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Conectar ao banco de dados
connectToDatabase();