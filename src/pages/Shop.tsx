import { useMemo, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { ProductCard } from "../components/ProductCard";
import { filterAndSortWatches, type ShopSort } from "../lib/shopCatalog";

function useShopParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleLine = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (next.get("line") === value) next.delete("line");
          else next.set("line", value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const line = searchParams.get("line");
  const newOnly = searchParams.get("new") === "1";
  const sortRaw = searchParams.get("sort");
  const sort: ShopSort =
    sortRaw === "price-asc" || sortRaw === "price-desc" || sortRaw === "newest" || sortRaw === "name"
      ? sortRaw
      : "name";

  const setParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === null || value === "") next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    setSearchParams,
    q,
    category,
    line,
    newOnly,
    sort,
    setParam,
    clearFilters,
    toggleLine,
  };
}

export function Shop() {
  const { watches, fetchWatches, isLoading, error, clearCatalogError } = useProductStore();
  const { q, category, line, newOnly, sort, setParam, clearFilters, toggleLine, setSearchParams } =
    useShopParams();

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  const displayed = useMemo(
    () =>
      filterAndSortWatches(watches, {
        q: q || undefined,
        category: category || undefined,
        line: line || undefined,
        newOnly,
        sort,
      }),
    [watches, q, category, line, newOnly, sort],
  );

  const isAllActive = !category && !line && !newOnly && !q;
  const sortLabel =
    sort === "newest"
      ? "New arrivals first"
      : sort === "price-asc"
        ? "Price: low to high"
        : sort === "price-desc"
          ? "Price: high to low"
          : "Name A–Z";

  return (
    <div className="min-h-screen bg-background pt-48 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-12">
        {error && (
          <div
            className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-secondary/30 bg-secondary/5 px-6 py-4 text-sm text-primary"
            role="status"
          >
            <p className="font-light leading-relaxed pr-4">{error}</p>
            <button
              type="button"
              onClick={clearCatalogError}
              className="wide-label !text-[9px] shrink-0 text-secondary font-bold hover:text-primary border-b border-secondary/40 pb-0.5 self-start sm:self-center"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-4xl">
              <span className="wide-label text-secondary mb-8 block font-bold tracking-[0.4em]">
                THE CURATED ARCHIVE
              </span>
              <h1 className="font-headline text-7xl md:text-[9rem] text-primary tight-headline mb-12">
                Masterpieces <br />
                <span className="italic font-serif opacity-60">of Horology</span>
              </h1>
              <p className="text-on-surface-variant max-w-2xl text-xl font-light leading-relaxed italic font-serif opacity-70">
                Explore our selection of luxury, vintage, and modern timepieces — authenticated and
                offered with transparent service.
              </p>
            </div>
            <div className="flex flex-col items-stretch md:items-end gap-6 w-full md:w-auto max-w-md">
              <label htmlFor="shop-search" className="wide-label !text-[9px] text-on-surface-variant/50 font-bold sr-only">
                Search collection
              </label>
              <div id="catalog-search" className="relative w-full scroll-mt-40">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl font-light pointer-events-none">
                  search
                </span>
                <input
                  id="shop-search"
                  type="search"
                  value={q}
                  onChange={(e) => setParam("q", e.target.value)}
                  placeholder="Search by name, collection…"
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 pl-10 pr-4 text-sm font-light text-primary placeholder:text-on-surface-variant/35 focus:outline-none focus:border-secondary transition-colors"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="wide-label !text-[9px] text-on-surface-variant/40 font-bold">
                  Showing {displayed.length} of {watches.length} models
                </span>
                <div className="h-px w-32 bg-secondary/30 hidden md:block" />
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <label htmlFor="shop-sort" className="wide-label !text-[9px] text-on-surface-variant/50 font-bold whitespace-nowrap">
                    Sort
                  </label>
                  <select
                    id="shop-sort"
                    value={sort}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSearchParams(
                        (prev) => {
                          const next = new URLSearchParams(prev);
                          if (v === "name") next.delete("sort");
                          else next.set("sort", v);
                          return next;
                        },
                        { replace: true },
                      );
                    }}
                    className="flex-1 md:flex-none bg-surface-container-low border border-outline-variant/20 px-4 py-2.5 text-xs font-medium text-primary focus:outline-none focus:border-secondary cursor-pointer wide-label !tracking-[0.15em]"
                  >
                    <option value="name">Name A–Z</option>
                    <option value="newest">New arrivals first</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                  </select>
                </div>
                <span className="wide-label !text-[8px] text-on-surface-variant/35 hidden md:inline">{sortLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mb-16 border-b border-outline-variant/10 pb-10">
          <Link
            to="/shop"
            className={`wide-label !text-[10px] font-bold pb-2 border-b-[3px] transition-colors ${
              isAllActive ? "text-primary border-secondary" : "text-on-surface-variant/60 border-transparent hover:text-primary"
            }`}
          >
            All models
          </Link>
          <button
            type="button"
            onClick={() => {
              setParam("new", newOnly ? null : "1");
              setParam("line", null);
            }}
            className={`wide-label !text-[10px] font-bold pb-2 border-b-[3px] transition-colors ${
              newOnly ? "text-primary border-secondary" : "text-on-surface-variant/60 border-transparent hover:text-primary"
            }`}
          >
            New arrivals
          </button>
          <button
            type="button"
            onClick={() => toggleLine("complications")}
            className={`wide-label !text-[10px] font-bold pb-2 border-b-[3px] transition-colors ${
              line === "complications"
                ? "text-primary border-secondary"
                : "text-on-surface-variant/60 border-transparent hover:text-primary"
            }`}
          >
            Complications
          </button>
          <button
            type="button"
            onClick={() => toggleLine("precious")}
            className={`wide-label !text-[10px] font-bold pb-2 border-b-[3px] transition-colors ${
              line === "precious"
                ? "text-primary border-secondary"
                : "text-on-surface-variant/60 border-transparent hover:text-primary"
            }`}
          >
            Precious metals
          </button>
          <button
            type="button"
            onClick={() => toggleLine("skeleton")}
            className={`wide-label !text-[10px] font-bold pb-2 border-b-[3px] transition-colors ${
              line === "skeleton"
                ? "text-primary border-secondary"
                : "text-on-surface-variant/60 border-transparent hover:text-primary"
            }`}
          >
            Skeleton series
          </button>
          {(category || line || newOnly || q) && (
            <button
              type="button"
              onClick={clearFilters}
              className="wide-label !text-[9px] text-secondary font-bold hover:text-primary ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {isLoading && watches.length === 0 && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
            <p className="wide-label text-on-surface-variant/60 font-bold">Loading collection…</p>
          </div>
        )}

        {!isLoading && displayed.length === 0 && watches.length > 0 && (
          <div className="min-h-[35vh] flex flex-col items-center justify-center text-center px-4">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-6 font-light">filter_alt_off</span>
            <h2 className="font-headline text-3xl text-primary mb-4">No watches match</h2>
            <p className="text-on-surface-variant font-light max-w-md mb-10">
              Try adjusting search or filters. Men&apos;s and women&apos;s views use the{" "}
              <strong className="font-medium text-primary">category</strong> field in Sanity.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="bg-primary text-white px-10 py-4 wide-label !text-[10px] font-bold hover:bg-secondary transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}

        {!isLoading && watches.length === 0 && (
          <div className="min-h-[35vh] flex flex-col items-center justify-center text-center px-4">
            <p className="text-on-surface-variant font-light">No watches in catalog.</p>
          </div>
        )}

        {displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
            {displayed.map((watch) => (
              <ProductCard key={watch.id} watch={watch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
