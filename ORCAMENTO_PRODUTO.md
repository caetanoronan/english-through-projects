# Orcamento de Produto | English Through Projects

Data: 25 de maio de 2026

Produto de referencia: **English Through Projects**

## 1. Resumo executivo

Este documento apresenta uma estimativa de escopo, cronograma, custos de desenvolvimento, custos mensais de software, equipe necessaria e manutencao para criar um produto semelhante ao app **English Through Projects**.

O produto e um app web/PWA para aprendizagem de ingles integrada a projetos reais, com vocabulario tecnico, leituras curtas, flashcards, pratica musical, reconhecimento de voz, integracao com Notion e backend seguro na Vercel.

Estimativa geral:

| Item | Estimativa |
| --- | ---: |
| Desenvolvimento inicial | R$ 18.000 a R$ 30.000 |
| Custo mensal tecnico inicial | R$ 0 a R$ 250 |
| Manutencao mensal | R$ 500 a R$ 4.000 |
| Prazo para MVP profissional | 4 a 6 semanas |

## 2. Escopo do produto

O produto inclui:

- Interface em HTML, CSS e JavaScript.
- App em abas: Home, Word, Vocabulary Bank, Sentence, Reading, Flashcards, Music e Notes.
- Vocabulario base em arquivos JSON.
- Leituras curtas em arquivos JSON.
- Conteudo de musica, escuta e pratica.
- Botao `Add Word`.
- Exportacao e importacao de vocabulario.
- Web Speech API para ouvir palavras e textos.
- Reconhecimento de voz para pratica de leitura.
- PWA instalavel em navegadores compativeis.
- Backend na Vercel com APIs seguras.
- Integracao com Notion para salvar e ler vocabulario.
- Integracao com Notion para salvar frases diarias.
- Publicacao com GitHub, GitHub Pages e Vercel.
- Documentacao tecnica em README e guia de integracao.

## 3. Cronograma sugerido

Versao MVP funcional: **4 a 6 semanas**.

| Etapa | Tempo estimado | Entregas |
| --- | ---: | --- |
| Planejamento e arquitetura | 2 a 3 dias | Escopo, fluxos, estrutura de dados e tecnologias |
| Layout e UI responsiva | 4 a 6 dias | Interface em abas, tema claro/escuro, widescreen e mobile |
| Conteudo inicial | 3 a 5 dias | 100 palavras, 50 leituras, flashcards e music practice |
| Funcionalidades locais | 5 a 8 dias | Add Word, filtros, busca, export/import e localStorage |
| Voz e escuta | 2 a 4 dias | Web Speech API e reconhecimento de fala |
| Integracao Vercel + Notion | 5 a 8 dias | APIs, tokens seguros, leitura e escrita no Notion |
| PWA | 1 a 2 dias | Manifest, service worker, icones e cache |
| Testes e ajustes | 3 a 5 dias | Testes reais, CORS, deploy e correcao de bugs |
| Documentacao | 2 a 3 dias | README, guia de integracao e troubleshooting |

Versao robusta com login, painel administrativo, metricas e multiusuario real: **8 a 12 semanas**.

## 4. Orcamento de desenvolvimento

Estimativa considerando freelancer ou desenvolvedor full-stack.

| Cenario | Valor estimado |
| --- | ---: |
| MVP enxuto semelhante ao produto atual | R$ 8.000 a R$ 15.000 |
| MVP documentado com PWA, Notion e testes | R$ 15.000 a R$ 28.000 |
| Produto comercial mais robusto | R$ 30.000 a R$ 60.000 |
| Plataforma com login, painel, banco proprio e analytics | R$ 60.000+ |

Faixa recomendada para um produto com o nivel atual do **English Through Projects**:

```text
R$ 18.000 a R$ 30.000
```

Justificativa:

- Frontend completo e responsivo.
- PWA instalavel.
- Backend serverless.
- Integracao com Notion.
- Leitura e escrita de dados online.
- Fallback local.
- Documentacao e deploy.

## 5. Custos mensais de software

### 5.1 Plano minimo

Uso inicial, experimental ou pessoal.

| Item | Custo estimado |
| --- | ---: |
| GitHub publico + GitHub Pages | R$ 0 |
| Vercel Hobby | R$ 0 |
| Notion Free | R$ 0 |
| Dominio proprio opcional | R$ 40 a R$ 100/ano |
| Total minimo | R$ 0 a R$ 10/mes |

### 5.2 Plano profissional recomendado

Uso profissional, com maior previsibilidade e possibilidade de equipe.

