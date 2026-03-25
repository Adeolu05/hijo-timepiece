import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll on route changes. If the URL has a hash, scrolls to that element
 * (e.g. /shop#catalog-search) instead of the top.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      if (!id) {
        window.scrollTo(0, 0);
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo(0, 0);
      }
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
}
