---
name: FluxUP
description: Backoffice financeiro para arenas e clubes de futsal — contas, orçamento, caixa e parceiros, sem drama visual.
colors:
  ink: "oklch(0.141 0.005 285.823)"
  bg: "oklch(1 0 0)"
  bg-dark: "oklch(0.141 0.005 285.823)"
  ink-dark: "oklch(0.985 0 0)"
  surface: "oklch(0.967 0.001 286.375)"
  surface-dark: "oklch(0.274 0.006 286.033)"
  border: "oklch(0.92 0.004 286.32)"
  border-dark: "oklch(1 0 0 / 10%)"
  muted-ink: "oklch(0.552 0.016 285.938)"
  muted-ink-dark: "oklch(0.705 0.015 286.067)"
  primary: "oklch(0.48 0.16 280)"
  primary-foreground: "oklch(0.98 0.01 280)"
  primary-dark: "oklch(0.82 0.11 280)"
  primary-foreground-dark: "oklch(0.18 0.03 280)"
  accent-violet: "oklch(0.68 0.13 250)"
  accent-violet-dark: "oklch(0.72 0.13 250)"
  success: "oklch(0.6 0.15 145)"
  success-dark: "oklch(0.72 0.14 145)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-dark: "oklch(0.704 0.191 22.216)"
typography:
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "4px 12px"
---

# Design System: FluxUP

## 1. Overview

**Creative North Star: "O Painel de Controle Sem Fricção"**

FluxUP é a operação financeira de uma arena de futsal condensada em telas que se leem em segundos: contas bancárias, orçamento, caixa, categorias, tags e parceiros. Quem abre o sistema não está passeando — está lançando um pagamento, conferindo um saldo ou fechando o caixa do dia, muitas vezes entre um atendimento e outro. Por isso a base do sistema (herdada do shadcn/ui, quase inteiramente em tons de cinza) permanece: densidade de dados, tabelas limpas, formulários objetivos. O que faltava era uma assinatura própria — hoje o botão "primário" é literalmente preto-sobre-branco, indistinguível de qualquer scaffold padrão. O FluxUP ganha um roxo-índigo considerado (não o roxo-gradiente de landing page de IA) como cor de marca, usado com disciplina: presente nos pontos de decisão (ação primária, item ativo do menu, foco de campo), ausente do resto da tela.

Este sistema rejeita explicitamente: o visual pesado e datado de sistema bancário legado (grids apertadas, zero cor, hierarquia achatada); e o exagero decorativo de dashboards de SaaS genérico (gradientes, glassmorphism, cards flutuantes idênticos em fileira). Direto e eficiente primeiro; moderno como consequência de tipografia, espaçamento e um único acento de cor bem escolhido — não como camada de estilo por cima.

**Key Characteristics:**
- Neutro por padrão, roxo-índigo por exceção — a cor de marca aparece em ≤10% de qualquer tela.
- Densidade de dados acima de espaço em branco decorativo: tabelas e formulários são o produto.
- Elevação quase inexistente (sombras `xs`/`sm`); profundidade vem de contraste tonal, não de blur.
- Zero elementos puramente decorativos: toda cor, toda sombra, todo raio tem um motivo funcional.

## 2. Colors

Paleta majoritariamente neutra (a base cinza-violeta do shadcn/ui, que por coincidência já compartilha o matiz ~285° com o novo roxo-índigo de marca em 280° — os dois se encaixam sem parecer colados um no outro) com um único acento de marca aplicado com disciplina.

### Primary
- **Índigo FluxUP** (`oklch(0.48 0.16 280)` claro / `oklch(0.82 0.11 280)` escuro): botão de ação primária, item ativo de navegação/sidebar, anel de foco, link, série principal de gráfico. Textura considerada — mais Linear do que landing page de IA: chroma moderado (0.16), nunca vibrante a ponto de "brilhar".

