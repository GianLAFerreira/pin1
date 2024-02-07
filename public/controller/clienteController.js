const { pool } = require('../../database');

const loginCliente = async (req, res) => {
    try {
        const { emailCliente } = req.body;
        const {  senhaCliente } = req.body;
        const values = [emailCliente, senhaCliente];
        
        const query = `
        SELECT * FROM cliente WHERE email = $1 AND senha = $2;
    `;

        // Executando a consulta
        const result = await pool.query(query, values);
        
        // Verificando se o resultado contém pelo menos um registro
        if (result.rowCount >  0) {
            res.status(201).json({ message: 'Login realizado com sucesso.' });
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
    const { cpf } = req.body;
    const { rua } = req.body;
    const { numero } = req.body;
    const { bairro } = req.body;
    const { estado } = req.body;
    const { cep } = req.body;
    const { senha } = req.body;

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
        }
        const query = `
            INSERT INTO cliente (primeiro_nome, sobrenome, email, cpf, rua, numero, bairro, estado, cep, senha)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        const values = [primeiroNome, sobrenome, email, cpf, rua, numero, bairro, estado, cep, senha];

        await pool.query(query, values);
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
                cpf VARCHAR(11) NOT NULL,
                rua VARCHAR(50) NOT NULL,
                numero VARCHAR(10) NOT NULL, 
                bairro VARCHAR(50) NOT NULL,
                estado VARCHAR(2) NOT NULL,
                cep VARCHAR(8) NOT NULL, 
                senha VARCHAR(8)
            );
        `;
        await pool.query(createTableQuery);
        console.log('Tabela cliente criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela cliente:', error);
        throw error;
    }
}


module.exports = { cadastrarCliente, loginCliente };
