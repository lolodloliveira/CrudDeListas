const store = require('../store');
const achar = (db, id) => db.listas.find((l) => l.id === id);
exports.criar = (req, res) => {
  const db = store.read(); const lista = achar(db, req.params.listaId);
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  const { descricao, etiqueta } = req.body;
  if (!descricao || !descricao.trim()) return res.status(400).json({ erro: 'A descrição da tarefa é obrigatória.' });
  const tarefa = { id: store.novoId('t'), descricao: descricao.trim(), etiqueta: (etiqueta||'').trim(), status: 'pendente', criadaEm: new Date().toISOString() };
  lista.tarefas.push(tarefa); store.write(db); res.status(201).json(tarefa);
};
exports.atualizar = (req, res) => {
  const db = store.read(); const lista = achar(db, req.params.listaId);
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  const tarefa = lista.tarefas.find((t) => t.id === req.params.tarefaId);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  const { descricao, etiqueta, status } = req.body;
  if (descricao !== undefined) tarefa.descricao = descricao.trim();
  if (etiqueta !== undefined) tarefa.etiqueta = etiqueta.trim();
  if (status !== undefined) tarefa.status = status;
  store.write(db); res.json(tarefa);
};
exports.alternarStatus = (req, res) => {
  const db = store.read(); const lista = achar(db, req.params.listaId);
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  const tarefa = lista.tarefas.find((t) => t.id === req.params.tarefaId);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  tarefa.status = tarefa.status === 'concluida' ? 'pendente' : 'concluida';
  store.write(db); res.json(tarefa);
};
exports.excluir = (req, res) => {
  const db = store.read(); const lista = achar(db, req.params.listaId);
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  const antes = lista.tarefas.length;
  lista.tarefas = lista.tarefas.filter((t) => t.id !== req.params.tarefaId);
  if (lista.tarefas.length === antes) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  store.write(db); res.status(204).end();
};
