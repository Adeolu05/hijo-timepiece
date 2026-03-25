# Hijo Timepiece

A luxury watch storefront built with **React**, **Vite**, and **TypeScript**. Product data is managed in **Sanity** and loaded at runtime; without Sanity credentials configured, the app falls back to bundled demo catalog data.

## Stack

- **Storefront** — Vite 6, React 19, React Router, Tailwind CSS, Zustand
- **CMS** — Sanity (`hijo/` is the Studio editors use; `sanity/` holds additional schema/docs used in this repo)

## Requirements

- Node.js 20+ (LTS recommended)
- npm

## Local development

```bash
npm install
npm run dev
```

The dev server runs at **http://localhost:3000** by default.

### Environment variables

Create a **`.env.local`** file in the project root (this file is gitignored). Vite only exposes variables prefixed with `VITE_`:

| Variable | Description |
|----------|-------------|
| `VITE_SANITY_PROJECT_ID` | Your Sanity project ID. If omitted, the app uses the built-in demo project id and local fallback watches. |
| `VITE_SANITY_DATASET` | Dataset name, usually `production` or `development`. |

Example:

```env
VITE_SANITY_PROJECT_ID=yourProjectId
VITE_SANITY_DATASET=production
```

In the Sanity project **API** settings, add your origins to **CORS**: `http://localhost:3000` for local dev, and your production URL when deployed.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

## Sanity Studio (`hijo/`)

Editors manage **Watch** documents here. From the `hijo` directory:

```bash
cd hijo
npm install
npm run dev
```

To host Studio for your team (recommended for non-technical editors):

```bash
npm run deploy
```

That uses Sanity’s hosted Studio URL. Alternatively, build with `npm run build` and deploy the output on your own host.

Schema for watches lives in `hijo/schemaTypes/watch.ts`. If you maintain the duplicate under `sanity/schemaTypes/`, keep both in sync when you change fields.

## Deploying the storefront

1. Set `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` on your host (e.g. Vercel, Netlify, Cloudflare Pages).
2. Build: `npm run build`.
3. Serve the **`dist`** directory as a static site.
4. Add your live site URL to Sanity **CORS**.

Published content only appears on the site after documents are **Published** in Studio, not while they are draft-only.

## Repository layout

```
├── src/           # Storefront application
├── public/        # Static assets
├── hijo/          # Sanity Studio (admin UI)
├── sanity/        # Schema samples, operations notes
└── package.json   # Storefront dependencies & scripts
```

Further Sanity operations (Vision, datasets, etc.) are described in `sanity/OPERATIONS.md`.

## License

Private — all rights reserved.
