# Release Notes

## 2026-04-27

- Improved mobile storefront UX across Home, Shop, and Product pages:
  - tighter mobile card sizing,
  - 2-up mobile shop grid,
  - reduced Product page hero image size,
  - swipeable Discovery row.
- Added `dial` field support end-to-end in watch specs:
  - Sanity schema,
  - Sanity query/types mapping,
  - app model mapping.
- Strengthened SEO/indexing foundations:
  - canonical + social base tags,
  - route/product metadata updates,
  - `robots.txt` sitemap reference,
  - `sitemap.xml`,
  - Google Search Console verification file.
- Stability fixes:
  - reverted risky product route rewrite experiment,
  - fixed ProductDetail hook-order crash on direct product URL loads.
- Deployment hardening:
  - switched Vercel config to `handle: filesystem` + SPA fallback route to avoid future route collisions.
