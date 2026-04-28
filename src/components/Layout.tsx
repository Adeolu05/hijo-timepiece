import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HOME_PAGE_META_DESCRIPTION,
  HOME_PAGE_META_TITLE,
  SITE_NAME_FULL,
  SITE_PUBLIC_BRAND,
  SHOP_PAGE_META_DESCRIPTION,
  FAQ_PAGE_META_DESCRIPTION,
} from '../constants/site';
import { applySeo } from '../lib/seo';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = HOME_PAGE_META_TITLE;
    let description = HOME_PAGE_META_DESCRIPTION;
    if (path === '/about') {
      title = `About Us | ${SITE_PUBLIC_BRAND}`;
      description = `About ${SITE_PUBLIC_BRAND} (${SITE_NAME_FULL}): trusted luxury, vintage & modern watches, Lagos — official site.`;
    } else if (path === '/shop') {
      title = `Shop luxury wristwatches | ${SITE_PUBLIC_BRAND}`;
      description = SHOP_PAGE_META_DESCRIPTION;
    } else if (path === '/faq') {
      title = `FAQ | ${SITE_PUBLIC_BRAND} — watches, shipping & orders`;
      description = FAQ_PAGE_META_DESCRIPTION;
    } else if (path === '/cart') {
      title = `Your collection | ${SITE_PUBLIC_BRAND}`;
      description = `Review your selected watches and checkout — ${SITE_PUBLIC_BRAND} (${SITE_NAME_FULL}).`;
    } else if (path === '/privacy') {
      title = `Privacy | ${SITE_PUBLIC_BRAND}`;
      description = `Privacy policy for ${SITE_PUBLIC_BRAND} / ${SITE_NAME_FULL}.`;
    } else if (path === '/terms') {
      title = `Terms of sale | ${SITE_PUBLIC_BRAND}`;
      description = `Terms of sale for ${SITE_PUBLIC_BRAND} / ${SITE_NAME_FULL}.`;
    } else if (path.startsWith('/product/')) {
      title = `Watch | ${SITE_PUBLIC_BRAND}`;
    }
    applySeo({
      title,
      description,
      path,
      type: path.startsWith('/product/') ? "product" : "website",
    });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
