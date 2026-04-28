/** Public site & contact; single source of truth for branding and WhatsApp. */

export const SITE_NAME = "Hijo Multiservice Timepieces";
export const SITE_NAME_FULL = "Hijo Multiservice Timepieces";
/**
 * Trading / customer-facing brand (domain hijoluxwatches.com, IG @hijoluxwatches).
 * Use in page titles, Open Graph, and copy where searches use "Hijo Lux" rather than the legal entity name.
 */
export const SITE_PUBLIC_BRAND = "Hijo Lux Watches";
export const SITE_TAGLINE = "Authentic luxury, vintage & modern timepieces";
export const SITE_DESCRIPTION =
  "Trusted watch dealer specializing in authentic luxury, vintage, and modern timepieces. Genuine quality, competitive prices, worldwide shipping, and secure transactions. Based in Lagos, Nigeria.";

/** Homepage meta (keep `index.html` & JSON-LD in sync with these strings when editing). */
export const HOME_PAGE_META_TITLE = `${SITE_PUBLIC_BRAND} | Official website | Authentic luxury timepieces`;
export const HOME_PAGE_META_DESCRIPTION =
  "Official website for Hijo Lux Watches — authentic luxury, vintage, and modern watches. Hijo Multiservice Timepieces, based in Lagos, Nigeria. Browse the shop, enquire on WhatsApp, worldwide shipping.";

export const LOCATION_LINE = "Lagos, Nigeria";

export const EMAIL = "hijoluxwatches@gmail.com";
export const PHONE_NG_DISPLAY = "+234 813 063 4066";
export const PHONE_AE_DISPLAY = "+971 52 232 6519";
/** WhatsApp / checkout (Nigeria): digits only for wa.me */
export const WHATSAPP_E164 = "2348130634066";
export const INSTAGRAM_URL = "https://www.instagram.com/hijoluxwatches/";
export const TIKTOK_URL = "https://www.tiktok.com/@hijoluxwatches";
export const INSTAGRAM_HANDLE = "@hijoluxwatches";
export const SITE_ORIGIN = "https://www.hijoluxwatches.com";

/** Registered brand certificate (PDF), served from `public/`. */
export const BRAND_CERTIFICATE_PDF_URL = "/hijo-lux-brand-certificate.pdf";

/** First-page screenshot of the certificate (PNG), served from `public/`. */
export const BRAND_CERTIFICATE_PREVIEW_URL = "/hijo-lux-cac-certificate-preview.png";

export function whatsappHref(): string {
  return `https://wa.me/${WHATSAPP_E164}`;
}

export function whatsappHrefWithText(text: string): string {
  return `${whatsappHref()}?text=${encodeURIComponent(text)}`;
}

export function productShareUrl(slug: string): string {
  return `${SITE_ORIGIN}/product/${encodeURIComponent(slug)}`;
}

/** Brand name as used in customer messages */
export const WHATSAPP_GREETING_NAME = SITE_NAME;
