const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

let server, base;
const U = () => `teste_${Date.now()}_${Math.random().toString(36).slice(2,6)}@x.com`;
const j = (r) => r.json();
const req = (path, method, body, userId) =>
  fetch(base + path, {
    method: method || 'GET',
    headers: Object.assign(body ? { 'Content-Type': 'application/json' } : {}, userId ? { 'X-Usuario-Id': userId } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });

before(() => { server = app.listen(0); base = `http://localhost:${server.address().port}`; });
after(() => server.close());

test('cadastro e login funcionam', async () => {
  const email = U();
  const c = await req('/api/auth/cadastro', 'POST', { nome: 'Teste', email, senha: '1234' });
  assert.strictEqual(c.status, 201);
  const u = await j(c);
  assert.ok(u.id, 'deve retornar id do usuário');
  const l = await req('/api/auth/login', 'POST', { email, senha: '1234' });
  assert.strictEqual(l.status, 200);
});

test('login com senha errada retorna 401', async () => {
  const email = U();
  await req('/api/auth/cadastro', 'POST', { nome: 'X', email, senha: '1234' });
  const r = await req('/api/auth/login', 'POST', { email, senha: 'errada' });
  assert.strictEqual(r.status, 401);
});

test('rota de listas exige autenticação', async () => {
  const r = await req('/api/listas');
  assert.strictEqual(r.status, 401);
});

test('CRUD de lista e tarefa', async () => {
  const u = await j(await req('/api/auth/cadastro', 'POST', { nome: 'A', email: U(), senha: '1234' }));
  // cria lista
  const lista = await j(await req('/api/listas', 'POST', { titulo: 'Faculdade', cor_hex: '#4F86C6' }, u.id));
  assert.ok(lista.id);
  assert.strictEqual(lista.ehDono, true);
  // cria tarefa
  const tarefa = await j(await req(`/api/listas/${lista.id}/tarefas`, 'POST', { descricao: 'Estudar' }, u.id));
  assert.strictEqual(tarefa.status, 'pendente');
  // conclui
  const tg = await j(await req(`/api/listas/${lista.id}/tarefas/${tarefa.id}/status`, 'PATCH', null, u.id));
  assert.strictEqual(tg.status, 'concluida');
  // checklist
  const item = await j(await req(`/api/listas/${lista.id}/tarefas/${tarefa.id}/checklist`, 'POST', { texto: 'Cap 1' }, u.id));
  assert.ok(item.id);
  // exclui tarefa
  const del = await req(`/api/listas/${lista.id}/tarefas/${tarefa.id}`, 'DELETE', null, u.id);
  assert.strictEqual(del.status, 204);
});

test('validação: lista sem título retorna 400', async () => {
  const u = await j(await req('/api/auth/cadastro', 'POST', { nome: 'B', email: U(), senha: '1234' }));
  const r = await req('/api/listas', 'POST', {}, u.id);
  assert.strictEqual(r.status, 400);
});

test('isolamento: um usuário não vê listas do outro', async () => {
  const a = await j(await req('/api/auth/cadastro', 'POST', { nome: 'A', email: U(), senha: '1234' }));
  const b = await j(await req('/api/auth/cadastro', 'POST', { nome: 'B', email: U(), senha: '1234' }));
  await req('/api/listas', 'POST', { titulo: 'Da A' }, a.id);
  const listasB = await j(await req('/api/listas', 'GET', null, b.id));
  assert.strictEqual(listasB.length, 0);
});

test('compartilhamento dá acesso ao colaborador', async () => {
  const dono = await j(await req('/api/auth/cadastro', 'POST', { nome: 'Dono', email: U(), senha: '1234' }));
  const emailColab = U();
  const colab = await j(await req('/api/auth/cadastro', 'POST', { nome: 'Colab', email: emailColab, senha: '1234' }));
  const lista = await j(await req('/api/listas', 'POST', { titulo: 'Compartilhada' }, dono.id));
  const sh = await req(`/api/listas/${lista.id}/compartilhar`, 'POST', { email: emailColab }, dono.id);
  assert.strictEqual(sh.status, 201);
  const listasColab = await j(await req('/api/listas', 'GET', null, colab.id));
  assert.strictEqual(listasColab.length, 1);
  assert.strictEqual(listasColab[0].ehDono, false);
});
