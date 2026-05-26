# Integracao com Notion e Vercel

Este documento descreve a integracao do English Through Projects com Notion usando uma API segura hospedada na Vercel.

## Arquitetura proposta

- GitHub Pages publica o HTML, CSS, JavaScript e arquivos JSON estaticos.
- Vercel hospeda APIs em `/api/vocabulary`, `/api/vocabulary-list`, `/api/sentence` e `/api/notes`.
- A API da Vercel recebe novas palavras, frases, notas e estudos musicais criados no app.
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

## Endpoints

```text
https://english-through-projects.vercel.app/api/vocabulary
https://english-through-projects.vercel.app/api/vocabulary-list
https://english-through-projects.vercel.app/api/sentence
https://english-through-projects.vercel.app/api/notes
```

Se o projeto na Vercel tiver outro nome de dominio, defina o endpoint antes de carregar `app.js`:

```html
<script>
  window.APP_VOCABULARY_ENDPOINT = "https://seu-projeto.vercel.app/api/vocabulary";
  window.APP_VOCABULARY_LIST_ENDPOINT = "https://seu-projeto.vercel.app/api/vocabulary-list";
  window.APP_SENTENCE_ENDPOINT = "https://seu-projeto.vercel.app/api/sentence";
  window.APP_NOTES_ENDPOINT = "https://seu-projeto.vercel.app/api/notes";
</script>
```

O app tenta enviar novas palavras, a frase diaria, notas gerais e estudos musicais para esses endpoints. Ao abrir, tambem busca palavras compartilhadas no Notion via `/api/vocabulary-list`. Se algum endpoint ainda nao estiver configurado, o conteudo continua salvo localmente no navegador.

## Variaveis secretas na Vercel

Configurar no painel da Vercel:

```text
NOTION_TOKEN
NOTION_DATA_SOURCE_ID
NOTION_SENTENCES_DATA_SOURCE_ID
NOTION_NOTES_DATA_SOURCE_ID
```

Essas variaveis ficam disponiveis apenas no backend da Vercel.

Opcional:

```text
NOTION_VERSION=2026-03-11
```

## Antes de configurar a Vercel

A integracao nao consegue criar o banco do zero. Voce precisa primeiro criar o database no Notion e compartilhar esse database com a integracao interna.

Checklist rapido:

1. Criar os databases no Notion usando o modelo de [notion-template.md](notion-template.md).
2. No banco de vocabulario, garantir as propriedades `Term`, `Tag`, `Meaning`, `Translation`, `Example`, `Source` e `Status`.
3. No banco de frases, garantir as propriedades `Sentence`, `FullText`, `Theme`, `Source` e `Status`.
4. No banco de notas, garantir as propriedades `Title`, `Note`, `Category`, `Link`, `Audio Link`, `Source`, `Status` e `Created Date`.
5. Compartilhar os databases com a integracao interna do Notion.
6. Copiar o ID do banco de vocabulario para `NOTION_DATA_SOURCE_ID`.
7. Copiar o ID do banco de frases para `NOTION_SENTENCES_DATA_SOURCE_ID`.
8. Copiar o ID do banco de notas para `NOTION_NOTES_DATA_SOURCE_ID`.
9. Configurar `NOTION_TOKEN`, `NOTION_DATA_SOURCE_ID`, `NOTION_SENTENCES_DATA_SOURCE_ID` e `NOTION_NOTES_DATA_SOURCE_ID` na Vercel.

Observacao: se `NOTION_SENTENCES_DATA_SOURCE_ID` receber o ID de uma pagina comum, o backend tenta salvar a frase como subpagina. Para ter tabela atualizando automaticamente, use o ID de um database/tabela.

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

Para frases diarias, crie outro banco seguindo `notion-template.md`.

- `Sentence`: titulo
- `FullText`: texto
- `Theme`: select
- `Source`: select com `App`, `Manual`
- `Status`: select com `New`, `Reviewed`, `Needs review`
- `Created At`: created time

Para notas e estudos musicais, crie outro banco seguindo `notion-template.md`.

- `Title`: titulo
- `Note`: texto
- `Category`: select com `General`, `Music`, `Lyrics`, `Project`, `Vocabulary`
- `Link`: URL para letra, fonte ou estudo
- `Audio Link`: URL para audio ou video
- `Source`: select com `App`, `Manual`
- `Status`: select com `New`, `Reviewed`
- `Created Date`: date

## Fallback local

Se a API da Vercel falhar, o app:

