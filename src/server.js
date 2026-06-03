const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  CRUD de Listas (protótipo) em http://localhost:${PORT}\n`);
});
