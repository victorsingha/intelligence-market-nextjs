<div align="center">
  <img src="https://raw.githubusercontent.com/victorsingha/intelligence-market-nextjs/master/public/opencode.svg" alt="opencode" width="80" />
  <br />
  <br />
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/TypeScript%205-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/IBM%20Carbon-0F62FE?style=flat-square&logo=ibm&logoColor=white" alt="IBM Carbon" />
  <img src="https://img.shields.io/badge/Made%20with%20AI-8B5CF6?style=flat-square&logo=openai&logoColor=white" alt="Made with AI" />
  <br />
  <br />
  <h1 style="font-weight: 300; font-size: 42px; letter-spacing: -0.4px; margin: 0;">Intelligence Markets</h1>
  <p style="font-size: 18px; color: #525252; margin: 8px 0 0 0;">— Stock analysis platform · IBM Carbon Design System · Real-time charts —</p>
  <br />
  <a href="http://localhost:3000"><img src="https://img.shields.io/badge/Launch%20Dashboard-0F62FE?style=flat-square&logo=vercel&logoColor=white" alt="Launch" /></a>
  <img src="https://img.shields.io/badge/Academic%20Project-161616?style=flat-square" alt="Academic Project" />
</div>
<br />

---

<br />

<pre style="background: #f4f4f4; padding: 16px; font-size: 14px; border: 1px solid #e0e0e0;">
A modern stock analysis platform with real-time market data, portfolio tracking, and
AI-driven insights — designed and built against the <strong>IBM Carbon Design System</strong>.
</pre>

<br />

## Tech Stack

| Layer | Technology | Badge |
|-------|-----------|-------|
| Framework | **Next.js 16.2.7** — App Router, Turbopack | <img src="https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=next.js&logoColor=white" /> |
| UI Library | **React 19.2** — Server Components by default | <img src="https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black" /> |
| Styling | **Tailwind CSS v4** + IBM Carbon tokens | <img src="https://img.shields.io/badge/Tailwind%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" /> |
| Language | **TypeScript 5** | <img src="https://img.shields.io/badge/TS-5-3178C6?style=flat-square&logo=typescript" /> |
| Linting | **ESLint 9** — flat config | <img src="https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint" /> |
| Charts | **lightweight-charts 5.2** — TradingView | <img src="https://img.shields.io/badge/Charts-TradingView-F7B731?style=flat-square" /> |
| Design | **IBM Carbon Design System** | <img src="https://img.shields.io/badge/Design-Carbon-0F62FE?style=flat-square&logo=ibm" /> |
| Font | **IBM Plex Sans** — self-hosted via `next/font` | <img src="https://img.shields.io/badge/Font-IBM%20Plex%20Sans-161616?style=flat-square" /> |
| AI | **opencode** — AI coding agent | <img src="https://img.shields.io/badge/Made%20with-opencode-8B5CF6?style=flat-square" /> |

<br />

## Routes

<table>
  <tr>
    <th style="background: #f4f4f4; text-align: left;">Path</th>
    <th style="background: #f4f4f4; text-align: left;">Type</th>
    <th style="background: #f4f4f4; text-align: left;">Description</th>
  </tr>
  <tr>
    <td><code style="background: #f4f4f4; padding: 2px 6px;">/</code></td>
    <td>Static Page</td>
    <td>Landing — stock analysis hero with CTA to Sign in / Open console</td>
  </tr>
  <tr>
    <td><code style="background: #f4f4f4; padding: 2px 6px;">/login</code></td>
    <td>Client Page</td>
    <td>Minimal split-panel login form (demo credentials)</td>
  </tr>
  <tr>
    <td><code style="background: #f4f4f4; padding: 2px 6px;">/dashboard</code></td>
    <td>Client Page</td>
    <td>Portfolio overview, real-time candlestick chart, watchlists</td>
  </tr>
  <tr>
    <td><code style="background: #f4f4f4; padding: 2px 6px;">/news</code></td>
    <td>Client Page</td>
    <td>Market news aggregated from RSS feeds</td>
  </tr>
  <tr>
    <td><code style="background: #f4f4f4; padding: 2px 6px;">POST /api/login</code></td>
    <td>Route Handler</td>
    <td>Demo auth — returns <code>{ success, user, token, issuedAt }</code></td>
  </tr>
  <tr>
    <td><code style="background: #f4f4f4; padding: 2px 6px;">GET /api/news</code></td>
    <td>Route Handler</td>
    <td>Proxies BBC + Fox Business RSS feeds as JSON</td>
  </tr>
