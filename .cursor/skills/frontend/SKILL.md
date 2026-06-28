---
name: frontend
description: >-
  Builds onepoint — premium single-company furniture store UI for Azerbaijan —
  with HTML, CSS, JavaScript, Svelte 5, SvelteKit, and REST API. Use when editing
  frontend code, catalog pages, components, or API client calls.
---

# Frontend (onepoint)

## Product direction

**onepoint** is a **single furniture company's online store** for Azerbaijan (premium catalog / e-commerce feel — NOT a multi-seller marketplace).

- Only onepoint sells furniture — no user listings, no "Sat" / sell CTAs
- Homepage is **public** at `/`
- Realistic AZ content; placeholder product data from market research (e.g. embawood.az names/prices/images only — never copy their layout)
- All user-facing UI text in **Azerbaijani**
- Routes, file names, identifiers, and code comments in **English**

## Stack

HTML, CSS, JavaScript, Svelte 5 runes, SvelteKit. No third-party CSS/component libraries.

API: `/home/devl0pr/entertainment/onepoint/docs/openapi.yaml`

## UX principles

1. **Store-first** — browse catalog, search, categories, collections, company benefits
2. **Public homepage** — `/` does not require login
3. **Header** — logo, search, login/register OR user menu dropdown (Settings, Log out)
4. **No header nav tabs** — account via user menu only
5. **Settings** — `/settings` (auth required): Account, Password, Appearance
6. **Product cards** show price, collection, stock, delivery, warranty — no seller info

## Routing

| Route | Purpose |
|-------|---------|
| `/` | Store homepage (public) |
| `/catalog` | Full product catalog |
| `/category/[slug]` | Category listing |
| `/collection/[slug]` | Collection listing |
| `/product/[id]` | Product detail |
| `/search` | Search (`?q=`) |
| `/about`, `/stores`, `/delivery`, `/inspirations`, `/consultation` | Info pages |
| `/login`, `/register` | Auth (customers) |
| `/settings` | Account (auth required) |
| `/admin` | Admin app (separate layout, auth required) |
| `/admin/login` | Admin login |

## Admin app

Separate **command-center** UI at `/admin` — dark sidebar, indigo accent, data-dense tables. Not the store design.

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/products` | Product catalog management |
| `/admin/orders` | Orders |
| `/admin/customers` | Customers |
| `/admin/consultations` | Consultation requests (from store form) |
| `/admin/collections`, `/admin/categories` | Content structure |
| `/admin/analytics` | Analytics |
| `/admin/settings` | Admin settings |

- Access: `VITE_ADMIN_EMAILS` (comma-separated). Empty = any authenticated user (dev only).
- Styles: `src/lib/styles/admin.css`
- Components: `src/lib/components/admin/`

## File layout

```
src/lib/data/marketplace.js
src/lib/components/marketplace/
src/lib/styles/marketplace.css
src/routes/(store)/
src/routes/(admin)/admin/
src/routes/settings/
```

## SvelteKit

- `settings/+layout.svelte` — auth guard + MarketplaceHeader
- Env: `VITE_API_URL`
