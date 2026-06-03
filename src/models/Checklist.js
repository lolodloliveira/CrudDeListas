const mongoose = require('mongoose');

// O checklist é tratado como subdocumento da Tarefa (ver Tarefa.js).
// Este schema fica exposto separadamente caso você prefira usá-lo como
// uma coleção própria no futuro.
const checklistItemSchema = new mongoose.Schema(
  {
    itemTexto: { type: String, required: true },
    concluido: { type: Boolean, default: false },
    tarefa: { type: mongoose.Schema.Types.ObjectId, ref: 'Tarefa' },
  },
  { timestamps: true }
);

module.exports = checklistItemSchema;
