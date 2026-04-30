import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { BRAND_LOGO_SRC } from "../constants/brand";
import {
  SITE_NAME_FULL,
  EMAIL,
  PHONE_NG_DISPLAY,
  PHONE_AE_DISPLAY,
  LOCATION_LINE,
  INSTAGRAM_URL,
  TIKTOK_URL,
  whatsappHref,
} from "../constants/site";

export function Footer() {
  return (
    <footer className="obsidian-black text-white pt-48 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-9 group">
              <img
                src={BRAND_LOGO_SRC}
                alt={`${SITE_NAME_FULL} brand logo`}
                className="h-16 sm:h-20 w-auto mb-4 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                width={160}
                height={160}
              />
              <span className="font-headline text-3xl sm:text-4xl tracking-[0.12em] tight-headline block mb-1 group-hover:text-secondary transition-colors">
                HIJO Lux Watches
              </span>
              <span className="wide-label !text-[8px] text-white/30 block mb-1">
                Registered as {SITE_NAME_FULL}
              </span>
              <span className="wide-label text-white/40 block">{LOCATION_LINE} · Worldwide</span>
            </Link>
            <p className="text-white/50 text-base leading-relaxed max-w-sm font-light mb-10">
              Quality watches, fair pricing, and trusted support for buyers in Nigeria and beyond.
            </p>
            <div className="flex gap-5">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-6 w-6 items-center justify-center text-white/40 hover:text-secondary transition-all hover:-translate-y-1"
                aria-label="Instagram"
              >
                <FaInstagram className="text-[20px]" aria-hidden />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex h-6 w-6 items-center justify-center text-white/40 hover:text-secondary transition-all hover:-translate-y-1"
                aria-label="Email"
              >
                <HiOutlineEnvelope className="text-[20px]" aria-hidden />
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-6 w-6 items-center justify-center text-white/40 hover:text-secondary transition-all hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-[20px]" aria-hidden />
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-6 w-6 items-center justify-center text-white/40 hover:text-secondary transition-all hover:-translate-y-1"
                aria-label="TikTok"
              >
                <FaTiktok className="text-[20px]" aria-hidden />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="wide-label mb-10 text-secondary font-bold">Shop</h4>
            <ul className="space-y-6 wide-label !text-[9px] text-white/60 font-light">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All watches
                </Link>
              </li>
              <li>
                <Link to="/shop?category=men" className="hover:text-white transition-colors">
                  Men&apos;s watches
                </Link>
              </li>
              <li>
                <Link to="/shop?category=women" className="hover:text-white transition-colors">
                  Women&apos;s watches
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="wide-label mb-10 text-secondary font-bold">Company</h4>
            <ul className="space-y-6 wide-label !text-[9px] text-white/60 font-light">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-white transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="wide-label mb-10 text-secondary font-bold">Contact</h4>
            <address className="not-italic wide-label !text-[9px] text-white/60 font-light leading-loose">
              {LOCATION_LINE}
              <br />
              <br />
              <a href="tel:+2348130634066" className="block text-white hover:text-secondary transition-colors tracking-normal font-body text-sm">
                {PHONE_NG_DISPLAY}
              </a>
              <a href="tel:+971522326519" className="block text-white hover:text-secondary transition-colors tracking-normal font-body text-sm mt-2">
                {PHONE_AE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="text-white hover:text-secondary transition-colors mt-6 inline-block lowercase tracking-normal font-body text-sm"
              >
                {EMAIL}
              </a>
            </address>
          </div>
        </div>

        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="wide-label text-white/20 text-center md:text-left">
            &copy; {new Date().getFullYear()} HIJO LUX WATCHES.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:space-x-12 md:gap-0">
            <Link to="/privacy" className="text-white/40 hover:text-white transition-colors wide-label">
              Privacy
            </Link>
            <Link to="/terms" className="text-white/40 hover:text-white transition-colors wide-label">
              Terms of sale
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
