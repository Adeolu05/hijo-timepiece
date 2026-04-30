import clsx from "clsx";
import { useWishlistStore } from "../store/wishlistStore";

interface WishlistHeartButtonProps {
  watchId: string;
  className?: string;
  /** Larger tap target on cards */
  size?: "md" | "lg";
}

export function WishlistHeartButton({ watchId, className, size = "md" }: WishlistHeartButtonProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const saved = useWishlistStore((s) => s.ids.includes(watchId.trim()));

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(watchId);
      }}
      className={clsx(
        "rounded-full bg-background/85 backdrop-blur-[2px] text-primary border border-outline-variant/25 hover:border-secondary/50 hover:text-secondary transition-colors shadow-sm",
        size === "lg" ? "p-3.5" : "p-2.5",
        className,
      )}
    >
      <span
        className={clsx(
          "material-symbols-outlined font-light block leading-none",
          size === "lg" ? "text-[26px]" : "text-[22px]",
        )}
        style={saved ? { fontVariationSettings: "'FILL' 1" } : undefined}
        aria-hidden
      >
        {saved ? "favorite" : "favorite_border"}
      </span>
    </button>
  );
}
