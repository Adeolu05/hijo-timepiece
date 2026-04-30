import type { Watch } from "../data/watches";

/** Items per page on `/shop` (URL `?page=`). */
export const SHOP_PAGE_SIZE = 20;

export type ShopSort = "name" | "price-asc" | "price-desc" | "newest";

export interface ShopCatalogParams {
  q?: string | null;
  category?: string | null;
  line?: string | null;
  newOnly?: boolean;
  sort?: ShopSort | null;
}

function matchesLine(watch: Watch, line: string): boolean {
  const c = watch.collection.toLowerCase();
  const n = watch.name.toLowerCase();
  switch (line) {
    case "complications":
      return /complication/.test(c) || /complication/.test(n) || /moonphase|gmt|chrono|tourbillon/i.test(n + c);
    case "precious":
      return /precious|gold|platinum|rose gold|yellow gold|white gold/i.test(c + n);
    case "skeleton":
      return /skeleton/.test(c) || /skeleton/.test(n);
    default:
      return true;
  }
}

/** Client-side filter + sort. Does not change Sanity; works on loaded `Watch[]`. */
export function filterAndSortWatches(watches: Watch[], p: ShopCatalogParams): Watch[] {
  let list = [...watches];

  const q = p.q?.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.collection.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        (w.category?.toLowerCase().includes(q) ?? false),
    );
  }

  const cat = p.category?.trim().toLowerCase();
  if (cat) {
    list = list.filter((w) => {
      const wc = w.category?.trim().toLowerCase();
      if (!wc) return false;
      return wc === cat || wc.includes(cat);
    });
  }

  if (p.newOnly) {
    list = list.filter((w) => w.isNewArrival === true);
  }

  const line = p.line?.trim().toLowerCase();
  if (line && ["complications", "precious", "skeleton"].includes(line)) {
    list = list.filter((w) => matchesLine(w, line));
  }

  const sort = p.sort ?? "name";
  list.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "newest") {
      const na = a.isNewArrival ? 1 : 0;
      const nb = b.isNewArrival ? 1 : 0;
      if (nb !== na) return nb - na;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  return list;
}
