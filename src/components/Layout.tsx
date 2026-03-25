import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_NAME_FULL } from '../constants/site';
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
    if (path === '/about') title = `About Us | ${SITE_NAME_FULL}`;
    else if (path === '/shop') title = `Shop | ${SITE_NAME_FULL}`;
    else if (path === '/cart') title = `Your Collection | ${SITE_NAME_FULL}`;
    else if (path === '/privacy') title = `Privacy | ${SITE_NAME_FULL}`;
    else if (path === '/terms') title = `Terms of Sale | ${SITE_NAME_FULL}`;
    else if (path.startsWith('/product/')) title = `Product | ${SITE_NAME_FULL}`;
    document.title = title;
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
