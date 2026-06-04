// ===== Estado =====
let dados = [];
let listaAtivaId = null, tarefaAtivaId = null;
let ocultarConcluidas = false, termoBusca = '';
let ordenarPor = 'manual', filtroEtiqueta = '';

// ===== API =====
const H = { 'Content-Type': 'application/json' };
const j = (r) => r.json();
const api = {
  listar: () => fetch('/api/listas').then(j),
  criarLista: (d) => fetch('/api/listas', { method:'POST', headers:H, body:JSON.stringify(d) }).then(j),
  excluirLista: (id) => fetch(`/api/listas/${id}`, { method:'DELETE' }),
  reordenarListas: (ordem) => fetch('/api/listas/reordenar', { method:'PATCH', headers:H, body:JSON.stringify({ ordem }) }),
  criarTarefa: (lid, d) => fetch(`/api/listas/${lid}/tarefas`, { method:'POST', headers:H, body:JSON.stringify(d) }).then(j),
  salvarTarefa: (lid, tid, d) => fetch(`/api/listas/${lid}/tarefas/${tid}`, { method:'PUT', headers:H, body:JSON.stringify(d) }).then(j),
  toggleTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}/status`, { method:'PATCH' }).then(j),
  fixarTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}/fixar`, { method:'PATCH' }).then(j),
  excluirTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}`, { method:'DELETE' }),
  reordenarTarefas: (lid, ordem) => fetch(`/api/listas/${lid}/tarefas/reordenar`, { method:'PATCH', headers:H, body:JSON.stringify({ ordem }) }),
  addItem: (lid, tid, d) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist`, { method:'POST', headers:H, body:JSON.stringify(d) }).then(j),
  toggleItem: (lid, tid, iid) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist/${iid}`, { method:'PATCH' }).then(j),
  removeItem: (lid, tid, iid) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist/${iid}`, { method:'DELETE' }),
};

// ===== Util =====
const $ = (id) => document.getElementById(id);
const esc = (t) => { const d = document.createElement('div'); d.textContent = t ?? ''; return d.innerHTML; };
const getLista = (id) => dados.find(l => l.id === id);
const listaDaTarefa = (tid) => dados.find(l => l.tarefas.some(t => t.id === tid));
const getTarefa = (tid) => { const l = listaDaTarefa(tid); return l && l.tarefas.find(t => t.id === tid); };
const hojeISO = () => new Date().toISOString().slice(0, 10);

function toast(msg, tipo = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + tipo;
  el.textContent = msg;
  $('toasts').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 2200);
}

function formatarPrazo(prazo, status) {
  if (!prazo) return null;
  const hoje = hojeISO();
  const [a, m, d] = prazo.split('-');
  const txt = `${d}/${m}`;
  if (status !== 'concluida' && prazo < hoje) return { texto: `Atrasada · ${txt}`, classe: 'atrasada' };
  if (prazo === hoje) return { texto: 'Hoje', classe: 'hoje' };
  return { texto: txt, classe: '' };
}

// ===== Tema =====
function aplicarTema(t) {
  document.documentElement.setAttribute('data-theme', t);
  $('btn-tema').textContent = t === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('tema', t); } catch (e) {}
}
$('btn-tema').onclick = () => {
  const atual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  aplicarTema(atual);
};

// ===== Carregar =====
async function carregar() {
  dados = await api.listar();
  if (!listaAtivaId && dados.length) listaAtivaId = dados[0].id;
  if (listaAtivaId && !getLista(listaAtivaId)) listaAtivaId = dados.length ? dados[0].id : null;
  if (tarefaAtivaId && !getTarefa(tarefaAtivaId)) fecharDetalhe();
  renderListas(); renderTarefas();
}

