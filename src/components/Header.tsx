import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiWhatsappLine } from "react-icons/ri";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { BRAND_LOGO_SRC } from "../constants/brand";
import { SITE_NAME, whatsappHref } from "../constants/site";

export function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = useWishlistStore((state) => state.ids.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const { pathname, search } = location;
  const shopQuery = new URLSearchParams(search);
  const category = shopQuery.get("category");
  const sort = shopQuery.get("sort");

  const navText = (active: boolean) =>
    [
      "wide-label transition-colors duration-200 text-[0.68rem] tracking-[0.26em]",
      active
        ? "text-primary font-semibold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-secondary/70"
        : "text-on-surface-variant/90 hover:text-primary font-medium",
      "relative inline-block pb-0.5",
    ].join(" ");

  /** Default catalog view (Shop + Brands share `/shop` with no men/women/newest filter). */
  const activeCatalog =
    pathname === "/shop" && category !== "men" && category !== "women" && sort !== "newest";
  const activeAbout = pathname === "/about";
  const activeFaq = pathname === "/faq";
  const activeJournal = pathname === "/journal" || pathname.startsWith("/journal/");
  const activeMen = pathname === "/shop" && category === "men";
  const activeWomen = pathname === "/shop" && category === "women";
  const activeNew = pathname === "/shop" && sort === "newest";

  const iconBtn =
    "text-on-surface-variant/85 hover:text-secondary p-2 -m-1 rounded-sm hover:bg-surface-container-high/60 transition-colors";

  return (
    <>
      <div className="sticky top-0 z-50 w-full shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
      {/* Top utility: slim black */}
      <div className="bg-[#0B0B0B] text-secondary/88 border-b border-white/[0.05]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-1.5 flex justify-center">
          <div className="inline-flex flex-wrap justify-center items-baseline gap-x-4 sm:gap-x-5 gap-y-1 text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-medium">
            <span className="text-white/80 whitespace-nowrap">Worldwide shipping</span>
            <span className="text-white/30 hidden sm:inline translate-y-px" aria-hidden>
              ·
            </span>
            <span className="text-white/80 whitespace-nowrap">Verified authenticity</span>
            <span className="text-white/30 hidden sm:inline translate-y-px" aria-hidden>
              ·
            </span>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary font-semibold hover:text-white transition-colors whitespace-nowrap"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation: cream */}
      <header className="w-full bg-background border-b border-outline-variant/10">
        <nav className="max-w-[1600px] mx-auto px-4 sm:px-10 md:px-10 py-3 md:py-4">
          {/* Mobile */}
          <div className="flex md:hidden items-stretch w-full min-w-0 gap-1">
            <div className="flex w-11 shrink-0 items-center justify-start">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-primary hover:text-secondary transition-colors"
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined font-light text-[28px]">menu</span>
              </button>
            </div>
            <div className="flex-1 flex justify-center items-center min-w-0 px-0.5">
              <Link to="/" className="flex flex-col items-center group py-1 max-w-full">
                <img
                  alt={`${SITE_NAME} brand logo`}
                  className="h-[4.75rem] w-auto max-w-[min(52vw,13rem)] object-contain object-center transition-all duration-700 group-hover:scale-[1.02] mix-blend-multiply opacity-[0.97]"
                  src={BRAND_LOGO_SRC}
                  width={220}
                  height={220}
                />
              </Link>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-0 -mr-1">
              <Link
                to="/wishlist"
                className="relative text-primary hover:text-secondary transition-colors p-1.5 -mr-0.5"
                aria-label="Wishlist"
              >
                <span className="material-symbols-outlined text-[24px] font-light">favorite</span>
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-secondary text-white text-[8px] font-bold h-3.5 min-w-3.5 px-0.5 rounded-full flex items-center justify-center tabular-nums">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-primary hover:text-secondary transition-colors p-1.5" aria-label="Cart">
                <span className="material-symbols-outlined text-[24px] font-light">shopping_bag</span>
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-secondary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop: logo anchored center, nav pulled inward */}
          <div className="hidden md:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-5 lg:gap-x-8">
            <div className="flex justify-end items-center gap-5 lg:gap-6 flex-wrap">
              <Link to="/shop" className={navText(activeCatalog)}>
                Shop
              </Link>
              <Link to="/about" className={navText(activeAbout)}>
                About
              </Link>
              <Link to="/journal" className={navText(activeJournal)}>
                Journal
              </Link>
              <Link to="/faq" className={navText(activeFaq)}>
                FAQ
              </Link>
              <Link to="/shop?category=men" className={navText(activeMen)}>
                Men
              </Link>
              <Link to="/shop?category=women" className={navText(activeWomen)}>
                Women
              </Link>
            </div>

            <div className="flex justify-center px-0 lg:px-3">
              <Link to="/" className="group block leading-none">
                <img
                  alt={`${SITE_NAME} brand logo`}
                  className="h-[5.5rem] lg:h-[6.25rem] w-auto max-h-[6.5rem] object-contain object-center transition-all duration-700 group-hover:scale-[1.015] mix-blend-multiply opacity-[0.98]"
                  src={BRAND_LOGO_SRC}
                  width={240}
                  height={240}
                />
              </Link>
            </div>

            <div className="flex justify-start items-center gap-5 lg:gap-6">
              <Link to="/shop?sort=newest" className={navText(activeNew)}>
                New Arrivals
              </Link>
              <Link to="/shop" className={navText(activeCatalog)}>
                Brands
              </Link>
              <div className="flex items-center gap-1 border-l border-outline-variant/20 pl-4 ml-2">
                <Link
                  to="/shop#catalog-search"
                  className={iconBtn}
                  aria-label="Search collection"
                >
                  <span className="material-symbols-outlined text-[21px] font-light">search</span>
                </Link>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={iconBtn}
                  aria-label="WhatsApp"
                >
                  <RiWhatsappLine className="block text-[21px] -translate-y-px" aria-hidden />
                </a>
                <Link to="/wishlist" className={`${iconBtn} relative`} aria-label="Wishlist">
                  <span className="material-symbols-outlined text-[21px] font-light">favorite</span>
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-secondary text-white text-[8px] font-bold h-3.5 min-w-3.5 px-0.5 rounded-full flex items-center justify-center tabular-nums">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className={`${iconBtn} relative`}>
                  <span className="material-symbols-outlined text-[21px] font-light">shopping_bag</span>
                  {cartItemCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-secondary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-background transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden flex flex-col`}
      >
        <div className="min-h-[5rem] py-3 px-6 flex items-center justify-between border-b border-outline-variant/20">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center group leading-none py-1 -ml-1"
          >
            <img
              alt={`${SITE_NAME} brand logo`}
              className="h-14 w-auto max-w-[min(62vw,13rem)] object-contain object-center mix-blend-multiply opacity-[0.97] transition-all duration-700 group-hover:scale-[1.02]"
              src={BRAND_LOGO_SRC}
              width={220}
              height={220}
            />
          </Link>
          <button
            className="p-2 -mr-2 text-primary hover:text-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined font-light text-[28px]">close</span>
          </button>
        </div>
        <nav className="flex flex-col px-6 py-12 space-y-8">
          <Link to="/shop" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">Shop</Link>
          <Link to="/about" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">About</Link>
          <Link to="/journal" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">Journal</Link>
          <Link to="/faq" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">FAQ</Link>
          <Link to="/shop?category=men" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">Men</Link>
          <Link to="/shop?category=women" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">Women</Link>
          <Link to="/shop?sort=newest" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">New Arrivals</Link>
          <Link to="/shop" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">Brands</Link>
          <Link
            to="/shop#catalog-search"
            className="wide-label text-on-surface-variant flex items-center hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined mr-4">search</span>
            Search collection
          </Link>
          <div className="h-px w-full bg-outline-variant/30 my-4"></div>
          <Link to="/wishlist" className="wide-label text-on-surface-variant flex items-center hover:text-primary transition-colors">
            <span className="material-symbols-outlined mr-4">favorite</span>
            Wishlist ({wishlistCount})
          </Link>
          <Link to="/cart" className="wide-label text-on-surface-variant flex items-center hover:text-primary transition-colors">
            <span className="material-symbols-outlined mr-4">shopping_bag</span>
            Your Selection ({cartItemCount})
          </Link>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="wide-label text-on-surface-variant flex items-center hover:text-primary transition-colors"
          >
            <RiWhatsappLine className="mr-4 text-[22px]" aria-hidden />
            WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}
