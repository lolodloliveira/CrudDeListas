const store = require('../store');
const acharLista = (db, id) => db.listas.find((l) => l.id === id);
function ctx(req, res) {
  const db = store.read();
  const lista = acharLista(db, req.params.listaId);
  if (!lista) { res.status(404).json({ erro: 'Lista não encontrada.' }); return null; }
  if (req.params.tarefaId) {
    const tarefa = lista.tarefas.find((t) => t.id === req.params.tarefaId);
    if (!tarefa) { res.status(404).json({ erro: 'Tarefa não encontrada.' }); return null; }
    return { db, lista, tarefa };
  }
  return { db, lista };
}

exports.criar = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  const { descricao, etiqueta, prazo } = req.body;
  if (!descricao || !descricao.trim()) return res.status(400).json({ erro: 'A descrição da tarefa é obrigatória.' });
  const tarefa = { id: store.novoId('t'), descricao: descricao.trim(), etiqueta: (etiqueta||'').trim(), status: 'pendente', prazo: prazo || null, fixada: false, anotacao: '', checklist: [], criadaEm: new Date().toISOString() };
  c.lista.tarefas.push(tarefa); store.write(c.db); res.status(201).json(tarefa);
};
exports.atualizar = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  const { descricao, etiqueta, status, anotacao, prazo, fixada } = req.body;
  if (descricao !== undefined) c.tarefa.descricao = descricao.trim();
  if (etiqueta !== undefined) c.tarefa.etiqueta = etiqueta.trim();
  if (status !== undefined) c.tarefa.status = status;
  if (anotacao !== undefined) c.tarefa.anotacao = anotacao;
  if (prazo !== undefined) c.tarefa.prazo = prazo || null;
  if (fixada !== undefined) c.tarefa.fixada = !!fixada;
  store.write(c.db); res.json(c.tarefa);
};
exports.alternarStatus = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  c.tarefa.status = c.tarefa.status === 'concluida' ? 'pendente' : 'concluida';
  store.write(c.db); res.json(c.tarefa);
};
exports.fixar = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  c.tarefa.fixada = !c.tarefa.fixada;
  store.write(c.db); res.json(c.tarefa);
};
exports.excluir = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  c.lista.tarefas = c.lista.tarefas.filter((t) => t.id !== req.params.tarefaId);
  store.write(c.db); res.status(204).end();
};
// Reordenar tarefas dentro da lista (drag-and-drop)
exports.reordenar = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  const ordem = req.body.ordem || [];
  const pos = (id) => { const i = ordem.indexOf(id); return i === -1 ? Infinity : i; };
  c.lista.tarefas.sort((a, b) => pos(a.id) - pos(b.id));
  store.write(c.db); res.json(c.lista.tarefas);
};

// --- Checklist (UC06) ---
exports.addChecklist = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  const { texto } = req.body;
  if (!texto || !texto.trim()) return res.status(400).json({ erro: 'O texto do item é obrigatório.' });
  const item = { id: store.novoId('c'), texto: texto.trim(), concluido: false };
  if (!c.tarefa.checklist) c.tarefa.checklist = [];
  c.tarefa.checklist.push(item); store.write(c.db); res.status(201).json(item);
};
exports.toggleChecklist = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  const item = (c.tarefa.checklist || []).find((i) => i.id === req.params.itemId);
  if (!item) return res.status(404).json({ erro: 'Item não encontrado.' });
  item.concluido = !item.concluido; store.write(c.db); res.json(item);
};
exports.removeChecklist = (req, res) => {
  const c = ctx(req, res); if (!c) return;
  c.tarefa.checklist = (c.tarefa.checklist || []).filter((i) => i.id !== req.params.itemId);
  store.write(c.db); res.status(204).end();
};
