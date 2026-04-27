# Safe Product OG Preview Plan (No `/product` Routing Risk)

## Goal

Enable product-specific social previews (WhatsApp, Facebook, X, Telegram) without touching live SPA route behavior for `/product/:slug`.

## Guardrail

Do not add rewrites/redirects/middleware that intercept `/product/:slug` for normal web traffic.

## Recommended Approach

### 1) Add a separate share-only route

- Introduce a dedicated URL pattern: `/share/product/:slug`
- This route is only for social sharing cards and can be handled by a serverless endpoint.
- Keep normal storefront links and navigation on `/product/:slug`.

### 2) Build serverless OG HTML response for share route

- Add endpoint that returns small HTML with:
  - `og:title`, `og:description`, `og:image`, `og:url`
  - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
  - canonical to `/product/:slug` (or share URL, based on strategy)
- Fetch product metadata from Sanity by slug.
- Include graceful fallback metadata if product lookup fails.

### 3) Keep user flow unchanged

- In body, include a normal link/button to the product URL.
- Optional: client-side redirect after short delay for human visitors.
- Never rewrite `/product/:slug`; only serve metadata on `/share/product/:slug`.

### 4) Share link strategy

- Use `/share/product/:slug` in outbound share actions (WhatsApp/Telegram/social posts).
- Keep internal browsing links as `/product/:slug`.

## Rollout Plan

1. Implement `/share/product/:slug` endpoint in staging/preview.
2. Validate in:
   - Meta Sharing Debugger,
   - WhatsApp,
   - Telegram,
   - X/Twitter validator (if available).
3. Confirm `/product/:slug` direct-open behavior is unchanged.
4. Release with a kill switch:
   - easy disable by removing share route only.

## Verification Checklist

- [ ] Direct product URL opens normally from address bar.
- [ ] Product URL works through in-app navigation.
- [ ] Share URL returns correct OG/Twitter tags per slug.
- [ ] No blank pages or redirect loops.
- [ ] Meta debugger "Scrape Again" reflects latest preview.
