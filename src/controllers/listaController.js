const store = require('../store');
exports.listar = (req, res) => res.json(store.read().listas);
exports.criar = (req, res) => {
  const { titulo, cor_hex } = req.body;
  if (!titulo || !titulo.trim()) return res.status(400).json({ erro: 'O título da lista é obrigatório.' });
  const db = store.read();
  const lista = { id: store.novoId('l'), titulo: titulo.trim(), cor_hex: cor_hex || '#4F86C6', criadaEm: new Date().toISOString(), tarefas: [] };
  db.listas.push(lista); store.write(db); res.status(201).json(lista);
};
exports.atualizar = (req, res) => {
  const db = store.read();
  const lista = db.listas.find((l) => l.id === req.params.id);
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  const { titulo, cor_hex } = req.body;
  if (titulo !== undefined) lista.titulo = titulo.trim();
  if (cor_hex !== undefined) lista.cor_hex = cor_hex;
  store.write(db); res.json(lista);
};
exports.excluir = (req, res) => {
  const db = store.read();
  const antes = db.listas.length;
  db.listas = db.listas.filter((l) => l.id !== req.params.id);
  if (db.listas.length === antes) return res.status(404).json({ erro: 'Lista não encontrada.' });
  store.write(db); res.status(204).end();
};
// Reordenar listas (drag-and-drop)
exports.reordenar = (req, res) => {
  const ordem = req.body.ordem || [];
  const db = store.read();
  const pos = (id) => { const i = ordem.indexOf(id); return i === -1 ? Infinity : i; };
  db.listas.sort((a, b) => pos(a.id) - pos(b.id));
  store.write(db); res.json(db.listas);
};
