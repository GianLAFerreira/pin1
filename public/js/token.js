const jwt = require('jsonwebtoken');

const segredo = 'seu_segredo_super_secreto'; // Chave secreta para assinar o token

function gerarToken(clienteId) {
    const payload = {
        id: clienteId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Token expira em 24 horas
    };
    return jwt.sign(payload, segredo);
}

const verificarToken = (req, res, next) => {
    // Verificar se o token está presente nos cabeçalhos da solicitação
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // Extrair o token do header
    const token = header.split(' ')[1];

    // Verificar se o token é válido
    jwt.verify(token, segredo, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        // Se o token for válido, passar para o próximo middleware
        req.usuario = decoded.usuario; // Decodificar o token e armazenar o usuário na solicitação
        next();
    });
};

module.exports = { gerarToken, verificarToken };
