# Integracao com Notion

Este documento descreve a integracao futura do English Through Projects com Notion, mantendo o app seguro para hospedagem estatica.

## Arquitetura proposta

- GitHub Pages publica o HTML, CSS, JavaScript e arquivos JSON estaticos.
- Vercel hospeda uma API em `/api/ideas` ou `/api/vocabulary`.
- A API da Vercel recebe dados do formulario do app.
- A funcao da Vercel conversa com a API do Notion usando variaveis secretas.
- O Notion funciona como mural/banco real, com permissoes controladas.
- O navegador salva uma copia local quando a API estiver indisponivel.

## Por que separar frontend e backend

Tokens da API do Notion nao devem ficar no HTML, no JavaScript publico ou em arquivos JSON publicados no GitHub Pages.

O fluxo seguro e:

```text
Browser -> Vercel API -> Notion
```

Nunca:

```text
Browser -> Notion com token publico
```

## Variaveis secretas na Vercel

Configurar no painel da Vercel:

```text
NOTION_TOKEN
NOTION_DATA_SOURCE_ID
```

Essas variaveis ficam disponiveis apenas no backend da Vercel.

## Campos sugeridos no Notion

Para vocabulario:

- `Term`: titulo
- `Tag`: select ou multi-select
- `Meaning`: texto
- `Translation`: texto
- `Example`: texto
- `Source`: texto
- `Created At`: data

Para ideias ou notas:

- `Title`: titulo
- `Content`: texto
- `Category`: select
- `Created At`: data

## Fallback local

Se a API da Vercel falhar, o app deve:

- salvar a palavra ou ideia no `localStorage`;
- avisar que o conteudo foi salvo localmente;
- permitir exportacao em JSON;
- tentar sincronizar depois em uma versao futura.

## Etapas de implementacao

1. Publicar a versao estatica no GitHub Pages.
2. Criar projeto Vercel para a API.
3. Criar a base no Notion.
4. Criar uma integracao interna no Notion.
5. Compartilhar a base do Notion com essa integracao.
6. Configurar `NOTION_TOKEN` e `NOTION_DATA_SOURCE_ID` na Vercel.
7. Criar endpoint `/api/vocabulary`.
8. Atualizar o app para enviar novas palavras para a API.
9. Manter `localStorage` como fallback offline.

## Observacao

Esta integracao deve ser feita somente depois que a experiencia principal do app estiver satisfatoria. O app atual ja funciona sem backend usando JSON estatico e armazenamento local.
