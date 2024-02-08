const { pool } = require('../../database');

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
                imagem VARCHAR(4000)
        `;
        await pool.query(createTableQuery);
        console.log('Tabela produto criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela produto:', error);
        throw error;
    }
} 

module.exports = { listarProdutos };
