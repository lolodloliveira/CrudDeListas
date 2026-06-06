const store = require('../store');
const acessivel = (l, uid) => l.usuarioId === uid || (l.colaboradores || []).includes(uid);
function enriquecer(l, db, uid) {
  const dono = db.usuarios.find(u => u.id === l.usuarioId);
  const membros = (l.colaboradores || []).map(id => {
    const u = db.usuarios.find(x => x.id === id);
    return u ? { id: u.id, nome: u.nome, email: u.email } : null;
  }).filter(Boolean);
  return Object.assign({}, l, { ehDono: l.usuarioId === uid, dono: dono ? dono.nome : '?', membros });
}

exports.listar = (req, res) => {
  const db = store.read();
  res.json(db.listas.filter(l => acessivel(l, req.userId)).map(l => enriquecer(l, db, req.userId)));
};

exports.criar = (req, res) => {
  const { titulo, cor_hex } = req.body;
  if (!titulo || !titulo.trim()) return res.status(400).json({ erro: 'O título da lista é obrigatório.' });
  const db = store.read();
  const lista = { id: store.novoId('l'), usuarioId: req.userId, colaboradores: [], titulo: titulo.trim(), cor_hex: cor_hex || '#4F86C6', criadaEm: new Date().toISOString(), tarefas: [] };
  db.listas.push(lista); store.write(db); res.status(201).json(enriquecer(lista, db, req.userId));
};

exports.atualizar = (req, res) => {
  const db = store.read();
  const lista = db.listas.find(l => l.id === req.params.id && acessivel(l, req.userId));
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  const { titulo, cor_hex } = req.body;
  if (titulo !== undefined) lista.titulo = titulo.trim();
  if (cor_hex !== undefined) lista.cor_hex = cor_hex;
  store.write(db); res.json(enriquecer(lista, db, req.userId));
};

exports.excluir = (req, res) => {
  const db = store.read();
  const lista = db.listas.find(l => l.id === req.params.id && acessivel(l, req.userId));
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  if (lista.usuarioId === req.userId) {
    db.listas = db.listas.filter(l => l.id !== lista.id);           // dono exclui para todos
  } else {
    lista.colaboradores = (lista.colaboradores || []).filter(id => id !== req.userId); // membro sai
  }
  store.write(db); res.status(204).end();
};

exports.reordenar = (req, res) => {
  const ordem = req.body.ordem || [];
  const db = store.read();
  const pos = (id) => { const i = ordem.indexOf(id); return i === -1 ? Infinity : i; };
  db.listas.sort((a, b) => pos(a.id) - pos(b.id));
  store.write(db); res.json(db.listas.filter(l => acessivel(l, req.userId)).map(l => enriquecer(l, db, req.userId)));
};

// Compartilhar (só o dono)
exports.compartilhar = (req, res) => {
  const db = store.read();
  const lista = db.listas.find(l => l.id === req.params.id);
  if (!lista || lista.usuarioId !== req.userId) return res.status(404).json({ erro: 'Lista não encontrada.' });
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ erro: 'Informe o e-mail.' });
  const u = db.usuarios.find(x => x.email.toLowerCase() === email);
  if (!u) return res.status(404).json({ erro: 'Não há usuário com esse e-mail.' });
  if (u.id === lista.usuarioId) return res.status(400).json({ erro: 'Essa lista já é sua.' });
  lista.colaboradores = lista.colaboradores || [];
  if (lista.colaboradores.includes(u.id)) return res.status(409).json({ erro: 'Esse usuário já tem acesso.' });
  lista.colaboradores.push(u.id); store.write(db);
  res.status(201).json(enriquecer(lista, db, req.userId));
};

// Remover colaborador (só o dono)
exports.removerColaborador = (req, res) => {
  const db = store.read();
  const lista = db.listas.find(l => l.id === req.params.id);
  if (!lista || lista.usuarioId !== req.userId) return res.status(404).json({ erro: 'Lista não encontrada.' });
  lista.colaboradores = (lista.colaboradores || []).filter(id => id !== req.params.userId);
  store.write(db); res.json(enriquecer(lista, db, req.userId));
};
