const { pool } = require('../../database');

const salvarCartao = async (req, res) => {
    const { cliente_id } = req.body;
    const { numero } = req.body;
    const { titular } = req.body;
    const { validade } = req.body;
    const { cvv } = req.body;
    try {

        const checkTableQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_name = 'cartao'
            )
    `;

        const tableCheckResult = await pool.query(checkTableQuery);
        const tableExists = tableCheckResult.rows[0].exists;

        if (!tableExists) {
            await criarTabelaDadosCartao();
        }

        const query = `
        INSERT INTO cartao (numero, titular, validade, cvv, cliente_id)
        VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [numero, titular, validade, cvv, cliente_id];

        await pool.query(query, values);

        res.status(201).json({ message: 'Cartão adicionado com sucesso.' });

    } catch (error) {
        console.error('Erro ao adicionar cartão:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

const obterCartoes = async (req, res) => {
    const { cliente_id } = req.body;
    console.log(cliente_id)
    try {
        const query = `
            SELECT * FROM cartao where cliente_id = $1;
        `;

        const values = [cliente_id];
        const { rows } = await pool.query(query, values);

        res.json(rows);
    } catch (error) {
        console.error('Erro ao obter cartão:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

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

        const { cliente_id } = req.body;

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
                imagem VARCHAR(4000),
                cliente_id INT REFERENCES cliente(id));
        `;
        await pool.query(createTableQuery);
        console.log('Tabela carrinho criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela carrinho:', error);
        throw error;
    }
}

async function criarTabelaDadosCartao() {
    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cartao (
            id SERIAL PRIMARY KEY,
            numero VARCHAR(19) NOT NULL,
            titular VARCHAR(100) NOT NULL,
            validade VARCHAR(5) NOT NULL,
            cvv VARCHAR(4) NOT NULL,
            cliente_id INT NOT NULL,
            FOREIGN KEY (cliente_id) REFERENCES cliente(id)
        ); `;
        await pool.query(createTableQuery);
        console.log('Tabela cartao criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela cartao:', error);
        throw error;
    }
}

module.exports = { salvarCarrinho, listarCarrinho, salvarCartao, obterCartoes };
