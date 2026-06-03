const mongoose = require('mongoose');
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI não definida. Configure o .env (veja .env.example).');
  await mongoose.connect(uri);
  console.log('Conectado ao MongoDB.');
}
module.exports = connectDB;
