# Intelligence Markets — Stock Analysis Platform

A modern stock analysis platform with real-time market data, portfolio tracking, and AI-driven insights, styled against the **IBM Carbon Design System**.

Built with **Next.js 16.2.7** (App Router), **React 19.2**, and **Tailwind CSS v4**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.7 (App Router, Turbopack) |
| UI Library | React 19.2 |
| Styling | Tailwind CSS v4 + IBM Carbon Design System tokens |
| Language | TypeScript 5 |
| Linting | ESLint 9 (flat config) |
| Charts | lightweight-charts 5.2 (TradingView) |
| Font | IBM Plex Sans (self-hosted via `next/font`) |
| Dev Runner | Custom `scripts/dev.cjs` (filters out "Network:" line) |

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page — stock analysis hero with Sign in / Open console CTAs |
| `/login` | Client-side login form (demo credentials) |
| `/dashboard` | Post-login dashboard with real-time candlestick chart, portfolio, watchlists |
| `/news` | Market news via aggregated RSS feeds (BBC Business, Fox Business) |
| `POST /api/login` | Demo authentication endpoint |
| `GET /api/news` | RSS feed proxy returning JSON |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@carbon.cloud` | `carbon2024` | Administrator |
| `demo@carbon.cloud` | `demo1234` | Member |

## Scripts

```bash
npm run dev    # Start dev server (Turbopack)
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Design System

This project follows the **IBM Carbon Design System**:
- IBM Blue (`#0f62fe`) as the single accent color
- No rounded corners, drop shadows, or gradients
- IBM Plex Sans typography
- 4px base spacing system

Full design tokens are documented in `DESIGN.md` and implemented in `app/globals.css`.

## Made With AI

This project was developed with assistance from **AI coding agents**, including **opencode** and others, to accelerate development, generate components, and maintain code quality.
