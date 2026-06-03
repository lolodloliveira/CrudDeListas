const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    senha: { type: String, required: true }, // armazenar sempre o hash, nunca texto puro
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
