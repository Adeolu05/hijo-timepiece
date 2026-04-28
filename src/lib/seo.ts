import { SITE_PUBLIC_BRAND } from "../constants/site";

const SITE_URL = "https://www.hijoluxwatches.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/hijo-lux-logo.png`;

type SeoPayload = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "product";
};

function ensureMetaByName(name: string): HTMLMetaElement {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  return el;
}

function ensureMetaByProperty(property: string): HTMLMetaElement {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  return el;
}

function ensureCanonicalLink(): HTMLLinkElement {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  return el;
}

function toAbsoluteUrl(path: string): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function applySeo(payload: SeoPayload): void {
  const url = toAbsoluteUrl(payload.path);
  const image = payload.image?.trim() || DEFAULT_OG_IMAGE;
  const type = payload.type ?? "website";

  document.title = payload.title;
  ensureCanonicalLink().setAttribute("href", url);

  ensureMetaByName("description").setAttribute("content", payload.description);
  ensureMetaByName("twitter:card").setAttribute("content", "summary_large_image");
  ensureMetaByName("twitter:title").setAttribute("content", payload.title);
  ensureMetaByName("twitter:description").setAttribute("content", payload.description);
  ensureMetaByName("twitter:image").setAttribute("content", image);

  ensureMetaByProperty("og:type").setAttribute("content", type);
  ensureMetaByProperty("og:title").setAttribute("content", payload.title);
  ensureMetaByProperty("og:description").setAttribute("content", payload.description);
  ensureMetaByProperty("og:url").setAttribute("content", url);
  ensureMetaByProperty("og:image").setAttribute("content", image);
  ensureMetaByProperty("og:site_name").setAttribute("content", SITE_PUBLIC_BRAND);
}

export { SITE_URL };
