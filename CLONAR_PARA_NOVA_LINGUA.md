# Clonar Para Nova Lingua

Guia para criar uma nova versao do **English Through Projects** para outro idioma, mantendo a mesma arquitetura tecnica: app estatico, PWA, Vercel, Notion, vocabulario compartilhado e fallback local.

Exemplos:

- `Spanish Through Projects`
- `French Through Projects`
- `Italian Through Projects`
- `German Through Projects`

## 1. Decisao inicial

Antes de clonar, defina:

| Item | Exemplo |
| --- | --- |
| Idioma alvo | Spanish |
| Nome do produto | Spanish Through Projects |
| Publico principal | estudantes, pesquisadores, musicos, equipe tecnica |
| Area de vocabulario | GIS, oceanografia, musica, pesquisa, programacao |
| Tom visual | academico, criativo, tecnico, musical, ambiental |
| Banco online | Notion, banco proprio futuro ou ambos |

## 2. Criar novo repositorio

Opcoes:

1. Duplicar o repositorio atual no GitHub.
2. Criar um novo repositorio vazio.
3. Copiar os arquivos do projeto atual.

Nome sugerido:

```text
spanish-through-projects
```

Depois, atualizar os links e referencias internas para o novo repositorio.

## 3. Atualizar identidade do app

Arquivos principais:

- `index.html`
- `README.md`
- `manifest.webmanifest`
- `icons/`
- `styles.css`

Trocar:

```text
English Through Projects
```

por:

```text
Spanish Through Projects
```

ou outro nome escolhido.

Pontos de atencao:

- `<title>` no `index.html`.
- Titulo principal no header.
- `name` e `short_name` no `manifest.webmanifest`.
- Nome do app no README.
- Nome dos bancos do Notion.
- URLs do GitHub Pages e Vercel.

## 4. Atualizar textos da interface

No `index.html`, revisar os textos visiveis:

- `Today's Word`
- `Today's Sentence`
- `Quick Reading`
- `Flashcards Due`
- `Music Practice`
- `My Notes`
- `Vocabulary Bank`
- `Add Word`
- `Listen`
- `Record voice`

Para um app de espanhol, por exemplo, voce pode decidir entre:

- manter a interface em ingles, se o foco for estudar espanhol via ingles;
- traduzir a interface para portugues;
- traduzir a interface para o idioma alvo.

Recomendacao: manter uma interface simples e consistente. Nao misturar muitos idiomas na navegacao principal.

## 5. Atualizar idioma de fala e reconhecimento de voz

Arquivo:

- `app.js`

Hoje o app usa ingles para fala e reconhecimento:

```js
utterance.lang = "en-US";
recognition.lang = "en-US";
```

Para outros idiomas:

| Idioma | Codigo sugerido |
| --- | --- |
| Espanhol | `es-ES` ou `es-MX` |
| Frances | `fr-FR` |
| Italiano | `it-IT` |
| Alemao | `de-DE` |
| Ingles | `en-US` |

Tambem revisar a funcao que escolhe voz:

```js
voice.lang.startsWith("en")
```

Para espanhol:

```js
voice.lang.startsWith("es")
```

## 6. Atualizar dados JSON

Arquivos:

- `data/vocabulary.json`
- `data/readings.json`
- `data/flashcards.json`
- `data/music.json`

Sugestao minima para uma nova lingua:

| Arquivo | Quantidade inicial |
| --- | ---: |
| `vocabulary.json` | 100 palavras |
| `readings.json` | 50 leituras curtas |
| `flashcards.json` | opcional, pois pode ser gerado do vocabulario |
| `music.json` | 8 a 12 estudos musicais |

Estrutura recomendada para vocabulario:

```json
{
  "term": "palavra ou expressao",
  "tag": "tema",
  "meaning": "definicao no idioma de estudo",
  "translation": "traducao ou explicacao em portugues",
  "example": "frase de exemplo"
}
```

## 7. Atualizar links de dicionario

Arquivo:

- `app.js`

Hoje o app aponta para Cambridge/Google em ingles.

Para outras linguas, revisar:

```js
cambridgeLink.href
googleLink.href
```

Opcoes:

- Cambridge Dictionary, quando tiver suporte ao idioma.
- WordReference.
- Linguee.
- Google Search.
- Dicionario academico especifico.

## 8. Atualizar layout e cores

Arquivo:

- `styles.css`

O layout pode ser reaproveitado sem quebrar a estrutura. Ajustes recomendados:

- cores principais;
- contraste claro/escuro;
- palavras de fundo;
- gradiente de titulos;
- icones e identidade visual;
- espacamento em widescreen e mobile.

Checklist visual:

- titulo cabe em uma linha em widescreen;
- cards nao ficam espremidos;
- textos tem contraste suficiente no claro e no escuro;
- abas funcionam em telas pequenas;
- tabela do Vocabulary Bank nao estoura a largura;
- PWA mantem boa aparencia quando instalado.

## 9. Atualizar PWA

Arquivos:

- `manifest.webmanifest`
- `service-worker.js`
- `icons/icon.svg`
- `icons/icon-192.png`
- `icons/icon-512.png`

Trocar:

- nome do app;
- descricao;
- cores `theme_color` e `background_color`;
- icones;
- versao do cache.

Sempre que mudar arquivos principais, atualizar o cache:

```js
const CACHE_NAME = "nome-do-app-v2";
```

Isso evita que o navegador fique preso em uma versao antiga.

## 10. Criar novos bancos no Notion

