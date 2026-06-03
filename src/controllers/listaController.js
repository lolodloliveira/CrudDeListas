const Lista = require('../models/Lista');

// UC01 – Manter Listas (CRUD)
// Exemplo de esqueleto. Ajuste a regra de negócio conforme necessário.

exports.listar = async (req, res) => {
  const listas = await Lista.find({ usuario: req.usuarioId });
  res.json(listas);
};

exports.criar = async (req, res) => {
  const { titulo, cor_hex } = req.body;
  const lista = await Lista.create({ titulo, cor_hex, usuario: req.usuarioId });
  res.status(201).json(lista);
};

exports.atualizar = async (req, res) => {
  const lista = await Lista.findOneAndUpdate(
    { _id: req.params.id, usuario: req.usuarioId },
    req.body,
    { new: true }
  );
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  res.json(lista);
};

exports.excluir = async (req, res) => {
  const lista = await Lista.findOneAndDelete({ _id: req.params.id, usuario: req.usuarioId });
  if (!lista) return res.status(404).json({ erro: 'Lista não encontrada.' });
  res.status(204).end();
};
