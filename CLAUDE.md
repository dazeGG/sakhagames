# CLAUDE.md — SakhaGames

**Project:** SakhaGames is a premium mobile-first editorial archive for Yakutian sports games (primarily Dygyn and future local competitions).  
Style: "The Arctic Curator" — strict, monochromatic, high-contrast editorial archive resembling a heavy printed album.

**Highest priority:** Always follow DESIGN.md (Arctic Curator). Read it before starting any UI, component or page work.

**File sync rule:** CLAUDE.md and AGENTS.md must always be kept in sync. Any change to one file must be mirrored in the other.

## Hard Rules (NEVER break these)

- **Zero radius**: Every element (cards, buttons, modals, images, containers, inputs) MUST have `border-radius: 0`.
- **No-Line**: No visible borders or outlines. Separate sections and blocks ONLY through tonal background shifts using colors from main.css.
- **Intentional Asymmetry + Air**: Use deliberate asymmetry and generous whitespace.
  Section spacing must use only Tailwind tokens: `spacing-20` (5rem), `spacing-30` (7.5rem), `spacing-40` (10rem).
- **No hover, no responsive**: The site is mobile-only. Never use `hover:*` classes or responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`). Hover states do not exist on touch devices.
- **Units**: All sizes (font-size, letter-spacing, padding, margin, etc.) must use `rem`. Never use `px` or `em` in Tailwind arbitrary values or inline styles.
- **Typography**:
  - h1 / Display: PT Serif (`--font-serif-classic`)
  - Headings, metadata, navigation, uppercase: Montserrat (`--font-heading`)
  - Body text and content: Noto Sans (`--font-sans`)
- **Colors**: Use ONLY the custom tokens defined in `main.css` (@theme block).
  Primary color is `primary-500` (#000000). Accents only for status tags and sport types.
- **UI Kit**: Strictly Nuxt UI v4 + Tabler icons. **Always reach for a Nuxt UI component first.** Only write raw HTML elements (`div`, `span`, `button`, `input`, etc.) when no suitable Nuxt UI component exists. When in doubt, check the Nuxt UI v4 component list before writing custom markup.
- **Mobile-only**: The site is built exclusively for mobile devices. No desktop layout needed.
- **Arrow functions only**: All functions in `<script setup>` blocks and composables must be written as `const fn = () => {}`. Never use the `function` keyword.
- **Lint compliance**: All code must strictly follow ESLint rules. Run `pnpm lint` after any changes and fix every error before finishing.

## Architecture

- Nuxt 4.4.2 + Nuxt UI 4.6.1 + Tailwind 4 (customization only via `@theme` in `main.css` — no `tailwind.config.ts`).
- UI language: Russian only for now. i18n is planned for the future (Yakut → English).

## Project Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check (nuxt typecheck)
```

## Data Layer (Django REST API)

- Django REST Framework is the only backend.
- All data fetching must go through `useApi()` composable (`app/composables/useApi.ts`), which exposes semantic modules: `api.athletes`, `api.dygynGames`, etc.
- API modules live in `app/api/` — each module is a pure factory `createXxxApi(baseUrl, lang)`. Add new collections there.
- Use the provided methods from the composable (e.g. `getList()`, `getBySlug()`, `getGamePage()` etc.).
- Type definitions for collections are located in `app/types/` (e.g. `athlete.ts`, `dygynGames.ts`).
- Environment variable: `API_URL`
  - Dev: `http://localhost:8000`
  - Production: `https://api.sakha.games`

## Full Color Palette Reference

See DESIGN.md → section 2.1 for the complete palette:
- `primary-*` (main monochrome)
- `secondary-*`
- `green-*`, `blue-*`, `yellow-*`, `red-*`, `neutral-*`

Primary button example: `bg-primary-500`

## Workflow

1. Before any UI or component work — re-read DESIGN.md completely.
2. Plan structure first, then implement.
3. Always use the `useApi()` composable for data operations.
4. Keep the visual language strict, calm, editorial and consistent with "The Arctic Curator".
5. If unsure about any design or architecture decision — ask instead of assuming.
6. After making changes, always run `pnpm lint` and `pnpm typecheck` and fix all errors before finishing.

This file is automatically loaded in every Claude Code session. Follow these rules strictly to maintain the premium archival style.