# English Through Projects

Um MVP em HTML, CSS e JavaScript para praticar ingles com baixo atrito, usando projetos reais como fonte de vocabulario, leitura, escuta e escrita.

## Ideia central

O app transforma a rotina em pequenas doses de imersao:

- Today's Word
- Today's Sentence
- Quick Reading
- Flashcards Due
- Music Practice
- My Notes

## Dados

O conteudo base fica separado em arquivos JSON:

- `data/vocabulary.json`
- `data/readings.json`
- `data/flashcards.json`
- `data/music.json`

As palavras adicionadas pelo botao `Add Word`, a frase escrita em `Today's Sentence`, notas gerais e estudos musicais ficam salvos no `localStorage` do navegador. Quando a Vercel e o Notion estao configurados, esses registros tambem podem ser enviados para bancos online protegidos.

## Recursos atuais

- Vocabulario expandido por temas: programacao, GitHub, GIS, oceanografia, biologia marinha, pesquisa academica e musica.
- Base inicial com 100 palavras e 50 leituras curtas.
- Botao `Add Word` para adicionar palavras pessoais.
- Exportacao e importacao do vocabulario pessoal em JSON.
- Aba `Vocabulary Bank` com busca, filtro por tema e tabela de referencia do vocabulario.
- Links no `Vocabulary Bank` para abrir o banco Notion, pesquisar no Cambridge Dictionary e buscar no Google.
- Flashcards gerados automaticamente a partir do `Vocabulary Bank`.
- Sugestao simples de correcao comparando a palavra digitada com o vocabulario existente.
- Leitura em voz alta com a Web Speech API do navegador.
- Aba Music com song study cards, versos originais, links de estudo, links para ouvir e cadastro de novas musicas.
- O campo `Useful vocabulary` da musica tambem cria palavras no `Vocabulary Bank`.
- Aba Reading com `Listen` e `Record voice` para comparar sua fala com o texto.
- Layout responsivo com grids fluidos, tema claro/escuro e titulos com gradiente colorido.
- Fundo visual inspirado nos temas do projeto: ingles, codigo, GIS, oceano, musica e pesquisa.
- Integracao preparada com Vercel `/api/vocabulary`, `/api/sentence`, `/api/notes`, `/api/music-list` e Notion, mantendo fallback local.

## Integracoes ativas

- GitHub: repositorio versionado em `caetanoronan/english-through-projects`.
- GitHub Pages: publicacao estatica do app.
- Vercel: backend seguro para receber dados do app.
- Notion: banco online para `Vocabulary Bank`, registros de `Today's Sentence` e `My Notes`.
- Web Speech API: leitura em voz alta e pratica de escuta/fala no navegador.
- PWA: manifest, icones e service worker para instalacao e abertura offline do app shell.
- Cambridge Dictionary e Google: links externos de apoio para pesquisar palavras fora do vocabulario local.

## Estado validado

- `Add Word` sincroniza com o Notion via `/api/vocabulary`.
- O app carrega palavras compartilhadas do Notion via `/api/vocabulary-list`.
- `Today's Sentence` sincroniza com o Notion via `/api/sentence`.
- `My Notes` e estudos musicais sincronizam com o Notion via `/api/notes` quando `NOTION_NOTES_DATA_SOURCE_ID` esta configurado.
- A aba Music carrega estudos musicais compartilhados do Notion via `/api/music-list`.
- Se a API falhar, o app preserva dados no navegador usando `localStorage`.
- O app pode ser instalado como PWA em navegadores compativeis.
- O endpoint de vocabulario tolera colunas ausentes no Notion e salva os detalhes no corpo da pagina.
- O endpoint de frases aceita uma tabela/database; se receber uma pagina comum, salva a frase como subpagina.

## Rotina minima diaria

- 5 minutos lendo um texto tecnico curto.
- 5 minutos revisando flashcards.
- 10 minutos ouvindo aula, musica ou tutorial em ingles.
- 2 minutos escrevendo uma frase propria.

## Como abrir

Como o app carrega arquivos JSON, use um servidor local ou publique com GitHub Pages.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

## Proximos passos

- Evoluir o flashcard para repeticao espacada real.
- Refinar o banco de frases no Notion para virar tabela/database completa.
- Padronizar colunas do Notion sem espacos extras nos nomes.
- Criar rotina futura para reenviar automaticamente itens pendentes do `localStorage`.
- Integrar um dicionario externo para correcao e definicoes automaticas.

## Publicacao

O projeto esta publicado como site estatico e usa backend separado na Vercel para proteger tokens do Notion. Veja o passo a passo completo em [INTEGRACAO_NOTION.md](INTEGRACAO_NOTION.md).

## Clonar para outras linguas

Para criar versoes como `Spanish Through Projects`, `French Through Projects` ou outro idioma, use o guia [CLONAR_PARA_NOVA_LINGUA.md](CLONAR_PARA_NOVA_LINGUA.md).
