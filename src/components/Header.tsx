import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { BRAND_LOGO_SRC } from "../constants/brand";
import {
  PHONE_NG_DISPLAY,
  PHONE_AE_DISPLAY,
  SITE_NAME,
  whatsappHref,
} from "../constants/site";

export function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
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

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#0B0B0B] text-[#C9A46A] py-3 px-4 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-2 wide-label font-medium border-b border-white/5 z-[60] relative text-center sm:text-left">
        <div className="opacity-80">Worldwide shipping · Secure transactions · Verified authenticity</div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1 items-center text-[10px] sm:text-[11px] tracking-[0.2em]">
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-white transition-colors">
            WhatsApp
          </a>
          <span className="opacity-20 hidden sm:inline">|</span>
          <span className="opacity-90">{PHONE_NG_DISPLAY}</span>
          <span className="opacity-20 hidden md:inline">|</span>
          <span className="hidden md:inline opacity-90">{PHONE_AE_DISPLAY}</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-black/5">
        <nav className="max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-12 py-4 md:py-6">
          {/* Desktop Left Nav */}
          <div className="hidden md:flex flex-1 gap-10 items-center">
            <Link
              to="/shop"
              className="text-on-surface-variant hover:text-primary transition-colors wide-label font-semibold"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-on-surface-variant hover:text-primary transition-colors wide-label font-semibold"
            >
              About
            </Link>
            <Link
              to="/shop?category=men"
              className="text-on-surface-variant hover:text-primary transition-colors wide-label font-semibold"
            >
              Men
            </Link>
            <Link
              to="/shop?category=women"
              className="text-on-surface-variant hover:text-primary transition-colors wide-label font-semibold"
            >
              Women
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-primary hover:text-secondary transition-colors"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined font-light text-[28px]">menu</span>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col items-center px-4">
            <Link to="/" className="flex flex-col items-center group">
              <img 
                alt={`${SITE_NAME} — brand logo`}
                className="h-16 md:h-20 w-auto mb-1 object-contain transition-all duration-700 group-hover:scale-105 group-hover:brightness-110" 
                src={BRAND_LOGO_SRC}
                width={160}
                height={160}
              />
              <span className="wide-label !text-[7px] md:!text-[8px] opacity-40 font-bold text-on-surface mt-1">
                Lagos, Nigeria · Worldwide
              </span>
            </Link>
          </div>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex flex-1 gap-10 items-center justify-end">
            <Link
              to="/shop?sort=newest"
              className="text-on-surface-variant hover:text-primary transition-colors wide-label font-semibold relative group"
            >
              New Arrivals
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              to="/shop"
              className="text-on-surface-variant hover:text-primary transition-colors wide-label font-semibold"
            >
              Brands
            </Link>
            <div className="flex gap-6 ml-4 items-center">
              <Link
                to="/shop#catalog-search"
                className="text-on-surface-variant hover:text-secondary transition-all"
                aria-label="Search collection"
              >
                <span className="material-symbols-outlined text-xl font-light">search</span>
              </Link>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-secondary transition-all hidden sm:block"
                aria-label="WhatsApp"
              >
                <span className="material-symbols-outlined text-xl font-light">chat_bubble</span>
              </a>
              <Link to="/cart" className="relative text-on-surface-variant hover:text-secondary transition-all group">
                <span className="material-symbols-outlined text-xl font-light">shopping_bag</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Cart Icon */}
          <div className="flex md:hidden flex-1 justify-end">
            <Link to="/cart" className="relative text-primary hover:text-secondary transition-colors p-2">
              <span className="material-symbols-outlined text-[24px] font-light">shopping_bag</span>
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-white text-[8px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-background transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden flex flex-col`}
      >
        <div className="h-24 px-6 flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex flex-col items-center">
            <img 
              alt={`${SITE_NAME} — brand logo`} 
              className="h-12 w-auto mb-1 object-contain" 
              src={BRAND_LOGO_SRC}
              width={120}
              height={120}
            />
            <span className="wide-label !text-[6px] opacity-40 font-bold">Lagos, Nigeria · Worldwide</span>
          </div>
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
          <Link to="/shop?category=men" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">Men</Link>
          <Link to="/shop?category=women" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">Women</Link>
          <Link to="/shop?sort=newest" className="font-headline text-4xl text-primary hover:text-secondary transition-colors tight-headline">New Arrivals</Link>
          <Link
            to="/shop#catalog-search"
            className="wide-label text-on-surface-variant flex items-center hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined mr-4">search</span>
            Search collection
          </Link>
          <div className="h-px w-full bg-outline-variant/30 my-4"></div>
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
            <span className="material-symbols-outlined mr-4">chat_bubble</span>
            WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}
