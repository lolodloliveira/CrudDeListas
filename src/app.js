const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', require('./routes/authRoutes'));

// Identifica o usuário a partir do header (sessão salva no navegador)
function exigirUsuario(req, res, next) {
  req.userId = req.headers['x-usuario-id'] || null;
  if (!req.userId) return res.status(401).json({ erro: 'Não autenticado.' });
  next();
}
app.use('/api/listas', exigirUsuario, require('./routes/listaRoutes'));
app.use('/api/etiquetas', exigirUsuario, require('./routes/etiquetaRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
module.exports = app;