| Item | Custo estimado |
| --- | ---: |
| Vercel Pro | US$ 20/mes por usuario, aprox. R$ 100/mes |
| Notion Plus | US$ 10/mes por membro, aprox. R$ 50/mes |
| Dominio proprio | R$ 40 a R$ 100/ano |
| Total mensal base | R$ 150 a R$ 250/mes |

### 5.3 Plano equipe ou negocio

Uso com equipe, colaboracao e necessidades maiores de gestao.

| Item | Custo estimado |
| --- | ---: |
| Vercel Pro, 2 usuarios | US$ 40/mes, aprox. R$ 200/mes |
| Notion Business, 2 usuarios | US$ 40/mes, aprox. R$ 200/mes |
| Monitoramento ou analytics extras | R$ 50 a R$ 300/mes |
| Total mensal estimado | R$ 400 a R$ 800/mes |

Observacao: valores em reais dependem da cotacao do dolar e podem variar.

## 6. Equipe necessaria

### MVP

- 1 desenvolvedor full-stack.
- 1 pessoa de conteudo ou curadoria linguistica.
- 1 pessoa para testes e validacao pedagogica.
- Designer UI/UX opcional.

### Produto comercial

- Desenvolvedor full-stack.
- Designer UI/UX.
- Especialista pedagogico ou professor de ingles.
- Pessoa responsavel por conteudo tecnico.
- QA/tester.
- Apoio juridico para termos, privacidade e LGPD.

## 7. Manutencao mensal

| Tipo de manutencao | Valor estimado |
| --- | ---: |
| Manutencao leve | R$ 500 a R$ 1.500/mes |
| Manutencao com melhorias continuas | R$ 1.500 a R$ 4.000/mes |
| Produto ativo com roadmap mensal | R$ 4.000 a R$ 10.000/mes |

Atividades incluidas:

- Correcao de bugs.
- Ajustes de integracao.
- Revisao de deploy.
- Atualizacao de conteudo.
- Pequenas melhorias de interface.
- Suporte ao uso.
- Monitoramento basico.

## 8. Itens importantes para produto real

Antes de abrir para muitos usuarios ou vender o produto, recomenda-se:

- Criar Termos de Uso.
- Criar Politica de Privacidade.
- Explicar o uso de `localStorage`.
- Explicar a integracao com Notion.
- Definir quem pode ver o vocabulario compartilhado.
- Separar banco de producao e banco de testes.
- Definir rotina de backup do Notion.
- Monitorar erros da Vercel.
- Padronizar nomes de colunas no Notion.
- Avaliar migracao futura para banco proprio, como Supabase ou Postgres.

## 9. Riscos e cuidados

| Risco | Mitigacao |
| --- | --- |
| Token do Notion exposto no frontend | Manter token apenas na Vercel |
| Colunas do Notion com nomes incorretos | Documentar schema e validar nomes |
| Service worker segurando versao antiga | Atualizar versao do cache quando houver mudancas |
| Dados locais presos em um navegador | Sincronizar com Notion e criar export/import |
| Crescimento de usuarios | Avaliar plano pago e banco proprio |
| Dependencia do Notion como banco | Planejar migracao futura para banco dedicado |

## 10. Roadmap recomendado

### Curto prazo

- Refinar banco de frases como database completo.
- Melhorar indicadores de sincronizacao.
- Adicionar botao para atualizar vocabulario online.
- Melhorar tela de instalacao PWA.

### Medio prazo

- Criar login de usuario.
- Separar vocabulario publico e vocabulario pessoal.
- Adicionar repeticao espacada real.
- Criar dashboard de progresso sem pressao.
- Adicionar revisao de pronuncia mais completa.

### Longo prazo

- Migrar dados para banco proprio.
- Criar painel administrativo.
- Criar perfis por area de estudo.
- Adicionar analytics de aprendizagem.
- Criar versao institucional para turmas ou projetos.

## 11. Fontes consultadas

- GitHub Pages: <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>
- Vercel Pricing: <https://vercel.com/docs/pricing>
- Vercel Plans: <https://vercel.com/docs/plans>
- Notion Pricing: <https://www.notion.com/pricing>
- Cotacao USD/BRL usada como referencia aproximada: cerca de R$ 5,02 por US$ 1 em maio de 2026.

## 12. Conclusao

Um produto semelhante ao **English Through Projects** pode nascer com custo operacional quase zero usando GitHub, Vercel Hobby e Notion Free. Para uso profissional, recomenda-se reservar uma faixa inicial de desenvolvimento entre **R$ 18.000 e R$ 30.000**, com manutencao mensal proporcional ao nivel de suporte e evolucao desejado.

O produto atual ja representa um MVP profissional: possui app funcional, PWA, backend seguro, integracao com Notion, vocabulário compartilhado, fallback local, publicacao online e documentacao tecnica.

