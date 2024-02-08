const { pool } = require('../../database');

const salvarCarrinho = async (req, res) => {
    try {
        const checkTableQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_name = 'carrinho'
        )
    `;

        const tableCheckResult = await pool.query(checkTableQuery);
        const tableExists = tableCheckResult.rows[0].exists;

        if (!tableExists) {
            await criarTabelaCarrinho();
        }

        // Extrair os dados do produto recebidos no corpo da requisição
        const { nome, descricao, valor, imagem, cliente_id } = req.body;

        // Consulta SQL para inserir os dados na tabela do carrinho
        const query = `
            INSERT INTO carrinho (nome, descricao, valor, imagem, cliente_id)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [nome, descricao, valor, imagem, cliente_id];
        await pool.query(query, values);

        res.status(201).send('Produto adicionado ao carrinho com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error);
        res.status(500).send('Erro interno do servidor');
    }
};



const listarCarrinho = async (req, res) => {
    try {
        const checkTableQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_name = 'carrinho'
        )
    `;

        const tableCheckResult = await pool.query(checkTableQuery);
        const tableExists = tableCheckResult.rows[0].exists;

        if (!tableExists) {
            await criarTabelaCarrinho();
        }

        const {cliente_id } = req.body;

        const query = `
            SELECT * FROM carrinho where cliente_id = $1;
        `;

        const values = [cliente_id];
        const { rows } = await pool.query(query, values);

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

async function criarTabelaCarrinho() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS carrinho (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(50) NOT NULL,
                descricao VARCHAR(400) NOT NULL,
                valor NUMERIC(10,2),
                imagem VARCHAR(4000)),
                cliente_id INT REFERENCES cliente(id)
        `;
        await pool.query(createTableQuery);
        console.log('Tabela carrinho criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela produto:', error);
        throw error;
    }
} 

module.exports = { salvarCarrinho, listarCarrinho };
