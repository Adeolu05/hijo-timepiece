import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';
import { WHATSAPP_GREETING_NAME, whatsappHrefWithText } from '../constants/site';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { watches, fetchWatches, isLoading } = useProductStore();
  const watch = watches.find((w) => w.id === id);
  const addItem = useCartStore((state) => state.addItem);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  // Reset gallery / qty when navigating to another product (scroll handled globally in ScrollToTop)
  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="w-12 h-12 border-4 border-outline-variant border-t-primary rounded-full animate-spin mb-6"></div>
        <h2 className="font-headline text-2xl text-primary">Loading Timepiece...</h2>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 font-light">
          search_off
        </span>
        <h2 className="font-headline text-4xl text-primary mb-4">Timepiece Not Found</h2>
        <p className="text-on-surface-variant mb-8 font-light text-center max-w-md">
          The timepiece you are looking for does not exist or has been removed from our collection.
        </p>
        <Link to="/shop" className="text-secondary hover:underline uppercase tracking-widest text-sm font-semibold">
          Return to Collection
        </Link>
      </div>
    );
  }

  const allImages = [watch.image, ...(watch.images || [])];
  
  // Related products logic
  let relatedWatches = watches.filter(w => w.id !== watch.id && w.collection === watch.collection);
  if (relatedWatches.length < 3) {
    const otherWatches = watches.filter(w => w.id !== watch.id && w.collection !== watch.collection);
    relatedWatches = [...relatedWatches, ...otherWatches].slice(0, 3);
  } else {
    relatedWatches = relatedWatches.slice(0, 3);
  }

  const isOutOfStock = watch.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(watch, quantity);
    navigate('/cart');
  };

  const handleWhatsAppEnquiry = () => {
    const message = `Hello ${WHATSAPP_GREETING_NAME}, I would like to inquire about the ${watch.name} (${watch.collection}) priced at $${watch.price.toLocaleString()}. Is it currently available?`;
    window.open(whatsappHrefWithText(message), '_blank');
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-24 md:pt-12 md:pb-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-12">
        
        {/* Breadcrumbs */}
        <nav className="flex wide-label !text-[8px] text-on-surface-variant/40 mb-8 md:mb-10">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-4 opacity-30">/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">Collection</Link>
          <span className="mx-4 opacity-30">/</span>
          <span className="text-primary font-bold">{watch.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-10">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-6 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory w-full md:w-24 flex-shrink-0">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] overflow-hidden border snap-start flex-shrink-0 w-24 md:w-full transition-all duration-700 ${
                    activeImage === idx ? 'border-secondary opacity-100 scale-105' : 'border-transparent opacity-30 hover:opacity-60'
                  }`}
                >
                  <img src={img} alt={`${watch.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative flex-1 aspect-[4/5] bg-surface-container-low overflow-hidden luxury-shadow group">
              <img
                src={allImages[activeImage]}
                alt={watch.name}
                className="w-full h-full object-cover object-center transition-transform duration-[2000ms] group-hover:scale-110"
              />
              {watch.isLimitedEdition && (
                <div className="absolute top-10 left-10 bg-primary text-white wide-label !text-[8px] px-6 py-3">
                  Limited Edition
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-12">
              <span className="wide-label text-secondary mb-6 block font-bold">
                {watch.collection}
              </span>
              <h1 className="font-headline text-6xl md:text-7xl text-primary tight-headline mb-8">
                {watch.name}
              </h1>
              <div className="flex items-baseline gap-6">
                <span className="text-4xl text-primary font-light tracking-tight">
                  ${watch.price.toLocaleString()}
                </span>
                <span className="wide-label !text-[10px] text-on-surface-variant/60">USD</span>
              </div>
            </div>
            
            {/* Stock Status */}
            <div className="mb-12">
              {isOutOfStock ? (
                <span className="wide-label !text-[8px] text-error border border-error/20 px-4 py-2 bg-error/5">Out of Stock</span>
              ) : watch.stock <= 3 ? (
                <span className="wide-label !text-[8px] text-secondary border border-secondary/20 px-4 py-2 bg-secondary/5">Low Stock · {watch.stock} remaining</span>
              ) : (
                <span className="wide-label !text-[8px] text-primary/40 border border-primary/10 px-4 py-2 bg-primary/5">In Stock · Ready for Delivery</span>
              )}
            </div>
            
            <div className="h-px w-full bg-outline-variant/10 mb-12"></div>
            
            <p className="text-on-surface-variant leading-relaxed font-light text-xl mb-16 italic font-serif opacity-80">
              "{watch.description}"
            </p>
            
            {/* Technical Specifications */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-16 mb-16">
              <div className="border-l-2 border-secondary/20 pl-6">
                <span className="wide-label !text-[8px] text-on-surface-variant/40 mb-3 block font-bold">Movement</span>
                <span className="text-sm text-primary font-medium tracking-widest uppercase">{watch.specs.movement}</span>
              </div>
              <div className="border-l-2 border-secondary/20 pl-6">
                <span className="wide-label !text-[8px] text-on-surface-variant/40 mb-3 block font-bold">Case</span>
                <span className="text-sm text-primary font-medium tracking-widest uppercase">{watch.specs.case}</span>
              </div>
              <div className="border-l-2 border-secondary/20 pl-6">
                <span className="wide-label !text-[8px] text-on-surface-variant/40 mb-3 block font-bold">Power Reserve</span>
                <span className="text-sm text-primary font-medium tracking-widest uppercase">{watch.specs.powerReserve}</span>
              </div>
              <div className="border-l-2 border-secondary/20 pl-6">
                <span className="wide-label !text-[8px] text-on-surface-variant/40 mb-3 block font-bold">Water Resistance</span>
                <span className="text-sm text-primary font-medium tracking-widest uppercase">{watch.specs.waterResistance}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-12">
              <span className="wide-label !text-[9px] text-on-surface-variant/40 mr-12 font-bold">Quantity</span>
              <div className="flex items-center border border-outline-variant/20 bg-surface-container-low/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="px-8 py-4 text-primary hover:bg-surface-container-low transition-colors disabled:opacity-20"
                >
                  <span className="material-symbols-outlined text-base font-light">remove</span>
                </button>
                <span className="px-6 py-4 text-sm font-bold w-14 text-center tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(watch.stock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= watch.stock}
                  className="px-8 py-4 text-primary hover:bg-surface-container-low transition-colors disabled:opacity-20"
                >
                  <span className="material-symbols-outlined text-base font-light">add</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-8 mb-16">
              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  variant="primary"
                  size="lg"
                  className="flex-[2] h-20 wide-label !text-[11px] font-bold tracking-[0.5em] disabled:opacity-30 shadow-2xl"
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Collection'}
                </Button>
                <Button
                  onClick={handleWhatsAppEnquiry}
                  variant="champagne"
                  size="lg"
                  className="flex-1 h-20 wide-label !text-[11px] font-bold tracking-[0.5em] shadow-2xl"
                >
                  Enquire
                </Button>
              </div>
              
              {/* WhatsApp Support Messaging */}
              <div className="flex items-center justify-center gap-4 py-6 border-y border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary text-2xl font-light">chat_bubble</span>
                <p className="wide-label !text-[9px] text-on-surface-variant/60 font-bold">
                  Speak with a <span className="text-secondary">Concierge Specialist</span> via WhatsApp
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 wide-label !text-[8px] text-on-surface-variant/40 font-bold">
              <span className="flex items-center">
                <span className="material-symbols-outlined text-lg mr-4 opacity-40">local_shipping</span>
                Complimentary Global Shipping
              </span>
              <span className="flex items-center">
                <span className="material-symbols-outlined text-lg mr-4 opacity-40">verified</span>
                5-Year International Warranty
              </span>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20 md:mt-28 border-t border-outline-variant/10 pt-16 md:pt-20">
          <div className="mb-14 md:mb-16">
            <span className="wide-label text-secondary mb-6 block font-bold">
              Discovery
            </span>
            <h2 className="font-headline text-5xl md:text-6xl text-primary tight-headline">
              You May Also <br />
              <span className="italic font-serif opacity-60">Appreciate</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
            {relatedWatches.map((rw) => (
              <ProductCard key={rw.id} watch={rw} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