### Secondary
- **Violeta-céu** (`oklch(0.68 0.13 250)`): estados secundários de destaque — hover de itens não-primários, segunda série de gráfico, chips informativos. Mais claro e mais azulado que o Índigo FluxUP, para criar hierarquia sem competir com ele.

### Tertiary
- **Verde-livro-caixa** (`oklch(0.6 0.15 145)` claro / `oklch(0.72 0.14 145)` escuro): status de sucesso/positivo (badge "pago", "conciliado", saldo positivo). Hoje está fixo como `green-600` do Tailwind dentro de `badge.tsx` — deve virar token (`--success` / `--success-foreground`) para ficar consistente com o resto do sistema.

### Neutral
- **Tinta** (`oklch(0.141 0.005 285.823)` claro / `oklch(0.985 0 0)` escuro): texto principal.
- **Superfície** (`oklch(0.967 0.001 286.375)` claro / `oklch(0.274 0.006 286.033)` escuro): fundo de cards secundários, hover neutro, sidebar.
- **Borda** (`oklch(0.92 0.004 286.32)` claro / `oklch(1 0 0 / 10%)` escuro): divisores, contornos de input e card.
- **Tinta-muted** (`oklch(0.552 0.016 285.938)` claro / `oklch(0.705 0.015 286.067)` escuro): texto secundário, legendas, placeholders.
- **Destructive** (`oklch(0.577 0.245 27.325)` claro / `oklch(0.704 0.191 22.216)` escuro): erros, exclusões, saldo negativo. Mantido como está.

### Named Rules
**A Regra dos 10%.** O Índigo FluxUP nunca cobre mais de ~10% de uma tela. Ele marca decisão (ação primária, item ativo, foco) — não decora. Se uma tela tem mais de um bloco grande pintado de roxo, é decoração, não sinalização.

**A Regra do Texto sobre Cor.** Texto branco/quase-branco sobre o Índigo FluxUP em modo claro (fill saturado de luminância média). Em modo escuro, o Índigo é um tom claro (L 0.82) — texto escuro por cima, seguindo a mesma convenção que o shadcn já usa para `--primary` no dark mode.

## 3. Typography