</table>

<br />

## Getting Started

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

<br />

## Demo Credentials

<table>
  <tr>
    <th style="background: #f4f4f4;">Email</th>
    <th style="background: #f4f4f4;">Password</th>
    <th style="background: #f4f4f4;">Name</th>
    <th style="background: #f4f4f4;">Role</th>
  </tr>
  <tr>
    <td><code>admin@carbon.cloud</code></td>
    <td><code>carbon2024</code></td>
    <td>Ada Lovelace</td>
    <td><strong>Administrator</strong></td>
  </tr>
  <tr>
    <td><code>demo@carbon.cloud</code></td>
    <td><code>demo1234</code></td>
    <td>Demo User</td>
    <td>Member</td>
  </tr>
</table>

<br />

## Scripts

```bash
npm run dev    # scripts/dev.cjs → next dev (Turbopack). Filters "Network:" line.
npm run build  # next build (Turbopack)
npm run start  # next start
npm run lint   # eslint
```

<br />

## Design System

> This project is styled against the **IBM Carbon Design System** — IBM's open-source enterprise design framework. Full design token reference in [`DESIGN.md`](DESIGN.md).

<br />

### Color Palette

<div style="display: flex; gap: 8px; flex-wrap: wrap;">

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #0f62fe; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Primary</span>
    <span style="font-size: 11px; color: #8c8c8c;">#0f62fe</span>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #161616; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Ink</span>
    <span style="font-size: 11px; color: #8c8c8c;">#161616</span>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #525252; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Ink Muted</span>
    <span style="font-size: 11px; color: #8c8c8c;">#525252</span>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #ffffff; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Canvas</span>
    <span style="font-size: 11px; color: #8c8c8c;">#ffffff</span>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #f4f4f4; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Surface 1</span>
    <span style="font-size: 11px; color: #8c8c8c;">#f4f4f4</span>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #e0e0e0; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Surface 2</span>
    <span style="font-size: 11px; color: #8c8c8c;">#e0e0e0</span>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #24a148; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Success</span>
    <span style="font-size: 11px; color: #8c8c8c;">#24a148</span>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100px;">
    <div style="width: 48px; height: 48px; background: #da1e28; border: 1px solid #e0e0e0;"></div>
    <span style="font-size: 12px; color: #525252;">Error</span>
    <span style="font-size: 11px; color: #8c8c8c;">#da1e28</span>
  </div>

</div>

<br />

### Design Principles

- **No rounded corners** — all buttons, cards, inputs at `0px`
- **Single accent** — IBM Blue `#0f62fe` only for links, CTAs, focus rings
- **Flat geometry** — no drop shadows, no gradients, no atmospheric depth
- **IBM Plex Sans** — weight 300 for display sizes (42px+), 400 for body
- **`letter-spacing: 0.16px`** on body type — Carbon precision detail
- **4px spacing grid** — Carbon's signature base unit

<br />

## Made With AI

This project was built with the assistance of **[opencode](https://opencode.ai)** — an AI coding agent that helped generate components, maintain code quality, and accelerate development throughout the project lifecycle.

The project also leveraged **Next.js 16.2.7** (Turbopack), **React 19.2**, and **Tailwind CSS v4** alongside the **IBM Carbon Design System** to deliver a polished enterprise-stock-analysis experience.

<br />

---

<div align="center">
  <p style="font-size: 14px; color: #8c8c8c;">
    <a href="https://github.com/victorsingha/intelligence-market-nextjs" style="color: #0f62fe; text-decoration: none;">GitHub</a>
    &nbsp;·&nbsp;
    <a href="MEMORY.md" style="color: #0f62fe; text-decoration: none;">Memory</a>
    &nbsp;·&nbsp;
    <a href="DESIGN.md" style="color: #0f62fe; text-decoration: none;">Design System</a>
  </p>
  <br />
  <p style="font-size: 12px; color: #8c8c8c;">
    IBM Carbon Design System · Next.js 16 · React 19 · Tailwind v4 · TypeScript 5 · opencode
  </p>
</div>
