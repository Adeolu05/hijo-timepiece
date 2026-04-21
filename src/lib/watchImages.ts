import type { Watch } from "../data/watches";

/**
 * Reliable fallback when Sanity/local data has no usable image URL (missing asset, empty string, etc.).
 * HTTPS, permissive CDN; used only when no primary or gallery URL exists.
 */
export const FALLBACK_WATCH_IMAGE_URL =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1600&auto=format&fit=crop";

function firstNonEmpty(...urls: (string | null | undefined)[]): string | null {
  for (const u of urls) {
    if (typeof u === "string" && u.trim().length > 0) return u.trim();
  }
  return null;
}

/** Resolve primary image from a wire row before mapping to {@link Watch}. */
export function resolvePrimaryImageFromWire(
  imageField: string | null | undefined,
  gallery: (string | null | undefined)[] | null | undefined,
): string {
  const fromGallery = gallery?.map((u) => (typeof u === "string" ? u.trim() : "")).filter(Boolean) ?? [];
  const url = firstNonEmpty(imageField, ...fromGallery);
  return url ?? FALLBACK_WATCH_IMAGE_URL;
}

/** Resolve display URL for a {@link Watch} (primary `image`, then `images[]`, then global fallback). */
export function resolveWatchImageUrl(watch: Pick<Watch, "image" | "images">): string {
  const url = firstNonEmpty(watch.image, ...(watch.images ?? []));
  return url ?? FALLBACK_WATCH_IMAGE_URL;
}
