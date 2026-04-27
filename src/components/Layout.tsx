import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_NAME_FULL } from '../constants/site';
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
    let title = SITE_NAME_FULL;
    let description =
      "Hijo Multiservice Timepieces, trusted dealer in authentic luxury, vintage, and modern timepieces. Worldwide shipping, secure transactions. Lagos, Nigeria.";
    if (path === '/about') title = `About Us | ${SITE_NAME_FULL}`;
    else if (path === '/shop') {
      title = `Shop | ${SITE_NAME_FULL}`;
      description = "Browse authentic luxury, vintage, and modern watches with transparent pricing and trusted support from Hijo Multiservice Timepieces.";
    } else if (path === '/cart') {
      title = `Your Collection | ${SITE_NAME_FULL}`;
      description = "Review selected watches and proceed with your enquiry or checkout with Hijo Multiservice Timepieces.";
    } else if (path === '/privacy') {
      title = `Privacy | ${SITE_NAME_FULL}`;
      description = "Read the privacy policy for Hijo Multiservice Timepieces.";
    } else if (path === '/terms') {
      title = `Terms of Sale | ${SITE_NAME_FULL}`;
      description = "Read the terms of sale for Hijo Multiservice Timepieces.";
    }
    else if (path.startsWith('/product/')) title = `Product | ${SITE_NAME_FULL}`;
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
