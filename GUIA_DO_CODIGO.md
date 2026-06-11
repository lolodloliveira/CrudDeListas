# Guia do Código — CRUD de Listas

Este guia explica, em linguagem simples, como o projeto funciona por dentro. A ideia é que, lendo isto, você consiga **entender e defender o código** numa apresentação. Leia com calma — não precisa decorar, precisa entender a lógica.

---

## 1. A ideia geral (a parte mais importante)

O sistema tem **três partes** que conversam entre si:

1. **Frontend (a "cara" do site)** — o que aparece no navegador: as listas, os botões, as cores. Fica na pasta `public`.
2. **Backend (o "cérebro")** — um servidor feito em Node.js que recebe pedidos do frontend, decide o que fazer e responde. Fica na pasta `src`.
3. **Armazenamento (a "memória")** — onde os dados ficam salvos. Aqui é um arquivo chamado `data/db.json` (um arquivo de texto que guarda tudo em formato JSON).

> **Analogia do restaurante:** o **frontend** é o salão e o cardápio (o cliente vê e pede). O **backend** é a cozinha (recebe o pedido e prepara). O **armazenamento** é a despensa (onde ficam os ingredientes/dados). O cliente nunca entra na cozinha — ele só faz pedidos e recebe pratos. É exatamente assim que o navegador conversa com o servidor.

---

## 2. As tecnologias (e por que usamos)

- **Node.js** — permite rodar JavaScript fora do navegador, no "servidor". É o que faz o backend funcionar.
- **Express** — uma biblioteca do Node que facilita criar um servidor e definir as "rotas" (os endereços que o frontend chama). Sem ele, daria muito mais trabalho.
- **HTML / CSS / JavaScript** — o frontend. HTML é a estrutura (os elementos), CSS é o visual (cores, espaçamento, fonte), e JavaScript é o comportamento (o que acontece ao clicar).
- **JSON** — um formato de texto pra guardar dados organizados (parecido com uma ficha). Usamos pra salvar tudo no arquivo `db.json`.
- **API REST** — é o "idioma" que o frontend e o backend usam pra conversar, através de endereços (rotas) e métodos (GET, POST, PUT, DELETE). Mais sobre isso na seção 5.

> No protótipo usamos um **arquivo JSON** como banco de dados pra facilitar (roda sem instalar nada). Na versão final, a ideia é trocar por **MongoDB** — por isso existe a pasta `src/models` com os "moldes" (schemas) prontos pra esse passo.

---

## 3. Estrutura de pastas (o que cada arquivo faz)

```
CruddeListas/
├── public/                  → FRONTEND (o que o navegador mostra)
│   ├── index.html           → a estrutura da página (telas, botões, campos)
│   ├── css/style.css        → todo o visual (cores, fonte, tema claro/escuro)
│   ├── js/app.js            → o comportamento (cliques, telas, chamadas ao servidor)
│   └── fonts/               → a fonte Outfit (embutida, funciona offline)
│
├── src/                     → BACKEND (o servidor)
│   ├── server.js            → liga o servidor na porta 3000
│   ├── app.js               → configura o Express e conecta as rotas
│   ├── store.js             → lê e grava no arquivo db.json (a "memória")
│   ├── routes/              → define os endereços da API (quem chama o quê)
│   │   ├── authRoutes.js    → rotas de login e cadastro
│   │   └── listaRoutes.js   → rotas de listas, tarefas e checklist
│   ├── controllers/         → a LÓGICA de cada ação
│   │   ├── authController.js → cadastrar e autenticar usuário
│   │   ├── listaController.js → criar/editar/excluir/compartilhar listas
│   │   └── tarefaController.js → criar/concluir/editar tarefas e checklist
│   ├── models/              → "moldes" das entidades (para a versão com MongoDB)
│   ├── config/              → configuração de conexão com banco (versão final)
│   └── middlewares/         → código que roda "no meio" do caminho (ex.: autenticação)
│
├── data/db.json             → onde os dados ficam salvos (criado ao rodar)
├── package.json             → nome, versão e dependências do projeto (ex.: express)
└── README.md                → apresentação do projeto
```

**A divisão importante de entender:** as **rotas** dizem QUAL endereço existe; os **controllers** dizem O QUE acontece quando aquele endereço é chamado; o **store** é quem realmente LÊ e GRAVA os dados. Essa separação (rotas → controllers → dados) é uma boa prática de organização chamada **separação de responsabilidades**.

---

## 4. O fluxo: o que acontece quando você usa o app

### Exemplo A — Adicionar uma tarefa

1. Você digita a tarefa e aperta "Adicionar". Isso dispara uma função no **`public/js/app.js`** (o frontend).
2. O frontend faz um **pedido** (`fetch`) pro endereço `POST /api/listas/ID/tarefas`, levando junto a descrição e quem é o usuário (no cabeçalho da sessão).
3. O **Express** (`src/app.js`) recebe e, pela rota em `listaRoutes.js`, manda pro método `criar` do **`tarefaController.js`**.
4. O controller confere se está tudo certo (a lista existe? é do usuário?), monta a nova tarefa e pede pro **`store.js`** salvar no `db.json`.
5. O controller responde pro frontend com a tarefa criada (em JSON).
6. O frontend recebe a resposta e **redesenha a tela** com a nova tarefa aparecendo. Pronto.