Crie dois bancos para a nova lingua:

```text
Spanish Through Projects - Vocabulary Bank
Spanish Through Projects - Daily Sentences
```

Use o modelo de:

```text
notion-template.md
```

### Vocabulary Bank

Colunas obrigatorias:

```text
Term
Tag
Meaning
Translation
Example
Source
Status
Created At
```

Atencao: nomes de colunas precisam ser exatos. Evite espacos extras, como `Meaning `.

### Daily Sentences

Colunas recomendadas:

```text
Sentence
FullText
Theme
Source
Status
Created At
```

## 11. Criar ou reutilizar integracao do Notion

Pagina:

```text
https://www.notion.so/my-integrations
```

Permissoes:

- Read content
- Insert content
- Update content

Depois, compartilhar os bancos com a integracao.

Erro comum:

```text
Could not find data_source
```

Solucao: conectar a integracao ao banco correto no Notion.

## 12. Configurar Vercel

Criar novo projeto na Vercel ou clonar o projeto existente.

Variaveis obrigatorias:

```text
NOTION_TOKEN
NOTION_DATA_SOURCE_ID
NOTION_SENTENCES_DATA_SOURCE_ID
```

Opcional:

```text
NOTION_VERSION=2026-03-11
```

Comandos:

```powershell
vercel env add NOTION_TOKEN production
vercel env add NOTION_DATA_SOURCE_ID production
vercel env add NOTION_SENTENCES_DATA_SOURCE_ID production
vercel deploy --prod
```

Importante: adicionar uma variavel por vez.

## 13. Atualizar endpoints

Arquivo:

- `app.js`

Atualizar o dominio se o novo projeto Vercel tiver outro nome:

```js
const onlineVocabularyEndpoint = window.APP_VOCABULARY_ENDPOINT || "https://novo-projeto.vercel.app/api/vocabulary";
const onlineVocabularyListEndpoint = window.APP_VOCABULARY_LIST_ENDPOINT || "https://novo-projeto.vercel.app/api/vocabulary-list";
const onlineSentenceEndpoint = window.APP_SENTENCE_ENDPOINT || "https://novo-projeto.vercel.app/api/sentence";
```

Endpoints esperados:

```text
/api/vocabulary
/api/vocabulary-list
/api/sentence
```

## 14. Testes obrigatorios

### Teste 1: app abre

```powershell
python -m http.server 8000
```

Abrir:

```text
http://localhost:8000
```

### Teste 2: JSON carrega

Verificar se:

- palavra do dia aparece;
- leitura aparece;
- musica aparece;
- flashcards aparecem.

### Teste 3: Add Word

Adicionar palavra nova e confirmar:

- aparece no app;
- aparece no Notion;
- outra aba/navegador carrega via `/api/vocabulary-list`.

### Teste 4: Today's Sentence

Salvar uma frase e confirmar:

- salva no app;
- vai para o Notion;
- nao quebra se o banco de frases ainda for pagina comum.

### Teste 5: PWA

Verificar:

- manifest acessivel;
- service worker acessivel;
- icone aparece;
- navegador oferece instalacao;
- app abre offline com a casca principal.

## 15. Erros que ja encontramos

### Variaveis da Vercel coladas juntas

Erro:

```text
Invalid number of arguments
```

Solucao: rodar um comando por vez.

### ID de pagina em vez de database

Erro:

```text
Provided database_id ... is a page, not a database.
```

Solucao: usar ID de database/tabela. O endpoint de frases tem fallback para pagina comum, mas o ideal e database.

### Coluna do Notion com espaco final

Erro:

```text
Meaning is not a property that exists.
```

Causa possivel:

```text
Meaning 
```

com espaco no final.

Solucao: renomear para:

```text
Meaning
```

### PWA segurando versao antiga

Solucao:

- atualizar `CACHE_NAME`;
- fazer refresh forte;
- fechar e abrir o app instalado.

## 16. Checklist final de clonagem

- [ ] Novo nome definido.
- [ ] Novo repositorio criado.
- [ ] `index.html` atualizado.
- [ ] `README.md` atualizado.
- [ ] `manifest.webmanifest` atualizado.
- [ ] Icones atualizados.
- [ ] `styles.css` revisado.
- [ ] Codigos de fala/reconhecimento ajustados.
- [ ] JSONs do novo idioma criados.
- [ ] Bancos do Notion criados.
- [ ] Integracao do Notion compartilhada com os bancos.
- [ ] Variaveis da Vercel configuradas.
- [ ] Endpoints atualizados.
- [ ] Deploy feito.
- [ ] Add Word testado.
- [ ] Vocabulary List testado.
- [ ] Today's Sentence testado.
- [ ] PWA testado.
- [ ] Documentacao final revisada.

## 17. Estrategia recomendada

Para cada nova lingua, mantenha:

- um repositorio proprio;
- um projeto Vercel proprio;
- bancos Notion proprios;
- conteudo JSON proprio;
- README proprio;
- guia de integracao proprio.

Isso evita misturar vocabularios, tokens, usuarios e historicos de estudo.

## 18. Conclusao

O projeto atual ja funciona como um molde reutilizavel. Para criar uma nova lingua, nao e necessario reconstruir tudo do zero: basta duplicar a estrutura, trocar identidade, conteudo, codigos de idioma, bancos Notion, endpoints e documentacao.

O ponto mais importante e manter a arquitetura segura:

```text
Browser -> Vercel API -> Notion
```

Nunca colocar token do Notion no frontend publico.

