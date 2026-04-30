import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useWishlistStore } from "../store/wishlistStore";
import { ProductCard } from "../components/ProductCard";
import { WishlistHeartButton } from "../components/WishlistHeartButton";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbJsonLd } from "../lib/structuredData";
import { applySeo } from "../lib/seo";
import { SITE_PUBLIC_BRAND, SITE_NAME_FULL } from "../constants/site";

export function Wishlist() {
  const { watches, fetchWatches, isLoading } = useProductStore();
  const ids = useWishlistStore((s) => s.ids);
  const keepOnlyWishlist = useWishlistStore((s) => s.keepOnly);

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  useEffect(() => {
    applySeo({
      title: `Wishlist | ${SITE_PUBLIC_BRAND}`,
      description: `Your saved timepieces at ${SITE_PUBLIC_BRAND} (${SITE_NAME_FULL}). Return anytime to shop or enquire.`,
      path: "/wishlist",
    });
  }, []);

  const items = useMemo(() => {
    const byId = new Map(watches.map((w) => [w.id, w]));
    return ids.map((id) => byId.get(id)).filter((w): w is NonNullable<typeof w> => w != null);
  }, [ids, watches]);

  const missingCount = ids.length - items.length;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Wishlist", path: "/wishlist" },
        ])}
      />
      <div className="min-h-screen bg-background pt-10 pb-24 md:pt-14 md:pb-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-12">
          <header className="mb-12 md:mb-16 border-b border-outline-variant/15 pb-10">
            <span className="wide-label text-secondary mb-4 block font-bold tracking-[0.35em]">SAVED PIECES</span>
            <h1 className="font-headline text-5xl sm:text-6xl text-primary tight-headline mb-4">
              Your wishlist
            </h1>
            <p className="text-on-surface-variant max-w-2xl font-light leading-relaxed">
              Hearts you tap on the shop and product pages are stored on this device. Open a watch to enquire or add it
              to your collection.
            </p>
          </header>

          {isLoading && watches.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5 py-24">
              <div className="w-11 h-11 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
              <p className="wide-label text-on-surface-variant/60 font-bold">Loading catalog…</p>
            </div>
          )}

          {(!isLoading || watches.length > 0) && ids.length === 0 && (
            <div className="text-center py-20 border border-outline-variant/15 bg-surface-container-low/25 px-6 max-w-xl mx-auto">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-6 font-light block">
                favorite_border
              </span>
              <p className="text-on-surface-variant font-light mb-8">You have not saved any watches yet.</p>
              <Link
                to="/shop"
                className="inline-block bg-primary text-white px-10 py-4 wide-label !text-[10px] font-bold hover:bg-secondary transition-colors"
              >
                Browse the collection
              </Link>
            </div>
          )}

          {ids.length > 0 && (
            <>
              {missingCount > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 text-sm text-on-surface-variant/80 font-light">
                  <p role="status">
                    {missingCount} saved {missingCount === 1 ? "reference is" : "references are"} not in the current
                    catalog (unpublished or removed slug).
                  </p>
                  <button
                    type="button"
                    onClick={() => keepOnlyWishlist(new Set(watches.map((w) => w.id)))}
                    className="wide-label !text-[9px] text-secondary font-bold self-start sm:self-auto border-b border-secondary/40 pb-0.5 hover:text-primary"
                  >
                    Remove unavailable entries
                  </button>
                </div>
              )}
              {items.length === 0 ? (
                <p className="text-on-surface-variant font-light text-center py-16">
                  No matching watches in the live catalog. Try opening the{" "}
                  <Link to="/shop" className="text-secondary underline underline-offset-4">
                    shop
                  </Link>
                  .
                </p>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 min-[390px]:gap-x-4 sm:gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-12 min-[390px]:gap-y-14 md:gap-y-20 lg:gap-y-28">
                  {items.map((watch) => (
                    <ProductCard
                      key={watch.id}
                      watch={watch}
                      overlayEnd={<WishlistHeartButton watchId={watch.id} />}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
