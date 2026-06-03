const express = require('express');
const path = require('path');
const cors = require('cors'); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/listas', require('./routes/listaRoutes'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;