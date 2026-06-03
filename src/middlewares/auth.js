const jwt = require('jsonwebtoken');
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.id; next();
  } catch (err) { return res.status(401).json({ erro: 'Token inválido ou expirado.' }); }
};
