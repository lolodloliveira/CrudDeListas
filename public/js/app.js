// ===== Estado =====
let dados = [];               // listas (fonte de verdade em memória)
let listaAtivaId = null;
let tarefaAtivaId = null;
let ocultarConcluidas = false;
let termoBusca = '';

// ===== API =====
const H = { 'Content-Type': 'application/json' };
const api = {
  listar: () => fetch('/api/listas').then(r => r.json()),
  criarLista: (d) => fetch('/api/listas', { method:'POST', headers:H, body:JSON.stringify(d) }).then(r => r.json()),
  excluirLista: (id) => fetch(`/api/listas/${id}`, { method:'DELETE' }),
  criarTarefa: (lid, d) => fetch(`/api/listas/${lid}/tarefas`, { method:'POST', headers:H, body:JSON.stringify(d) }).then(r => r.json()),
  salvarTarefa: (lid, tid, d) => fetch(`/api/listas/${lid}/tarefas/${tid}`, { method:'PUT', headers:H, body:JSON.stringify(d) }).then(r => r.json()),
  toggleTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}/status`, { method:'PATCH' }).then(r => r.json()),
  excluirTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}`, { method:'DELETE' }),
  addItem: (lid, tid, d) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist`, { method:'POST', headers:H, body:JSON.stringify(d) }).then(r => r.json()),
  toggleItem: (lid, tid, iid) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist/${iid}`, { method:'PATCH' }).then(r => r.json()),
  removeItem: (lid, tid, iid) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist/${iid}`, { method:'DELETE' }),
};

// ===== Util =====
const $ = (id) => document.getElementById(id);
const esc = (t) => { const d = document.createElement('div'); d.textContent = t ?? ''; return d.innerHTML; };
const getLista = (id) => dados.find(l => l.id === id);
const listaDaTarefa = (tid) => dados.find(l => l.tarefas.some(t => t.id === tid));
const getTarefa = (tid) => { const l = listaDaTarefa(tid); return l && l.tarefas.find(t => t.id === tid); };

// ===== Carregar =====
async function carregar() {
  dados = await api.listar();
  if (!listaAtivaId && dados.length) listaAtivaId = dados[0].id;
  if (listaAtivaId && !getLista(listaAtivaId)) listaAtivaId = dados.length ? dados[0].id : null;
  if (tarefaAtivaId && !getTarefa(tarefaAtivaId)) fecharDetalhe();
  renderListas();
  renderTarefas();
}

// ===== Sidebar =====
function renderListas() {
  const ul = $('listas'); ul.innerHTML = '';
  dados.forEach(lista => {
    const pend = lista.tarefas.filter(t => t.status === 'pendente').length;
    const li = document.createElement('li');
    li.className = 'item-lista' + (lista.id === listaAtivaId && !termoBusca ? ' ativa' : '');
    li.innerHTML = `<span class="bolinha" style="background:${lista.cor_hex}"></span><span class="nome">${esc(lista.titulo)}</span><span class="contador">${pend}</span>`;
    li.onclick = () => { termoBusca = ''; $('busca').value = ''; listaAtivaId = lista.id; renderListas(); renderTarefas(); };
    ul.appendChild(li);
  });
}

// ===== Coluna central =====
function renderTarefas() {
  const ul = $('tarefas'); ul.innerHTML = '';
  const vazio = $('vazio');

  if (termoBusca) return renderBusca(ul, vazio);

  const lista = getLista(listaAtivaId);
  $('form-tarefa').hidden = !lista;
  $('acoes-lista').hidden = !lista;
  if (!lista) {
    $('titulo-lista').textContent = 'Selecione uma lista';
    $('ponto-cor').style.background = 'var(--borda)';
    vazio.hidden = dados.length > 0;
    vazio.textContent = 'Crie uma lista para começar.';
    return;
  }
  $('titulo-lista').textContent = lista.titulo;
  $('ponto-cor').style.background = lista.cor_hex;

  let tarefas = lista.tarefas;
  if (ocultarConcluidas) tarefas = tarefas.filter(t => t.status !== 'concluida');
  if (!tarefas.length) {
    vazio.hidden = false;
    vazio.textContent = ocultarConcluidas ? 'Nenhuma tarefa pendente. 🎉' : 'Nenhuma tarefa ainda. Adicione a primeira acima.';
    return;
  }
  vazio.hidden = true;
  tarefas.forEach(t => ul.appendChild(itemTarefa(t, false)));
}

function renderBusca(ul, vazio) {
  $('form-tarefa').hidden = true;
  $('acoes-lista').hidden = true;
  $('titulo-lista').textContent = `Busca: "${termoBusca}"`;
  $('ponto-cor').style.background = 'var(--borda)';
  const termo = termoBusca.toLowerCase();
  const achados = [];
  dados.forEach(l => l.tarefas.forEach(t => {
    const alvo = [t.descricao, t.etiqueta, t.anotacao, ...(t.checklist||[]).map(i => i.texto)].join(' ').toLowerCase();
    if (alvo.includes(termo)) achados.push({ tarefa: t, lista: l });
  }));
  if (!achados.length) { vazio.hidden = false; vazio.textContent = 'Nenhuma tarefa encontrada.'; return; }
  vazio.hidden = true;
  achados.forEach(({ tarefa, lista }) => ul.appendChild(itemTarefa(tarefa, true, lista)));
}

function itemTarefa(t, comOrigem, listaOrigem) {
  const li = document.createElement('li');
  li.className = 'item-tarefa' + (t.status === 'concluida' ? ' concluida' : '') + (t.id === tarefaAtivaId ? ' selecionada' : '');
  const total = (t.checklist || []).length;
  const feitos = (t.checklist || []).filter(i => i.concluido).length;
  const progresso = total ? `<span>☑ ${feitos}/${total}</span>` : '';
  const temNota = t.anotacao && t.anotacao.trim() ? '<span>📝</span>' : '';
  const origem = comOrigem && listaOrigem ? `<span class="lista-origem">em ${esc(listaOrigem.titulo)}</span>` : '';
  const etq = t.etiqueta ? `<span class="etiqueta">${esc(t.etiqueta)}</span>` : '';
  li.innerHTML = `
    <input type="checkbox" ${t.status === 'concluida' ? 'checked' : ''} />
    <div class="corpo">
      <span class="descricao">${esc(t.descricao)}</span>
      <div class="meta">${origem}${etq}${progresso}${temNota}</div>
    </div>`;
  li.querySelector('input').onclick = (e) => e.stopPropagation();
  li.querySelector('input').onchange = async () => {
    const lid = (listaOrigem || getLista(listaAtivaId)).id;
    const at = await api.toggleTarefa(lid, t.id);
    t.status = at.status;
    renderListas(); renderTarefas();
    if (t.id === tarefaAtivaId) $('det-status').checked = t.status === 'concluida';
  };
  li.querySelector('.corpo').onclick = () => abrirDetalhe(t.id);
  return li;
}

// ===== Painel de detalhe =====
function abrirDetalhe(tid) {
  tarefaAtivaId = tid;
  const t = getTarefa(tid);
  if (!t) return;
  $('det-titulo').value = t.descricao;
  $('det-etiqueta').value = t.etiqueta || '';
  $('det-status').checked = t.status === 'concluida';
  $('det-anotacao').value = t.anotacao || '';
  renderChecklist();
  $('detalhe').hidden = false;
  $('aviso-salvo').hidden = true;
  document.querySelector('.app').classList.add('com-detalhe');
  renderTarefas();
}
function fecharDetalhe() {
  tarefaAtivaId = null;
  $('detalhe').hidden = true;
  document.querySelector('.app').classList.remove('com-detalhe');
}
function renderChecklist() {
  const ul = $('det-checklist'); ul.innerHTML = '';
  const t = getTarefa(tarefaAtivaId);
  if (!t) return;
  (t.checklist || []).forEach(item => {
    const li = document.createElement('li');
    li.className = 'item-check' + (item.concluido ? ' feito' : '');
    li.innerHTML = `<input type="checkbox" ${item.concluido ? 'checked' : ''} /><span class="txt">${esc(item.texto)}</span><button class="btn-icone" title="Remover">✕</button>`;
    const lid = listaDaTarefa(t.id).id;
    li.querySelector('input').onchange = async () => { const r = await api.toggleItem(lid, t.id, item.id); item.concluido = r.concluido; renderChecklist(); renderTarefas(); };
    li.querySelector('button').onclick = async () => { await api.removeItem(lid, t.id, item.id); t.checklist = t.checklist.filter(i => i.id !== item.id); renderChecklist(); renderTarefas(); };
    ul.appendChild(li);
  });
}

// ===== Eventos =====
$('form-lista').onsubmit = async (e) => {
  e.preventDefault();
  const titulo = $('nova-lista').value.trim();
  if (!titulo) return;
  const nova = await api.criarLista({ titulo, cor_hex: $('nova-lista-cor').value });
  nova.tarefas = nova.tarefas || [];
  dados.push(nova);
  $('nova-lista').value = '';
  termoBusca = ''; $('busca').value = '';
  listaAtivaId = nova.id;
  renderListas(); renderTarefas();
};

$('form-tarefa').onsubmit = async (e) => {
  e.preventDefault();
  const descricao = $('nova-tarefa').value.trim();
  if (!descricao || !listaAtivaId) return;
  const t = await api.criarTarefa(listaAtivaId, { descricao, etiqueta: $('nova-tarefa-etiqueta').value });
  getLista(listaAtivaId).tarefas.push(t);
  $('nova-tarefa').value = ''; $('nova-tarefa-etiqueta').value = '';
  renderTarefas(); renderListas();
};

$('busca').oninput = (e) => { termoBusca = e.target.value.trim(); renderListas(); renderTarefas(); };

$('ocultar-concluidas').onchange = (e) => { ocultarConcluidas = e.target.checked; renderTarefas(); };

$('btn-excluir-lista').onclick = async () => {
  if (!listaAtivaId) return;
  const lista = getLista(listaAtivaId);
  if (!confirm(`Excluir a lista "${lista.titulo}" e todas as suas tarefas?`)) return;
  await api.excluirLista(listaAtivaId);
  dados = dados.filter(l => l.id !== listaAtivaId);
  if (tarefaAtivaId && !getTarefa(tarefaAtivaId)) fecharDetalhe();
  listaAtivaId = dados.length ? dados[0].id : null;
  renderListas(); renderTarefas();
};

$('btn-fechar').onclick = () => { fecharDetalhe(); renderTarefas(); };

$('form-item').onsubmit = async (e) => {
  e.preventDefault();
  const texto = $('novo-item').value.trim();
  const t = getTarefa(tarefaAtivaId);
  if (!texto || !t) return;
  const lid = listaDaTarefa(t.id).id;
  const item = await api.addItem(lid, t.id, { texto });
  (t.checklist = t.checklist || []).push(item);
  $('novo-item').value = '';
  renderChecklist(); renderTarefas();
};

$('btn-salvar').onclick = async () => {
  const t = getTarefa(tarefaAtivaId);
  if (!t) return;
  const lid = listaDaTarefa(t.id).id;
  const body = {
    descricao: $('det-titulo').value.trim() || t.descricao,
    etiqueta: $('det-etiqueta').value,
    status: $('det-status').checked ? 'concluida' : 'pendente',
    anotacao: $('det-anotacao').value,
  };
  const at = await api.salvarTarefa(lid, t.id, body);
  Object.assign(t, at);
  const aviso = $('aviso-salvo'); aviso.hidden = false;
  setTimeout(() => { aviso.hidden = true; }, 1800);
  renderTarefas(); renderListas();
};

$('btn-excluir-tarefa').onclick = async () => {
  const t = getTarefa(tarefaAtivaId);
  if (!t) return;
  if (!confirm(`Excluir a tarefa "${t.descricao}"?`)) return;
  const lid = listaDaTarefa(t.id).id;
  await api.excluirTarefa(lid, t.id);
  getLista(lid).tarefas = getLista(lid).tarefas.filter(x => x.id !== t.id);
  fecharDetalhe();
  renderTarefas(); renderListas();
};

// ===== Início =====
carregar();
