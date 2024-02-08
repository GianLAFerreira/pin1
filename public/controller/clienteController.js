const { pool } = require('../../database');
const { gerarToken } = require('../js/token');

const login = async (req, res) => {
    try {
        const { emailCliente } = req.body;
        const {  senhaCliente } = req.body;
        const values = [emailCliente, senhaCliente];
        
        const query = `
        SELECT * FROM cliente WHERE email = $1 AND senha = $2;
    `;
        const result = await pool.query(query, values);
        
        if (result.rowCount >  0) {
            const id = result.rows[0].id;
            res.status(201).json({ message: 'Login realizado com sucesso.', id  });
        } else {
            res.status(401).json({ message: 'Email ou senha incorretos.' });
        }
    } catch (error) {
        console.log(error)
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).send('Erro interno do servidor');
    }
}

const cadastrarCliente = async (req, res) => {

    const { primeiroNome } = req.body;
    const { sobrenome } = req.body;
    const { email } = req.body;
    const { cpfcnpj } = req.body;
    const { rua } = req.body;
    const { numero } = req.body;
    const { bairro } = req.body;
    const { municipio } = req.body;
    const { uf } = req.body;
    const { cep } = req.body;
    const { senha } = req.body;
    const { isFornecedor } = req.body;

    try {

        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables 
                WHERE table_name = 'cliente'
            )
        `;
        const tableCheckResult = await pool.query(checkTableQuery);
        const tableExists = tableCheckResult.rows[0].exists;

        if (!tableExists) {
            await criarTabelaCliente();
            await criarTabelaProduto();
        }

        const query = `
            INSERT INTO cliente (primeiro_nome, sobrenome, email, cpfcnpj, rua, numero, bairro, municipio, uf, cep, senha, isFornecedor)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;
        const values = [primeiroNome, sobrenome, email, cpfcnpj, rua, numero, bairro, municipio, uf, cep, senha, isFornecedor];

        await pool.query(query, values);
        console.log('Conta criada com sucesso!');
        
        res.status(201).json({ message: 'Conta criada com sucesso.' });
    } catch (error) {
        console.log(error)
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

async function criarTabelaCliente() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS cliente (
                id SERIAL PRIMARY KEY,
                primeiro_nome VARCHAR(50) NOT NULL,
                sobrenome VARCHAR(50) NOT NULL,
                email VARCHAR(50) NOT NULL,
                cpfcnpj VARCHAR(11) NOT NULL,
                rua VARCHAR(50) NOT NULL,
                numero VARCHAR(10) NOT NULL, 
                bairro VARCHAR(50) NOT NULL,
                municipio VARCHAR(50) NOT NULL,
                uf VARCHAR(2) NOT NULL,
                cep VARCHAR(8) NOT NULL, 
                senha VARCHAR(8),
                isFornecedor boolean NOT NULL
            );
        `;
        await pool.query(createTableQuery);
        console.log('Tabela cliente criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela cliente:', error);
        throw error;
    }
}

module.exports = { cadastrarCliente, login };