// ===== Sidebar (listas) =====
function renderListas() {
  const ul = $('listas'); ul.innerHTML = '';
  dados.forEach(lista => {
    const pend = lista.tarefas.filter(t => t.status === 'pendente').length;
    const li = document.createElement('li');
    li.className = 'item-lista' + (lista.id === listaAtivaId && !termoBusca ? ' ativa' : '');
    li.dataset.id = lista.id;
    li.draggable = true;
    li.innerHTML = `<span class="bolinha" style="background:${lista.cor_hex}"></span><span class="nome">${esc(lista.titulo)}</span><span class="contador">${pend}</span>`;
    li.onclick = () => { termoBusca = ''; $('busca').value = ''; listaAtivaId = lista.id; renderListas(); renderTarefas(); };
    li.addEventListener('dragstart', () => li.classList.add('arrastando'));
    li.addEventListener('dragend', async () => {
      li.classList.remove('arrastando');
      const ordem = [...ul.querySelectorAll('.item-lista')].map(x => x.dataset.id);
      dados.sort((a, b) => ordem.indexOf(a.id) - ordem.indexOf(b.id));
      await api.reordenarListas(ordem);
    });
    ul.appendChild(li);
  });
}

// ===== Conteúdo (tarefas) =====
function renderTarefas() {
  const ul = $('tarefas'); ul.innerHTML = '';
  const vazio = $('vazio');

  if (termoBusca) { mostrarFerramentas(false); return renderBusca(ul, vazio); }

  const lista = getLista(listaAtivaId);
  $('form-tarefa').hidden = !lista;
  $('btn-excluir-lista').hidden = !lista;
  mostrarFerramentas(!!lista);
  if (!lista) {
    $('titulo-lista').textContent = 'Selecione uma lista';
    $('ponto-cor').style.background = 'var(--border)';
    vazio.hidden = dados.length > 0;
    vazio.textContent = 'Crie uma lista para começar.';
    return;
  }
  $('titulo-lista').textContent = lista.titulo;
  $('ponto-cor').style.background = lista.cor_hex;
  atualizarFiltroEtiquetas(lista);
  atualizarProgresso(lista);

  // filtros
  let tarefas = lista.tarefas.slice();
  if (ocultarConcluidas) tarefas = tarefas.filter(t => t.status !== 'concluida');
  if (filtroEtiqueta) tarefas = tarefas.filter(t => (t.etiqueta || '') === filtroEtiqueta);

  // ordenação: fixadas primeiro, depois o critério
  const criterio = {
    manual: () => 0,
    nome: (a, b) => a.descricao.localeCompare(b.descricao),
    status: (a, b) => (a.status === 'concluida') - (b.status === 'concluida'),
    prazo: (a, b) => (a.prazo || '9999').localeCompare(b.prazo || '9999'),
  }[ordenarPor];
  if (ordenarPor === 'manual') {
    tarefas.sort((a, b) => (b.fixada === true) - (a.fixada === true));
  } else {
    tarefas.sort((a, b) => ((b.fixada === true) - (a.fixada === true)) || criterio(a, b));
  }

  const arrastavel = ordenarPor === 'manual' && !filtroEtiqueta && !ocultarConcluidas;

  if (!tarefas.length) {
    vazio.hidden = false;
    vazio.textContent = ocultarConcluidas ? 'Nenhuma tarefa pendente. 🎉' : 'Nenhuma tarefa aqui ainda.';
    return;
  }
  vazio.hidden = true;
  tarefas.forEach(t => ul.appendChild(itemTarefa(t, false, null, arrastavel)));
}

function mostrarFerramentas(v) { $('barra-ferramentas').hidden = !v; $('progresso').hidden = !v; }

function renderBusca(ul, vazio) {
  $('form-tarefa').hidden = true;
  $('btn-excluir-lista').hidden = true;
  $('titulo-lista').textContent = `Busca: "${termoBusca}"`;
  $('ponto-cor').style.background = 'var(--border)';
  const termo = termoBusca.toLowerCase();
  const achados = [];
  dados.forEach(l => l.tarefas.forEach(t => {
    const alvo = [t.descricao, t.etiqueta, t.anotacao, ...(t.checklist || []).map(i => i.texto)].join(' ').toLowerCase();
    if (alvo.includes(termo)) achados.push({ tarefa: t, lista: l });
  }));
  if (!achados.length) { vazio.hidden = false; vazio.textContent = 'Nenhuma tarefa encontrada.'; return; }
  vazio.hidden = true;
  achados.forEach(({ tarefa, lista }) => ul.appendChild(itemTarefa(tarefa, true, lista, false)));
}

