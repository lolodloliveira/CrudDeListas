# Guia de Deploy (Render — grátis)

O jeito mais simples de publicar o protótipo com um link público é pelo **Render** (plano gratuito). Como o projeto é Node.js, o deploy é direto a partir do GitHub.

## Passos

1. Acesse https://render.com e crie uma conta (pode entrar com o GitHub).
2. Clique em **New +** → **Web Service**.
3. Conecte sua conta do GitHub e escolha o repositório **CrudDeListas**.
4. Preencha:
   - **Name:** crud-de-listas (ou o que preferir)
   - **Region:** a mais próxima (ex.: Ohio/Oregon)
   - **Branch:** main
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Clique em **Create Web Service**. Em alguns minutos o Render gera um link público (ex.: `https://crud-de-listas.onrender.com`).

## Observações importantes

- **Porta:** o app já usa `process.env.PORT`, então funciona no Render sem ajuste.
- **Dados:** no plano gratuito, o sistema de arquivos é **efêmero** — o `data/db.json` é recriado quando o serviço reinicia (contas/listas se perdem). Isso é esperado para um protótipo. A solução definitiva é a **migração para o MongoDB** (MongoDB Atlas tem plano grátis), prevista na Sprint 4.
- **Primeiro acesso lento:** no plano free, o serviço "dorme" após inatividade e leva alguns segundos para acordar no primeiro acesso.

## Alternativa: Railway

O processo é parecido no https://railway.app — novo projeto a partir do GitHub, ele detecta Node e usa `npm start`.
