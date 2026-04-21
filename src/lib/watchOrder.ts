import type { Watch, WatchAvailability } from "../data/watches";

const DEFAULT_MAX_QTY = 99;

/** Hydrated carts may omit `availability`; infer from legacy `stock` when needed. */
export function resolveWatchAvailability(watch: Watch): WatchAvailability {
  const a = watch.availability;
  if (a === "available" || a === "out-of-stock" || a === "pre-order") return a;
  if (typeof watch.stock === "number" && watch.stock === 0) return "out-of-stock";
  return "available";
}

/** Cart / quantity controls: available + pre-order can order; out-of-stock cannot. */
export function isStorefrontPurchasable(watch: Watch): boolean {
  const a = resolveWatchAvailability(watch);
  return a === "available" || a === "pre-order";
}

/**
 * Max units per line item. Uses optional internal `stockQuantity` when set &gt; 0;
 * otherwise a generous default (concierge / pre-order). Legacy persisted carts may still have `stock`.
 */
export function getMaxOrderQuantity(watch: Watch): number {
  if (!isStorefrontPurchasable(watch)) return 0;
  const internal =
    typeof watch.stockQuantity === "number" && watch.stockQuantity > 0
      ? watch.stockQuantity
      : typeof watch.stock === "number" && watch.stock > 0
        ? watch.stock
        : null;
  return internal != null ? internal : DEFAULT_MAX_QTY;
}
