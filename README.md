# CRUD de Listas

Aplicação web para **gerenciamento de listas de tarefas**: criar listas, organizar tarefas por etiquetas e cores, marcar itens como concluídos, ocultar finalizados e acompanhar o progresso.

> 🚧 **Status: protótipo funcional.** Esta versão roda sem banco de dados externo (armazenamento em arquivo JSON) para facilitar a demonstração. Os models Mongoose para a versão final já estão no repositório em [`src/models`](./src/models).

---

## ▶️ Como rodar o protótipo (sem instalar banco)

Pré-requisito: ter o [Node.js](https://nodejs.org/) 18+ instalado.

```bash
npm install
npm start
```

Depois abra **http://localhost:3000** no navegador. Os dados ficam em `data/db.json` (criado automaticamente, já com exemplos para a apresentação).

---

## 📋 Escopo e casos de uso

- **UC01 – Manter listas (CRUD):** criar, visualizar, editar e excluir listas.
- **UC02 – Categorizar por cor/etiqueta:** cor por lista e etiqueta por tarefa.
- **UC03 – Marcar como concluída:** alternar status pendente/concluída.
- **UC04 – Ocultar concluídas:** filtro que mostra só as tarefas pendentes.
- **UC05 – Editar detalhes da tarefa:** alterar descrição, etiqueta e status.
- **UC06 – Checklists:** (planejado para a próxima etapa).

### O que já funciona neste protótipo

Criar/excluir listas com cor, adicionar tarefas com etiqueta, marcar/desmarcar como concluída, ocultar concluídas e excluir tarefas — tudo persistido em arquivo. Autenticação de usuário fica para a versão final.

---

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Armazenamento (protótipo):** arquivo JSON (`data/db.json`)
- **Banco (versão final):** MongoDB + Mongoose (scaffolding em `src/models` e `src/config`)
- **Frontend:** HTML, CSS e JavaScript puro

---

## 📂 Estrutura de diretórios

```
crud-de-listas/
├── public/                  # Frontend (servido estaticamente)
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── src/
│   ├── store.js             # Armazenamento JSON (protótipo)
│   ├── controllers/         # Regras dos casos de uso (UC01–UC05)
│   ├── routes/              # Endpoints da API
│   ├── models/              # Schemas Mongoose (versão final)
│   ├── config/              # Conexão MongoDB (versão final)
│   ├── middlewares/         # Autenticação (versão final)
│   ├── app.js               # Configuração do Express
│   └── server.js            # Ponto de entrada
├── data/                    # db.json (gerado em runtime, ignorado pelo Git)
├── package.json
└── README.md
```

---

## 🔌 Endpoints da API

| Método | Rota                                         | Caso de uso |
|--------|----------------------------------------------|-------------|
| GET    | `/api/listas`                                | UC01 |
| POST   | `/api/listas`                                | UC01 |
| PUT    | `/api/listas/:id`                            | UC01/UC02 |
| DELETE | `/api/listas/:id`                            | UC01 |
| POST   | `/api/listas/:id/tarefas`                    | UC01 |
| PUT    | `/api/listas/:id/tarefas/:tid`               | UC05 |
| PATCH  | `/api/listas/:id/tarefas/:tid/status`        | UC03 |
| DELETE | `/api/listas/:id/tarefas/:tid`               | UC01 |

---

## 🗺️ Próximos passos

- [x] Protótipo funcional (UC01–UC05) com armazenamento em arquivo
- [ ] Checklists nas tarefas (UC06)
- [ ] Autenticação de usuários
- [ ] Migrar armazenamento para MongoDB (Mongoose)
- [ ] Testes automatizados e deploy

---

## 📄 Licença

Uso acadêmico (MIT).
