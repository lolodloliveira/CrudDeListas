const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const agora = () => new Date().toISOString();
const dia = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const hash = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

const SEED = {
  usuarios: [
    { id:'u1', nome:'Estudante Demo', email:'demo@demo.com', senha: hash('demo123'), criadoEm: agora() }
  ],
  listas: [
    { id:'l1', usuarioId:'u1', titulo:'Faculdade', cor_hex:'#4F86C6', criadaEm:agora(), tarefas:[
      { id:'t1', descricao:'Entregar protótipo de Arquitetura', etiqueta:'Urgente', status:'pendente', prazo:dia(-2), fixada:true,
        anotacao:'<h2>Lembretes</h2><p>Subir no GitHub e testar no PC da faculdade antes de apresentar.</p>', checklist:[
        { id:'c1', texto:'Subir código no GitHub', concluido:true },
        { id:'c2', texto:'Testar npm install', concluido:false },
        { id:'c3', texto:'Preparar fala da demo', concluido:false } ], criadaEm:agora() },
      { id:'t2', descricao:'Revisar diagrama de classes', etiqueta:'Estudo', status:'pendente', prazo:dia(0), fixada:false, anotacao:'', checklist:[], criadaEm:agora() },
      { id:'t4', descricao:'Estudar para a prova', etiqueta:'Estudo', status:'concluida', prazo:null, fixada:false, anotacao:'', checklist:[], criadaEm:agora() } ] },
    { id:'l2', usuarioId:'u1', titulo:'Pessoal', cor_hex:'#6FB07F', criadaEm:agora(), tarefas:[
      { id:'t3', descricao:'Comprar mantimentos', etiqueta:'Casa', status:'pendente', prazo:dia(3), fixada:false, anotacao:'', checklist:[
        { id:'c4', texto:'Arroz', concluido:false },
        { id:'c5', texto:'Café', concluido:false } ], criadaEm:agora() } ] } ]
};
function ensureFile(){ if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true}); if(!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE,JSON.stringify(SEED,null,2)); }
function read(){ ensureFile(); const db = JSON.parse(fs.readFileSync(DB_FILE,'utf-8')); if(!db.usuarios) db.usuarios=[]; if(!db.listas) db.listas=[]; return db; }
function write(db){ ensureFile(); fs.writeFileSync(DB_FILE,JSON.stringify(db,null,2)); }
function novoId(p){ return p + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
module.exports = { read, write, novoId, hash };
