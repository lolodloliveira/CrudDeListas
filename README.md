# CRUD de Listas

Aplicação web para **organização e gestão de tarefas**, voltada a estudantes e pequenos times que precisam de agilidade e centralização. Inspirada no app de Notas do iPhone: cada usuário cria listas, adiciona tarefas com **prazo**, **etiquetas** e **checklists**, e escreve **notas formatadas** dentro de cada tarefa — tudo numa interface fluida com modo claro/escuro.

> 🔐 Tem **login com sessão salva** (você entra uma vez) e os dados são **por usuário**.
> 🚧 **Status: protótipo funcional.** Roda sem banco externo (armazenamento em arquivo JSON). Os models Mongoose para a versão final estão em [`src/models`](./src/models).

---

## ▶️ Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm start
```

Abra **http://localhost:3000**, crie uma conta (ou faça login) e comece a usar. Os dados ficam em `data/db.json`, criado automaticamente.

---

## ✨ Funcionalidades

**Conta e sessão**
- Cadastro e login de usuário (senha guardada com hash SHA-256).
- Sessão salva no navegador: você entra uma vez e o app lembra de você.
- Cada usuário vê e gerencia apenas as **suas** listas (isolamento de dados).

**Listas e tarefas**
- Criar listas por um popup, com **cor** personalizada (UC01 / UC02).
- Adicionar, concluir, editar e excluir tarefas (UC01 / UC03 / UC05).
- **Ocultar concluídas** e **filtrar por etiqueta** (UC04 / UC02).
- **Prazo** por tarefa, com **atrasadas em vermelho** e **vence hoje** em destaque.
- **Fixar** tarefas no topo e **arrastar para reordenar** listas e tarefas.
- **Busca** por tarefas em todas as listas.
- **Painel de progresso** com % concluído por lista.

**Notas e checklists**
- **Checklist** que expande inline ao clicar na tarefa (UC06).
- **Editor de notas formatado** na tarefa: Título, Subtítulo, Corpo, negrito, itálico e listas.

**Interface**
- Modo claro/escuro, fonte Outfit embutida (funciona offline), ícones SVG e animações suaves.
- Estado vazio com atalho para criar a primeira lista.

---

## 🧱 Modelo de domínio

| Entidade   | Atributos                                   | Papel |
|------------|---------------------------------------------|-------|
| `Usuario`  | id, nome, email, senha                      | Autenticação e autoria das listas. |
| `Lista`    | id, titulo, cor_hex, usuarioId, dataCriacao | Agrupador de tarefas, pertence a um usuário. |
| `Tarefa`   | id, descricao, status, prazo, etiqueta, anotacao | Unidade de trabalho. |
| `Etiqueta` | nome, cor                                   | Classificador das tarefas. |
| `Checklist`| itemTexto, concluido                        | Subitens de uma tarefa. |

Relacionamentos: um `Usuario` gerencia muitas `Lista`s; uma `Lista` contém muitas `Tarefa`s; uma `Tarefa` possui itens de `Checklist` e pode ter `Etiqueta`.

---

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Armazenamento (protótipo):** arquivo JSON (`data/db.json`)
- **Banco (versão final):** MongoDB + Mongoose (scaffolding em `src/models` e `src/config`)
- **Frontend:** HTML, CSS e JavaScript puro (sem frameworks)

---

## 📂 Estrutura

```
crud-de-listas/
├── public/                  # Frontend
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   └── fonts/               # Fonte Outfit (offline)
├── src/
│   ├── store.js             # Armazenamento JSON (protótipo)
│   ├── controllers/         # auth, lista, tarefa (UC01–UC06)
│   ├── routes/              # Endpoints da API
│   ├── models/ config/ middlewares/   # Versão final (Mongoose, auth)
│   ├── app.js  server.js
├── data/                    # db.json (gerado em runtime, ignorado pelo Git)
├── package.json
└── README.md
```

---

## 🔌 Principais endpoints

| Método | Rota | Função |
|--------|------|--------|
| POST | `/api/auth/cadastro` · `/api/auth/login` | Criar conta / autenticar |
| GET/POST | `/api/listas` | Listar / criar lista (do usuário) |
| PUT/DELETE | `/api/listas/:id` | Editar / excluir lista |
| PATCH | `/api/listas/reordenar` | Reordenar listas |
| POST | `/api/listas/:id/tarefas` | Criar tarefa |
| PUT | `/api/listas/:id/tarefas/:tid` | Editar (descrição, etiqueta, status, prazo, anotação) |
| PATCH | `/api/listas/:id/tarefas/:tid/status` · `/fixar` | Concluir/reabrir · fixar |
| PATCH | `/api/listas/:id/tarefas/reordenar` | Reordenar tarefas |
| DELETE | `/api/listas/:id/tarefas/:tid` | Excluir tarefa |
| POST/PATCH/DELETE | `.../checklist/...` | Itens do checklist (UC06) |

> As rotas de lista/tarefa exigem o cabeçalho de sessão do usuário.

---

## ✅ Casos de uso

| Caso de uso | Status |
|---|---|
| UC01 – Manter listas (CRUD) | ✅ |
| UC02 – Categorizar por etiquetas/cores | ✅ |
| UC03 – Marcar tarefa como concluída | ✅ |
| UC04 – Ocultar tarefas finalizadas | ✅ |
| UC05 – Editar detalhes da tarefa | ✅ |
| UC06 – Gerenciar checklists | ✅ |
| Autenticação de usuário (`Usuario`) | ✅ |

---

## 🗺️ Próximos passos

- [ ] Compartilhar listas entre usuários (`Lista.compartilhar()`)
- [ ] Etiquetas como entidade com cores próprias
- [ ] Migrar armazenamento para MongoDB
- [ ] Responsividade para celular
- [ ] Testes automatizados e deploy

---

## 📄 Licença

Uso acadêmico (MIT).
