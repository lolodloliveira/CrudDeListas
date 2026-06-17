const store = require('../store');
const PALETA = ['#E2574C', '#4F86C6', '#6FB07F', '#E8A23D', '#9B72CF', '#3FB6C9', '#E26FA0', '#5C6B7A'];

// Garante que a etiqueta exista para o usuário (cria com cor da paleta se for nova)
function ensure(db, userId, nome) {
  nome = (nome || '').trim();
  if (!nome) return null;
  let e = db.etiquetas.find(x => x.usuarioId === userId && x.nome.toLowerCase() === nome.toLowerCase());
  if (!e) {
    const cor = PALETA[db.etiquetas.filter(x => x.usuarioId === userId).length % PALETA.length];
    e = { id: store.novoId('e'), usuarioId: userId, nome, cor };
    db.etiquetas.push(e);
  }
  return e;
}
exports.ensure = ensure;

exports.listar = (req, res) => res.json(store.read().etiquetas.filter(e => e.usuarioId === req.userId));

exports.atualizar = (req, res) => {
  const db = store.read();
  const e = db.etiquetas.find(x => x.id === req.params.id && x.usuarioId === req.userId);
  if (!e) return res.status(404).json({ erro: 'Etiqueta não encontrada.' });
  const { nome, cor } = req.body;
  const antigo = e.nome;
  if (nome !== undefined && nome.trim()) e.nome = nome.trim();
  if (cor !== undefined) e.cor = cor;
  // se renomeou, atualiza nas tarefas do usuário
  if (e.nome.toLowerCase() !== antigo.toLowerCase()) {
    db.listas.filter(l => l.usuarioId === req.userId).forEach(l =>
      l.tarefas.forEach(t => { if ((t.etiqueta || '').toLowerCase() === antigo.toLowerCase()) t.etiqueta = e.nome; }));
  }
  store.write(db); res.json(e);
};

exports.excluir = (req, res) => {
  const db = store.read();
  const e = db.etiquetas.find(x => x.id === req.params.id && x.usuarioId === req.userId);
  if (!e) return res.status(404).json({ erro: 'Etiqueta não encontrada.' });
  db.etiquetas = db.etiquetas.filter(x => x.id !== e.id);
  // remove a etiqueta das tarefas do usuário
  db.listas.filter(l => l.usuarioId === req.userId).forEach(l =>
    l.tarefas.forEach(t => { if ((t.etiqueta || '').toLowerCase() === e.nome.toLowerCase()) t.etiqueta = ''; }));
  store.write(db); res.status(204).end();
};