**Display Font:** stack padrão do sistema (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`)
**Body Font:** mesma stack
**Label/Mono Font:** mesma stack (nenhuma fonte monoespaçada em uso, mesmo para valores monetários)

**Character:** Neutra e funcional — herdada do padrão Tailwind, sem personalidade tipográfica própria hoje. É o maior espaço em aberto para "moderno, não banco antigo" sem tocar em cor: um par de fontes com mais caráter (ex.: uma sans geométrica para títulos + a stack de sistema para corpo) resolveria isso sem exigir nova cor.

### Hierarquia
- **Title** (600, 18px, 1.2): títulos de página e cabeçalhos de card (`title.tsx`, `CardTitle`).
- **Body** (400, 14px, 1.5): texto de tabela, formulário, corpo geral. Máximo ~75ch onde há texto corrido (raro neste produto).
- **Label** (500, 12px, 1.2): rótulos de campo, badges, cabeçalhos de coluna de tabela.

### Named Rules
**A Regra do Número Legível.** Valores monetários e datas nunca usam peso `light`; peso mínimo `400`, e o `tabular-nums` deve ser considerado em colunas de valor para que os dígitos alinhem verticalmente em tabelas.

## 4. Elevation

Sistema quase plano. Sombras existem apenas como `shadow-xs` (botões, inputs, badges) e `shadow-sm` (cards) — imperceptíveis a olho nu, servindo mais para "descolar" ligeiramente a borda do que para simular profundidade. Não há glassmorphism, não há sombras difusas coloridas, não há elevação em camadas (nenhum "float" de card sobre card).

### Shadow Vocabulary
- **shadow-xs** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): botões, inputs, badges — presença mínima de borda.
- **shadow-sm** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): cards — separação sutil do fundo.

### Named Rules
**A Regra do Plano por Padrão.** Superfícies são planas em repouso. Nenhuma sombra cresce por decoração; a única exceção aceitável é um glow sutil tingido de Índigo FluxUP no hover do botão primário, para dar "presença" sem virar glassmorphism.

## 5. Components

### Buttons
- **Shape:** cantos moderadamente arredondados (`rounded-md`, 8px).
- **Primary:** fundo Índigo FluxUP (`oklch(0.48 0.16 280)`), texto quase-branco, `shadow-xs` em repouso. Altura padrão 36px (`h-9`), padding `16px` horizontal.
- **Hover / Focus:** hover escurece levemente o Índigo (`/90` de opacidade, já é o padrão CVA do projeto); foco usa anel de 3px na cor do Índigo a 50% de opacidade — troca o `--ring` neutro atual por um `--ring` alinhado à marca.
- **Secondary / Ghost / Outline:** mantidos neutros (fundo `surface` ou transparente) — a cor de marca não aparece aqui, reforçando a Regra dos 10%.

### Badges
- **Style:** fundo sólido, texto de contraste, `rounded-md` (6-8px), padding `2px 8px`, texto `12px/500`.
- **State:** variante `success` deve migrar de `green-600` hardcoded para o token `--success`; variante `default` usa Índigo FluxUP; `destructive` mantida.

### Cards / Containers
- **Corner Style:** `rounded-xl` (14px).
- **Background:** `bg` (branco / quase-preto no dark).
- **Shadow Strategy:** `shadow-sm`, ver Elevação.
- **Border:** 1px, cor `border`.
- **Internal Padding:** `24px` vertical, `24px` horizontal no header/content.

### Inputs / Fields
- **Style:** borda 1px (`border-input`), fundo transparente/`bg`, `rounded-md`, altura 36px.
- **Focus:** borda muda para `ring`, anel de 3px — deve herdar o mesmo Índigo do foco de botão para reforçar a marca em toda interação de teclado.
- **Error / Disabled:** anel/borda `destructive` em `aria-invalid`; opacidade 50% quando `disabled`.

### Navigation (Sidebar)
- **Style:** fundo `sidebar` neutro; item ativo hoje é apenas um tom de cinza mais escuro (`sidebar-accent`). Recomendação: item ativo passa a usar fundo Índigo FluxUP a 10% de opacidade + texto/ícone na cor Índigo cheia — nunca uma borda lateral colorida (proibido, ver Don'ts).

## 6. Do's and Don'ts

### Do:
- **Do** usar o Índigo FluxUP (`oklch(0.48 0.16 280)`) apenas em pontos de decisão: botão primário, item ativo de navegação, anel de foco, link, primeira série de gráfico.
- **Do** manter o restante da tela neutro (cinza/branco/preto) — a Regra dos 10%.
- **Do** tokenizar o verde de sucesso hoje hardcoded em `badge.tsx` (`green-600`) como `--success` / `--success-foreground`.
- **Do** manter elevação quase plana (`shadow-xs`/`shadow-sm`); qualquer sombra nova precisa justificar por que uma tabela de lançamentos financeiros precisa de profundidade.
- **Do** usar `tabular-nums` em colunas de valores monetários para alinhamento vertical de dígitos.

### Don't:
- **Don't** usar gradiente em texto ou em fundo de botão — nem no Índigo, nem em nenhuma outra cor.
- **Don't** usar `border-left`/`border-right` colorido como indicador de estado ativo ou destaque (item de menu ativo, alerta, card) — sempre proibido nesta skill.
- **Don't** deixar o Índigo FluxUP cobrir blocos grandes de tela (heróis, banners, fundos de seção inteira) — isso é decoração, não sinalização, e quebra a Regra dos 10%.
- **Don't** introduzir glassmorphism, blur decorativo ou cards flutuantes sobre cards.
- **Don't** aplicar o Índigo FluxUP com chroma acima de ~0.18 — vira o roxo-neon de landing page de ferramenta de IA, exatamente o clichê que este sistema evita.
- **Don't** misturar mais de dois tons de acento (Índigo + Violeta-céu) numa mesma tela além do Destructive/Success semânticos — isso dilui a assinatura de marca.
