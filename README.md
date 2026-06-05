# CRUD de Listas

Aplicação web para **organização e gestão de tarefas**, voltada a estudantes e pequenos times que precisam de agilidade e centralização. Inspirada no app de Notas do iPhone: listas, tarefas, **anotações**, **checklists**, **prazos** e **prioridade visual** — com interface fluida e modo claro/escuro.

> 🚧 **Status: protótipo funcional.** Roda sem banco de dados externo (armazenamento em arquivo JSON). Os models Mongoose para a versão final estão em [`src/models`](./src/models).

---

## ▶️ Como rodar (sem instalar banco)

Pré-requisito: [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm start
```

Abra **http://localhost:3000**. Os dados ficam em `data/db.json` (criado automaticamente, já com exemplos).

---

## ✨ Funcionalidades

- **Listas coloridas** na lateral — criar, escolher cor, excluir e **reordenar arrastando** (UC01/UC02).
- **Tarefas** — adicionar, concluir, excluir, **arrastar para reordenar**, **fixar no topo** (📌).
- **Prazos** — data por tarefa, com **atrasadas em vermelho** e **vence hoje** em destaque.
- **Filtrar** por etiqueta e ocultar concluídas; **arrastar para reordenar**.
- **Busca** por tarefas em todas as listas (título, etiqueta, anotação, itens).
- **Checklist que expande inline** ao clicar na tarefa (UC06).
- **Painel de detalhes** (ícone de edição) para anotação, etiqueta, prazo e status.
- **Painel de progresso** com barra de % concluído por lista.
- **Modo claro/escuro** e animações suaves.

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
│   └── js/app.js
├── src/
│   ├── store.js             # Armazenamento JSON (protótipo)
│   ├── controllers/         # listaController, tarefaController (UC01–UC06)
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
| GET/POST | `/api/listas` | Listar / criar lista |
| PUT/DELETE | `/api/listas/:id` | Editar / excluir lista |
| PATCH | `/api/listas/reordenar` | Reordenar listas |
| POST | `/api/listas/:id/tarefas` | Criar tarefa |
| PUT | `/api/listas/:id/tarefas/:tid` | Editar (descrição, etiqueta, status, prazo, anotação) |
| PATCH | `/api/listas/:id/tarefas/:tid/status` | Concluir / reabrir |
| PATCH | `/api/listas/:id/tarefas/:tid/fixar` | Fixar / desafixar |
| PATCH | `/api/listas/:id/tarefas/reordenar` | Reordenar tarefas |
| DELETE | `/api/listas/:id/tarefas/:tid` | Excluir tarefa |
| POST/PATCH/DELETE | `/api/listas/:id/tarefas/:tid/checklist/...` | Itens do checklist (UC06) |

---

## 🗺️ Próximos passos

- [x] CRUD de listas e tarefas, anotações e checklists (UC01–UC06)
- [x] Prazos, ordenação, filtros, busca, fixar e reordenar
- [x] Modo claro/escuro e interface fluida
- [ ] Autenticação de usuários
- [ ] Migrar armazenamento para MongoDB
- [ ] Testes automatizados e deploy

---

## 📄 Licença

Uso acadêmico (MIT).
