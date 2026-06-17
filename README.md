# 📋 CRUD de Listas

> Aplicação web para **organização e gestão de tarefas**, voltada a estudantes e pequenos times. Cada usuário cria listas, adiciona tarefas com prazo, etiquetas e checklists, escreve notas formatadas e pode **compartilhar listas** com outras contas — tudo numa interface fluida, inspirada no app de Notas do iPhone.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Status](https://img.shields.io/badge/status-prot%C3%B3tipo%20funcional-blue)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)

---

## 📑 Sobre o projeto

Projeto desenvolvido para a disciplina de **Arquitetura de Software**. O objetivo é uma ferramenta de produtividade que centralize tarefas acadêmicas e pessoais, com foco em **agilidade**, **organização** e **colaboração**.

O sistema implementa um **CRUD completo** (criar, ler, atualizar e excluir) de listas e tarefas, com autenticação de usuário e compartilhamento entre contas. A arquitetura é organizada em camadas (interface, servidor e armazenamento), seguindo o princípio de **separação de responsabilidades**.

> 🔐 Tem **login com sessão salva** (você entra uma vez) e os dados são **isolados por usuário**.
> 🚧 **Status: protótipo funcional.** Roda sem banco de dados externo (armazenamento em arquivo JSON). Os _schemas_ Mongoose para a versão final já estão em [`src/models`](./src/models).

---

## ✨ Funcionalidades

**Conta e colaboração**
- Cadastro e login de usuário (senha protegida com hash SHA-256).
- Sessão salva no navegador: entra uma vez e o app lembra de você.
- Dados isolados por usuário — cada um vê só as suas listas.
- **Compartilhamento de listas:** o dono adiciona outra conta por e-mail e ambos passam a ver e editar a lista (tarefas, notas e checklists). Dono pode remover acesso; colaborador pode sair.

**Listas e tarefas**
- Criar listas por um popup, com **cor** personalizada.
- Adicionar, concluir, editar, excluir e **reordenar** (arrastar) tarefas e listas.
- **Prazo** por tarefa, com **atrasadas em vermelho** e **vence hoje** em destaque.
- **Fixar** tarefas no topo, **ocultar concluídas** e **filtrar por etiqueta**.
- **Busca** por tarefas em todas as listas.
- **Painel de progresso** com % concluído por lista.

**Notas e checklists**
- **Checklist** que expande inline ao clicar na tarefa.
- **Editor de notas formatado** na tarefa: Título, Subtítulo, Corpo, negrito, itálico e listas.

**Interface**
- Modo claro/escuro, fonte Outfit embutida (funciona offline), ícones SVG e animações suaves.
- Estado vazio com atalho para criar a primeira lista.

---

## 🚀 Como usar (passo a passo)

1. Crie uma conta na tela inicial (ou faça login).
2. Clique em **Nova lista**, dê um nome e escolha uma cor.
3. Adicione tarefas no campo central. Clique numa tarefa para abrir o **checklist** embaixo dela.
4. No ícone de **detalhes** (lápis) da tarefa, defina **prazo**, **etiqueta** e escreva uma **nota formatada**.
5. Marque tarefas como concluídas no círculo à esquerda; use **Ocultar concluídas** para limpar a visão.
6. Para colaborar, clique em **Compartilhar** numa lista sua e informe o e-mail de outra conta.

---

## 🏗️ Arquitetura

O projeto se divide em três camadas que se comunicam por uma **API REST**:

```
  Navegador (Frontend)        Servidor (Backend)            Armazenamento
  public/  HTML+CSS+JS   ⇄    src/  Node.js + Express   ⇄   data/db.json
  (a interface)               (rotas → controllers)         (a "memória")
```

Fluxo de uma ação: **o usuário clica → o frontend faz um pedido (`fetch`) a uma rota → o controller valida e processa → o `store` salva no `db.json` → o servidor responde → a tela é atualizada.**

> Uma explicação detalhada, em linguagem simples, está em [`GUIA_DO_CODIGO.md`](./GUIA_DO_CODIGO.md).

---

## 🧱 Modelo de domínio

| Entidade   | Atributos principais                                   | Papel |
|------------|--------------------------------------------------------|-------|
| `Usuario`  | id, nome, email, senha (hash)                          | Autenticação e autoria das listas. |
| `Lista`    | id, titulo, cor_hex, usuarioId, colaboradores          | Agrupador de tarefas; pertence a um usuário e pode ser compartilhado. |
| `Tarefa`   | id, descricao, status, prazo, etiqueta, anotacao, fixada | Unidade de trabalho. |
| `Etiqueta` | nome, cor                                              | Classificador das tarefas. |
| `Checklist`| itemTexto, concluido                                   | Subitens de uma tarefa. |

Relacionamentos: um `Usuario` gerencia muitas `Lista`s; uma `Lista` contém muitas `Tarefa`s; uma `Tarefa` possui itens de `Checklist` e pode ter `Etiqueta`.

---

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Frontend:** HTML, CSS e JavaScript puro (sem frameworks)
- **Armazenamento (protótipo):** arquivo JSON (`data/db.json`)
- **Banco (versão final):** MongoDB + Mongoose (scaffolding em `src/models` e `src/config`)
- **Fonte:** Outfit (embutida para uso offline)

---

## 📂 Estrutura de pastas

```
CruddeListas/
├── public/                  # Frontend
│   ├── index.html           # Estrutura das telas
│   ├── css/style.css        # Visual (tema claro/escuro)
│   ├── js/app.js            # Comportamento e chamadas à API
│   └── fonts/               # Fonte Outfit (offline)
├── src/                     # Backend
│   ├── server.js            # Inicia o servidor (porta 3000)
│   ├── app.js               # Configura Express e conecta rotas
│   ├── store.js             # Lê/grava o db.json
│   ├── routes/              # Endereços da API (auth, listas)
│   ├── controllers/         # Lógica (auth, lista, tarefa)
│   ├── models/ config/ middlewares/   # Versão final (Mongoose, auth)
├── data/db.json             # Dados (gerado em runtime, ignorado pelo Git)
├── GUIA_DO_CODIGO.md        # Explicação do código em linguagem simples
├── package.json
└── README.md
```

---

## 🔌 Principais endpoints da API

| Método | Rota | Função |
|--------|------|--------|
| POST | `/api/auth/cadastro` · `/api/auth/login` | Criar conta / autenticar |
| GET / POST | `/api/listas` | Listar / criar lista |
| PUT / DELETE | `/api/listas/:id` | Editar / excluir (ou sair) da lista |
| POST | `/api/listas/:id/compartilhar` | Compartilhar lista por e-mail |
| DELETE | `/api/listas/:id/compartilhar/:userId` | Remover colaborador |
| POST | `/api/listas/:id/tarefas` | Criar tarefa |
| PUT | `/api/listas/:id/tarefas/:tid` | Editar tarefa (descrição, status, prazo, nota…) |
| PATCH | `…/status` · `…/fixar` | Concluir/reabrir · fixar |
| DELETE | `/api/listas/:id/tarefas/:tid` | Excluir tarefa |
| POST/PATCH/DELETE | `…/checklist/…` | Itens do checklist |

> As rotas de lista/tarefa exigem o cabeçalho de sessão do usuário.

---

## ✅ Casos de uso atendidos

| Caso de uso | Status |
|---|---|
| UC01 – Manter listas (CRUD) | ✅ |
| UC02 – Categorizar por etiquetas/cores | ✅ |
| UC03 – Marcar tarefa como concluída | ✅ |
| UC04 – Ocultar tarefas finalizadas | ✅ |
| UC05 – Editar detalhes da tarefa | ✅ |
| UC06 – Gerenciar checklists | ✅ |
| Autenticação de usuário | ✅ |
| Compartilhamento de listas | ✅ |

---

## ▶️ Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install
npm start
```

Depois abra **http://localhost:3000** no navegador.

---

## 🗺️ Próximos passos

- [ ] Etiquetas como entidade com cores próprias
- [ ] Visão "Hoje" / "Atrasadas" agregando tarefas por prazo
- [ ] Migrar o armazenamento para MongoDB
- [ ] Responsividade para celular
- [ ] Testes automatizados e deploy

---

## 👥 Equipe

Projeto acadêmico da disciplina de Engenharia de Software: Projeto e Desenvolvimento. Integrantes: Augusto Feltrin, Matheus Tresguerras, Lorenzo de Oliveira e Lucas Mendes

---

## 📄 Licença

Uso acadêmico — MIT.
