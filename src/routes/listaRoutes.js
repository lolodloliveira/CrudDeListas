const express = require('express');
const router = express.Router();
const lista = require('../controllers/listaController');
const tarefa = require('../controllers/tarefaController');

// Listas (UC01 / UC02)
router.get('/', lista.listar);
router.post('/', lista.criar);
router.put('/:id', lista.atualizar);
router.delete('/:id', lista.excluir);

// Tarefas (UC01 / UC03 / UC05)
router.post('/:listaId/tarefas', tarefa.criar);
router.put('/:listaId/tarefas/:tarefaId', tarefa.atualizar);
router.patch('/:listaId/tarefas/:tarefaId/status', tarefa.alternarStatus);
router.delete('/:listaId/tarefas/:tarefaId', tarefa.excluir);

// Checklist dentro da tarefa (UC06)
router.post('/:listaId/tarefas/:tarefaId/checklist', tarefa.addChecklist);
router.patch('/:listaId/tarefas/:tarefaId/checklist/:itemId', tarefa.toggleChecklist);
router.delete('/:listaId/tarefas/:tarefaId/checklist/:itemId', tarefa.removeChecklist);

module.exports = router;
