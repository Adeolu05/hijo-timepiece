import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { Watch } from "../data/watches";
import { formatNgn } from "../lib/formatNgn";
import { formatWatchCondition } from "../lib/watchConditionLabels";

interface ProductCardProps {
  watch: Watch;
  /** e.g. wishlist control; rendered on the image (top-right). */
  overlayEnd?: ReactNode;
}

export function ProductCard({ watch, overlayEnd }: ProductCardProps) {
  const statusLabel = watch.isLimitedEdition
    ? "Limited Edition"
    : watch.availability === "pre-order"
      ? "Pre-Order"
      : watch.availability === "out-of-stock"
        ? "Out of Stock"
        : watch.isNewArrival
          ? "New Arrival"
          : "Available";

  const compareAt = watch.compareAtPrice;
  const onSale = typeof compareAt === "number" && compareAt > watch.price;

  const metaBits = [watch.collection, watch.specs.movement].filter(Boolean);
  if (watch.modelYear != null) metaBits.push(String(watch.modelYear));
  if (watch.condition) metaBits.push(formatWatchCondition(watch.condition));
  const supportingLine = metaBits.join(" · ");

  return (
    <Link
      to={`/product/${watch.id}`}
      className="group block transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-variant/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`View details for ${watch.name}`}
    >
      <div className="relative aspect-[5/6] sm:aspect-[4/5] overflow-hidden bg-surface-container-low mb-2.5 sm:mb-4 luxury-shadow ring-1 ring-transparent group-hover:ring-outline-variant/35 transition-[transform,box-shadow,ring-color] duration-500">
        <img
          src={watch.image}
          alt={`${watch.name} · luxury wristwatch, ${watch.collection}. Hijo Lux Watches`}
          className="w-full h-full object-cover object-[center_28%] sm:object-center group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[0.2] group-hover:grayscale-0"
        />
        <div className="absolute top-6 left-6 z-[1] flex flex-col gap-2 items-start pointer-events-none">
          {watch.isLimitedEdition && (
            <div className="bg-primary text-white wide-label !text-[7px] px-4 py-2">Limited Edition</div>
          )}
          {onSale && (
            <div className="bg-secondary text-primary wide-label !text-[7px] px-4 py-2">
              {watch.discountPercent != null && watch.discountPercent > 0
                ? `−${watch.discountPercent}%`
                : "Sale"}
            </div>
          )}
        </div>
        {overlayEnd ? (
          <div className="absolute top-6 right-6 z-[2] flex flex-col items-end gap-2 pointer-events-auto">
            {overlayEnd}
          </div>
        ) : null}
      </div>
      <div className="border-t border-outline-variant/20 pt-2 md:pt-3.5 flex flex-col items-center text-center">
        <span className="wide-label !text-[8px] text-on-surface-variant/55 mb-1.5">{statusLabel}</span>
        <h3 className="font-headline text-[1.18rem] min-[360px]:text-[1.24rem] min-[390px]:text-[1.34rem] md:text-[1.95rem] text-primary leading-[1.14] md:leading-[1.04] line-clamp-2 break-words mb-1 group-hover:text-secondary transition-colors duration-500">
          {watch.name}
        </h3>
        <span className="block wide-label !text-[7px] min-[390px]:!text-[8px] md:!text-[9px] tracking-[0.12em] min-[390px]:tracking-[0.14em] md:tracking-[0.16em] text-on-surface-variant/82 mb-1.5 italic px-1.5 min-[390px]:px-2 line-clamp-2">
          {supportingLine}
        </span>
        <div className="w-full max-w-[18rem] flex flex-col items-center justify-center gap-1 border-t border-outline-variant/20 pt-1.5 min-[390px]:pt-2">
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <div className="h-px w-5 bg-outline-variant/25 hidden sm:block" />
            <p className="text-sm text-primary font-semibold tracking-[0.14em] inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
              {onSale ? (
                <>
                  <span className="text-on-surface-variant line-through text-xs font-light tabular-nums">
                    {formatNgn(compareAt!)}
                  </span>
                  <span className="text-secondary tabular-nums">{formatNgn(watch.price)}</span>
                </>
              ) : (
                <span className="tabular-nums">{formatNgn(watch.price)}</span>
              )}
              <span className="text-[10px] text-on-surface-variant/70 font-light">NGN</span>
            </p>
            <div className="h-px w-5 bg-outline-variant/25 hidden sm:block" />
          </div>
        </div>
        <span className="mt-2.5 inline-flex items-center gap-1.5 wide-label !text-[8px] text-on-surface-variant/60 group-hover:text-secondary transition-colors duration-500 underline decoration-outline-variant/40 underline-offset-4">
          View details
          <span
            aria-hidden="true"
            className="translate-y-[0.5px] transition-transform duration-500 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
