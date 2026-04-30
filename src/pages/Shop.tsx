import { useMemo, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { ProductCard } from "../components/ProductCard";
import { WishlistHeartButton } from "../components/WishlistHeartButton";
import { filterAndSortWatches, SHOP_PAGE_SIZE, type ShopSort } from "../lib/shopCatalog";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbJsonLd, shopItemListJsonLd } from "../lib/structuredData";

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

  const pageParam = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const setPage = useCallback(
    (n: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const clamped = Math.max(1, n);
          if (clamped <= 1) next.delete("page");
          else next.set("page", String(clamped));
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
    pageParam,
    setPage,
  };
}

export function Shop() {
  const { watches, fetchWatches, isLoading, error, clearCatalogError } = useProductStore();
  const { q, category, line, newOnly, sort, setParam, clearFilters, toggleLine, setSearchParams, pageParam, setPage } =
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

  const totalFiltered = displayed.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / SHOP_PAGE_SIZE));
  const page = Math.min(pageParam, totalPages);

  useEffect(() => {
    if (pageParam > totalPages) {
      setPage(totalPages);
    }
  }, [pageParam, totalPages, setPage]);

  const filterKey = `${q}|${category ?? ""}|${line ?? ""}|${newOnly}|${sort}`;
  const prevFilterKey = useRef<string | null>(null);
  useEffect(() => {
    if (prevFilterKey.current === null) {
      prevFilterKey.current = filterKey;
      return;
    }
    if (prevFilterKey.current !== filterKey) {
      prevFilterKey.current = filterKey;
      setParam("page", null);
    }
  }, [filterKey, setParam]);

  const displayedPage = useMemo(
    () => displayed.slice((page - 1) * SHOP_PAGE_SIZE, page * SHOP_PAGE_SIZE),
    [displayed, page],
  );

  const rangeStart = totalFiltered === 0 ? 0 : (page - 1) * SHOP_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * SHOP_PAGE_SIZE, totalFiltered);

  const hasSingleResult = displayedPage.length === 1;
  const isAllActive = !category && !line && !newOnly && !q;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Shop wristwatches", path: "/shop" }])} />
      {watches.length > 0 ? <JsonLd data={shopItemListJsonLd(watches)} /> : null}
    <div className="min-h-screen bg-background pt-8 pb-24 md:pt-12 md:pb-32 overflow-x-hidden">
      <div
        className={`mx-auto w-full max-w-full min-w-0 px-3 min-[390px]:px-4 ${
          hasSingleResult
            ? "sm:px-8 max-w-[1120px]"
            : "sm:px-12 max-w-[1600px]"
        }`}
      >
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
        <div className="mb-8 md:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-end">
            <div className="md:col-span-8 max-w-3xl">
              <span className="wide-label text-secondary mb-3 md:mb-4 block font-bold tracking-[0.4em]">
                THE CURATED ARCHIVE
              </span>
              <h1 className="font-headline text-5xl sm:text-[3.2rem] md:text-[4.7rem] text-primary tight-headline mb-3 md:mb-4">
                Masterpieces <br />
                <span className="italic font-serif opacity-60">of Horology</span>
              </h1>
              <p className="text-on-surface-variant max-w-2xl text-base md:text-lg font-light leading-relaxed italic font-serif opacity-75">
                Browse luxury wristwatches, vintage & modern timepieces · authentic watches with transparent pricing
                and trusted support from our Lagos team. Search by name, collection, or line.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9 flex flex-col items-stretch gap-2.5 w-full max-w-[420px] md:ml-auto">
              <label htmlFor="shop-search" className="wide-label !text-[9px] text-on-surface-variant/50 font-bold sr-only">
                Search collection
              </label>
              <div id="catalog-search" className="relative w-full scroll-mt-32 md:scroll-mt-40">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl font-light pointer-events-none">
                  search
                </span>
                <input
                  id="shop-search"
                  type="search"
                  value={q}
                  onChange={(e) => setParam("q", e.target.value)}
                  placeholder="Search by name, collection…"
                  className="w-full bg-transparent border-b border-outline-variant/30 py-2.5 pl-10 pr-4 text-sm font-light text-primary placeholder:text-on-surface-variant/35 focus:outline-none focus:border-secondary transition-colors"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 border-t border-outline-variant/20 pt-2 min-w-0">
                <span className="text-on-surface-variant/55 whitespace-normal sm:whitespace-nowrap max-sm:text-[10px] min-w-0">
                  <span className="wide-label !text-[8px] mr-1.5">Showing</span>
                  <span className="wide-label !text-[9px] text-primary/85 font-bold tabular-nums">
                    {rangeStart > 0 ? `${rangeStart}–${rangeEnd}` : "0"}
                  </span>
                  <span className="wide-label !text-[8px] mx-1 text-on-surface-variant/45">of</span>
                  <span className="wide-label !text-[9px] text-on-surface-variant/70 font-bold tabular-nums">
                    {totalFiltered}
                  </span>
                  <span className="wide-label !text-[8px] mx-1 text-on-surface-variant/45">matches ·</span>
                  <span className="wide-label !text-[9px] text-on-surface-variant/60 font-bold tabular-nums">
                    {watches.length}
                  </span>
                  <span className="wide-label !text-[8px] ml-1 text-on-surface-variant/45">in catalog</span>
                </span>
                <div className="flex items-center gap-2.5 w-full sm:w-auto min-w-0">
                  <label htmlFor="shop-sort" className="wide-label !text-[9px] text-on-surface-variant/50 font-bold whitespace-nowrap shrink-0">
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
                    className="w-full min-w-0 flex-1 sm:flex-initial sm:min-w-[172px] max-w-full bg-surface-container-low border border-outline-variant/20 px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:border-secondary cursor-pointer wide-label !tracking-[0.15em]"
                  >
                    <option value="name">Name A–Z</option>
                    <option value="newest">New arrivals first</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mb-9 md:mb-10 border-b border-outline-variant/20 pb-6 md:pb-7">
          <span className="wide-label !text-[9px] text-on-surface-variant/45 font-bold mr-1">Browse by</span>
          <Link
            to="/shop"
            className={`wide-label !text-[10px] font-bold pb-2.5 border-b-2 transition-colors ${
              isAllActive
                ? "text-primary border-secondary"
                : "text-on-surface-variant/55 border-transparent hover:text-primary"
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
            className={`wide-label !text-[10px] font-bold pb-2.5 border-b-2 transition-colors ${
              newOnly
                ? "text-primary border-secondary"
                : "text-on-surface-variant/55 border-transparent hover:text-primary"
            }`}
          >
            New arrivals
          </button>
          <button
            type="button"
            onClick={() => toggleLine("complications")}
            className={`wide-label !text-[10px] font-bold pb-2.5 border-b-2 transition-colors ${
              line === "complications"
                ? "text-primary border-secondary"
                : "text-on-surface-variant/55 border-transparent hover:text-primary"
            }`}
          >
            Complications
          </button>
          <button
            type="button"
            onClick={() => toggleLine("precious")}
            className={`wide-label !text-[10px] font-bold pb-2.5 border-b-2 transition-colors ${
              line === "precious"
                ? "text-primary border-secondary"
                : "text-on-surface-variant/55 border-transparent hover:text-primary"
            }`}
          >
            Precious metals
          </button>
          <button
            type="button"
            onClick={() => toggleLine("skeleton")}
            className={`wide-label !text-[10px] font-bold pb-2.5 border-b-2 transition-colors ${
              line === "skeleton"
                ? "text-primary border-secondary"
                : "text-on-surface-variant/55 border-transparent hover:text-primary"
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
          <>
            <div
              className={
                displayedPage.length === 1
                  ? "max-w-[720px] mx-auto"
                  : displayedPage.length === 2
                    ? "max-w-[1100px] mx-auto grid grid-cols-2 gap-x-3 min-[390px]:gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-12 min-[390px]:gap-y-14 md:gap-y-20"
                    : "grid grid-cols-2 lg:grid-cols-3 gap-x-3 min-[390px]:gap-x-4 sm:gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-12 min-[390px]:gap-y-14 md:gap-y-20 lg:gap-y-28 w-full max-w-full min-w-0"
              }
            >
              {displayedPage.map((watch) => (
                <ProductCard
                  key={watch.id}
                  watch={watch}
                  overlayEnd={<WishlistHeartButton watchId={watch.id} />}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-16 md:mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-10"
                aria-label="Catalog pages"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="wide-label !text-[10px] font-bold text-primary border border-outline-variant/30 px-6 py-3 hover:border-secondary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="wide-label !text-[9px] text-on-surface-variant/65 font-bold tabular-nums">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="wide-label !text-[10px] font-bold text-primary border border-outline-variant/30 px-6 py-3 hover:border-secondary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}
