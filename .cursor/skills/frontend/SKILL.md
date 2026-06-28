---
name: frontend
description: >-
  Builds onepoint UI with HTML, CSS, JavaScript, Svelte 5, SvelteKit, and REST
  API integration. Use when editing frontend code, Svelte components, routes,
  styling, or API client calls for this project.
---

# Frontend (onepoint UI)

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

Before adding endpoints or changing request/response shapes, read the OpenAPI spec (or `docs/index.html` Swagger UI).

## Conventions

- **JavaScript only** — no TypeScript. Use plain `.js` files and `<script>` (not `lang="ts"`).
- **No third-party CSS or component libraries** — write plain CSS in `src/app.css` or scoped `<style>` blocks.
- **Simple, custom design** — minimal layout, readable forms, accessible labels and focus states.
- **Read official docs** when adding features or unsure about Svelte/SvelteKit patterns.
- **Svelte 5 runes** — use `$state`, `$derived`, `$props`, `$effect`; avoid legacy `export let` in new code.
- **API client** — centralize calls in `src/lib/api/client.js`; shapes follow the OpenAPI spec.
- **Auth** — Bearer `access_token` from `POST /api/login`; refresh via `POST /api/token/refresh`; revoke via `POST /api/logout`.

## Auth flow

1. Register → `POST /api/register`
2. Login → `POST /api/login` → store `access_token` + `refresh_token`
3. Protected routes → `Authorization: Bearer <access_token>`
4. Current user → `GET /api/me`
5. Logout → `POST /api/logout` then clear local session

## File layout

```
src/
  app.css
  lib/
    api/client.js
    auth/session.js
    auth/auth.svelte.js
  routes/
    login/
    register/
    dashboard/
```

## SvelteKit patterns

- Use `+page.svelte` for pages; `+layout.svelte` for shared chrome and guards.
- Client-only auth (localStorage) → guard in layout with `browser` check from `$app/environment`.
- Env: `VITE_API_URL` (default `http://localhost:8088`).
