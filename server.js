const express = require('express');
const { connectToDatabase } = require('./database');
const { cadastrarCliente } = require('./public/controller/clienteController');

const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Rotas
app.post('/cliente', cadastrarCliente);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Conectar ao banco de dados
connectToDatabase();