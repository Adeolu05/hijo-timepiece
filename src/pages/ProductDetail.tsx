import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa6';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';
import { WHATSAPP_GREETING_NAME, whatsappHrefWithText } from '../constants/site';
import { formatNgn } from '../lib/formatNgn';
import { applySeo } from '../lib/seo';
import { getMaxOrderQuantity, isStorefrontPurchasable, resolveWatchAvailability } from '../lib/watchOrder';

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

  const allImages = useMemo(() => {
    const pool = [watch?.image, ...(watch?.images || [])]
      .map((img) => (typeof img === 'string' ? img.trim() : ''))
      .filter(Boolean);
    const unique = Array.from(new Set(pool));
    return unique;
  }, [watch?.image, watch?.images]);

  useEffect(() => {
    if (allImages.length > 0 && activeImage >= allImages.length) {
      setActiveImage(0);
    }
  }, [activeImage, allImages]);

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

  // Related products logic
  let relatedWatches = watches.filter(w => w.id !== watch.id && w.collection === watch.collection);
  if (relatedWatches.length < 3) {
    const otherWatches = watches.filter(w => w.id !== watch.id && w.collection !== watch.collection);
    relatedWatches = [...relatedWatches, ...otherWatches].slice(0, 3);
  } else {
    relatedWatches = relatedWatches.slice(0, 3);
  }

  const availability = resolveWatchAvailability(watch);
  const isSoldOut = availability === 'out-of-stock';
  const maxQty = getMaxOrderQuantity(watch);
  const displayImages = allImages.length > 0 ? allImages : [watch.image];
  const normalizeSpec = (value?: string) => {
    const trimmed = value?.trim() || '';
    if (!trimmed) return '';
    if (/^(-|n\/a|na|none|unknown|tbc|tbd)$/i.test(trimmed)) return '';
    return trimmed;
  };
  const movementValue = normalizeSpec(watch.specs.movement);
  const caseValue = normalizeSpec(watch.specs.case);
  const powerReserveValue = normalizeSpec(watch.specs.powerReserve);
  const waterResistanceValue = normalizeSpec(watch.specs.waterResistance);
  const strapValue = normalizeSpec(watch.specs.strapOrBracelet);
  const specsToDisplay = [
    { label: 'Movement', value: movementValue },
    { label: 'Case', value: caseValue },
    { label: 'Power Reserve', value: powerReserveValue },
    { label: 'Water Resistance', value: waterResistanceValue },
    { label: 'Strap / Bracelet', value: strapValue },
  ].filter((spec) => spec.value.length > 0);
  const cleanedDescription = watch.description
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/\s{2,}/g, ' ');

  const handleAddToCart = () => {
    if (!isStorefrontPurchasable(watch)) return;
    addItem(watch, quantity);
    navigate('/cart');
  };

  const handleWhatsAppEnquiry = () => {
    const message = `Hello ${WHATSAPP_GREETING_NAME}, I would like to inquire about the ${watch.name} (${watch.collection}) priced at ${formatNgn(watch.price)}. Is it currently available?`;
    window.open(whatsappHrefWithText(message), '_blank');
  };

  useEffect(() => {
    if (!watch) return;
    const description = (watch.description || '').trim().slice(0, 160);
    applySeo({
      title: `${watch.name} | ${watch.collection} | Hijo Multiservice Timepieces`,
      description:
        description.length > 0
          ? description
          : `Explore ${watch.name} from the ${watch.collection} at Hijo Multiservice Timepieces.`,
      path: `/product/${watch.id}`,
      image: watch.image,
      type: 'product',
    });
  }, [watch]);

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-[390px]:gap-12 md:gap-16 xl:gap-24">
          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6 md:gap-9">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 min-[390px]:gap-4 md:gap-5 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory w-full md:w-24 flex-shrink-0">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] overflow-hidden border snap-start flex-shrink-0 w-20 min-[390px]:w-24 md:w-full transition-all duration-500 ${
                    activeImage === idx
                      ? 'border-secondary/70 opacity-100 scale-[1.03] shadow-sm'
                      : 'border-outline-variant/20 opacity-65 hover:opacity-90'
                  }`}
                  aria-label={`View image ${idx + 1} of ${displayImages.length}`}
                  aria-pressed={activeImage === idx}
                >
                  <img src={img} alt={`${watch.name} view ${idx + 1}`} className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative flex-1 max-w-[16rem] min-[390px]:max-w-[18rem] mx-auto md:max-w-none aspect-[3/4] md:aspect-[4/5] bg-surface-container-low overflow-hidden luxury-shadow group">
              <img
                src={displayImages[activeImage] || watch.image}
                alt={watch.name}
                className="w-full h-full object-contain object-center p-2 md:p-4 transition-transform duration-[1600ms] group-hover:scale-[1.02]"
              />
              {watch.isLimitedEdition && (
                <div className="absolute top-10 left-10 bg-primary text-white wide-label !text-[8px] px-6 py-3">
                  Limited Edition
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:pr-2">
            <div className="mb-8">
              <span className="wide-label text-secondary mb-4 block font-bold">
                {watch.collection}
              </span>
              <h1 className="font-headline text-5xl md:text-6xl xl:text-7xl text-primary tight-headline mb-5">
                {watch.name}
              </h1>
              <div className="flex items-baseline gap-4 md:gap-6">
                <span className="text-3xl md:text-4xl text-primary font-light tracking-tight">
                  {formatNgn(watch.price)}
                </span>
                <span className="wide-label !text-[10px] text-on-surface-variant/60">NGN</span>
              </div>
            </div>
            
            {/* Availability */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="wide-label !text-[8px] text-on-surface-variant/70 font-bold">Status</span>
              {availability === 'out-of-stock' ? (
                <span className="wide-label !text-[8px] text-error border border-error/20 px-4 py-2 bg-error/5">Out of Stock</span>
              ) : availability === 'pre-order' ? (
                <span className="wide-label !text-[8px] text-secondary border border-secondary/20 px-4 py-2 bg-secondary/5">Pre-order</span>
              ) : (
                <span className="wide-label !text-[8px] text-primary/60 border border-primary/15 px-4 py-2 bg-primary/5">Available</span>
              )}
              {watch.isNewArrival && (
                <span className="wide-label !text-[8px] text-primary border border-primary/20 px-4 py-2 bg-primary/[0.03]">New Arrival</span>
              )}
            </div>
            
            <div className="h-px w-full bg-outline-variant/10 mb-8"></div>
            
            <p className="text-on-surface-variant leading-relaxed font-light text-lg md:text-xl mb-10 font-serif opacity-90">
              {cleanedDescription}
            </p>
            
            {/* Technical Specifications */}
            {specsToDisplay.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 mb-10">
                {specsToDisplay.map((spec) => (
                  <div key={spec.label} className="border-l-2 border-secondary/20 pl-5">
                    <span className="wide-label !text-[8px] text-on-surface-variant/40 mb-2 block font-bold">{spec.label}</span>
                    <span className="text-sm text-primary font-medium tracking-[0.14em] uppercase">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center mb-9">
              <span className="wide-label !text-[9px] text-on-surface-variant/40 mr-12 font-bold">Quantity</span>
              <div className="flex items-center border border-outline-variant/20 bg-surface-container-low/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isSoldOut}
                  className="px-8 py-4 text-primary hover:bg-surface-container-low transition-colors disabled:opacity-20"
                >
                  <span className="material-symbols-outlined text-base font-light">remove</span>
                </button>
                <span className="px-6 py-4 text-sm font-bold w-14 text-center tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  disabled={isSoldOut || quantity >= maxQty}
                  className="px-8 py-4 text-primary hover:bg-surface-container-low transition-colors disabled:opacity-20"
                >
                  <span className="material-symbols-outlined text-base font-light">add</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-5 mb-10">
              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isStorefrontPurchasable(watch)}
                  variant="primary"
                  size="lg"
                  className="flex-[2] h-20 wide-label !text-[11px] font-bold tracking-[0.4em] disabled:opacity-30"
                >
                  {isSoldOut ? 'Sold Out' : 'Add to Collection'}
                </Button>
                <Button
                  onClick={handleWhatsAppEnquiry}
                  variant="champagne"
                  size="lg"
                  className="flex-1 h-20 wide-label !text-[11px] font-bold tracking-[0.35em]"
                >
                  Enquire
                </Button>
              </div>
              
              {/* WhatsApp Support Messaging */}
              <div className="flex items-center justify-center gap-3 py-5 border-y border-outline-variant/10">
                <FaWhatsapp className="text-secondary text-[22px]" aria-hidden />
                <p className="wide-label !text-[9px] text-on-surface-variant/60 font-bold">
                  Ask about this watch on <span className="text-secondary">WhatsApp</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 wide-label !text-[8px] text-on-surface-variant/40 font-bold border-t border-outline-variant/10 pt-5">
              <span className="flex items-center">
                <span className="material-symbols-outlined text-lg mr-4 opacity-40">local_shipping</span>
                Worldwide delivery available
              </span>
              <span className="flex items-center">
                <span className="material-symbols-outlined text-lg mr-4 opacity-40">verified</span>
                3-year international warranty
              </span>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24 md:mt-32 border-t border-outline-variant/10 pt-16 md:pt-20">
          <div className="mb-10 min-[390px]:mb-12 md:mb-16">
            <span className="wide-label text-secondary mb-6 block font-bold">
              Discovery
            </span>
            <h2 className="font-headline text-[2.3rem] min-[390px]:text-5xl md:text-6xl text-primary tight-headline">
              You may also <br />
              <span className="italic font-serif opacity-60">Appreciate</span>
            </h2>
          </div>
          {relatedWatches.length > 0 ? (
            <div className="flex gap-3 min-[390px]:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-10 sm:gap-y-18 lg:gap-y-24 sm:overflow-visible sm:snap-none">
              {relatedWatches.map((rw) => (
                <div key={rw.id} className="min-w-[68%] min-[390px]:min-w-[64%] min-[440px]:min-w-[56%] max-w-[14.5rem] min-[390px]:max-w-[15.5rem] snap-start sm:min-w-0 sm:max-w-none">
                  <ProductCard watch={rw} />
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-outline-variant/20 bg-surface-container-low/25 px-6 py-10 md:px-10 md:py-12 text-center">
              <p className="text-on-surface-variant font-light mb-6">
                More pieces from this curation are being prepared.
              </p>
              <Link
                to="/shop"
                className="wide-label !text-[9px] text-secondary font-bold hover:text-primary transition-colors"
              >
                Explore the full collection
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
