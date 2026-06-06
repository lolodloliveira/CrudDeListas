const store = require('../store');
const publico = (u) => ({ id: u.id, nome: u.nome, email: u.email });

exports.cadastro = (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
  if (String(senha).length < 4) return res.status(400).json({ erro: 'A senha deve ter pelo menos 4 caracteres.' });
  const db = store.read();
  if (db.usuarios.some(u => u.email.toLowerCase() === String(email).toLowerCase()))
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
  const usuario = { id: store.novoId('u'), nome: nome.trim(), email: String(email).trim().toLowerCase(), senha: store.hash(senha), criadoEm: new Date().toISOString() };
  db.usuarios.push(usuario); store.write(db);
  res.status(201).json(publico(usuario));
};

exports.login = (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha.' });
  const db = store.read();
  const usuario = db.usuarios.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!usuario || usuario.senha !== store.hash(senha))
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  res.json(publico(usuario));
};
