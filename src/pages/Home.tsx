import { Link } from 'react-router-dom';
import { useEffect, type ImgHTMLAttributes } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { HiOutlineEnvelope } from 'react-icons/hi2';
import { useProductStore } from '../store/productStore';
import type { Watch } from '../data/watches';
import { WATCHES } from '../data/watches';
import { EMAIL, whatsappHref, whatsappHrefWithText, WHATSAPP_GREETING_NAME } from '../constants/site';
import { formatNgn } from '../lib/formatNgn';
import { FALLBACK_WATCH_IMAGE_URL, resolveWatchImageUrl } from '../lib/watchImages';
import { displayMerchandisingLabel } from '../lib/merchandisingLabels';
import { BrandCertificateTrust } from '../components/BrandCertificateTrust';

function WatchPhoto({
  watch,
  alt,
  className,
}: {
  watch: Pick<Watch, 'image' | 'images'>;
  alt: string;
  className?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  const src = resolveWatchImageUrl(watch);
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.dataset.fallbackApplied) {
          el.dataset.fallbackApplied = '1';
          el.src = FALLBACK_WATCH_IMAGE_URL;
        }
      }}
    />
  );
}

/** Case + strap line; omits empty placeholder values from Sanity/local data. */
function watchDetailLine(watch: Watch): string | null {
  const parts = [watch.specs.case, watch.specs.strapOrBracelet].filter(
    (s) => typeof s === "string" && s.trim().length > 0,
  );
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function Home() {
  const { watches, fetchWatches } = useProductStore();

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  const catalog = watches.length > 0 ? watches : WATCHES;
  const heroWatch = catalog[0];
  const stackedWatches = catalog.slice(1, 3);
  const limitedHighlight = catalog.find((w) => w.isLimitedEdition) ?? catalog[catalog.length - 1] ?? heroWatch;
  const sportWatch = catalog[3] ?? catalog[1] ?? heroWatch;
  const heroDetailLine = watchDetailLine(heroWatch);
  const heroCollectionLabel = displayMerchandisingLabel(heroWatch.collection);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[82vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden bg-background border-b border-outline-variant/10">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-12 py-12 md:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-y-0 lg:gap-x-14 xl:gap-x-20 items-center">
            <div className="text-center lg:text-left z-20 order-1">
              <span className="wide-label text-secondary mb-6 md:mb-8 block font-bold">
                LAGOS, NIGERIA · WORLDWIDE
              </span>
              <h1 className="font-headline text-[2.75rem] min-[400px]:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6rem] 2xl:text-[6.75rem] text-primary tight-headline leading-[0.88]">
                The <br />
                Architecture <br />
                of <span className="italic font-light serif opacity-60">Time</span>
              </h1>
              <p className="mt-8 md:mt-9 max-w-md lg:max-w-lg mx-auto lg:mx-0 font-noto text-base md:text-[1.0625rem] leading-relaxed text-on-surface-variant/85 italic">
                <span className="not-italic text-on-surface-variant/90">
                  Hijo Lux Watches · our official online store for
                </span>{' '}
                authentic luxury and vintage watches from sources we trust around the world. We&apos;re based
                in Dubai but registered in Lagos, Nigeria and work with buyers across Nigeria, clear advice when you&apos;re deciding, and
                support you can count on after the sale.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 mt-8 md:mt-9">
                <Link
                  to="/shop"
                  className="bg-primary text-white px-12 md:px-14 py-5 wide-label !text-[10px] font-bold hover:bg-secondary transition-all duration-700 shadow-2xl shrink-0"
                >
                  Explore Collection
                </Link>
                <a
                  href={whatsappHrefWithText(
                    `Hi, I'd like to ask ${WHATSAPP_GREETING_NAME} about a watch.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 border border-outline-variant/40 bg-background px-10 md:px-12 py-5 wide-label !text-[10px] font-bold text-primary hover:border-secondary hover:text-secondary transition-all duration-500 shrink-0"
                >
                  <FaWhatsapp className="text-[18px]" aria-hidden />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end order-2 pt-10 md:pt-12 lg:pt-0">
              <div className="relative group w-full max-w-[min(100%,420px)] lg:max-w-[min(100%,520px)]">
                <img
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
                  alt="Luxury timepiece"
                  className="w-full h-auto object-cover drop-shadow-[0_40px_45px_rgba(0,0,0,0.12)] grayscale-[0.15] group-hover:grayscale-0 transition-all duration-[2000ms] scale-105 group-hover:scale-100"
                />
                <div className="absolute -top-12 -right-8 lg:-top-16 lg:-right-12 w-48 h-48 lg:w-64 lg:h-64 border border-secondary/10 rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 lg:w-40 lg:h-40 border border-secondary/5 rounded-none pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 md:bottom-14 right-8 lg:right-12 hidden lg:block">
          <div className="flex flex-col items-center gap-6">
            <span className="wide-label !text-[8px] text-on-surface-variant/40 vertical-text rotate-180 font-bold">
              Scroll to Archive
            </span>
            <div className="w-px h-20 bg-secondary/30"></div>
          </div>
        </div>
      </section>

      {/* Masterpieces + editorial: one section */}
      <section className="border-t border-outline-variant/10 bg-gradient-to-b from-background via-background to-surface-container-low/35">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-12 pt-10 pb-14 md:pt-14 md:pb-20">
          {/* Section opener: headline + Browse paired; intro below */}
          <div className="mb-4 min-[390px]:mb-5 md:mb-6 pb-4 border-b border-outline-variant/20">
            <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-2.5 min-[390px]:gap-3 lg:gap-5">
              <h2 className="font-headline text-[2.2rem] min-[360px]:text-[2.35rem] min-[390px]:text-5xl md:text-6xl lg:text-7xl text-primary leading-[0.9] tight-headline">
                Masterpieces <br />
                <span className="italic font-light serif opacity-60">of the</span> Season
              </h2>
              <Link
                to="/shop"
                className="wide-label text-primary hover:text-primary/90 transition-colors font-bold tracking-[0.26em] shrink-0 border-b border-secondary/40 hover:border-secondary pb-0.5 self-start lg:mt-1"
              >
                Browse collection
              </Link>
            </div>
            <p className="font-noto text-[0.82rem] min-[390px]:text-sm md:text-[0.9375rem] text-on-surface-variant/85 leading-relaxed max-w-md mt-2.5 min-[390px]:mt-3">
              A selection from our current stock, ask if you&apos;re looking for a specific reference.
            </p>
          </div>

          {/* Product grid: featured width capped; lighter crop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-start md:pb-5 md:border-b md:border-outline-variant/10">
            <div className="md:col-span-6 min-w-0 max-w-[27rem] mx-auto md:mx-0 lg:max-w-[min(100%,26rem)] xl:max-w-[min(100%,27rem)]">
              <Link
                to={`/product/${heroWatch.id}`}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/60"
              >
                <div className="relative w-full aspect-[7/8] min-[390px]:aspect-[5/6] sm:aspect-[4/5] overflow-hidden bg-surface-container-low mb-3 min-[390px]:mb-4 luxury-shadow border border-outline-variant/10 min-h-0">
                  {heroWatch.isLimitedEdition ? (
                    <div className="absolute top-5 left-5 md:top-6 md:left-6 z-10">
                      <span className="bg-primary text-white px-3 py-2 wide-label !text-[7px] font-bold tracking-[0.32em]">
                        Limited edition
                      </span>
                    </div>
                  ) : null}
                  <WatchPhoto
                    watch={heroWatch}
                    alt={heroWatch.name}
                    className="absolute inset-0 h-full w-full object-cover object-[center_28%] min-[390px]:object-[center_24%] md:object-[center_22%] transition-transform duration-[2000ms] group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-4 pt-2 border-t border-outline-variant/10">
                  <div className="min-w-0 space-y-0.5 min-[390px]:space-y-1">
                    <h3 className="font-headline text-[1.35rem] min-[390px]:text-2xl md:text-[1.7rem] text-primary leading-[1.14] md:leading-[1.08] break-words">
                      {heroWatch.name}
                    </h3>
                    {heroCollectionLabel ? (
                      <p className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/50 font-semibold">
                        {heroCollectionLabel}
                      </p>
                    ) : null}
                    {heroDetailLine ? (
                      <p className="font-noto text-[0.75rem] min-[390px]:text-[0.8125rem] md:text-sm text-on-surface-variant/72 leading-snug pt-0.5">
                        {heroDetailLine}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-headline text-[1.05rem] min-[390px]:text-xl md:text-2xl text-secondary tabular-nums shrink-0 pt-1 sm:pt-0">
                    {formatNgn(heroWatch.price)}
                  </p>
                </div>
              </Link>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 md:flex md:flex-col gap-3 min-[390px]:gap-4 sm:gap-6 lg:gap-7 border-l-0 md:border-l border-outline-variant/10 md:pl-5 lg:pl-7 min-w-0">
              {stackedWatches.map((watch) => {
              const stackedDetail = watchDetailLine(watch);
              const collectionLabel = displayMerchandisingLabel(watch.collection);
              return (
                <Link
                  key={watch.id}
                  to={`/product/${watch.id}`}
                  className="group block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/60 transition-colors"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-surface-container-low mb-2 min-[390px]:mb-3 luxury-shadow border border-outline-variant/10 min-h-0 transition-all duration-300 group-hover:border-secondary/35 group-hover:shadow-md">
                    {watch.isNewArrival ? (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-primary/95 text-white px-2.5 py-1.5 wide-label !text-[6px] font-bold tracking-[0.32em]">
                          New arrival
                        </span>
                      </div>
                    ) : null}
                    <WatchPhoto
                      watch={watch}
                      alt={watch.name}
                      className="absolute inset-0 h-full w-full object-cover object-[center_30%] sm:object-center transition-transform duration-[2000ms] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 sm:gap-4 pt-1.5 sm:pt-2 border-t border-outline-variant/10">
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-headline text-[1.05rem] min-[390px]:text-[1.2rem] md:text-2xl text-primary leading-[1.16] md:leading-[1.08] line-clamp-2 break-words">
                        {watch.name}
                      </h3>
                      {collectionLabel ? (
                        <p className="text-[8px] min-[390px]:text-[9px] tracking-[0.16em] min-[390px]:tracking-[0.2em] uppercase text-on-surface-variant/50 font-semibold">
                          {collectionLabel}
                        </p>
                      ) : null}
                      {stackedDetail ? (
                        <p className="font-noto text-[0.7rem] min-[390px]:text-xs text-on-surface-variant/72 line-clamp-2">
                          {stackedDetail}
                        </p>
                      ) : null}
                    </div>
                    <p className="font-headline text-sm min-[390px]:text-base md:text-xl text-secondary tabular-nums shrink-0">
                      {formatNgn(watch.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>

          {/* Editorial + supporting tiles: aligned rhythm with grid above */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-start mt-7 md:mt-8 pt-7 md:pt-8 border-t border-outline-variant/10">
            <div className="lg:col-span-7 relative min-w-0">
              <div className="relative w-full aspect-[4/5] overflow-hidden luxury-shadow border border-outline-variant/10 min-h-0">
                <img
                  src="https://images.unsplash.com/photo-1587836374828-cb4387861007?q=80&w=2070&auto=format&fit=crop"
                  alt="Dress watch on wrist"
                  className="absolute inset-0 h-full w-full object-cover object-center grayscale-[0.15] hover:grayscale-0 transition-all duration-[2000ms]"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (!el.dataset.fallbackApplied) {
                      el.dataset.fallbackApplied = '1';
                      el.src = FALLBACK_WATCH_IMAGE_URL;
                    }
                  }}
                />
              </div>
              <div className="mt-5 lg:mt-0 lg:absolute lg:bottom-6 lg:right-6 lg:z-10 lg:max-w-[min(100%,22rem)] xl:max-w-[26rem] bg-background p-7 md:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] border border-outline-variant/25 ring-1 ring-black/[0.04] backdrop-blur-[2px]">
                <span className="wide-label text-secondary mb-3 block font-bold tracking-[0.32em]">
                  Dress watches
                </span>
                <h3 className="font-headline text-3xl md:text-4xl text-primary mb-3 leading-[0.95] tight-headline">
                  Quiet <span className="italic font-light serif opacity-60">elegance</span>
                </h3>
                <p className="text-on-surface text-[0.9375rem] leading-relaxed mb-5 font-noto">
                  Understated cases for work and evenings. Tell us the setting and budget, we&apos;ll suggest a
                  short list.
                </p>
                <Link
                  to="/shop"
                  className="wide-label text-primary border-b border-secondary pb-1.5 inline-block font-bold hover:text-secondary hover:border-primary transition-colors tracking-[0.28em]"
                >
                  Browse dress watches
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-7 min-w-0">
              <Link
                to="/shop"
                className="group relative aspect-square overflow-hidden luxury-shadow border border-outline-variant/10 block cursor-pointer min-h-0 transition-all duration-300 hover:border-secondary/45 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/60 active:brightness-[0.98]"
              >
                <WatchPhoto
                  watch={sportWatch}
                  alt="Sport and chronograph timepiece"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                  <h4 className="text-white font-headline text-2xl md:text-3xl mb-2 tight-headline drop-shadow-sm">
                    Sport &amp; chronographs
                  </h4>
                  <p className="text-white/90 text-sm font-noto leading-relaxed mb-4">
                    Timing for travel, sport, and daily wear, see what&apos;s in the case.
                  </p>
                  <span className="wide-label text-secondary font-bold tracking-[0.28em] group-hover:text-white transition-colors inline-flex items-center gap-2">
                    Shop this edit
                    <span aria-hidden className="text-lg font-light opacity-90 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </Link>

              <Link
                to="/shop"
                className="group relative aspect-square overflow-hidden luxury-shadow border border-outline-variant/10 block cursor-pointer min-h-0 transition-all duration-300 hover:border-secondary/45 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/60 active:brightness-[0.98]"
              >
                <WatchPhoto
                  watch={limitedHighlight}
                  alt={limitedHighlight.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/38 to-black/15 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                  <h4 className="text-white font-headline text-2xl md:text-3xl mb-2 tight-headline drop-shadow-sm">
                    Limited runs
                  </h4>
                  <p className="text-white/90 text-sm font-noto leading-relaxed mb-4">
                    Numbered and small-batch pieces when we can get them, ask before they go.
                  </p>
                  <span className="wide-label text-secondary font-bold tracking-[0.28em] group-hover:text-white transition-colors inline-flex items-center gap-2">
                    Shop limited pieces
                    <span aria-hidden className="text-lg font-light opacity-90 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust: brand certificate + pillars */}
      <section className="py-14 md:py-[4.25rem] bg-background border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BrandCertificateTrust />
          <div className="mt-8 md:mt-10 pt-8 md:pt-11 border-t border-outline-variant/10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-x-10 md:gap-y-11 text-center">
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-4xl mb-2 font-light group-hover:scale-110 transition-transform duration-500">verified</span>
              <h4 className="wide-label text-primary mb-1 font-bold">Verified watches</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold leading-tight max-w-[11rem] mx-auto">
                Authenticated and documented.
              </p>
            </div>
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-4xl mb-2 font-light group-hover:scale-110 transition-transform duration-500">payments</span>
              <h4 className="wide-label text-primary mb-1 font-bold">Fair pricing</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold leading-tight max-w-[11rem] mx-auto">
                Clear NGN, no surprises.
              </p>
            </div>
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-4xl mb-2 font-light group-hover:scale-110 transition-transform duration-500">public</span>
              <h4 className="wide-label text-primary mb-1 font-bold">Nigeria &amp; worldwide</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold leading-tight max-w-[11rem] mx-auto">
                Local care, global shipping.
              </p>
            </div>
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-4xl mb-2 font-light group-hover:scale-110 transition-transform duration-500">support_agent</span>
              <h4 className="wide-label text-primary mb-1 font-bold">Support</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold leading-tight max-w-[11rem] mx-auto">
                Before and after purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA (Black) */}
      <section className="bg-[#0B0B0B] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1587836374828-cb4387861007?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale"
            alt="Movement"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <span className="wide-label text-secondary mb-3 md:mb-4 block font-bold tracking-[0.6em]">CONTACT</span>
          <h2 className="font-headline text-[2.125rem] min-[400px]:text-5xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-5 tight-headline leading-[0.94]">
            Here when you <br />
            <span className="italic font-light serif opacity-60">need us</span>
          </h2>
          <p className="text-white/55 text-[0.9375rem] md:text-[1.0625rem] font-noto mb-6 md:mb-7 max-w-2xl mx-auto leading-[1.55]">
            Chat with us on WhatsApp for help choosing the right watch, checking availability, or asking questions before you buy. You can also email us anytime.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-stretch gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <a 
              href={whatsappHref()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-transparent border border-secondary text-secondary px-9 md:px-10 py-[1.125rem] wide-label !text-[11px] font-bold hover:bg-secondary hover:text-black transition-all duration-500 group sm:min-w-[13.25rem]"
            >
              <FaWhatsapp className="mr-3 text-[19px] group-hover:scale-110 transition-transform" aria-hidden />
              Chat on WhatsApp
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center bg-transparent border border-white/10 text-white/60 px-9 md:px-10 py-[1.125rem] wide-label !text-[11px] font-bold hover:border-white hover:text-white transition-all duration-500 sm:min-w-[13.25rem]"
            >
              <HiOutlineEnvelope className="mr-3 text-[19px]" aria-hidden />
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Guidance Section */}
      <section className="py-36 md:py-44 bg-background">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="wide-label text-secondary mb-8 block font-bold">PERSONALISED GUIDANCE</span>
          <h2 className="font-headline text-5xl md:text-7xl text-primary mb-5 md:mb-6 tight-headline leading-[0.95]">
            Support from Selection <br />
            <span className="italic font-light serif opacity-60">to Delivery</span>
          </h2>
          <p className="text-on-surface-variant/85 text-[1.0625rem] md:text-[1.125rem] font-noto leading-relaxed max-w-3xl mx-auto">
            We help you choose the right watch, confirm what&apos;s available, and guide you through delivery with clear support at every step.
          </p>
        </div>
      </section>
    </div>
  );
}
