// ---- Estado ----
let listas = [];
let listaAtivaId = null;
let ocultarConcluidas = false;

const api = {
  async get() { return (await fetch('/api/listas')).json(); },
  async criarLista(dados) { return (await fetch('/api/listas', { method: 'POST', headers: json(), body: JSON.stringify(dados) })).json(); },
  async excluirLista(id) { return fetch(`/api/listas/${id}`, { method: 'DELETE' }); },
  async criarTarefa(listaId, dados) { return (await fetch(`/api/listas/${listaId}/tarefas`, { method: 'POST', headers: json(), body: JSON.stringify(dados) })).json(); },
  async alternarStatus(listaId, tarefaId) { return fetch(`/api/listas/${listaId}/tarefas/${tarefaId}/status`, { method: 'PATCH' }); },
  async excluirTarefa(listaId, tarefaId) { return fetch(`/api/listas/${listaId}/tarefas/${tarefaId}`, { method: 'DELETE' }); },
};
function json() { return { 'Content-Type': 'application/json' }; }
const $ = (id) => document.getElementById(id);

async function carregar() {
  listas = await api.get();
  if (!listaAtivaId && listas.length) listaAtivaId = listas[0].id;
  if (listaAtivaId && !listas.find((l) => l.id === listaAtivaId)) listaAtivaId = listas.length ? listas[0].id : null;
  render();
}
function render() { renderListas(); renderTarefas(); }

function renderListas() {
  const ul = $('listas'); ul.innerHTML = '';
  listas.forEach((lista) => {
    const pendentes = lista.tarefas.filter((t) => t.status === 'pendente').length;
    const li = document.createElement('li');
    li.className = 'item-lista' + (lista.id === listaAtivaId ? ' ativa' : '');
    li.innerHTML = `<span class="bolinha" style="background:${lista.cor_hex}"></span><span class="nome">${escapar(lista.titulo)}</span><span class="contador">${pendentes}</span>`;
    li.onclick = () => { listaAtivaId = lista.id; render(); };
    ul.appendChild(li);
  });
}

function renderTarefas() {
  const lista = listas.find((l) => l.id === listaAtivaId);
  const formTarefa = $('form-tarefa'), acoes = $('acoes-lista'), vazio = $('vazio'), ulTarefas = $('tarefas');
  ulTarefas.innerHTML = '';
  if (!lista) {
    $('titulo-lista').textContent = 'Selecione uma lista';
    $('ponto-cor').style.background = 'var(--borda)';
    formTarefa.hidden = true; acoes.hidden = true;
    vazio.hidden = listas.length > 0; vazio.textContent = 'Crie uma lista para começar.';
    return;
  }
  $('titulo-lista').textContent = lista.titulo;
  $('ponto-cor').style.background = lista.cor_hex;
  formTarefa.hidden = false; acoes.hidden = false;
  let tarefas = lista.tarefas;
  if (ocultarConcluidas) tarefas = tarefas.filter((t) => t.status !== 'concluida');
  if (!tarefas.length) {
    vazio.hidden = false;
    vazio.textContent = ocultarConcluidas ? 'Nenhuma tarefa pendente. 🎉' : 'Nenhuma tarefa ainda. Adicione a primeira acima.';
    return;
  }
  vazio.hidden = true;
  tarefas.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'item-tarefa' + (t.status === 'concluida' ? ' concluida' : '');
    li.innerHTML = `<input type="checkbox" ${t.status === 'concluida' ? 'checked' : ''} /><span class="descricao">${escapar(t.descricao)}</span>${t.etiqueta ? `<span class="etiqueta">${escapar(t.etiqueta)}</span>` : ''}<button class="btn-icone" title="Excluir tarefa">✕</button>`;
    li.querySelector('input').onchange = async () => { await api.alternarStatus(lista.id, t.id); await carregar(); };
    li.querySelector('button').onclick = async () => { await api.excluirTarefa(lista.id, t.id); await carregar(); };
    ulTarefas.appendChild(li);
  });
}

$('form-lista').onsubmit = async (e) => {
  e.preventDefault();
  const titulo = $('nova-lista').value.trim();
  if (!titulo) return;
  const nova = await api.criarLista({ titulo, cor_hex: $('nova-lista-cor').value });
  $('nova-lista').value = ''; listaAtivaId = nova.id; await carregar();
};
$('form-tarefa').onsubmit = async (e) => {
  e.preventDefault();
  const descricao = $('nova-tarefa').value.trim();
  if (!descricao || !listaAtivaId) return;
  await api.criarTarefa(listaAtivaId, { descricao, etiqueta: $('nova-tarefa-etiqueta').value });
  $('nova-tarefa').value = ''; $('nova-tarefa-etiqueta').value = ''; await carregar();
};
$('ocultar-concluidas').onchange = (e) => { ocultarConcluidas = e.target.checked; renderTarefas(); };
$('btn-excluir-lista').onclick = async () => {
  if (!listaAtivaId) return;
  const lista = listas.find((l) => l.id === listaAtivaId);
  if (!confirm(`Excluir a lista "${lista.titulo}" e todas as suas tarefas?`)) return;
  await api.excluirLista(listaAtivaId); listaAtivaId = null; await carregar();
};
function escapar(txt) { const d = document.createElement('div'); d.textContent = txt; return d.innerHTML; }
carregar();
