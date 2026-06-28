---
name: frontend
description: >-
  Builds onepoint UI — a news aggregation app — with HTML, CSS, JavaScript,
  Svelte 5, SvelteKit, and REST API integration. Use when editing frontend
  code, Svelte components, routes, styling, or API client calls.
---

# Frontend (onepoint UI)

## Product direction

**onepoint** is a news aggregator: crawl articles from multiple sources, expose them via APIs, let users scan a unified feed.

Design for **scanning and reading**, not admin dashboards.

## Stack

| Layer | Technology | Official docs |
|-------|------------|---------------|
| Markup | HTML | https://developer.mozilla.org/en-US/docs/Web/HTML |
| Styling | Custom CSS (no UI/CSS libraries) | https://developer.mozilla.org/en-US/docs/Web/CSS |
| Logic | JavaScript | https://developer.mozilla.org/en-US/docs/Web/JavaScript |
| Components | Svelte 5 (runes) | https://svelte.dev/docs/svelte/overview |
| Framework | SvelteKit | https://svelte.dev/docs/kit/introduction |
| Backend | REST API | See project API reference below |

## API reference

Backend OpenAPI spec: `/home/devl0pr/entertainment/onepoint/docs/openapi.yaml`

Local server: `http://localhost:8088`

Before adding endpoints or changing request/response shapes, read the OpenAPI spec.

## UX principles (news aggregator)

1. **Feed-first** — Home (`/`) is a chronological article list. Optimized for headline scanning (~680px column, source + time + excerpt).
2. **Minimal chrome** — Sticky header: logo + **user menu only**. No top nav links (no Dashboard / Settings tabs).
3. **Account via user menu** — Click username (top right) → dropdown → Settings, Log out. Standard web pattern.
4. **Settings is separate** — `/settings` for profile/password/photo only. Not nested under feed or "dashboard".
5. **External articles** — Cards link out to originals unless a dedicated reader view is added later.
6. **Filters when data exists** — Source chips, saved items, search — add when crawler APIs ship; use disabled placeholders until then.
7. **Future routes** (when APIs exist): `/sources`, `/saved`, `/article/[id]` — each top-level, not under feed.

## Routing

| Route | Purpose |
|-------|---------|
| `/login`, `/register` | Public auth |
| `/` | Main news feed (authenticated) |
| `/settings` | Account management |

Use `(app)/+layout.svelte` for authenticated shell. Route groups do not appear in the URL.

**Do not** put account settings under `/dashboard/*` or add header nav menus.

## Conventions

- **JavaScript only** — no TypeScript.
- **No third-party CSS or component libraries.**
- **Simple, custom design** — readable typography, clear hierarchy.
- **API client** — `src/lib/api/client.js`.
- **Auth** — Bearer token; see OpenAPI auth section.

## File layout

```
src/
  lib/
    api/client.js
    auth/
    components/       # UserMenu, PasswordInput, UsernameField, …
  routes/
    login/
    register/
    (app)/
      +layout.svelte  # header + user menu
      +page.svelte    # feed
      settings/
```

## SvelteKit patterns

- Guard auth in `(app)/+layout.svelte` with `browser` check.
- Env: `VITE_API_URL` (default `http://localhost:8088`).
