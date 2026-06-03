# CRUD de Listas

Aplicação web para **gerenciamento de listas de tarefas**, permitindo que usuários criem listas, organizem tarefas por etiquetas e cores, marquem itens como concluídos e acompanhem o progresso por meio de checklists.

> Projeto acadêmico de Arquitetura de Software. Documentação de base (proposta, jornada do usuário, DAS e team charter) disponível em [`/docs`](./docs).

---

## 📋 Escopo

O sistema oferece um CRUD completo de listas e tarefas, com os seguintes recursos principais:

- **Gerenciar listas (CRUD):** criar, visualizar, editar e excluir listas de tarefas.
- **Categorizar por etiquetas/cores:** organizar listas e tarefas com cores e tags para filtragem rápida.
- **Marcar tarefa como concluída:** alterar o status de uma tarefa entre pendente e concluída.
- **Ocultar tarefas finalizadas:** filtrar a tela principal para exibir apenas tarefas pendentes.
- **Editar detalhes da tarefa:** alterar título, descrição, prazo e status.
- **Gerenciar checklists:** dividir tarefas complexas em subitens e acompanhar o progresso.

Toda interação exige **usuário autenticado**, garantindo que cada pessoa tenha seu próprio espaço de trabalho.

### Personas

| Persona  | Necessidade principal |
|----------|------------------------|
| Vinícius | Organização pessoal com categorização por cores/etiquetas e ocultação de concluídas. |
| Fernanda | Monitoria de tarefas complexas, com edição detalhada e checklists. |

---

## 🧱 Modelo de domínio

| Entidade   | Atributos                                   | Responsabilidade |
|------------|---------------------------------------------|------------------|
| `Usuario`  | id, nome, email, senha                      | Autenticação e autoria das listas. |
| `Lista`    | id, titulo, cor_hex, dataCriacao            | Agrupador principal de tarefas. |
| `Tarefa`   | id, descricao, dataPrazo, status            | Unidade de trabalho do CRUD. |
| `Etiqueta` | id, nome, cor                               | Classificador transversal (tags). |
| `Checklist`| id, itemTexto, concluido                    | Subitens de uma tarefa. |

**Relacionamentos:** um `Usuario` gerencia muitas `Lista`s; uma `Lista` contém muitas `Tarefa`s; uma `Tarefa` possui itens de `Checklist` e pode ser classificada por `Etiqueta`s.

---

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Banco de dados:** MongoDB (via Mongoose)
- **Frontend:** HTML, CSS e JavaScript (interface web)
- **Autenticação:** JWT (JSON Web Tokens)
- **Variáveis de ambiente:** dotenv
- **Testes:** Jest (sugerido)

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) 18 LTS ou superior
- [npm](https://www.npmjs.com/) 9+ (vem com o Node)
- [MongoDB](https://www.mongodb.com/) 6+ rodando localmente, ou uma string de conexão do [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação e execução local

```bash
# 1. Clone o repositório
git clone https://github.com/<seu-usuario>/crud-de-listas.git
cd crud-de-listas

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com a sua string de conexão do MongoDB e o segredo do JWT

# 4. Rode o servidor em modo de desenvolvimento
npm run dev

# ou em modo de produção
npm start
```

Por padrão a aplicação sobe em `http://localhost:3000`.

---

## 📂 Estrutura de diretórios

```
crud-de-listas/
├── public/                  # Frontend (interface web servida estaticamente)
│   ├── index.html
│   ├── css/
│   └── js/
├── src/                     # Código do backend
│   ├── config/              # Conexão com o banco e configs
│   │   └── database.js
│   ├── models/              # Schemas Mongoose (entidades do domínio)
│   │   ├── Usuario.js
│   │   ├── Lista.js
│   │   ├── Tarefa.js
│   │   ├── Etiqueta.js
│   │   └── Checklist.js
│   ├── controllers/         # Regras de aplicação (UC01–UC06)
│   ├── routes/              # Definição das rotas/endpoints da API
│   ├── middlewares/         # Autenticação e tratamento de erros
│   ├── services/            # Regras de negócio reutilizáveis
│   ├── app.js               # Configuração do Express
│   └── server.js            # Ponto de entrada
├── tests/                   # Testes automatizados
├── docs/                    # Documentação do projeto (proposta, DAS, etc.)
├── .env.example             # Modelo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## 🔌 Endpoints previstos (rascunho)

| Método | Rota                    | Caso de uso | Descrição |
|--------|-------------------------|-------------|-----------|
| POST   | `/api/auth/login`       | —           | Autenticar usuário. |
| GET    | `/api/listas`           | UC01        | Listar listas do usuário. |
| POST   | `/api/listas`           | UC01        | Criar lista. |
| PUT    | `/api/listas/:id`       | UC01/UC02   | Editar/categorizar lista. |
| DELETE | `/api/listas/:id`       | UC01        | Excluir lista. |
| POST   | `/api/listas/:id/tarefas` | UC01      | Adicionar tarefa à lista. |
| PUT    | `/api/tarefas/:id`      | UC05        | Editar detalhes da tarefa. |
| PATCH  | `/api/tarefas/:id/concluir` | UC03    | Marcar tarefa como concluída. |
| POST   | `/api/tarefas/:id/checklist` | UC06   | Gerenciar checklist da tarefa. |

> Tabela ilustrativa — ajuste conforme a implementação evoluir.

---

## 🗺️ Roadmap (sprints)

- [x] Levantamento de requisitos e jornada do usuário (Sprint 1)
- [ ] Modelagem do banco e configuração da base do projeto
- [ ] CRUD de listas (UC01)
- [ ] Categorização por etiquetas/cores (UC02)
- [ ] Conclusão e ocultação de tarefas (UC03/UC04)
- [ ] Edição de tarefas e checklists (UC05/UC06)
- [ ] Autenticação de usuários
- [ ] Testes e deploy

---

## 👥 Equipe

Projeto desenvolvido para a disciplina de Arquitetura de Software. Consulte o Team Charter em [`/docs`](./docs) para papéis e acordos da equipe.

---

## 📄 Licença

Uso acadêmico. Defina uma licença (ex.: MIT) caso o repositório seja público.
