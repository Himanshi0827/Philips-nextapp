@AGENTS.md

# Philips-nextapp

Conga Agreement Line Item (ALI) management UI. Create, edit, clone, amend, terminate agreements and members against the Conga REST API. Originally a React SPA; mid-conversion to Next.js 16 App Router.

## Stack

- Next.js 16.2.4 (App Router, Turbopack)
- React 19.2.4
- TypeScript 5.4
- Tailwind v4 (PostCSS plugin)
- `oidc-client-ts` (OIDC auth)
- `zustand` (state)
- `axios`, `react-select`, `react-toastify`

## Scripts

- `npm install`
- `npm run dev` — dev server on port 3000
- `npm run build` — production build (currently bypasses type-checking, see Known issues)
- `npm run start`
- `npm run lint`

## Layout

- `app/` — Next.js App Router. Every page currently uses `'use client'` (the routes were ported from a React SPA and still rely on browser-side hooks for params/state).
- `src/` — original React code reused by the app routes:
  - `src/api/` — data layer and OIDC (`api.ts`, `member.ts`, query helpers)
  - `src/components/` — shared UI (`TopBar`, `Sidebar`, `MemberSearch`, `ProductList`, etc.)
  - `src/forms/`, `src/EditForms/` — page-level form components
  - `src/Member/` — member-related views
  - `src/CSS/` — per-page stylesheets, imported directly by the component that needs them

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing page with a Sign-in button |
| `/callback` | OIDC redirect handler |
| `/[agreementId]` | Agreement detail |
| `/amend/[agreementId]` | Amend an agreement |
| `/edit/[agreementId]` | Edit an agreement |
| `/clone/[agreementId]` | Clone an agreement |
| `/clone-members/[agreementId]` | Clone members onto another agreement |
| `/extension/[agreementId]` | Extend an agreement |
| `/terminate/[agreementId]` | Terminate an agreement |
| `/member/[agreementId]` | Member list for an agreement |
| `/member-detail/[memberId]` | Single member detail |
| `/new-agreement/[agreementId]` | Create a new agreement |
| `/newALIfromquote` | Create new ALI from a quote |

All routes are dynamically rendered — see `export const dynamic = "force-dynamic"` in [app/layout.tsx](app/layout.tsx). The auth flow reads `sessionStorage` during initial render, which is undefined during static prerender, so static export is disabled app-wide.

## Auth flow

`login()` in [src/api/api.ts](src/api/api.ts) calls `userManager.signinRedirect()`. Conga redirects back to `/callback`, which runs `handleCallback()` and stores the user in `sessionStorage`. `getAccessToken()` reads the bearer token from `sessionStorage` for every API request.

## Conventions

- **Imports**: pages currently use relative paths like `../../src/api/...`. The `@/*` alias is configured in `tsconfig.json` — prefer `@/src/...` for new code (used in [app/page.tsx](app/page.tsx)).
- **CSS**: per-page stylesheets live in `src/CSS/` and are imported directly by the page or component that needs them. Tailwind v4 is globally available via [app/globals.css](app/globals.css) (`@import "tailwindcss";`).

## Env vars

See [.env.example](.env.example). Required when the env-var refactor (see Known issues) lands:

- `NEXT_PUBLIC_OIDC_AUTHORITY`
- `NEXT_PUBLIC_OIDC_CLIENT_ID`
- `NEXT_PUBLIC_OIDC_REDIRECT_URI`
- `NEXT_PUBLIC_API_BASE_URL`

**The code does not read these yet.** URLs are hardcoded in `src/api/*.ts`. This refactor is required before either Vercel or Netlify deploys can authenticate end-to-end.

## Deployment

The repo is configured to deploy to **both Vercel and Netlify**. Pick one (or run both for testing) — the two configs don't conflict.

### Vercel

1. Push the repo to GitHub.
2. Import in Vercel — framework is auto-detected as Next.js (default build/install/output commands work).
3. Under Project Settings → Environment Variables, set the four `NEXT_PUBLIC_*` vars for Production and Preview.
4. Register `https://<vercel-domain>/callback` as an allowed redirect URI in the Conga OIDC client. Without this, login fails with `invalid redirect_uri`.

No `vercel.json` needed for a baseline deploy. Default Node runtime is fine.

### Netlify

[netlify.toml](netlify.toml) declares the build command and the `@netlify/plugin-nextjs` runtime plugin (Netlify auto-installs declared plugins).

1. Push the repo to GitHub.
2. In Netlify, "Add new site" → "Import an existing project" → pick the repo. Build command and publish directory are read from `netlify.toml`.
3. Under Site settings → Environment variables, set the four `NEXT_PUBLIC_*` vars.
4. Register `https://<netlify-domain>/callback` as an allowed redirect URI in the Conga OIDC client.

The `@netlify/plugin-nextjs` plugin handles SSR/serverless routing for the dynamically-rendered routes (see `force-dynamic` note above).

## Known issues

**Build bypasses TypeScript type-checking.** [next.config.ts](next.config.ts) sets `typescript.ignoreBuildErrors: true` because the converted code has ~1100 pre-existing TS strict-mode errors across 39 files (implicit-any params, missing `useState` generics producing `never` types, `useParams()` returning `ParamValue | undefined` used where `string` is expected). Builds succeed and Vercel / Netlify deploys will work, but type errors will not block CI until this flag is removed. Top offenders:

- `app/clone/[agreementId]/page.tsx` (138 errors)
- `src/components/DiscountPop.tsx` (116)
- `app/new-agreement/[agreementId]/page.tsx` (96)
- `src/forms/ProductSelectionForm.tsx` (87)
- `src/Member/Designation.tsx` (84)
- `src/EditForms/EditDiscountPricingStrategyForm.tsx` (81)
- `app/[agreementId]/page.tsx` (80)

**`npm run lint` fails** with `react-hooks/immutability` (functions referenced before declaration in `useEffect`), `no-var`, and `react/no-unescaped-entities` errors. Pre-existing from the conversion. Next.js 16 no longer runs ESLint as part of `next build`, so this doesn't block builds — but `npm run lint` should pass before the codebase is considered clean.

## Follow-ups

- Refactor `src/api/api.ts` and its nine siblings (`GetLookup`, `GetParentProduct`, `GetPicklist`, `GetProductsByParent`, `member`, `PriceList`, `queryAgreementLineItemsByAgreement`, `Records`, `SearchLookup`) to read `process.env.NEXT_PUBLIC_*` instead of literal URLs. Required for either Vercel or Netlify deploys to authenticate.
- Fix the TS errors per the Known issues list, then drop `typescript.ignoreBuildErrors` from [next.config.ts](next.config.ts).
- Fix the lint errors so `npm run lint` exits 0.
- Migrate relative `../../src/...` imports to the `@/*` alias.
- Drop the unused `toastify@^2.0.1` from `package.json` (duplicate of `react-toastify`).
- Once auth is server-render-safe (e.g. cookie-based instead of `sessionStorage`), drop `export const dynamic = "force-dynamic"` from [app/layout.tsx](app/layout.tsx) to allow static optimization for read-only routes.
