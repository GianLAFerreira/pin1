const { pool } = require('../../database');

const salvarCarrinho = async (req, res) => {
    try {
        // Extrair os dados do produto recebidos no corpo da requisição
        const { nome, descricao, valor, imagem } = req.body;

        // Consulta SQL para inserir os dados na tabela do carrinho
        const query = `
            INSERT INTO carrinho (nome, descricao, valor, imagem)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [nome, descricao, valor, imagem];
        await pool.query(query, values);

        res.status(201).send('Produto adicionado ao carrinho com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error);
        res.status(500).send('Erro interno do servidor');
    }
};



const listarCarrinho = async (req, res) => {
    try {
        const query = `
            SELECT * FROM carrinho;
        `;
        const { rows } = await pool.query(query);

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

module.exports = { salvarCarrinho, listarCarrinho };
