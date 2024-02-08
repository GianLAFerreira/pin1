const { pool } = require('../../database');

const realizarPagamento = async (req, res) => {
    try {
        const { cliente_id } = req.body;
        
        const query = `
        DELETE FROM carrinho WHERE cliente_id = $1;
    `;
        const values = [cliente_id];

        await pool.query(query, values);
        
        res.status(201).json({ message: 'Pagamento realizado com sucesso!' });
    } catch (error) {
        console.log(error)
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).send('Erro interno do servidor');
    }
}


module.exports = { realizarPagamento };
