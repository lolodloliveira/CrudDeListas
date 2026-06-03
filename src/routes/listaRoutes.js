const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const listaController = require('../controllers/listaController');

// Todas as rotas de lista exigem usuário autenticado
router.use(auth);

router.get('/', listaController.listar);       // UC01
router.post('/', listaController.criar);       // UC01
router.put('/:id', listaController.atualizar); // UC01 / UC02
router.delete('/:id', listaController.excluir);// UC01

module.exports = router;