- salva palavra, frase, nota ou musica no `localStorage`;
- registra uma copia em `pendingSyncWords`, `pendingSyncSentences` ou `pendingSyncNotes`;
- avisa que a sincronizacao online ficou pendente;
- permitir exportacao em JSON;
- pode tentar sincronizar depois em uma versao futura.

## Etapas de implementacao

1. Publicar a versao estatica no GitHub Pages.
2. Criar projeto Vercel para a API.
3. Criar as bases no Notion.
4. Criar uma integracao interna no Notion.
5. Compartilhar as bases do Notion com essa integracao.
6. Configurar `NOTION_TOKEN`, `NOTION_DATA_SOURCE_ID`, `NOTION_SENTENCES_DATA_SOURCE_ID` e `NOTION_NOTES_DATA_SOURCE_ID` na Vercel.
7. Criar endpoints `/api/vocabulary`, `/api/vocabulary-list`, `/api/sentence` e `/api/notes`.
8. Atualizar o app para enviar novas palavras, frases, notas e musicas para a API, alem de carregar palavras compartilhadas do Notion.
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

Se a API responder `Could not find data_source`, quase sempre significa que a integracao nao foi compartilhada com o banco correto ou que o ID configurado na Vercel pertence a outra pagina.

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

GET real para carregar vocabulario compartilhado:

```powershell
Invoke-WebRequest -Uri 'https://english-through-projects.vercel.app/api/vocabulary-list' -Headers @{ Origin='https://caetanoronan.github.io' }
```

POST real para `Today's Sentence`:

```powershell
$body = @{
  text='Today I mapped the coastline and reviewed one English sentence.'
  theme='Daily Practice'
} | ConvertTo-Json

Invoke-WebRequest -Uri 'https://english-through-projects.vercel.app/api/sentence' -Method POST -Headers @{ Origin='https://caetanoronan.github.io' } -ContentType 'application/json' -Body $body
```

## Dificuldades encontradas e solucoes

### 1. Variaveis da Vercel precisam ser criadas uma por vez

O comando da Vercel exige uma variavel por chamada. Se dois comandos forem colados juntos, a CLI responde com erro de argumentos.

Correto:

```powershell
vercel env rm NOTION_DATA_SOURCE_ID production
vercel env add NOTION_TOKEN production
vercel env add NOTION_DATA_SOURCE_ID production
vercel env add NOTION_SENTENCES_DATA_SOURCE_ID production
vercel env add NOTION_NOTES_DATA_SOURCE_ID production
vercel deploy --prod
```

### 2. O token do Notion nao deve ir para o frontend

O token fica apenas na Vercel como `NOTION_TOKEN`. O HTML e o JavaScript publico chamam somente a API da Vercel.

### 3. O Notion precisa compartilhar o banco com a integracao

Mesmo com token correto, a API falha se o banco nao estiver conectado a integracao `English Through Projects`.

Erro comum:

```text
Could not find data_source
```

Solucao: abrir o banco no Notion, adicionar a conexao e permitir leitura/insercao/edicao.

### 4. ID de pagina comum nao e igual a ID de database

Na integracao de `Today's Sentence`, usamos inicialmente o ID de uma pagina comum. O Notion respondeu:

```text
Provided database_id ... is a page, not a database.
```

Solucao aplicada: o endpoint `/api/sentence` tenta salvar em tabela/database. Se receber uma pagina comum, salva a frase como subpagina. Para linhas com propriedades, use o ID de uma tabela/database real.

### 5. Colunas do Notion precisam ter nomes exatos

No `Vocabulary Bank`, a exportacao revelou uma coluna chamada `Meaning ` com espaco no final. Para a API, `Meaning ` e diferente de `Meaning`.

Erro visto:

```text
Meaning is not a property that exists.
```

Solucoes:

- renomear a coluna no Notion para `Meaning`, sem espaco final;
- manter `Example` e `Source` criadas;
- o backend agora tambem tenta salvar a palavra mesmo se alguma coluna estiver ausente.

### 6. Teste real do vocabulario

Teste validado:

```text
Term: sediment plume
Tag: Coastal Oceanography
Meaning: A visible cloud of suspended sediment carried by water into a coastal area.
Translation: pluma de sedimentos
Example: The satellite image showed a sediment plume near the river mouth.
```

Resultado esperado:

```text
201 OK
```

### 7. Teste real da frase diaria

Teste validado:

```text
Today I connected my daily English sentence to Notion.
```

Resultado esperado:

```text
201 OK
```

## Observacao

O app continua funcionando sem backend usando JSON estatico e armazenamento local. A integracao com Notion melhora persistencia e revisao, mas nao bloqueia o uso diario.
