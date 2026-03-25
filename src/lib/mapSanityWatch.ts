import type { Watch } from "../data/watches";
import type { SanityWatchDocument } from "./sanityTypes";

function nonEmptyStrings(urls: (string | null | undefined)[] | null | undefined): string[] {
  if (!urls?.length) return [];
  return urls.filter((u): u is string => typeof u === "string" && u.length > 0);
}

/**
 * Maps a Sanity GROQ row to the app's Watch shape. Returns null if `slug` is missing (invalid for routing/cart).
 */
export function mapSanityDocumentToWatch(doc: SanityWatchDocument): Watch | null {
  const slug = doc.slug?.trim();
  if (!slug) return null;

  const images = nonEmptyStrings(doc.images ?? []);
  const mainImage =
    (typeof doc.image === "string" && doc.image.length > 0 ? doc.image : null) ||
    images[0] ||
    "";

  const s = doc.specs ?? {};
  const specs = {
    movement: (s.movement ?? "").trim() || "—",
    case: (s.case ?? "").trim() || "—",
    powerReserve: (s.powerReserve ?? "").trim() || "—",
    waterResistance: (s.waterResistance ?? "").trim() || "—",
  };

  const price = typeof doc.price === "number" && Number.isFinite(doc.price) ? doc.price : 0;
  const stock =
    typeof doc.stock === "number" && Number.isFinite(doc.stock) && doc.stock >= 0
      ? Math.floor(doc.stock)
      : 0;

  const watch: Watch = {
    id: slug,
    name: (doc.name ?? "").trim() || "Untitled",
    collection: (doc.collection ?? "").trim() || "Collection",
    price,
    image: mainImage,
    description: (doc.description ?? "").trim() || "",
    specs,
    images,
    stock,
  };

  if (doc.category != null && String(doc.category).trim()) {
    watch.category = String(doc.category).trim();
  }
  if (doc.featured === true) watch.featured = true;
  if (doc.isNewArrival === true) watch.isNewArrival = true;
  if (doc.isLimitedEdition === true) watch.isLimitedEdition = true;

  return watch;
}

export function mapSanityDocumentsToWatches(docs: SanityWatchDocument[]): Watch[] {
  const bySlug = new Map<string, Watch>();
  for (const doc of docs) {
    const watch = mapSanityDocumentToWatch(doc);
    if (watch && !bySlug.has(watch.id)) bySlug.set(watch.id, watch);
  }
  return Array.from(bySlug.values());
}
