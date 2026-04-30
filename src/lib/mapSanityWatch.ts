import type { Watch, WatchAvailability } from "../data/watches";
import type { SanityWatchDocument } from "./sanityTypes";
import { resolvePrimaryImageFromWire } from "./watchImages";

const WATCH_CONDITIONS = new Set<string>(["unworn", "excellent", "very-good", "good", "fair"]);

function mapCondition(raw: string | null | undefined): Watch["condition"] | undefined {
  const v = raw?.trim().toLowerCase();
  if (v && WATCH_CONDITIONS.has(v)) return v as Watch["condition"];
  return undefined;
}

function deriveDiscountPercent(price: number, compareAt: number): number | undefined {
  if (!(compareAt > price) || compareAt <= 0) return undefined;
  const pct = Math.round((1 - price / compareAt) * 100);
  if (pct <= 0 || pct > 100) return undefined;
  return pct;
}

function nonEmptyStrings(urls: (string | null | undefined)[] | null | undefined): string[] {
  if (!urls?.length) return [];
  return urls.filter((u): u is string => typeof u === "string" && u.length > 0);
}

function mapAvailability(doc: SanityWatchDocument): WatchAvailability {
  const a = doc.availability?.trim();
  if (a === "available" || a === "out-of-stock" || a === "pre-order") return a;
  if (typeof doc.stock === "number" && doc.stock === 0) return "out-of-stock";
  return "available";
}

function mapStockQuantity(doc: SanityWatchDocument): number | undefined {
  if (typeof doc.stockQuantity === "number" && Number.isFinite(doc.stockQuantity) && doc.stockQuantity > 0) {
    return Math.floor(doc.stockQuantity);
  }
  if (typeof doc.stock === "number" && Number.isFinite(doc.stock) && doc.stock > 0) {
    return Math.floor(doc.stock);
  }
  return undefined;
}

/**
 * Maps a Sanity GROQ row to the app's Watch shape. Returns null if `slug` is missing (invalid for routing/cart).
 */
export function mapSanityDocumentToWatch(doc: SanityWatchDocument): Watch | null {
  const slug = doc.slug?.trim();
  if (!slug) return null;

  const images = nonEmptyStrings(doc.images ?? []);
  const rawPrimary =
    typeof doc.image === "string" && doc.image.trim().length > 0 ? doc.image.trim() : null;
  const mainImage = resolvePrimaryImageFromWire(rawPrimary, images);

  const s = doc.specs ?? {};
  const specs = {
    movement: (s.movement ?? "").trim(),
    dial: (s.dial ?? "").trim(),
    case: (s.case ?? "").trim(),
    powerReserve: (s.powerReserve ?? "").trim(),
    waterResistance: (s.waterResistance ?? "").trim(),
    strapOrBracelet: (s.strapOrBracelet ?? "").trim(),
  };

  const price = typeof doc.price === "number" && Number.isFinite(doc.price) ? doc.price : 0;
  const compareRaw =
    typeof doc.compareAtPrice === "number" && Number.isFinite(doc.compareAtPrice)
      ? doc.compareAtPrice
      : undefined;
  const compareAtPrice = compareRaw != null && compareRaw > price ? compareRaw : undefined;

  let discountPercent: number | undefined =
    typeof doc.discountPercent === "number" &&
    Number.isFinite(doc.discountPercent) &&
    doc.discountPercent > 0 &&
    doc.discountPercent <= 100
      ? Math.round(doc.discountPercent)
      : undefined;
  if (discountPercent == null && compareAtPrice != null) {
    discountPercent = deriveDiscountPercent(price, compareAtPrice);
  }

  const modelYear =
    typeof doc.modelYear === "number" && Number.isFinite(doc.modelYear)
      ? Math.floor(doc.modelYear)
      : undefined;

  const availability = mapAvailability(doc);
  const stockQuantity = mapStockQuantity(doc);

  const watch: Watch = {
    id: slug,
    name: (doc.name ?? "").trim() || "Untitled",
    collection: (doc.collection ?? "").trim() || "Collection",
    price,
    image: mainImage,
    description: (doc.description ?? "").trim() || "",
    specs,
    images,
    availability,
  };

  if (stockQuantity != null) watch.stockQuantity = stockQuantity;

  if (doc.category != null && String(doc.category).trim()) {
    watch.category = String(doc.category).trim();
  }
  if (doc.featured === true) watch.featured = true;
  if (doc.isNewArrival === true) watch.isNewArrival = true;
  if (doc.isLimitedEdition === true) watch.isLimitedEdition = true;

  if (compareAtPrice != null) watch.compareAtPrice = compareAtPrice;
  if (discountPercent != null) watch.discountPercent = discountPercent;
  if (modelYear != null) watch.modelYear = modelYear;
  const condition = mapCondition(doc.condition ?? undefined);
  if (condition) watch.condition = condition;

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
