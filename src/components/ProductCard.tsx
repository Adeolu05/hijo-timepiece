import { Link } from 'react-router-dom';
import { Watch } from '../data/watches';

interface ProductCardProps {
  watch: Watch;
}

export function ProductCard({ watch }: ProductCardProps) {
  return (
    <Link to={`/product/${watch.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low mb-10 luxury-shadow">
        <img
          src={watch.image}
          alt={watch.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[0.2] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {watch.isLimitedEdition && (
          <div className="absolute top-8 left-8 bg-primary text-white wide-label !text-[7px] px-4 py-2">
            Limited Edition
          </div>
        )}
        <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-background/90 backdrop-blur-md py-4 px-6 text-center">
            <span className="wide-label !text-[8px] text-primary">View Archive Details</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-center">
        <h3 className="font-headline text-3xl md:text-4xl text-primary tight-headline mb-3 group-hover:text-secondary transition-colors duration-500">
          {watch.name}
        </h3>
        <span className="block wide-label !text-[9px] text-on-surface-variant mb-4 italic opacity-60">
          {watch.collection}
        </span>
        <div className="flex items-center gap-6">
           <div className="h-px w-6 bg-outline-variant/30"></div>
           <p className="text-sm text-primary font-medium tracking-[0.15em]">
             ${watch.price.toLocaleString()} 
             <span className="text-[10px] text-on-surface-variant font-light ml-2">USD</span>
           </p>
           <div className="h-px w-6 bg-outline-variant/30"></div>
        </div>
      </div>
    </Link>
  );
}
