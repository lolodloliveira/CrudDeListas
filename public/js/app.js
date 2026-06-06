// ===== Ícones (SVG inline, sem dependência externa) =====
const ICN = {
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  listcheck:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  note:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  chevron:'<path d="m6 9 6 6 6-6"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
};
const ic = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICN[n] || ''}</svg>`;

// ===== Estado =====
let dados = [];
let listaAtivaId = null, tarefaAtivaId = null, expandidaId = null;
let ocultarConcluidas = false, termoBusca = '', filtroEtiqueta = '';
let focarAddDe = null;

// ===== API =====
let usuario = null;
try { usuario = JSON.parse(localStorage.getItem('usuario') || 'null'); } catch (e) {}
const j = (r) => r.json();
const hdr = (json) => { const h = {}; if (json) h['Content-Type'] = 'application/json'; if (usuario) h['X-Usuario-Id'] = usuario.id; return h; };
const api = {
  listar: () => fetch('/api/listas', { headers: hdr() }).then(j),
  criarLista: (d) => fetch('/api/listas', { method:'POST', headers:hdr(1), body:JSON.stringify(d) }).then(j),
  excluirLista: (id) => fetch(`/api/listas/${id}`, { method:'DELETE', headers: hdr() }),
  reordenarListas: (ordem) => fetch('/api/listas/reordenar', { method:'PATCH', headers:hdr(1), body:JSON.stringify({ ordem }) }),
  criarTarefa: (lid, d) => fetch(`/api/listas/${lid}/tarefas`, { method:'POST', headers:hdr(1), body:JSON.stringify(d) }).then(j),
  salvarTarefa: (lid, tid, d) => fetch(`/api/listas/${lid}/tarefas/${tid}`, { method:'PUT', headers:hdr(1), body:JSON.stringify(d) }).then(j),
  toggleTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}/status`, { method:'PATCH', headers: hdr() }).then(j),
  fixarTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}/fixar`, { method:'PATCH', headers: hdr() }).then(j),
  excluirTarefa: (lid, tid) => fetch(`/api/listas/${lid}/tarefas/${tid}`, { method:'DELETE', headers: hdr() }),
  reordenarTarefas: (lid, ordem) => fetch(`/api/listas/${lid}/tarefas/reordenar`, { method:'PATCH', headers:hdr(1), body:JSON.stringify({ ordem }) }),
  addItem: (lid, tid, d) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist`, { method:'POST', headers:hdr(1), body:JSON.stringify(d) }).then(j),
  toggleItem: (lid, tid, iid) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist/${iid}`, { method:'PATCH', headers: hdr() }).then(j),
  removeItem: (lid, tid, iid) => fetch(`/api/listas/${lid}/tarefas/${tid}/checklist/${iid}`, { method:'DELETE', headers: hdr() }),
  login: (d) => fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }),
  cadastro: (d) => fetch('/api/auth/cadastro', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }),
};

// ===== Util =====
const $ = (id) => document.getElementById(id);
const esc = (t) => { const d = document.createElement('div'); d.textContent = t ?? ''; return d.innerHTML; };
const txtPlano = (html) => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent || ''; };
const getLista = (id) => dados.find(l => l.id === id);
const listaDaTarefa = (tid) => dados.find(l => l.tarefas.some(t => t.id === tid));
const getTarefa = (tid) => { const l = listaDaTarefa(tid); return l && l.tarefas.find(t => t.id === tid); };
const hojeISO = () => new Date().toISOString().slice(0, 10);

function toast(msg, tipo = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + tipo; el.textContent = msg;
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
  $('btn-tema').innerHTML = ic(t === 'dark' ? 'sun' : 'moon', 18);
  try { localStorage.setItem('tema', t); } catch (e) {}
}
$('btn-tema').onclick = () => aplicarTema(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

// ===== Carregar =====
async function carregar() {
  dados = await api.listar();
  if (!listaAtivaId && dados.length) listaAtivaId = dados[0].id;
  if (listaAtivaId && !getLista(listaAtivaId)) listaAtivaId = dados.length ? dados[0].id : null;
  if (tarefaAtivaId && !getTarefa(tarefaAtivaId)) fecharDetalhe();
  renderListas(); renderTarefas();
}

// ===== Sidebar =====
function renderListas() {
  const ul = $('listas'); ul.innerHTML = '';
  dados.forEach(lista => {
    const pend = lista.tarefas.filter(t => t.status === 'pendente').length;
    const li = document.createElement('li');
    li.className = 'item-lista' + (lista.id === listaAtivaId && !termoBusca ? ' ativa' : '');
    li.dataset.id = lista.id; li.draggable = true;
    li.innerHTML = `<span class="bolinha" style="background:${lista.cor_hex}"></span><span class="nome">${esc(lista.titulo)}</span><span class="contador">${pend}</span>`;
    li.onclick = () => { termoBusca = ''; $('busca').value = ''; listaAtivaId = lista.id; expandidaId = null; renderListas(); renderTarefas(); };
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

// ===== Tarefas =====
function renderTarefas() {
  const ul = $('tarefas'); ul.innerHTML = '';
  const vazio = $('vazio');
  if (termoBusca) { mostrarFerramentas(false); renderBusca(ul, vazio); return refocoAdd(); }

  const lista = getLista(listaAtivaId);
  $('form-tarefa').hidden = !lista;
  $('btn-excluir-lista').hidden = !lista;
  mostrarFerramentas(!!lista);
  if (!lista) {
    $('titulo-lista').textContent = 'Selecione uma lista';
    $('ponto-cor').style.background = 'var(--border)';
    vazio.hidden = dados.length > 0; vazio.textContent = 'Crie uma lista para começar.';
    return;
  }
  $('titulo-lista').textContent = lista.titulo;
  $('ponto-cor').style.background = lista.cor_hex;
  atualizarFiltroEtiquetas(lista);
  atualizarProgresso(lista);

  let tarefas = lista.tarefas.slice();
  if (ocultarConcluidas) tarefas = tarefas.filter(t => t.status !== 'concluida');
  if (filtroEtiqueta) tarefas = tarefas.filter(t => (t.etiqueta || '') === filtroEtiqueta);
  tarefas.sort((a, b) => (b.fixada === true) - (a.fixada === true));

  const arrastavel = !filtroEtiqueta && !ocultarConcluidas;
  if (!tarefas.length) {
    vazio.hidden = false; vazio.textContent = ocultarConcluidas ? 'Nenhuma tarefa pendente.' : 'Nenhuma tarefa aqui ainda.';
    return;
  }
  vazio.hidden = true;
  tarefas.forEach(t => ul.appendChild(itemTarefa(t, false, null, arrastavel)));
  refocoAdd();
}
function refocoAdd() {
  if (!focarAddDe) return;
  const inp = document.querySelector(`.item-tarefa[data-id="${focarAddDe}"] .exp-novo`);
  if (inp) inp.focus();
  focarAddDe = null;
}
function mostrarFerramentas(v) { $('barra-ferramentas').hidden = !v; $('progresso').hidden = !v; }

function renderBusca(ul, vazio) {
  $('form-tarefa').hidden = true; $('btn-excluir-lista').hidden = true;
  $('titulo-lista').textContent = `Busca: "${termoBusca}"`;
  $('ponto-cor').style.background = 'var(--border)';
  const termo = termoBusca.toLowerCase(); const achados = [];
  dados.forEach(l => l.tarefas.forEach(t => {
    const alvo = [t.descricao, t.etiqueta, txtPlano(t.anotacao), ...(t.checklist || []).map(i => i.texto)].join(' ').toLowerCase();
    if (alvo.includes(termo)) achados.push({ tarefa: t, lista: l });
  }));
  if (!achados.length) { vazio.hidden = false; vazio.textContent = 'Nenhuma tarefa encontrada.'; return; }
  vazio.hidden = true;
  achados.forEach(({ tarefa, lista }) => ul.appendChild(itemTarefa(tarefa, true, lista, false)));
}

function itemTarefa(t, comOrigem, listaOrigem, arrastavel) {
  const aberta = expandidaId === t.id;
  const li = document.createElement('li');
  li.className = 'item-tarefa' + (t.status === 'concluida' ? ' concluida' : '') + (t.id === tarefaAtivaId ? ' selecionada' : '') + (t.fixada ? ' fixada' : '') + (aberta ? ' aberta' : '');
  li.dataset.id = t.id;
  const total = (t.checklist || []).length;
  const feitos = (t.checklist || []).filter(i => i.concluido).length;
  const pino = t.fixada ? `<span class="pin-badge">${ic('pin', 13)}</span>` : '';
  const origem = comOrigem && listaOrigem ? `<span class="lista-origem">em ${esc(listaOrigem.titulo)}</span>` : '';
  const etq = t.etiqueta ? `<span class="etiqueta">${esc(t.etiqueta)}</span>` : '';
  const pz = formatarPrazo(t.prazo, t.status);
  const prazoHtml = pz ? `<span class="prazo ${pz.classe}">${ic('calendar', 12)} ${esc(pz.texto)}</span>` : '';
  const checagem = total ? `<span class="mi">${ic('listcheck', 13)} ${feitos}/${total}</span>` : '';
  const nota = txtPlano(t.anotacao).trim() ? `<span class="mi">${ic('note', 13)}</span>` : '';
  li.innerHTML = `
    <div class="tarefa-row">
      <input type="checkbox" class="chk-status" ${t.status === 'concluida' ? 'checked' : ''} />
      <div class="corpo">
        <span class="descricao">${pino}${esc(t.descricao)}</span>
        <div class="meta">${origem}${etq}${prazoHtml}${checagem}${nota}</div>
      </div>
      <button class="btn-icone editar" title="Detalhes" aria-label="Detalhes">${ic('edit', 17)}</button>
      <button class="btn-icone chevron" title="Mostrar checklist" aria-label="Mostrar checklist">${ic('chevron', 18)}</button>
    </div>
    ${aberta ? `<div class="tarefa-exp">${expansaoHtml(t)}</div>` : ''}`;

  // status
  const chk = li.querySelector('.chk-status');
  chk.onclick = (e) => e.stopPropagation();
  chk.onchange = async () => {
    const lid = listaDaTarefa(t.id).id;
    const at = await api.toggleTarefa(lid, t.id);
    t.status = at.status; renderListas(); renderTarefas();
    if (t.id === tarefaAtivaId) $('det-status').checked = t.status === 'concluida';
  };
  // expandir
  const row = li.querySelector('.tarefa-row');
  row.onclick = (e) => { if (e.target.closest('.chk-status') || e.target.closest('.editar')) return; expandidaId = aberta ? null : t.id; renderTarefas(); };
  // detalhes
  li.querySelector('.editar').onclick = (e) => { e.stopPropagation(); abrirDetalhe(t.id); };

  // expansão (checklist inline)
  if (aberta) ligarExpansao(li, t);

  // arrastar
  if (arrastavel && !aberta) {
    li.draggable = true;
    li.addEventListener('dragstart', () => li.classList.add('arrastando'));
    li.addEventListener('dragend', async () => {
      li.classList.remove('arrastando');
      const ordem = [...$('tarefas').querySelectorAll('.item-tarefa')].map(x => x.dataset.id);
      const lista = getLista(listaAtivaId);
      lista.tarefas.sort((a, b) => ordem.indexOf(a.id) - ordem.indexOf(b.id));
      await api.reordenarTarefas(listaAtivaId, ordem);
    });
  }
  return li;
}

function expansaoHtml(t) {
  const itens = t.checklist || [];
  const lista = itens.length
    ? `<ul class="exp-checklist">${itens.map(i => `
        <li class="exp-item ${i.concluido ? 'feito' : ''}" data-iid="${i.id}">
          <input type="checkbox" ${i.concluido ? 'checked' : ''} />
          <span class="txt">${esc(i.texto)}</span>
          <button class="btn-icone rem-item" title="Remover" aria-label="Remover">${ic('x', 15)}</button>
        </li>`).join('')}</ul>`
    : `<p class="exp-vazio">Sem itens ainda. Adicione abaixo.</p>`;
  return `${lista}<form class="exp-add"><input class="exp-novo" placeholder="Adicionar item..." maxlength="80" /><button type="submit" title="Adicionar" aria-label="Adicionar item">${ic('plus', 18)}</button></form>`;
}

function ligarExpansao(li, t) {
  const lid = listaDaTarefa(t.id).id;
  li.querySelectorAll('.exp-item').forEach(el => {
    const iid = el.dataset.iid;
    el.querySelector('input').onchange = async () => {
      const r = await api.toggleItem(lid, t.id, iid);
      const item = t.checklist.find(i => i.id === iid); if (item) item.concluido = r.concluido;
      renderTarefas();
    };
    el.querySelector('.rem-item').onclick = async () => {
      await api.removeItem(lid, t.id, iid);
      t.checklist = t.checklist.filter(i => i.id !== iid);
      renderTarefas();
    };
  });
  li.querySelector('.exp-add').onsubmit = async (e) => {
    e.preventDefault();
    const inp = li.querySelector('.exp-novo'); const texto = inp.value.trim();
    if (!texto) return;
    const item = await api.addItem(lid, t.id, { texto });
    (t.checklist = t.checklist || []).push(item);
    focarAddDe = t.id;
    renderTarefas();
  };
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
  $('det-anotacao').innerHTML = t.anotacao || '';
  $('btn-fixar').classList.toggle('btn-fixar-on', !!t.fixada);
  $('detalhe').hidden = false;
  document.querySelector('.app').classList.add('com-detalhe');
  renderTarefas();
}
function fecharDetalhe() {
  tarefaAtivaId = null;
  $('detalhe').hidden = true;
  document.querySelector('.app').classList.remove('com-detalhe');
}

// ===== Eventos =====
// ----- Modal: nova lista -----
const CORES = ['#4F86C6','#6FB07F','#E2574C','#E8A23D','#9B72CF','#3FB6C9','#E26FA0','#5C6B7A'];
let corSel = CORES[0], corCustom = '#4F86C6';
function renderSwatches() {
  const c = $('modal-cores'); c.innerHTML = '';
  CORES.forEach(cor => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'swatch' + (cor === corSel ? ' sel' : '');
    b.style.background = cor; b.setAttribute('aria-label', 'Cor ' + cor);
    b.onclick = () => { corSel = cor; renderSwatches(); };
    c.appendChild(b);
  });
  const custom = (CORES.includes(corSel)) ? corCustom : corSel;
  const lab = document.createElement('label');
  lab.className = 'swatch custom' + (!CORES.includes(corSel) ? ' sel' : '');
  if (!CORES.includes(corSel)) { lab.style.background = corSel; lab.innerHTML = `<input type="color" value="${custom}" />`; }
  else { lab.innerHTML = ic('plus', 16) + `<input type="color" value="${custom}" />`; }
  lab.querySelector('input').oninput = (e) => { corCustom = e.target.value; corSel = e.target.value; renderSwatches(); };
  c.appendChild(lab);
}
function abrirModalLista() { $('modal-nome').value = ''; corSel = CORES[0]; renderSwatches(); $('modal-lista').hidden = false; setTimeout(() => $('modal-nome').focus(), 40); }
function fecharModalLista() { $('modal-lista').hidden = true; }
async function criarListaModal() {
  const titulo = $('modal-nome').value.trim();
  if (!titulo) { $('modal-nome').focus(); return; }
  const nova = await api.criarLista({ titulo, cor_hex: corSel });
  nova.tarefas = nova.tarefas || []; dados.push(nova);
  termoBusca = ''; $('busca').value = ''; listaAtivaId = nova.id; expandidaId = null;
  fecharModalLista(); renderListas(); renderTarefas(); toast('Lista criada', 'sucesso');
}
$('btn-nova-lista').onclick = abrirModalLista;
$('modal-cancelar').onclick = fecharModalLista;
$('modal-criar').onclick = criarListaModal;
$('modal-nome').addEventListener('keydown', (e) => { if (e.key === 'Enter') criarListaModal(); });
$('modal-lista').addEventListener('click', (e) => { if (e.target.id === 'modal-lista') fecharModalLista(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('modal-lista').hidden) fecharModalLista(); });
$('form-tarefa').onsubmit = async (e) => {
  e.preventDefault();
  const descricao = $('nova-tarefa').value.trim(); if (!descricao || !listaAtivaId) return;
  const t = await api.criarTarefa(listaAtivaId, { descricao, etiqueta: $('nova-tarefa-etiqueta').value });
  getLista(listaAtivaId).tarefas.push(t);
  $('nova-tarefa').value = ''; $('nova-tarefa-etiqueta').value = '';
  renderTarefas(); renderListas();
};
$('busca').oninput = (e) => { termoBusca = e.target.value.trim(); expandidaId = null; renderListas(); renderTarefas(); };
$('filtro-etiqueta').onchange = (e) => { filtroEtiqueta = e.target.value; renderTarefas(); };
$('ocultar-concluidas').onchange = (e) => { ocultarConcluidas = e.target.checked; renderTarefas(); };
$('btn-excluir-lista').onclick = async () => {
  if (!listaAtivaId) return;
  const lista = getLista(listaAtivaId);
  if (!confirm(`Excluir a lista "${lista.titulo}" e todas as suas tarefas?`)) return;
  await api.excluirLista(listaAtivaId);
  dados = dados.filter(l => l.id !== listaAtivaId);
  if (tarefaAtivaId && !getTarefa(tarefaAtivaId)) fecharDetalhe();
  listaAtivaId = dados.length ? dados[0].id : null; expandidaId = null;
  renderListas(); renderTarefas(); toast('Lista excluída');
};
$('btn-fechar').onclick = () => { fecharDetalhe(); renderTarefas(); };
$('btn-fixar').onclick = async () => {
  const t = getTarefa(tarefaAtivaId); if (!t) return;
  const lid = listaDaTarefa(t.id).id;
  const at = await api.fixarTarefa(lid, t.id); t.fixada = at.fixada;
  $('btn-fixar').classList.toggle('btn-fixar-on', t.fixada);
  renderTarefas(); toast(t.fixada ? 'Fixada no topo' : 'Desafixada');
};
$('btn-salvar').onclick = async () => {
  const t = getTarefa(tarefaAtivaId); if (!t) return;
  const lid = listaDaTarefa(t.id).id;
  const body = {
    descricao: $('det-titulo').value.trim() || t.descricao,
    etiqueta: $('det-etiqueta').value,
    status: $('det-status').checked ? 'concluida' : 'pendente',
    prazo: $('det-prazo').value || null,
    anotacao: $('det-anotacao').innerHTML,
  };
  const at = await api.salvarTarefa(lid, t.id, body); Object.assign(t, at);
  renderTarefas(); renderListas(); toast('Alterações salvas', 'sucesso');
};
$('btn-excluir-tarefa').onclick = async () => {
  const t = getTarefa(tarefaAtivaId); if (!t) return;
  if (!confirm(`Excluir a tarefa "${t.descricao}"?`)) return;
  const lid = listaDaTarefa(t.id).id;
  await api.excluirTarefa(lid, t.id);
  getLista(lid).tarefas = getLista(lid).tarefas.filter(x => x.id !== t.id);
  if (expandidaId === t.id) expandidaId = null;
  fecharDetalhe(); renderTarefas(); renderListas(); toast('Tarefa excluída');
};

// dragover global
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
  return els.reduce((c, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > c.offset) return { offset, element: child };
    return c;
  }, { offset: Number.NEGATIVE_INFINITY }).element || null;
}

// ===== Editor de notas (formatação) =====
(function ligarEditor() {
  const tb = $('editor-toolbar'), ed = $('det-anotacao');
  if (!tb || !ed) return;
  tb.addEventListener('mousedown', (e) => e.preventDefault()); // mantém a seleção no editor
  tb.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      ed.focus();
      if (btn.dataset.bloco) document.execCommand('formatBlock', false, btn.dataset.bloco);
      else if (btn.dataset.cmd) document.execCommand(btn.dataset.cmd, false, null);
    };
  });
})();

// ===== Ícones estáticos =====
function iconesEstaticos() {
  $('btn-nova-lista').innerHTML = ic('plus', 16) + ' Nova lista';
  $('btn-excluir-lista').innerHTML = ic('trash', 16);
  $('btn-fechar').innerHTML = ic('x', 18);
  $('btn-fixar').innerHTML = ic('pin', 17);
  $('btn-logout').innerHTML = ic('logout', 17);
  $('btn-excluir-tarefa').innerHTML = ic('trash', 15) + ' Excluir';
}

// ===== Início =====
// ===== Sessão / login =====
function mostrarApp() {
  $('tela-login').hidden = true; $('app').hidden = false;
  $('user-avatar').textContent = (usuario.nome || '?').trim().charAt(0).toUpperCase();
  $('user-nome').textContent = usuario.nome;
  listaAtivaId = null; tarefaAtivaId = null; expandidaId = null;
  carregar();
}
function mostrarLogin() { $('app').hidden = true; $('tela-login').hidden = false; setTimeout(() => $('login-email').focus(), 50); }
function entrar(u) { usuario = u; try { localStorage.setItem('usuario', JSON.stringify(u)); } catch (e) {} mostrarApp(); }
function sair() { try { localStorage.removeItem('usuario'); } catch (e) {} location.reload(); }

$('form-login').onsubmit = async (e) => {
  e.preventDefault(); $('login-erro').hidden = true;
  const r = await api.login({ email: $('login-email').value.trim(), senha: $('login-senha').value });
  const d = await r.json();
  if (!r.ok) { $('login-erro').textContent = d.erro || 'Erro ao entrar.'; $('login-erro').hidden = false; return; }
  entrar(d);
};
$('form-cadastro').onsubmit = async (e) => {
  e.preventDefault(); $('cad-erro').hidden = true;
  const r = await api.cadastro({ nome: $('cad-nome').value.trim(), email: $('cad-email').value.trim(), senha: $('cad-senha').value });
  const d = await r.json();
  if (!r.ok) { $('cad-erro').textContent = d.erro || 'Erro ao cadastrar.'; $('cad-erro').hidden = false; return; }
  entrar(d);
};
$('ir-cadastro').onclick = (e) => { e.preventDefault(); $('form-login').hidden = true; $('ir-cadastro').hidden = true; $('form-cadastro').hidden = false; $('ir-login').hidden = false; setTimeout(() => $('cad-nome').focus(), 30); };
$('ir-login').onclick = (e) => { e.preventDefault(); $('form-cadastro').hidden = true; $('ir-login').hidden = true; $('form-login').hidden = false; $('ir-cadastro').hidden = false; setTimeout(() => $('login-email').focus(), 30); };
$('btn-logout').onclick = sair;

// ===== Início =====
(function init() {
  let tema = 'light';
  try { tema = localStorage.getItem('tema') || 'light'; } catch (e) {}
  aplicarTema(tema);
  iconesEstaticos();
  if (usuario) mostrarApp(); else mostrarLogin();
})();
