import { useCallback, useEffect, useState } from "react";

const SCROLL_SHOW_PX = 520;

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_SHOW_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Back to top of page"
      className={[
        "fixed z-[45] flex items-center justify-center",
        "bottom-5 right-4 min-[390px]:bottom-7 min-[390px]:right-6 sm:bottom-8 sm:right-10",
        "h-12 w-12 sm:h-14 sm:w-14 rounded-full",
        "champagne-gradient text-primary shadow-[0_8px_32px_-8px_rgba(28,28,23,0.35)]",
        "ring-1 ring-primary/15 ring-inset",
        "hover:brightness-105 hover:shadow-[0_12px_36px_-10px_rgba(201,164,106,0.55)] active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "transition-all duration-300 ease-out",
        visible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-3 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-[26px] sm:text-[30px] font-light leading-none translate-y-px">
        keyboard_arrow_up
      </span>
    </button>
  );
}
