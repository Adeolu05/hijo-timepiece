# Sanity integration — operations

## 1) Frontend data contract (source of truth)

### `Watch` shape (`src/data/watches.ts`)

| Field | Type | Notes |
|--------|------|--------|
| `id` | `string` | **Always** `slug.current` from Sanity (public URL segment). Never `_id`. |
| `name` | `string` | Required for sensible UI; mapper falls back to `"Untitled"`. |
| `collection` | `string` | Mapper fallback `"Collection"`. |
| `category` | `string` (optional) | |
| `price` | `number` | **Selling price** in NGN; cart & JSON-LD use this amount. |
| `compareAtPrice` | `number` (optional) | Original list price when on sale; must be &gt; `price` to display struck through. |
| `discountPercent` | `number` (optional) | 0–100 badge; derived from compare-at vs price when omitted. |
| `modelYear` | `number` (optional) | Model or manufacture year. |
| `condition` | `string` (optional) | One of `unworn`, `excellent`, `very-good`, `good`, `fair`. |
| `description` | `string` | Mapper default `""`. |
| `image` | `string` | Main image URL; uses primary image or first gallery URL; may be `""` if missing (avoid—set **Primary image** in Studio). |
| `images` | `string[]` | Gallery URLs after GROQ resolves assets. |
| `specs` | object | `movement`, `case`, `powerReserve`, `waterResistance` — strings; mapper uses `"—"` if empty. |
| `featured` | `boolean` (optional) | From Sanity `featured`. |
| `isNewArrival` | `boolean` (optional) | |
| `isLimitedEdition` | `boolean` (optional) | |
| `stock` | `number` | Non-negative integer; mapper defaults `0`. |

### GROQ projection (`src/lib/sanity.ts`)

Documents must have `_type == "watch"` and `defined(slug.current)`. Fetched fields include: `slug` (as `slug.current`), `name`, `collection`, `category`, `price`, `compareAtPrice`, `discountPercent`, `modelYear`, `condition`, `image` (asset URL), `description`, `specs` subfields, `images` (URLs), `featured`, `isNewArrival`, `isLimitedEdition`, `availability`, `stockQuantity`, `stock`.

### When local `WATCHES` is used (`src/store/productStore.ts`)

- `VITE_SANITY_PROJECT_ID` unset → client uses project id `demo` → **only** `WATCHES`.
- Fetch error or **zero** mappable watches → **fallback** to `WATCHES`.

---

## A) Final Studio-ready schema

**File:** `sanity/schemaTypes/watch.ts` — uses `defineType` / `defineField` from `sanity`.

**Wire-up in your Studio repo** (`sanity.config.ts`):

```ts
import { defineConfig } from "sanity";
import { watchType } from "./path/to/hijo-lux-watches/sanity/schemaTypes/watch";

export default defineConfig({
  // ...projectId, dataset, plugins
  schema: {
    types: [watchType],
  },
});
```

Or re-export from `sanity/schemaTypes/index.ts` (`schemaTypes` array).

**DevDependency:** this storefront repo lists `sanity` under `devDependencies` so the schema file type-checks when you run `tsc` from the repo root.

---

## B) Example documents

See `sanity/examples/sample-watches.json` for three realistic field sets.

**In Studio, for each row:**

1. Create **Watch**.
2. Set **Slug** to the `slugCurrent` value (e.g. `vanguard-skeleton`) so URLs are `/product/vanguard-skeleton`.
3. Copy text/number/boolean/spec fields from the JSON.
4. **Upload** primary image (required) and optional gallery images.

---

## C) Setup checklist

### Environment variables (Vite)

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SANITY_PROJECT_ID` | Yes, for live Sanity | Real project id from sanity.io. If missing, app stays on `demo` + local `WATCHES`. |
| `VITE_SANITY_DATASET` | Optional | Defaults to `production` in code if unset. |

Add to `.env.local` at the repo root (never commit secrets):

```env
VITE_SANITY_PROJECT_ID=yourProjectId
VITE_SANITY_DATASET=production
```

### Sanity Studio

1. Create or open a Sanity project; note **Project ID** and **Dataset** name.
2. Add the `watch` schema (`watchType`) to Studio `schema.types`.
3. Deploy or run Studio; create at least one **Watch** with a **Slug** and **Primary image**; **Publish** documents (drafts are not returned by default public API unless using token/draft perspective).

### Sanity dashboard (sanity.io/manage)

1. **CORS origins:** add your local dev origin, e.g. `http://localhost:3000` (and production URL when deployed). Required for browser `fetch` from `@sanity/client`.
2. Confirm **dataset** exists and matches `VITE_SANITY_DATASET`.
3. If the dataset is private or you use tokens, configure access accordingly (default public read for `useCdn` expects typical public dataset rules).

### Local app before testing

1. `npm install`
2. Create `.env.local` with `VITE_SANITY_*` as above.
3. `npm run dev` (default port in this project: **3000** per `package.json` script).
4. Hard-refresh or clear site data if you switched from fallback to Sanity (product store caches after first successful load; cart uses `hijo-lux-cart-v2`).

---

## D) Frontend verification checklist

### Homepage reading from Sanity

- Set real `VITE_SANITY_PROJECT_ID`; ensure published watches exist.
- Open `/`; featured section uses `watches` from the store (first items in store order after fetch).
- **Confirm:** Temporarily change a watch **name** in Sanity, publish, hard refresh (or new session with empty store cache). Title on home/grid should reflect Sanity.  
- **Or:** DevTools → Network: look for requests to `*.apicdn.sanity.io` (or your API host) when loading `/`.

### Shop reading from Sanity

- Open `/shop`; product grid should list only watches returned by GROQ (with slug).
- **Confirm:** Count matches Sanity document count (with slug), not necessarily the 9 mock rows.

### Product detail + slug routing

- From shop, open a product; URL must be `/product/<slug>`.
- **Confirm:** Manually open `/product/<known-slug>` in a new tab; PDP loads after fetch.

### Related products

- Open a PDP; scroll to “You May Also Appreciate”.
- **Confirm:** Cards are other watches (same collection preferred); links use `/product/<slug>`.

### Cart

- Add to cart from PDP; open `/cart`; quantity and line totals update.
- **Confirm:** Refresh page — cart persists (Zustand persist).

### WhatsApp checkout

- On `/cart`, fill name + phone, **Proceed to WhatsApp**; WhatsApp opens with order text.
- **Confirm:** Message lists items and totals (unchanged flow).

### Fallback no longer used

- With valid env and ≥1 valid published watch, you should **not** see the console warning: `Sanity returned no valid watches... using local WATCHES fallback` or `Failed to fetch from Sanity`.
- **Confirm:** In DevTools → Console: no fallback warnings; Network shows successful Sanity fetch.
- **Extra:** Temporarily set wrong `VITE_SANITY_PROJECT_ID` — app should warn and show mock catalog (proves fallback path still works).

---

## Small frontend change (featured)

The Studio schema and GROQ include a boolean **`featured`** field. The app now maps it to optional **`Watch.featured`** so content and types stay aligned. The current UI does not display it yet; no layout changes were made.
