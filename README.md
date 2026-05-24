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

As palavras adicionadas pelo botao `Add Word` ficam salvas no `localStorage` do navegador. Isso permite testar sem banco de dados, mas ainda nao sincroniza automaticamente entre dispositivos.

## Recursos atuais

- Vocabulario expandido por temas: programacao, GitHub, GIS, oceanografia, biologia marinha, pesquisa academica e musica.
- Base inicial com 100 palavras e 50 leituras curtas.
- Botao `Add Word` para adicionar palavras pessoais.
- Exportacao e importacao do vocabulario pessoal em JSON.
- Aba `Vocabulary Bank` com busca, filtro por tema e tabela de referencia do vocabulario.
- Flashcards gerados automaticamente a partir do `Vocabulary Bank`.
- Sugestao simples de correcao comparando a palavra digitada com o vocabulario existente.
- Leitura em voz alta com a Web Speech API do navegador.
- Aba Music com song study cards, versos originais, links de estudo e vocabulario musical.
- Aba Reading com `Listen` e `Record voice` para comparar sua fala com o texto.
- Layout responsivo com grids fluidos, tema claro/escuro e titulos com gradiente colorido.
- Fundo visual inspirado nos temas do projeto: ingles, codigo, GIS, oceano, musica e pesquisa.

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

- Publicar com GitHub Pages.
- Evoluir o flashcard para repeticao espacada real.
- Preparar backend na Vercel para salvar vocabulario e ideias.
- Integrar Notion com tokens protegidos no backend. Veja `INTEGRACAO_NOTION.md`.
- Sincronizar palavras adicionadas em banco online, como Firebase ou Supabase.
- Integrar um dicionario externo para correcao e definicoes automaticas.

## Publicacao planejada

O projeto sera publicado como site estatico no GitHub Pages. A integracao com Notion e Vercel deve ficar em uma etapa separada, usando backend protegido para evitar expor tokens no navegador.
