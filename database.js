const { Pool } = require('pg');

// Configuração da conexão com o banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pin1',
    password: 'postgres',
    port: 5432, // Porta padrão do PostgreSQL
});

const connectToDatabase = async () => {
    try {
        await pool.connect();
        console.log('Conectado ao banco de dados PostgreSQL');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
};

module.exports = { pool, connectToDatabase };
