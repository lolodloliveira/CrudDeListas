const express = require('express');
const router = express.Router();
const etiq = require('../controllers/etiquetaController');
router.get('/', etiq.listar);
router.put('/:id', etiq.atualizar);
router.delete('/:id', etiq.excluir);
module.exports = router;
