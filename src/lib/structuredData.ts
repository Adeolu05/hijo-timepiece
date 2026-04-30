/**
 * Schema.org helpers for richer search snippets (products, breadcrumbs, FAQs, catalog lists).
 */

import type { Watch, WatchAvailability } from "../data/watches";
import { SITE_NAME_FULL, SITE_ORIGIN, SITE_PUBLIC_BRAND } from "../constants/site";
import { resolveWatchAvailability } from "./watchOrder";

const ORG_ID = `${SITE_ORIGIN}/#organization`;

function absoluteImageUrl(src: string): string {
  if (src.startsWith("http")) return src;
  return `${SITE_ORIGIN}${src.startsWith("/") ? src : `/${src}`}`;
}

function availabilityToSchemaUrl(a: WatchAvailability): string {
  switch (a) {
    case "available":
      return "https://schema.org/InStock";
    case "out-of-stock":
      return "https://schema.org/OutOfStock";
    case "pre-order":
      return "https://schema.org/PreOrder";
    default:
      return "https://schema.org/InStock";
  }
}

export function productJsonLd(watch: Watch): object {
  const url = `${SITE_ORIGIN}/product/${encodeURIComponent(watch.id)}`;
  const pool = [watch.image, ...(watch.images || [])]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  const images = (pool.length > 0 ? pool : [watch.image]).map(absoluteImageUrl);
  const avail = resolveWatchAvailability(watch);
  const desc = watch.description.trim().slice(0, 5000);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${watch.name} · ${watch.collection}`,
    description: desc.length > 0 ? desc : `${watch.name} luxury wristwatch from ${SITE_PUBLIC_BRAND}.`,
    image: images,
    sku: watch.id,
    brand: {
      "@type": "Brand",
      name: SITE_PUBLIC_BRAND,
    },
    category: watch.collection,
    // `price` is the current selling price (after any discount).
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: String(watch.price),
      availability: availabilityToSchemaUrl(avail),
      seller: { "@id": ORG_ID },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/** Full catalog URLs for shop indexation (stable list of models). */
export function shopItemListJsonLd(watches: Watch[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Luxury wristwatches & timepieces · ${SITE_PUBLIC_BRAND}`,
    description: `${SITE_PUBLIC_BRAND} (${SITE_NAME_FULL}) curated shop: vintage, luxury, and modern wristwatches. Nigeria & worldwide.`,
    numberOfItems: watches.length,
    itemListElement: watches.map((w, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_ORIGIN}/product/${encodeURIComponent(w.id)}`,
      name: w.name,
    })),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  image?: string;
}): object {
  const pageUrl = `${SITE_ORIGIN}/journal/${encodeURIComponent(post.slug)}`;
  const img = post.image?.trim();
  const imageUrl = img
    ? img.startsWith("http")
      ? img
      : `${SITE_ORIGIN}${img.startsWith("/") ? img : `/${img}`}`
    : undefined;

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    description: post.description.trim().slice(0, 5000),
    author: {
      "@type": "Organization",
      name: SITE_PUBLIC_BRAND,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_PUBLIC_BRAND,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
  };
  if (imageUrl) payload.image = imageUrl;
  return payload;
}