> É o famoso ciclo **pedido → processa → salva → responde → atualiza a tela**. Quase tudo no app segue esse mesmo caminho — muda só o endereço e a lógica.

### Exemplo B — Fazer login (sessão salva)

1. Você digita e-mail e senha e clica "Entrar". O frontend chama `POST /api/auth/login`.
2. O **`authController.js`** procura o usuário pelo e-mail e compara a senha (guardada com **hash**, ou seja, embaralhada — nunca em texto puro).
3. Se bate, responde com os dados do usuário. O frontend **guarda isso no navegador** (no `localStorage`), por isso você não precisa logar de novo toda vez.
4. A partir daí, todo pedido manda o "id do usuário" no cabeçalho, e o servidor só devolve as listas **daquele** usuário.

---

## 5. Conceitos-chave (o que você deve saber explicar)

- **CRUD** — as 4 operações básicas com dados: **C**reate (criar), **R**ead (ler), **U**pdate (atualizar), **D**elete (excluir). O nome do projeto vem daí. Cada uma vira um método e uma rota.

- **API REST e os métodos HTTP** — a forma de conversar com o servidor. Cada ação usa um "verbo":
  - **GET** = buscar/ler (ex.: pegar as listas)
  - **POST** = criar (ex.: nova tarefa)
  - **PUT/PATCH** = atualizar (ex.: editar, marcar como concluída)
  - **DELETE** = excluir

- **Rota (endpoint)** — um endereço da API, como `/api/listas`. O arquivo `listaRoutes.js` lista todos.

- **Controller** — a função que executa a ação de uma rota. Fica em `src/controllers`.

- **Middleware** — um código que roda "no meio do caminho", antes do controller. No nosso caso, o `exigirUsuario` (no `src/app.js`) confere se o pedido tem um usuário logado antes de deixar mexer nas listas.

- **Sessão / `localStorage`** — o navegador guarda quem está logado, então o login "fica salvo".

- **Hash de senha** — a senha não é salva como você digitou; ela é transformada numa sequência embaralhada (SHA-256). Assim, mesmo abrindo o `db.json`, ninguém vê a senha real.

- **Compartilhamento** — cada lista tem um **dono** (`usuarioId`) e uma lista de **colaboradores**. O servidor só deixa ver/editar quem é dono OU colaborador. É assim que duas contas mexem na mesma lista.

---

## 6. Ligação com os diagramas do trabalho

- **Casos de uso (UC01–UC06):** cada um virou rotas + lógica. Ex.: UC01 (CRUD de listas) = rotas GET/POST/PUT/DELETE em `listaRoutes.js`. UC06 (checklists) = as rotas `.../checklist/...`.
- **Diagrama de classes (entidades):** `Usuario`, `Lista`, `Tarefa`, `Etiqueta`, `Checklist` aparecem como os dados salvos no `db.json` e como os "moldes" em `src/models`. Métodos do diagrama viraram funções: `autenticar()`→login, `cadastrar()`→cadastro, `compartilhar()`→compartilhamento, `concluir()`→marcar concluída.
- **Diagrama de sequência:** é exatamente o fluxo da seção 4 (Usuário → Interface → Controller → Banco → volta).

---

## 7. Se o professor perguntar... (respostas curtas)

- **"Onde os dados ficam salvos?"** → Num arquivo JSON (`data/db.json`), lido e gravado pelo `store.js`. Na versão final iria pro MongoDB.
- **"Como o frontend conversa com o backend?"** → Por uma API REST: o frontend faz pedidos `fetch` para rotas (ex.: `POST /api/listas`), e o servidor responde em JSON.
- **"O que essa função faz?"** → Diga o caminho: a rota X chama o método Y do controller Z, que valida e usa o `store` pra salvar. (Veja a seção 4.)
- **"Como funciona o login?"** → Senha guardada com hash; ao logar, o usuário fica salvo no navegador (localStorage); cada pedido manda o id do usuário, e o servidor isola os dados por usuário.
- **"Por que separou em rotas, controllers e store?"** → Organização (separação de responsabilidades): fica mais fácil achar, testar e manter o código.
- **"O que é o Express?"** → Uma biblioteca do Node.js que facilita criar o servidor e definir as rotas.
- **"E se dois usuários editam a mesma lista?"** → A lista tem dono e colaboradores; ambos têm acesso, e tudo é salvo no mesmo lugar, então um vê o que o outro faz ao recarregar.

---

## 8. Mini-glossário

- **Servidor:** programa que fica "escutando" pedidos e respondendo (o nosso roda em `localhost:3000`).
- **localhost:3000:** o endereço do seu próprio computador, na porta 3000, onde o app abre.
- **Requisição (request):** o pedido que o navegador faz ao servidor.
- **Resposta (response):** o que o servidor devolve (geralmente em JSON).
- **JSON:** formato de texto pra organizar dados (`{ "nome": "Faculdade" }`).
- **Dependência:** uma biblioteca externa que o projeto usa (ex.: o `express`), listada no `package.json`.

---

### Dica final para a apresentação

Se travar numa pergunta, volte sempre para a **seção 1** (as 3 partes) e a **seção 4** (o fluxo). Quase toda pergunta sobre o código se responde explicando esse caminho: *"o usuário clica → o frontend faz um pedido → o servidor processa e salva → responde → a tela atualiza"*. Dominando isso, você defende o projeto com tranquilidade.
