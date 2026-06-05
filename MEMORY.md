# MEMORY.md

> Long-lived project memory. Read this first when resuming work.

## Project: Intelligence Markets — Stock Analysis Platform

A Next.js 16.2.7 (App Router, React 19.2, Tailwind v4) implementation of a
stock analysis platform with real-time market data, portfolio tracking, and
AI-driven insights, styled against the **IBM Carbon Design System** (see `DESIGN.md`).

### Stack

- **Next.js** 16.2.7 — App Router only, no `pages/`.
  - `next dev` / `next build` use **Turbopack by default** — do not pass `--turbopack`.
  - `next lint` is **removed**; lint via the `eslint` script (`npm run lint`).
  - Async request APIs only (`cookies`, `headers`, `draftMode`, `params`, `searchParams`).
  - Use `next/font/google` for self-hosted fonts. Use `next/form` for form submissions.
  - Use `next/link` `<Link>` for client-side navigation.
- **React** 19.2 — Server Components by default; `'use client'` only where needed (interactivity, hooks).
- **Tailwind CSS v4** with `@import "tailwindcss";` and the `@theme inline` directive for tokens. No `tailwind.config.js` — config is in `app/globals.css`.
- **TypeScript** 5+, **ESLint** 9 (flat config).
- **lightweight-charts** 5.2 — TradingView's financial charting library for real-time candlestick charts.

### File Map

```
nextjs-app/
├─ app/
│  ├─ layout.tsx             # Loads IBM Plex Sans via next/font; sets <html> class.
│  ├─ globals.css            # Tailwind v4 import + Carbon design tokens + component layer.
│  ├─ page.tsx               # Home / landing: hero pitching stock analysis + Sign in / Open console CTAs.
│  ├─ login/
│  │  └─ page.tsx            # 'use client' login (no header/footer): form POSTs /api/login, redirects to /dashboard.
│  ├─ dashboard/
│  │  ├─ page.tsx            # 'use client' dashboard (minimal topbar, no footer): portfolio overview, market movers, watchlists.
│  │  └─ StockChart.tsx      # 'use client' real-time candlestick chart (lightweight-charts by TradingView).
│  ├─ news/
│  │  └─ page.tsx            # 'use client' news page: fetches from /api/news, renders article list.
│  └─ api/
│     ├─ login/
│     │  └─ route.ts         # POST /api/login — demo creds; GET lists creds for testing.
│     └─ news/
│        └─ route.ts         # GET /api/news — fetches BBC Business + Fox Business RSS, returns JSON.
├─ public/                   # Static assets.
├─ scripts/
│  └─ dev.cjs                # Custom dev runner: filters out "Network:" line only.
├─ DESIGN.md                 # Source of truth for the Carbon design system used here.
├─ MEMORY.md                 # This file.
└─ package.json              # Scripts: dev, build, start, lint.
```

### Routes

| Path         | Type           | Notes                                                          |
| ------------ | -------------- | -------------------------------------------------------------- |
| `/`          | Static page    | Landing with stock analysis hero + Sign in / Open console CTAs. |
| `/login`     | Client page    | Minimal split-panel login (no header/footer). POSTs `/api/login`. |
| `/dashboard` | Client page    | Post-login dashboard (minimal topbar, no footer) with real-time candlestick chart, stock market data, portfolio, watchlists. |
| `/news`      | Client page    | Market news page. Fetches from `/api/news`.                 |
| `POST /api/login` | Route handler | Demo creds; returns `{ success, user, token, issuedAt }`.   |
| `GET  /api/login` | Route handler | Lists the demo credentials (for testing only).             |
| `GET  /api/news`  | Route handler | Proxies BBC Business + Fox Business RSS feeds as JSON.   |

### Auth Flow

- Login form (`app/login/page.tsx`) calls `POST /api/login` with `{ email, password }`.
- On success, the response is `{ success: true, user, token, issuedAt }` and the page stores `carbon:user` + `carbon:token` in `localStorage` (if "Keep me signed in" is checked) or `sessionStorage`, then `router.push("/dashboard")`.
- Dashboard (`app/dashboard/page.tsx`) reads `carbon:user` from `localStorage` then `sessionStorage` on mount. If absent, it `router.replace("/login")`.
- Logout clears both storages and routes to `/login`.
- No real session cookie / JWT verification — this is a demo. See **Known Gaps**.
- Dashboard data (stats, market movers, watchlists, portfolio breakdown) is hardcoded demo data.
- Real-time chart in `StockChart.tsx` uses simulated random-walk price data, not live market data.

### Demo Credentials (defined in `app/api/login/route.ts`)

