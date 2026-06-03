const mongoose = require('mongoose');

const etiquetaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cor: { type: String, default: '#CCCCCC' },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Etiqueta', etiquetaSchema);
