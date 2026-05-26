# Notion Template | English Through Projects

Use estes modelos para criar os bancos do Notion que recebem os dados enviados pelo app.

## Vocabulary Bank

Nome sugerido: `English Through Projects - Vocabulary Bank`

### Visao principal

Tipo: Table

Agrupar ou filtrar por: `Tag`, `Status` ou `Source`

### Propriedades esperadas pela API

| Propriedade | Tipo | Uso |
| --- | --- | --- |
| Term | Title | Palavra ou expressao em ingles |
| Tag | Select | Tema: GIS, Music, Programming, Academic English etc. |
| Meaning | Text | Definicao curta em ingles |
| Translation | Text | Traducao ou explicacao em portugues |
| Example | Text | Frase de exemplo |
| Source | Select | App, Import, Manual |
| Status | Select | New, Reviewed, Needs review |
| Created At | Created time | Registro automatico |

### Opcoes sugeridas

Source:

- App
- Import
- Manual

Status:

- New
- Reviewed
- Needs review

## Daily Sentences

Nome sugerido: `English Through Projects - Daily Sentences`

Este segundo banco recebe as frases escritas no bloco `Today's Sentence`.

### Visao principal

Tipo: Table

Agrupar ou filtrar por: `Theme`, `Status` ou `Source`

### Propriedades esperadas pela API

| Propriedade | Tipo | Uso |
| --- | --- | --- |
| Sentence | Title | Previa curta da frase |
| FullText | Text | Frase completa escrita no app |
| Theme | Select | Tema da frase |
| Source | Select | Origem do registro |
| Status | Select | Estado de revisao |
| Created At | Created time | Registro automatico |

### Opcoes sugeridas

Theme:

- Daily Practice
- Research
- Code
- Music
- Reading
- Personal

Source:

- App
- Manual

Status:

- New
- Reviewed
- Needs review

## Notes

Nome sugerido: `English Through Projects - Notes`

Este banco recebe notas gerais e estudos musicais salvos nas abas `Notes` e `Music`.

### Visao principal

Tipo: Table

Agrupar ou filtrar por: `Category`, `Status` ou `Source`

### Propriedades esperadas pela API

| Propriedade | Tipo | Uso |
| --- | --- | --- |
| Title | Title | Titulo curto da nota |
| Note | Text | Conteudo da nota |
| Category | Select | General, Music, Lyrics, Project, Vocabulary |
| Link | URL | Link de letra, fonte ou estudo |
| Audio Link | URL | Link de audio ou video para ouvir |
| Source | Select | App, Manual |
| Status | Select | New, Reviewed |
| Created Date | Date | Data enviada pelo app |

### Opcoes sugeridas

Category:

- General
- Music
- Lyrics
- Project
- Vocabulary

Source:

- App
- Manual

Status:

- New
- Reviewed

## Fluxo seguro

```text
GitHub Pages -> Vercel API -> Notion
```

O token do Notion deve ficar apenas na Vercel em `NOTION_TOKEN`.

O ID do banco de vocabulario deve ficar apenas na Vercel em `NOTION_DATA_SOURCE_ID`.

O ID do banco de frases deve ficar apenas na Vercel em `NOTION_SENTENCES_DATA_SOURCE_ID`.

O ID do banco de notas deve ficar apenas na Vercel em `NOTION_NOTES_DATA_SOURCE_ID`.

## Fallback

Se a API estiver indisponivel, o app continua salvando palavras, frases, notas e musicas no navegador via `localStorage`. Depois, esses dados podem ser exportados ou sincronizados em uma etapa futura.
