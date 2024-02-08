const { pool } = require('../../database');

const isFornecedor = async (req, res) => {
    try {
        const { cliente_id } = req.body; 
        
        const query = `
            SELECT isfornecedor FROM cliente WHERE id = $1;
        `;

        const values = [cliente_id];
        const { rows } = await pool.query(query, values);
        await pool.query(query, values);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao verificar se é fornecedor:', error);
        res.status(500).send('Erro interno do servidor');
    }
};



const listarProdutos = async (req, res) => {
    try {
        const checkTableQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_name = 'produto'
        )
    `;

        const tableCheckResult = await pool.query(checkTableQuery);
        const tableExists = tableCheckResult.rows[0].exists;

        if (!tableExists) {
            await criarTabelaProduto();
        }

        const query = `
            SELECT * FROM produto;
        `;
        const { rows } = await pool.query(query);

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

async function criarTabelaProduto() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS produto (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(50) NOT NULL,
                descricao VARCHAR(400) NOT NULL,
                valor NUMERIC(10,2),
                imagem VARCHAR(4000));
        `;
        await pool.query(createTableQuery);
        console.log('Tabela produto criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela produto:', error);
        throw error;
    }
}


const cadastrarProduto = async (req, res) => {

    const { nome } = req.body;
    const { descricao } = req.body;
    const { valor } = req.body;
    const { url } = req.body;

    try {

        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables 
                WHERE table_name = 'produto'
            )
        `;
        const tableCheckResult = await pool.query(checkTableQuery);
        const tableExists = tableCheckResult.rows[0].exists;

        if (!tableExists) {
            await criarTabelaProduto();
        }

        console.log(nome)

        const query = `
            INSERT INTO produto (nome, descricao, valor, imagem)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [nome, descricao, valor, url];

        await pool.query(query, values);
        console.log('Produto criado com sucesso!');

        res.status(201).json({ message: 'Produto criado com sucesso.' });
    } catch (error) {
        console.log(error)
        console.error('Erro ao cadastrar Produto:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

module.exports = { listarProdutos, cadastrarProduto, isFornecedor };
