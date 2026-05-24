# Notion Template | English Through Projects

Use este modelo para criar o banco de vocabulario que recebera as palavras novas enviadas pelo app.

## Nome sugerido

English Through Projects - Vocabulary Bank

## Visao principal

Tipo: Table

Agrupar ou filtrar por: `Tag`, `Status` ou `Source`

## Propriedades esperadas pela API

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

## Opcoes sugeridas

### Source

- App
- Import
- Manual

### Status

- New
- Reviewed
- Needs review

## Fluxo seguro

```text
GitHub Pages -> Vercel /api/vocabulary -> Notion
```

O token do Notion deve ficar apenas na Vercel em `NOTION_TOKEN`.

O ID do data source deve ficar apenas na Vercel em `NOTION_DATA_SOURCE_ID`.

## Fallback

Se a API estiver indisponivel, o app continua salvando a palavra no navegador via `localStorage`. Depois, a palavra pode ser exportada em JSON ou sincronizada em uma etapa futura.
