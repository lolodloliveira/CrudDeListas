# CRUD de Listas

Aplicação web para **organização e gestão de tarefas**, voltada a estudantes e pequenos times que precisam de agilidade e centralização. Permite o gerenciamento completo de listas de tarefas (criar, ler, atualizar e excluir), com **anotações** e **checklists** por tarefa — no espírito do app de Notas do iPhone.

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

## ✨ O que dá para fazer

- **Listas coloridas** na lateral — criar, escolher cor, excluir (UC01/UC02).
- **Tarefas** dentro de cada lista — adicionar, marcar como concluída, excluir (UC01/UC03).
- **Ocultar concluídas** com um clique (UC04).
- **Painel de detalhe** ao clicar numa tarefa, com:
  - **Anotação** livre (texto), salva com o botão "Salvar" (UC05).
  - **Checklist** de subitens, marcar/desmarcar e remover (UC06).
  - Editar título, etiqueta e status.
- **Busca** por tarefas em todas as listas (título, etiqueta, anotação e itens do checklist).

---

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Armazenamento (protótipo):** arquivo JSON (`data/db.json`)
- **Banco (versão final):** MongoDB + Mongoose (scaffolding em `src/models` e `src/config`)
- **Frontend:** HTML, CSS e JavaScript puro

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
│   ├── models/              # Schemas Mongoose (versão final)
│   ├── config/ middlewares/ # Conexão Mongo e autenticação (versão final)
│   ├── app.js  server.js
├── data/                    # db.json (gerado em runtime, ignorado pelo Git)
├── package.json
└── README.md
```

---

## 🔌 Endpoints da API

| Método | Rota | Caso de uso |
|--------|------|-------------|
| GET/POST | `/api/listas` | UC01 |
| PUT/DELETE | `/api/listas/:id` | UC01/UC02 |
| POST | `/api/listas/:id/tarefas` | UC01 |
| PUT | `/api/listas/:id/tarefas/:tid` | UC05 (descrição, etiqueta, status, anotação) |
| PATCH | `/api/listas/:id/tarefas/:tid/status` | UC03 |
| DELETE | `/api/listas/:id/tarefas/:tid` | UC01 |
| POST | `/api/listas/:id/tarefas/:tid/checklist` | UC06 |
| PATCH | `/api/listas/:id/tarefas/:tid/checklist/:itemId` | UC06 |
| DELETE | `/api/listas/:id/tarefas/:tid/checklist/:itemId` | UC06 |

---

## 🗺️ Próximos passos

- [x] CRUD de listas e tarefas (UC01–UC05)
- [x] Anotações e checklists por tarefa (UC06)
- [x] Busca de tarefas
- [ ] Autenticação de usuários
- [ ] Migrar armazenamento para MongoDB
- [ ] Testes automatizados e deploy

---

## 📄 Licença

Uso acadêmico (MIT).
