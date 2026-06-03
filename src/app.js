const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Arquivos estáticos do frontend (pasta public)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas da API
// app.use('/api/listas', require('./routes/listaRoutes'));
// app.use('/api/tarefas', require('./routes/tarefaRoutes'));

// Healthcheck
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
