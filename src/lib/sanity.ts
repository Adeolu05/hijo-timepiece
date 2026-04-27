import { createClient } from "@sanity/client";
import type { SanityWatchDocument } from "./sanityTypes";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "demo",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2023-05-03",
});

/** Shared GROQ projection: public id in the app is `slug` (slug.current), not `_id`. */
const watchProjection = `{
  "slug": slug.current,
  name,
  collection,
  category,
  price,
  "image": image.asset->url,
  description,
  specs {
    movement,
    dial,
    case,
    powerReserve,
    waterResistance,
    strapOrBracelet
  },
  "images": coalesce(images[].asset->url, []),
  featured,
  isNewArrival,
  isLimitedEdition,
  availability,
  stockQuantity,
  stock
}`;

export const queries = {
  getAllWatches: `*[_type == "watch" && defined(slug.current)] | order(name asc) ${watchProjection}`,
  /** For optional single-document fetch; same shape as list rows. */
  getWatchBySlug: `*[_type == "watch" && slug.current == $slug][0] ${watchProjection}`,
};

export type { SanityWatchDocument };
