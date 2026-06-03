const mongoose = require('mongoose');

const listaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    cor_hex: { type: String, default: '#FFFFFF' },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lista', listaSchema);
