# Integracao com Notion e Vercel

Este documento descreve a integracao do English Through Projects com Notion usando uma API segura hospedada na Vercel.

## Arquitetura proposta

- GitHub Pages publica o HTML, CSS, JavaScript e arquivos JSON estaticos.
- Vercel hospeda uma API em `/api/vocabulary`.
- A API da Vercel recebe novas palavras criadas no app.
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

## Endpoint planejado

```text
https://english-through-projects.vercel.app/api/vocabulary
```

O app tenta enviar novas palavras para esse endpoint. Se ele ainda nao estiver configurado, a palavra continua salva localmente no navegador.

## Variaveis secretas na Vercel

Configurar no painel da Vercel:

```text
NOTION_TOKEN
NOTION_DATA_SOURCE_ID
```

Essas variaveis ficam disponiveis apenas no backend da Vercel.

Opcional:

```text
NOTION_VERSION=2026-03-11
```

## Campos sugeridos no Notion

Para vocabulario, crie um banco seguindo `notion-template.md`.

- `Term`: titulo
- `Tag`: select
- `Meaning`: texto
- `Translation`: texto
- `Example`: texto
- `Source`: select com `App`, `Import`, `Manual`
- `Status`: select com `New`, `Reviewed`, `Needs review`
- `Created At`: created time

## Fallback local

Se a API da Vercel falhar, o app:

- salva a palavra no `localStorage`;
- registra uma copia em `pendingSyncWords`;
- avisa que a sincronizacao online ficou pendente;
- permitir exportacao em JSON;
- pode tentar sincronizar depois em uma versao futura.

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

## Criar a integracao interna do Notion

1. Acesse <https://www.notion.so/my-integrations>.
2. Crie uma nova integracao interna.
3. Nome sugerido: `English Through Projects`.
4. Copie o token secreto.
5. Habilite capacidades de conteudo:
   - Read content
   - Insert content
   - Update content

Nunca coloque esse token no GitHub, no HTML ou no JavaScript publico.

## Permissao no Notion

Depois de criar o banco:

1. Abra o banco no Notion.
2. Use o menu de conexoes/compartilhamento.
3. Convide a integracao `English Through Projects`.
4. Garanta permissao para editar o banco.

Se a API responder `Could not find data_source`, quase sempre significa que a integracao nao foi compartilhada com o banco correto.

## Testes rapidos

GET deve responder `405 Method Not Allowed`:

```powershell
curl.exe -i https://english-through-projects.vercel.app/api/vocabulary
```

OPTIONS deve responder `204 No Content`:

```powershell
curl.exe -i -X OPTIONS https://english-through-projects.vercel.app/api/vocabulary -H "Origin: https://caetanoronan.github.io" -H "Access-Control-Request-Method: POST"
```

POST real:

```powershell
$body = @{
  term='coastline'
  tag='Coastal GIS'
  meaning='The outline or shape of a coast.'
  translation='linha de costa'
  example='The coastline changed after the storm.'
} | ConvertTo-Json

Invoke-WebRequest -Uri 'https://english-through-projects.vercel.app/api/vocabulary' -Method POST -Headers @{ Origin='https://caetanoronan.github.io' } -ContentType 'application/json' -Body $body
```

## Observacao

O app continua funcionando sem backend usando JSON estatico e armazenamento local. A integracao com Notion melhora persistencia e revisao, mas nao bloqueia o uso diario.
