const express = require('express');
const router = express.Router();
const lista = require('../controllers/listaController');
const tarefa = require('../controllers/tarefaController');

// Reordenar listas (antes de /:id)
router.patch('/reordenar', lista.reordenar);

// Listas (UC01 / UC02)
router.get('/', lista.listar);
router.post('/', lista.criar);
router.put('/:id', lista.atualizar);
router.delete('/:id', lista.excluir);

// Reordenar tarefas (antes das rotas com :tarefaId)
router.patch('/:listaId/tarefas/reordenar', tarefa.reordenar);

// Tarefas (UC01 / UC03 / UC05)
router.post('/:listaId/tarefas', tarefa.criar);
router.put('/:listaId/tarefas/:tarefaId', tarefa.atualizar);
router.patch('/:listaId/tarefas/:tarefaId/status', tarefa.alternarStatus);
router.patch('/:listaId/tarefas/:tarefaId/fixar', tarefa.fixar);
router.delete('/:listaId/tarefas/:tarefaId', tarefa.excluir);

// Checklist (UC06)
router.post('/:listaId/tarefas/:tarefaId/checklist', tarefa.addChecklist);
router.patch('/:listaId/tarefas/:tarefaId/checklist/:itemId', tarefa.toggleChecklist);
router.delete('/:listaId/tarefas/:tarefaId/checklist/:itemId', tarefa.removeChecklist);

module.exports = router;
