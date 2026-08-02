<div align="center">

# Booking Platform

**One codebase. Every interface your brand needs.**

Production-ready booking products for hotels, resorts and tour operators —
where the same content renders as completely different websites.

[Tiếng Việt](./README.vi.md) · [Architecture](./resources/docs/ARCHITECTURE.md)

</div>

---

## Products

### 🏨 Booking Hotel

A complete reservation system for hotels and resorts: room listings, rich detail
pages, availability search, add-on services and a full checkout flow.

**Four interface designs, one content source.** Pick the look that fits your
brand — the rooms, prices and bookings behind them are identical.

| | Design | Character |
|---|---|---|
| **01** | Coastal Blue | Clean and corporate. Structured layout, confidence-first. |
| **02** | Teal & Amber | Warm and hospitable. Editorial rhythm, generous imagery. |
| **03** | Boutique | Refined and calm. Typography-led, quiet spacing. |
| **04** | Fresh Green | Bright and active. Bold, energetic, adventure-oriented. |

→ **[View the demo](https://thenamduhillresort.com)**

Change your mind later and switching designs costs a configuration change, not a
rebuild. Your rooms, bookings and customer data stay exactly where they are.

*More products are on the way — the platform is built so each one inherits the
same foundation.*

---

## What you get

**Bilingual out of the box** — Vietnamese and English, written into the data
layer rather than bolted on afterwards. Every price, room name and policy exists
in both languages.

**Built for real bookings** — date selection, guest counts, extra beds, ferry
tickets, transfers and add-ons, with pricing calculated in one place so every
design shows the same number.

**Fast on real devices** — server-rendered pages and optimised images. Guests on
hotel wifi and 4G get a site that loads.

**Yours to grow** — adding a fifth design, or a tenth, does not mean rewriting
what already works.

---

## Technology

Chosen for longevity and hiring pool, not novelty.

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19 · TypeScript 5 |
| Styling | Tailwind CSS v4 with per-theme design tokens |
| Structure | pnpm workspaces monorepo |
| Icons | lucide-react |

The interesting decision is the structure. Themes are independent packages
sharing a single business core, so visual variety never duplicates business
logic. Full reasoning in [resources/docs/ARCHITECTURE.md](./resources/docs/ARCHITECTURE.md).

---

## Repository layout

```
apps/
  portfolio/           Product directory — links to each product
  2026-thenamduhill/   Booking Hotel — hub + every design
  2025-phogroup/       Earlier project, preserved
packages/
  core/                Types, data, booking logic, i18n
  ui/                  Brand-neutral components
  theme-h1/            Design 01 — tokens, sections, composition
  theme-h2..h4/        Designs 02–04
resources/             Design bundle, architecture docs, handover notes
```

Each product is its own app, its own Vercel Project and its own domain, so
shipping one never rebuilds the others.

---

## Running locally

```bash
pnpm install
pnpm dev
```

Then open **http://localhost:3002** and click through to whichever product you
want to see.

### Commands

| Command | What it does |
|---|---|
| `pnpm install` | Install the whole workspace |
| **`pnpm dev`** | **Run every app — start here, open `:3002`** |
| `pnpm build` | Build everything (cached by Turborepo) |
| `pnpm check` | Lint + typecheck everything |

<details>
<summary>Running a single app</summary>

Only needed when you want to save resources while focusing on one app — the
other ports serve nothing while it runs.

| Command | Port | App |
|---|---|---|
| `pnpm dev:portfolio` | 3002 | Product directory |
| `pnpm dev:thenamduhill` | 3000 | Booking Hotel |
| `pnpm dev:phogroup` | 3001 | Pho Group |

Build or check just one package with a filter:
`pnpm turbo build --filter=@repo/2026-thenamduhill`

</details>

### Ports

| Port | App | |
|---|---|---|
| **3002** | `portfolio` | 🚪 Start here — links to the rest |
| 3000 | `2026-thenamduhill` | Booking Hotel, design picker |
| 3001 | `2025-phogroup` | Pho Group Phú Quốc |

Ports are pinned per app, so each one always lands in the same place.

---

## Sharing with a client

Every product has its own domain, so send the product link directly — the client
sees only their own site.

| Send to | Link |
|---|---|
| Nam Du Hill client | `thenamduhillresort.com` |
| A client, pre-set to one design | `thenamduhillresort.com/h1` |
| Pho Group client | `2025-phuquoc.vercel.app` |
| Recruiters, new prospects | `vantha.com.vn` (this directory) |

Deployment setup: [resources/docs/DEPLOY.md](./resources/docs/DEPLOY.md).

---

## About

Built and maintained by **[CobyTran](https://github.com/CobyTran)**, a senior
frontend engineer working on booking and travel products.

Available for frontend and design-system work — reach out via GitHub.

<sub>Third-party content used during development is for structural reference only
and is not part of any production deployment.</sub>
