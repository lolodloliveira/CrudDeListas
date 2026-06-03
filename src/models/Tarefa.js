const mongoose = require('mongoose');
const checklistItemSchema = new mongoose.Schema({
  itemTexto: { type: String, required: true },
  concluido: { type: Boolean, default: false },
}, { _id: true });
const tarefaSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  dataPrazo: { type: Date },
  status: { type: String, enum: ['pendente', 'concluida'], default: 'pendente' },
  anotacao: { type: String, default: '' },
  lista: { type: mongoose.Schema.Types.ObjectId, ref: 'Lista', required: true },
  etiquetas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Etiqueta' }],
  checklist: [checklistItemSchema],
}, { timestamps: true });
module.exports = mongoose.model('Tarefa', tarefaSchema);