function itemTarefa(t, comOrigem, listaOrigem, arrastavel) {
  const li = document.createElement('li');
  li.className = 'item-tarefa' + (t.status === 'concluida' ? ' concluida' : '') + (t.id === tarefaAtivaId ? ' selecionada' : '') + (t.fixada ? ' fixada' : '');
  li.dataset.id = t.id;
  const total = (t.checklist || []).length;
  const feitos = (t.checklist || []).filter(i => i.concluido).length;
  const progresso = total ? `<span>☑ ${feitos}/${total}</span>` : '';
  const temNota = t.anotacao && t.anotacao.trim() ? '<span>📝</span>' : '';
  const pino = t.fixada ? '<span class="pin-badge">📌</span>' : '';
  const origem = comOrigem && listaOrigem ? `<span class="lista-origem">em ${esc(listaOrigem.titulo)}</span>` : '';
  const etq = t.etiqueta ? `<span class="etiqueta">${esc(t.etiqueta)}</span>` : '';
  const pz = formatarPrazo(t.prazo, t.status);
  const prazoHtml = pz ? `<span class="prazo ${pz.classe}">📅 ${esc(pz.texto)}</span>` : '';
  li.innerHTML = `
    <input type="checkbox" ${t.status === 'concluida' ? 'checked' : ''} />
    <div class="corpo">
      <span class="descricao">${pino} ${esc(t.descricao)}</span>
      <div class="meta">${origem}${etq}${prazoHtml}${progresso}${temNota}</div>
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

  if (arrastavel) {
    li.draggable = true;
    li.addEventListener('dragstart', () => li.classList.add('arrastando'));
    li.addEventListener('dragend', async () => {
      li.classList.remove('arrastando');
      const ul = $('tarefas');
      const ordem = [...ul.querySelectorAll('.item-tarefa')].map(x => x.dataset.id);
      const lista = getLista(listaAtivaId);
      lista.tarefas.sort((a, b) => ordem.indexOf(a.id) - ordem.indexOf(b.id));
      await api.reordenarTarefas(listaAtivaId, ordem);
    });
  }
  return li;
}

// dragover global na lista de tarefas (registrado uma vez)
$('tarefas').addEventListener('dragover', (e) => {
  e.preventDefault();
  const arr = $('tarefas').querySelector('.item-tarefa.arrastando'); if (!arr) return;
  const depois = elementoApos($('tarefas'), e.clientY, '.item-tarefa');
  if (depois == null) $('tarefas').appendChild(arr); else $('tarefas').insertBefore(arr, depois);
});
$('listas').addEventListener('dragover', (e) => {
  e.preventDefault();
  const arr = $('listas').querySelector('.item-lista.arrastando'); if (!arr) return;
  const depois = elementoApos($('listas'), e.clientY, '.item-lista');
  if (depois == null) $('listas').appendChild(arr); else $('listas').insertBefore(arr, depois);
});
function elementoApos(ul, y, sel) {
  const els = [...ul.querySelectorAll(`${sel}:not(.arrastando)`)];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element || null;
}

function atualizarFiltroEtiquetas(lista) {
  const sel = $('filtro-etiqueta');
  const etqs = [...new Set(lista.tarefas.map(t => t.etiqueta).filter(Boolean))].sort();
  const atual = filtroEtiqueta;
  sel.innerHTML = '<option value="">Todas</option>' + etqs.map(e => `<option value="${esc(e)}">${esc(e)}</option>`).join('');
  if (etqs.includes(atual)) sel.value = atual; else { filtroEtiqueta = ''; sel.value = ''; }
}

function atualizarProgresso(lista) {
  const total = lista.tarefas.length;
  const feitas = lista.tarefas.filter(t => t.status === 'concluida').length;
  const pct = total ? Math.round((feitas / total) * 100) : 0;
  $('prog-texto').textContent = `${feitas} de ${total} concluídas`;
  $('prog-pct').textContent = `${pct}%`;
  $('prog-fill').style.width = pct + '%';
}

// ===== Detalhe =====
function abrirDetalhe(tid) {
  tarefaAtivaId = tid;
  const t = getTarefa(tid); if (!t) return;
  $('det-titulo').value = t.descricao;
  $('det-etiqueta').value = t.etiqueta || '';
  $('det-status').checked = t.status === 'concluida';
  $('det-prazo').value = t.prazo || '';
  $('det-anotacao').value = t.anotacao || '';
  $('btn-fixar').classList.toggle('btn-fixar-on', !!t.fixada);
  renderChecklist();
  $('detalhe').hidden = false;
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
  const t = getTarefa(tarefaAtivaId); if (!t) return;
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
  const titulo = $('nova-lista').value.trim(); if (!titulo) return;
  const nova = await api.criarLista({ titulo, cor_hex: $('nova-lista-cor').value });
  nova.tarefas = nova.tarefas || [];
  dados.push(nova);
  $('nova-lista').value = '';
  termoBusca = ''; $('busca').value = '';
  listaAtivaId = nova.id;
  renderListas(); renderTarefas();
  toast('Lista criada', 'sucesso');
};
$('form-tarefa').onsubmit = async (e) => {
  e.preventDefault();
  const descricao = $('nova-tarefa').value.trim(); if (!descricao || !listaAtivaId) return;
  const t = await api.criarTarefa(listaAtivaId, { descricao, etiqueta: $('nova-tarefa-etiqueta').value });
  getLista(listaAtivaId).tarefas.push(t);
  $('nova-tarefa').value = ''; $('nova-tarefa-etiqueta').value = '';
  renderTarefas(); renderListas();
};
$('busca').oninput = (e) => { termoBusca = e.target.value.trim(); renderListas(); renderTarefas(); };
$('ordenar').onchange = (e) => { ordenarPor = e.target.value; renderTarefas(); };
$('filtro-etiqueta').onchange = (e) => { filtroEtiqueta = e.target.value; renderTarefas(); };
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
  toast('Lista excluída');
};
$('btn-fechar').onclick = () => { fecharDetalhe(); renderTarefas(); };
$('btn-fixar').onclick = async () => {
  const t = getTarefa(tarefaAtivaId); if (!t) return;
  const lid = listaDaTarefa(t.id).id;
  const at = await api.fixarTarefa(lid, t.id);
  t.fixada = at.fixada;
  $('btn-fixar').classList.toggle('btn-fixar-on', t.fixada);
  renderTarefas();
  toast(t.fixada ? 'Fixada no topo 📌' : 'Desafixada');
};
$('form-item').onsubmit = async (e) => {
  e.preventDefault();
  const texto = $('novo-item').value.trim();
  const t = getTarefa(tarefaAtivaId); if (!texto || !t) return;
  const lid = listaDaTarefa(t.id).id;
  const item = await api.addItem(lid, t.id, { texto });
  (t.checklist = t.checklist || []).push(item);
  $('novo-item').value = '';
  renderChecklist(); renderTarefas();
};
$('btn-salvar').onclick = async () => {
  const t = getTarefa(tarefaAtivaId); if (!t) return;
  const lid = listaDaTarefa(t.id).id;
  const body = {
    descricao: $('det-titulo').value.trim() || t.descricao,
    etiqueta: $('det-etiqueta').value,
    status: $('det-status').checked ? 'concluida' : 'pendente',
    prazo: $('det-prazo').value || null,
    anotacao: $('det-anotacao').value,
  };
  const at = await api.salvarTarefa(lid, t.id, body);
  Object.assign(t, at);
  renderTarefas(); renderListas();
  toast('Alterações salvas', 'sucesso');
};
$('btn-excluir-tarefa').onclick = async () => {
  const t = getTarefa(tarefaAtivaId); if (!t) return;
  if (!confirm(`Excluir a tarefa "${t.descricao}"?`)) return;
  const lid = listaDaTarefa(t.id).id;
  await api.excluirTarefa(lid, t.id);
  getLista(lid).tarefas = getLista(lid).tarefas.filter(x => x.id !== t.id);
  fecharDetalhe();
  renderTarefas(); renderListas();
  toast('Tarefa excluída');
};

// ===== Início =====
(function init() {
  let tema = 'light';
  try { tema = localStorage.getItem('tema') || 'light'; } catch (e) {}
  aplicarTema(tema);
  carregar();
})();