| Email                  | Password    | Name          | Role           |
| ---------------------- | ----------- | ------------- | -------------- |
| `admin@carbon.cloud`   | `carbon2024`| Ada Lovelace  | Administrator  |
| `demo@carbon.cloud`    | `demo1234`  | Demo User     | Member         |

### Conventions

- **All design tokens live in `app/globals.css`** under `:root` and `@theme inline`. Reference them via `var(--token)` or Tailwind utilities (`bg-canvas`, `text-ink`, etc.).
- **Never add rounded corners** — Carbon is `0px`. Use the `.btn-primary`, `.btn-tertiary`, `.btn-ghost`, `.carbon-input`, `.checkbox-carbon` classes.
- **IBM Plex Sans only** — loaded once in `app/layout.tsx` as `--font-plex-sans`. Display sizes use `font-weight: 300`. Body uses 400 with `letter-spacing: 0.16px`.
- **One accent color**: IBM Blue `#0f62fe` (`--primary`). Use for links, primary CTAs, focused-input underlines, and CTA banners only. Do not use for card backgrounds or eyebrows.
- **Carbon input signature**: surface-1 background, no top/side borders, 1px hairline bottom border that becomes 2px primary underline on focus.
- **Layout**: utility bar (32px) → top nav (48px) → page content → inverse-canvas footer. Use this rhythm.
- **Tailwind v4 syntax** — utilities like `text-[14px]` are first-class; arbitrary values are common.
- **No comments in source** unless explicitly requested.

### Scripts

```bash
npm run dev    # scripts/dev.cjs → next dev (Turbopack). Filters out "Network:" line.
npm run build  # next build (Turbopack)
npm run start  # next start
npm run lint   # eslint
```

### Design System Quick Reference (from DESIGN.md)

| Token            | Value                                     | Use                          |
| ---------------- | ----------------------------------------- | ---------------------------- |
| `--primary`      | `#0f62fe`                                 | IBM Blue, single accent      |
| `--ink`          | `#161616`                                 | Headlines, body emphasis     |
| `--ink-muted`    | `#525252`                                 | Secondary type               |
| `--ink-subtle`   | `#8c8c8c`                                 | Helper, captions, disabled   |
| `--canvas`       | `#ffffff`                                 | Default page background      |
| `--surface-1`    | `#f4f4f4`                                 | Input background, alt rows   |
| `--surface-2`    | `#e0e0e0`                                 | Hovered input, separators    |
| `--hairline`     | `#e0e0e0`                                 | 1px borders                  |
| `--inverse-canvas` | `#161616`                               | Footer only                  |
| `--inverse-ink`  | `#ffffff`                                 | Footer headings              |
| `--inverse-ink-muted` | `#c6c6c6`                            | Footer body                  |

**Typography**: IBM Plex Sans 300 (display 42/60/76px), 400 (body 14/16/18/20/24/32px), 600 (selected/emphasis only). `letter-spacing: 0.16px` on body.

**Radii**: all `0px` (none). The `xs` (2px) and `sm` (4px) tokens exist for product surfaces but are not used on marketing.

**Spacing**: 4px base. `xxs` 4 · `xs` 8 · `sm` 12 · `md` 16 · `lg` 24 · `xl` 32 · `xxl` 48 · `section` 96.

### Don'ts (from DESIGN.md)

- No rounded corners on buttons, cards, inputs.
- No bold display headlines (use weight 300 for 42px+).
- No drop shadows, gradient backdrops, or atmospheric depth.
- No second brand color (only IBM Blue + semantic success/warning/error).
- No all-caps tracked eyebrows; use sentence case at 14px.
- No pill-shaped buttons.

### Next.js 16 Gotchas (verified against `node_modules/next/dist/docs/`)

- `params` / `searchParams` are **Promises** in page/layout/route handlers — `await` them.
- `next lint` removed; the `lint` script runs `eslint` directly.
- `experimental.turbopack` → top-level `turbopack` in `next.config.ts` (we don't customize it).
- `images.domains` deprecated — use `images.remotePatterns`.
- `<Form>` from `next/form` only supports `action={string | ServerAction}` — pass a function to `useFormStatus` for pending states.
- `<a href="/">` in any file that has a matching route triggers `no-html-link-for-pages`; use `<Link href="/">` from `next/link`.

### Known Gaps / TODO

- Auth is **client-side only**: the API returns a token string but it is never verified. Don't ship as-is.
- No `<Form action={login}>` Server Action; the login form uses `fetch` for the pending / error UX.
- `GET /api/login` exposes the demo credentials list — remove before any non-demo deploy.
- No `/signup` route yet; "Create account" links point to `#signup`.
- No tests yet. Add Playwright/Vitest when needed.
- `/api/news` depends on external RSS feeds (BBC, Fox Business) — may fail if feeds change or are blocked.

