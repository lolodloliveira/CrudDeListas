const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED = { listas: [
  { id:'l1', titulo:'Faculdade', cor_hex:'#4F86C6', criadaEm:new Date().toISOString(), tarefas:[
    { id:'t1', descricao:'Entregar protótipo de Arquitetura', etiqueta:'Urgente', status:'pendente', criadaEm:new Date().toISOString() },
    { id:'t2', descricao:'Revisar diagrama de classes', etiqueta:'Estudo', status:'concluida', criadaEm:new Date().toISOString() } ] },
  { id:'l2', titulo:'Pessoal', cor_hex:'#6FB07F', criadaEm:new Date().toISOString(), tarefas:[
    { id:'t3', descricao:'Comprar mantimentos', etiqueta:'Casa', status:'pendente', criadaEm:new Date().toISOString() } ] } ] };
function ensureFile(){ if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true}); if(!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE,JSON.stringify(SEED,null,2)); }
function read(){ ensureFile(); return JSON.parse(fs.readFileSync(DB_FILE,'utf-8')); }
function write(db){ ensureFile(); fs.writeFileSync(DB_FILE,JSON.stringify(db,null,2)); }
function novoId(p){ return p + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
module.exports = { read, write, novoId };
