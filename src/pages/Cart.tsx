import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useDiscountStore } from '../store/discountStore';
import { useProductStore } from '../store/productStore';
import { WHATSAPP_GREETING_NAME, openWhatsAppWithText, SHIPPING_POLICY } from '../constants/site';
import { usePriceDisplay } from '../hooks/usePriceDisplay';
import { useCartQuote } from '../hooks/useCartQuote';
import { PriceCurrencyPicker } from '../components/CurrencySelector';
import { getMaxOrderQuantity } from '../lib/watchOrder';
import { applyDiscountCode, isFailedApply } from '../lib/discountCodes';

export function Cart() {
  const { items, removeItem, updateQuantity, appliedCode, setAppliedCode } = useCartStore();
  const { formatPrice, formatCheckoutLine } = usePriceDisplay();
  const quote = useCartQuote();
  const codes = useDiscountStore((state) => state.codes);
  const hasFetched = useDiscountStore((state) => state.hasFetched);
  const fetchFailed = useDiscountStore((state) => state.fetchFailed);
  const pendingCode = useDiscountStore((state) => state.pendingCode);
  const clearPendingCode = useDiscountStore((state) => state.clearPendingCode);
  const fetchCodes = useDiscountStore((state) => state.fetchCodes);
  const watches = useProductStore((state) => state.watches);
  const fetchWatches = useProductStore((state) => state.fetchWatches);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({ name: false, phone: false });
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoNotice, setPromoNotice] = useState<string | null>(null);

  useEffect(() => {
    void fetchCodes();
    void fetchWatches();
  }, [fetchCodes, fetchWatches]);

  useEffect(() => {
    if (!hasFetched || fetchFailed) return;

    if (pendingCode) {
      if (items.length === 0) return;
      const result = applyDiscountCode(pendingCode, codes, items, watches);
      if (isFailedApply(result)) {
        if (result.reason === 'no_eligible_items') {
          setPromoNotice(null);
          setPromoError(result.message);
        } else {
          clearPendingCode();
          setPromoNotice(null);
          setPromoError(result.message);
        }
      } else {
        setAppliedCode(result.quote.applied.code);
        clearPendingCode();
        setPromoError(null);
        setPromoNotice(
          result.quote.applied.storefrontNote ||
            (result.quote.eligibleCount < items.length
              ? 'Applied to eligible timepieces in your cart.'
              : 'Code applied.'),
        );
      }
      return;
    }

    if (!appliedCode) return;
    const result = applyDiscountCode(appliedCode, codes, items, watches);
    if (isFailedApply(result)) {
      setAppliedCode(null);
      setPromoNotice(null);
      setPromoError(result.message);
    }
  }, [
    appliedCode,
    clearPendingCode,
    codes,
    fetchFailed,
    hasFetched,
    items,
    pendingCode,
    setAppliedCode,
    watches,
  ]);

  const handleApplyPromo = () => {
    if (items.length === 0) return;
    const result = applyDiscountCode(promoInput, codes, items, watches);
    if (isFailedApply(result)) {
      setPromoNotice(null);
      setPromoError(result.message);
      return;
    }
    clearPendingCode();
    setAppliedCode(result.quote.applied.code);
    setPromoInput('');
    setPromoError(null);
    setPromoNotice(
      result.quote.applied.storefrontNote ||
        (result.quote.eligibleCount < items.length
          ? 'Applied to eligible timepieces in your cart.'
          : 'Code applied.'),
    );
  };

  const handleRemovePromo = () => {
    setAppliedCode(null);
    clearPendingCode();
    setPromoNotice(null);
    setPromoError(null);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    const newErrors = { name: !name.trim(), phone: !phone.trim() };
    setErrors(newErrors);

    if (newErrors.name || newErrors.phone) {
      return;
    }

    const orderDetails = quote.lines
      .map((line) => {
        const price = formatCheckoutLine(line.discountedLineTotal);
        if (line.eligible && line.discountedLineTotal < line.lineTotal) {
          return `${line.quantity}x ${line.name} (${line.collection}) - ${price} (was ${formatCheckoutLine(line.lineTotal)})`;
        }
        return `${line.quantity}x ${line.name} (${line.collection}) - ${price}`;
      })
      .join('\n');

    const totals = [
      `Subtotal: ${formatCheckoutLine(quote.subtotal)}`,
      quote.applied && quote.savings > 0
        ? `Promo code: ${quote.applied.code} (−${formatCheckoutLine(quote.savings)})`
        : null,
      `Total: ${formatCheckoutLine(quote.total)}`,
    ]
      .filter(Boolean)
      .join('\n');

    const message = `Hello ${WHATSAPP_GREETING_NAME}, I would like to purchase the following timepieces:\n\n${orderDetails}\n\n${totals}\n\nCustomer Details:\nName: ${name}\nPhone: ${phone}${note ? `\nNote: ${note}` : ''}\n\nPlease provide payment and shipping instructions.`;

    window.open(whatsappHrefWithText(message), '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-surface-container-lowest px-4 text-center">
        <div className="mb-12 relative">
          <span className="wide-label text-secondary mb-8 block font-bold tracking-[0.6em]">THE ARCHIVE IS VACANT</span>
          <h2 className="font-headline text-7xl md:text-9xl text-primary tight-headline italic opacity-10 leading-none">
            Awaiting <br /> Selection
          </h2>
        </div>
        <p className="text-on-surface-variant mb-16 font-light max-w-md leading-relaxed italic font-serif opacity-70 text-lg">
          "Your curated collection is currently empty. We invite you to explore our horological masterpieces and begin your journey."
        </p>
        <Link
          to="/shop"
          className="bg-primary text-white px-16 py-6 wide-label !text-[10px] font-bold hover:bg-secondary transition-all duration-700 shadow-2xl"
        >
          Explore Timepieces
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-8 pb-24 md:pt-12 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <header className="mb-16">
          <h1 className="font-headline text-6xl md:text-7xl font-light tracking-tight text-primary mb-4 italic">
            Your Collection
          </h1>
          <p className="text-on-surface-variant/70 tracking-[0.2em] uppercase text-[10px] font-medium">
            Curated pieces awaiting your inquiry
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-12">
            {items.map((item) => {
              const line = quote.lines.find((entry) => entry.watchId === item.watch.id);
              const lineTotal = line?.lineTotal ?? item.watch.price * item.quantity;
              const discounted = line?.discountedLineTotal ?? lineTotal;
              const showLineDiscount = Boolean(line?.eligible && discounted < lineTotal);

              return (
              <div key={item.watch.id} className="flex flex-col md:flex-row gap-8 pb-12 border-b border-outline-variant/30 last:border-0">
                <div className="w-full md:w-48 aspect-[4/5] bg-surface-container-low overflow-hidden">
                  <img 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out" 
                    src={item.watch.image} 
                    alt={item.watch.name} 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-headline text-2xl font-medium tracking-tight text-primary">
                        {item.watch.name}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-light tracking-tight text-primary tabular-nums">
                            {formatPrice(discounted)}
                          </span>
                          <PriceCurrencyPicker variant="subtle" />
                        </div>
                        {showLineDiscount ? (
                          <span className="text-xs font-light text-on-surface-variant/60 line-through tabular-nums">
                            {formatPrice(lineTotal)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-sm font-light italic font-serif opacity-70 mb-6">
                      {item.watch.collection} · {item.watch.specs.case} · {item.watch.specs.movement}
                    </p>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <span className="text-[9px] tracking-widest uppercase font-bold text-on-surface-variant/40">QTY</span>
                      <div className="flex items-center border border-outline-variant/30 bg-white/50 backdrop-blur-sm">
                        <button 
                          onClick={() => updateQuantity(item.watch.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1.5 text-primary hover:bg-surface-container-high transition-colors material-symbols-outlined text-sm font-light"
                        >
                          remove
                        </button>
                        <span className="px-5 py-1.5 text-xs font-bold border-x border-outline-variant/30 tabular-nums">
                          {item.quantity.toString().padStart(2, '0')}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.watch.id, Math.min(getMaxOrderQuantity(item.watch), item.quantity + 1))}
                          disabled={item.quantity >= getMaxOrderQuantity(item.watch)}
                          className="px-3 py-1.5 text-primary hover:bg-surface-container-high transition-colors material-symbols-outlined text-sm font-light disabled:opacity-20"
                        >
                          add
                        </button>
                      </div>
                    </div>
                    {showLineDiscount && quote.applied ? (
                      <p className="text-[9px] tracking-widest uppercase font-bold text-secondary mb-4">
                        {quote.applied.code} applied
                      </p>
                    ) : null}
                  </div>
                  <button 
                    onClick={() => removeItem(item.watch.id)}
                    className="text-[9px] tracking-widest uppercase font-bold text-secondary hover:text-primary transition-all text-left italic underline decoration-1 underline-offset-8"
                  >
                    Remove from Archive
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          <aside className="lg:col-span-5">
            <div className="bg-surface-container-low/50 backdrop-blur-xl p-8 md:p-12 sticky top-32 border border-outline-variant/20">
              <h2 className="font-headline text-3xl font-light mb-10 text-primary">Inquiry Details</h2>
              <form className="space-y-8">
                <div className="group">
                  <input 
                    className="w-full bg-transparent border-b border-outline-variant/30 py-3 focus:outline-none focus:border-secondary transition-all placeholder:text-on-surface-variant/30 text-sm font-light" 
                    id="name" 
                    placeholder="Full Name" 
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: false })); }}
                  />
                  {errors.name && <span className="text-error text-[9px] wide-label mt-2 block">Name is required</span>}
                </div>
                <div className="group">
                  <input 
                    className="w-full bg-transparent border-b border-outline-variant/30 py-3 focus:outline-none focus:border-secondary transition-all placeholder:text-on-surface-variant/30 text-sm font-light" 
                    id="phone" 
                    placeholder="Phone Number" 
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: false })); }}
                  />
                  {errors.phone && <span className="text-error text-[9px] wide-label mt-2 block">Phone is required</span>}
                </div>
                <div className="group">
                  <textarea 
                    className="w-full bg-transparent border-b border-outline-variant/30 py-3 focus:outline-none focus:border-secondary transition-all placeholder:text-on-surface-variant/30 text-sm font-light resize-none" 
                    id="notes" 
                    placeholder="Special Requests / Notes" 
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                </div>

                <div className="pt-2 space-y-3">
                  <span className="text-[9px] tracking-widest uppercase font-bold text-on-surface-variant/40">
                    Discount code
                  </span>
                  {quote.applied ? (
                    <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 py-3">
                      <div>
                        <p className="text-sm tracking-[0.18em] uppercase text-primary font-medium">
                          {quote.applied.code}
                        </p>
                        {quote.applied.storefrontNote ? (
                          <p className="text-[10px] text-on-surface-variant/60 italic font-serif mt-1">
                            {quote.applied.storefrontNote}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[9px] tracking-widest uppercase font-bold text-secondary hover:text-primary italic underline decoration-1 underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-end gap-3">
                      <input
                        className="flex-1 bg-transparent border-b border-outline-variant/30 py-3 focus:outline-none focus:border-secondary transition-all placeholder:text-on-surface-variant/30 text-sm font-light tracking-[0.16em] uppercase"
                        id="promo"
                        placeholder="Enter code"
                        type="text"
                        autoCapitalize="characters"
                        autoComplete="off"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyPromo();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="text-[9px] tracking-widest uppercase font-bold text-primary hover:text-secondary pb-3"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError ? (
                    <span className="text-error text-[9px] wide-label block">{promoError}</span>
                  ) : null}
                  {promoNotice && !promoError ? (
                    <span className="text-secondary text-[9px] wide-label block">{promoNotice}</span>
                  ) : null}
                </div>
                
                <div className="pt-8 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/60 font-bold">Collection Subtotal</span>
                    <span className="text-sm font-light tabular-nums text-primary">{formatPrice(quote.subtotal)}</span>
                  </div>
                  {quote.applied && quote.savings > 0 ? (
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-secondary font-bold">
                        {quote.applied.code}
                      </span>
                      <span className="text-sm font-light tabular-nums text-secondary">
                        −{formatPrice(quote.savings)}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-baseline border-b border-outline-variant/20 pb-4">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/60 font-bold">Total</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline text-3xl text-primary tabular-nums">{formatPrice(quote.total)}</span>
                      <PriceCurrencyPicker variant="inline" />
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/50 leading-relaxed italic font-serif">
                    {SHIPPING_POLICY} Final order confirmation is completed via WhatsApp.
                  </p>
                  {(errors.name || errors.phone) && (
                    <span className="text-error text-[9px] wide-label block">
                      Name and phone are required above before we can open WhatsApp.
                    </span>
                  )}
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-5 px-8 flex items-center justify-center gap-3 hover:bg-secondary transition-all duration-500 group mt-6" 
                    type="button"
                  >
                    <span className="text-[11px] tracking-[0.3em] font-bold uppercase">Proceed to WhatsApp</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform font-light">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
