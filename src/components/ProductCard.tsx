import { Link } from 'react-router-dom';
import { Watch } from '../data/watches';
import { formatNgn } from '../lib/formatNgn';

interface ProductCardProps {
  watch: Watch;
}

export function ProductCard({ watch }: ProductCardProps) {
  const statusLabel = watch.isLimitedEdition
    ? 'Limited Edition'
    : watch.availability === 'pre-order'
      ? 'Pre-Order'
      : watch.availability === 'out-of-stock'
        ? 'Out of Stock'
        : watch.isNewArrival
          ? 'New Arrival'
          : 'Available';

  const supportingLine = `${watch.collection} · ${watch.specs.movement}`;

  return (
    <Link
      to={`/product/${watch.id}`}
      className="group block transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-variant/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`View details for ${watch.name}`}
    >
      <div className="relative aspect-[5/6] sm:aspect-[4/5] overflow-hidden bg-surface-container-low mb-2.5 sm:mb-4 luxury-shadow ring-1 ring-transparent group-hover:ring-outline-variant/35 transition-[transform,box-shadow,ring-color] duration-500">
        <img
          src={watch.image}
          alt={watch.name}
          className="w-full h-full object-cover object-[center_28%] sm:object-center group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[0.2] group-hover:grayscale-0"
        />
        {watch.isLimitedEdition && (
          <div className="absolute top-8 left-8 bg-primary text-white wide-label !text-[7px] px-4 py-2">
            Limited Edition
          </div>
        )}
      </div>
      <div className="border-t border-outline-variant/20 pt-2 md:pt-3.5 flex flex-col items-center text-center">
        <span className="wide-label !text-[8px] text-on-surface-variant/55 mb-1.5">{statusLabel}</span>
        <h3 className="font-headline text-[1.18rem] min-[360px]:text-[1.24rem] min-[390px]:text-[1.34rem] md:text-[1.95rem] text-primary leading-[1.14] md:leading-[1.04] line-clamp-2 break-words mb-1 group-hover:text-secondary transition-colors duration-500">
          {watch.name}
        </h3>
        <span className="block wide-label !text-[7px] min-[390px]:!text-[8px] md:!text-[9px] tracking-[0.12em] min-[390px]:tracking-[0.14em] md:tracking-[0.16em] text-on-surface-variant/82 mb-1.5 italic px-1.5 min-[390px]:px-2">
          {supportingLine}
        </span>
        <div className="w-full max-w-[18rem] flex items-center justify-center gap-2.5 border-t border-outline-variant/20 pt-1.5 min-[390px]:pt-2">
           <div className="h-px w-5 bg-outline-variant/25"></div>
           <p className="text-sm text-primary font-semibold tracking-[0.14em]">
             {formatNgn(watch.price)}
             <span className="text-[10px] text-on-surface-variant/70 font-light ml-1.5">NGN</span>
           </p>
           <div className="h-px w-5 bg-outline-variant/25"></div>
        </div>
        <span className="mt-2.5 inline-flex items-center gap-1.5 wide-label !text-[8px] text-on-surface-variant/60 group-hover:text-secondary transition-colors duration-500 underline decoration-outline-variant/40 underline-offset-4">
          View details
          <span aria-hidden="true" className="translate-y-[0.5px] transition-transform duration-500 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
