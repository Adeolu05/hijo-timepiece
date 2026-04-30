import { createClient } from "@sanity/client";
import type { SanityWatchDocument } from "./sanityTypes";
import type { SanityJournalDetail, SanityJournalListItem } from "./journalTypes";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "demo",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2023-05-03",
});

export function isDemoSanityClient(): boolean {
  return sanityClient.config().projectId === "demo";
}

/** Shared GROQ projection: public id in the app is `slug` (slug.current), not `_id`. */
const watchProjection = `{
  "slug": slug.current,
  name,
  collection,
  category,
  price,
  compareAtPrice,
  discountPercent,
  modelYear,
  condition,
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

const journalListProjection = `{
  "slug": slug.current,
  title,
  publishedAt,
  excerpt,
  "coverImage": coverImage.asset->url
}`;

const journalDetailProjection = `{
  "slug": slug.current,
  title,
  publishedAt,
  excerpt,
  "coverImage": coverImage.asset->url,
  "body": body[] {
    _key,
    _type,
    caption,
    url,
    text,
    "imageUrl": image.asset->url
  }
}`;

export const queries = {
  getAllWatches: `*[_type == "watch" && defined(slug.current)] | order(name asc) ${watchProjection}`,
  /** For optional single-document fetch; same shape as list rows. */
  getWatchBySlug: `*[_type == "watch" && slug.current == $slug][0] ${watchProjection}`,
  getAllJournalPosts: `*[_type == "journalPost" && defined(slug.current)] | order(publishedAt desc) ${journalListProjection}`,
  getJournalPostBySlug: `*[_type == "journalPost" && slug.current == $slug][0] ${journalDetailProjection}`,
};

export type { SanityWatchDocument, SanityJournalListItem, SanityJournalDetail };
