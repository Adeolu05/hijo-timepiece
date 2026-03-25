# Sanity: ownership, team access & editor handoff

This document explains how to run **Sanity** for **Hijo Multiservice Timepieces** when you are the **developer** but **not** the brand owner, and someone else will enter product data.

---

## 1. Two separate systems

| Piece | What it is | Typical owner |
|--------|------------|----------------|
| **Sanity project** | Content API + datasets + billing (free tier or paid) | **Business / brand** (recommended) |
| **Sanity Studio** | Admin UI to create and publish **Watch** documents | Same org as the project (editors log in here) |
| **This Vite storefront** | Public website; reads published content via `@sanity/client` | Your hosting; env vars point at the Sanity **project ID** + **dataset** |

The website does **not** need to live in the same GitHub account as Sanity. It only needs the correct **environment variables**.

---

## 2. Recommended end state

- The **brand** should **own** the Sanity project (billing, members, long-term control).
- You keep **Developer** (or **Administrator** during build-out) so you can adjust schema and project settings.
- **Editors** (brand staff) get **Editor** role: they add watches, upload images, and **Publish** — no code required.

**If the project was created on your personal Sanity account:**

1. Invite the brand owner (or their ops lead) as **Administrator**.
2. When they are comfortable, **transfer project ownership** to their account/organization (via [sanity.io/manage](https://www.sanity.io/manage)), **or** create a **new** project under **their** Sanity login and migrate content (export/import or re-enter).  
3. Update **production** env vars on hosting to the **final** project ID if it changes.

---

## 3. Inviting people to the project

1. Open **[sanity.io/manage](https://www.sanity.io/manage)** and sign in.
2. Select the **Hijo Multiservice Timepieces** (or **Hijo**) Sanity project.
3. Go to **Team** / **Members** / **Invite** (labels may vary slightly).
4. Enter the person’s **email**.
5. Choose a **role**:
   - **Administrator** — full control; use for the business owner or lead.
   - **Editor** — create, edit, and publish documents; limited access to technical settings. **Best for day-to-day product entry.**
   - **Developer** — schema, CLI, tokens; **use for you** as the implementer.
6. They **accept the invite** and sign in with Google/GitHub (whatever Sanity offers).

Editors never need access to this Git repository unless you want them to run Studio locally.

---

## 4. How editors add products (no code)

### Option A — Hosted / deployed Studio (best for non-technical editors)

- Deploy Studio once (Sanity’s **Deploy** flow from manage, or host the `hijo/` Studio app on Vercel/Netlify).
- Share the **Studio URL** with editors.
- They log in → **Structure** → **Watch** → **Create** → fill fields → **Publish**.

### Option B — Studio on their laptop (developer-style)

- From the `hijo` folder: `npm install` → `npm run dev`.
- Open the printed URL (often `http://localhost:3333`).
- Usually **not** ideal for the brand owner; prefer Option A for handoff.

---

## 5. Editor runbook (what to fill in for each watch)

The storefront expects documents with `_type == "watch"` (see schema in `hijo/schemaTypes/watch.ts` and mirror in `sanity/schemaTypes/watch.ts`).

| Field | Required for a good listing | Notes |
|--------|-----------------------------|--------|
| **Name** | Yes | Shown on shop and product page. |
| **Slug** | Yes | Becomes the URL: `/product/<slug>`. Use lowercase, hyphens, no spaces. **Do not change** casually — old links and saved carts can break. |
| **Collection** | Yes | Shown under the title; used for “related” products. |
| **Category** | For Men / Women filters | Set e.g. `men` or `women` so header links `?category=men` / `women` work. |
| **Price** | Yes | USD number. |
| **Stock** | Yes | Quantity; out-of-stock hides add-to-cart behavior. |
| **Description** | Yes | Product story / details. |
| **Primary image** | Yes | Main photo on grid and PDP. |
| **Gallery images** | Optional | Extra photos on the product page. |
| **Specifications** | Optional | Movement, case, power reserve, water resistance (defaults show “—” if empty). |
| **Featured / New arrival / Limited edition** | Optional | Flags for future use or merchandising. |

**Publish vs draft**

- The live site reads **published** content from the public API (default setup).
- Editors must click **Publish** for changes to appear on the website.

---

## 6. Developer checklist (you)

- [ ] **CORS**: In project **API** settings, add:
  - Local: `http://localhost:3000` (Vite dev).
  - Production: `https://your-real-domain.com` when you go live.
- [ ] **Env on hosting** (production build):
  - `VITE_SANITY_PROJECT_ID`
  - `VITE_SANITY_DATASET` (often `production`)
- [ ] **Hand off** Studio URL + this runbook to the client.
- [ ] **Schema changes**: If you add/remove fields, update **both** Studio copies if you keep two (`hijo/schemaTypes/watch.ts` and root `sanity/schemaTypes/watch.ts`) so they stay in sync.

---

## 7. Optional: staging vs production datasets

- **`production`** — what the live site should use.
- **`development`** (or `staging`) — train editors or test content without affecting the live catalog; point a **preview** deployment’s env at that dataset only.

---

## 8. Security & access (short)

- Do **not** commit **tokens** or secrets unless your hosting requires a server-side token (this storefront uses public read + CDN by default).
- If someone leaves the team, **remove** them from the Sanity project members list.
- **Project ID** in the browser is public; real security is dataset rules and not exposing write tokens in frontend code.

---

## 9. Quick reference links

- Manage projects: [https://sanity.io/manage](https://sanity.io/manage)  
- Project schema (reference): `hijo/schemaTypes/watch.ts`  
- Storefront GROQ (reference): `src/lib/sanity.ts`  
- Longer ops notes (env, Vision, CORS): `sanity/OPERATIONS.md`  

---

## 10. Email you can send to the client (template)

> Subject: Access to your product catalog (Sanity)  
>  
> Hi [Name],  
>  
> Your website’s products are managed in **Sanity** — a web-based editor (no code).  
>  
> 1. Accept the invite I sent to your email from Sanity.  
> 2. Open this link to the admin: **[YOUR STUDIO URL]**  
> 3. Go to **Watch** → **Create** (or edit an existing watch).  
> 4. Fill in name, **slug** (URL), price, stock, description, and **primary image**, then click **Publish**.  
>  
> The slug becomes: `https://yoursite.com/product/your-slug` — please avoid changing slugs after launch unless we coordinate.  
>  
> If anything fails to appear on the site, check that the document is **Published** (not draft only).  
>  
> Best,  
> [You]

---

*Last note: Privacy/Terms on the site are templates; have a lawyer review for your jurisdiction. This handoff doc is operational guidance, not legal advice.*
