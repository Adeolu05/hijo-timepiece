import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { EMAIL, whatsappHref } from '../constants/site';

export function Home() {
  const { watches, fetchWatches } = useProductStore();

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  const featuredWatches = watches.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Utility Bar */}
      <div className="obsidian-black py-2 text-center px-4">
        <span className="wide-label text-secondary">
          Worldwide shipping · Secure transactions · Authentic luxury &amp; vintage timepieces
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center overflow-hidden bg-background border-b border-outline-variant/10">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left z-20 pt-20 md:pt-0">
            <span className="wide-label text-secondary mb-10 block font-bold">LAGOS, NIGERIA · WORLDWIDE</span>
            <h1 className="font-headline text-7xl md:text-[11rem] text-primary mb-12 tight-headline">
              The <br />
              Architecture <br />
              of <span className="italic font-light serif opacity-60">Time</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-12 mt-16">
              <Link
                to="/shop"
                className="bg-primary text-white px-16 py-6 wide-label !text-[10px] font-bold hover:bg-secondary transition-all duration-700 shadow-2xl"
              >
                Explore Collection
              </Link>
              <Link
                to="/about"
                className="wide-label !text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors border-b border-primary/20 hover:border-primary pb-2 italic"
              >
                About Us
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative mt-24 md:mt-0 flex justify-center">
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
                alt="Luxury Watch"
                className="w-full max-w-2xl drop-shadow-[0_50px_50px_rgba(0,0,0,0.15)] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[2000ms] scale-110 group-hover:scale-100"
              />
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 border border-secondary/10 rounded-full animate-pulse pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-secondary/5 rounded-full pointer-events-none"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-24 right-12 hidden lg:block">
          <div className="flex flex-col items-center gap-8">
            <span className="wide-label !text-[8px] text-on-surface-variant/40 vertical-text rotate-180 font-bold">
              Scroll to Archive
            </span>
            <div className="w-px h-24 bg-secondary/30"></div>
          </div>
        </div>
      </section>

      {/* Masterpieces Section */}
      <section className="py-64 px-4 sm:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
          <div className="max-w-2xl">
            <h2 className="font-headline text-7xl md:text-8xl text-primary mb-10 leading-[0.85] tight-headline">
              Masterpieces <br />
              <span className="italic font-light serif opacity-60">of the</span> Season
            </h2>
            <p className="wide-label text-secondary font-bold">
              A CURATED SELECTION OF HOROLOGICAL EXCELLENCE
            </p>
          </div>
          <div className="flex items-center gap-10">
            <Link to="/shop" className="wide-label text-on-surface-variant hover:text-primary transition-colors font-bold">
              View Archive
            </Link>
            <div className="w-48 h-px bg-outline-variant/20"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-24">
          {/* Large Vertical Card */}
          <div className="md:col-span-7 group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden bg-surface-container-low relative mb-12 luxury-shadow">
              <div className="absolute top-10 left-10 z-10">
                <span className="bg-primary text-white px-6 py-3 wide-label !text-[8px] font-bold">Limited Edition</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1974&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                alt="Featured Watch"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
            <div className="flex justify-between items-start pt-4">
              <div>
                <h3 className="font-headline text-4xl text-primary mb-3 tight-headline">The Obsidian Chronograph</h3>
                <p className="wide-label !text-[9px] text-on-surface-variant/60 font-bold">Calibre 321 • Platinum Case</p>
              </div>
              <p className="font-headline text-3xl text-secondary italic">
                <span className="wide-label !text-[10px] align-top mr-2 opacity-40">USD</span> 42,500
              </p>
            </div>
          </div>

          {/* Two Smaller Stacked Cards */}
          <div className="md:col-span-5 flex flex-col gap-32">
            {featuredWatches.slice(1, 3).map((watch) => (
              <div key={watch.id} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-surface-container-low mb-10 luxury-shadow relative">
                  <img 
                    src={watch.image} 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    alt={watch.name}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>
                <div className="flex justify-between items-start pt-2">
                  <div>
                    <h3 className="font-headline text-3xl text-primary mb-2 tight-headline">{watch.name}</h3>
                    <p className="wide-label !text-[9px] text-on-surface-variant/60 font-bold">{watch.collection}</p>
                  </div>
                  <p className="font-headline text-2xl text-secondary italic">
                    <span className="wide-label !text-[10px] align-top mr-2 opacity-40">USD</span> {watch.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-64 border-t border-outline-variant/10 bg-surface-container-low/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/5] overflow-hidden luxury-shadow">
                <img
                  src="https://images.unsplash.com/photo-1587836374828-cb4387861007?q=80&w=2070&auto=format&fit=crop"
                  alt="Watchmaking Craftsmanship"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[3000ms] scale-105 hover:scale-100"
                />
              </div>
              <div className="absolute -bottom-20 -right-20 w-3/4 bg-background p-20 luxury-shadow hidden md:block border border-outline-variant/10">
                <span className="wide-label text-secondary mb-8 block font-bold">PRECISION ENGINEERING</span>
                <h3 className="font-headline text-6xl text-primary mb-10 leading-[0.9] tight-headline">
                  The Dress Watch <br /> <span className="italic font-light serif opacity-60">Reimagined</span>
                </h3>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-12 font-light italic font-serif opacity-80">
                  "Slim profiles designed to glide beneath the cuff of a bespoke shirt. Elegance in its purest, most minimalist form."
                </p>
                <Link to="/shop" className="wide-label text-primary border-b border-secondary pb-2 inline-block font-bold hover:text-secondary hover:border-primary transition-all">
                  Shop Dress Watches
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-32">
              <div className="aspect-square relative overflow-hidden group luxury-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  alt="Chronographs"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <h4 className="text-white font-headline text-4xl mb-4 tight-headline">Chronographs</h4>
                  <p className="text-white/70 wide-label font-bold">Racing & Aviation Icons</p>
                </div>
              </div>
              <div className="aspect-square relative overflow-hidden group bg-[#0B0B0B] luxury-shadow">
                <div className="absolute inset-0 flex items-center justify-center p-16">
                   <span className="font-headline text-8xl text-secondary/10 select-none italic">Limited</span>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-16">
                  <h4 className="text-white font-headline text-4xl mb-4 tight-headline">Limited Editions</h4>
                  <p className="text-white/70 wide-label font-bold">Rare Horological Pieces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-48 bg-background border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20 text-center">
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-5xl mb-8 font-light group-hover:scale-110 transition-transform duration-500">verified</span>
              <h4 className="wide-label text-primary mb-4 font-bold">Authenticity</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold">Verified guarantee</p>
            </div>
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-5xl mb-8 font-light group-hover:scale-110 transition-transform duration-500">payments</span>
              <h4 className="wide-label text-primary mb-4 font-bold">Pricing</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold">Transparent &amp; competitive</p>
            </div>
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-5xl mb-8 font-light group-hover:scale-110 transition-transform duration-500">public</span>
              <h4 className="wide-label text-primary mb-4 font-bold">Shipping</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold">Worldwide delivery</p>
            </div>
            <div className="group">
              <span className="material-symbols-outlined text-secondary text-5xl mb-8 font-light group-hover:scale-110 transition-transform duration-500">support_agent</span>
              <h4 className="wide-label text-primary mb-4 font-bold">Service</h4>
              <p className="wide-label !text-[8px] text-on-surface-variant/40 font-bold">Reliable customer care</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA (Black) */}
      <section className="bg-[#0B0B0B] py-64 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1587836374828-cb4387861007?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale"
            alt="Movement"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="wide-label text-secondary mb-12 block font-bold tracking-[0.6em]">BESPOKE SERVICES</span>
          <h2 className="font-headline text-7xl md:text-9xl text-white mb-16 tight-headline">
            A Bespoke <br />
            <span className="italic font-light serif opacity-60">Experience</span>
          </h2>
          <p className="text-white/40 text-xl font-light mb-20 max-w-3xl mx-auto leading-relaxed italic font-serif">
            "Connect with our horological experts via WhatsApp for personalized consultations, private viewings, and bespoke sourcing requests."
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a 
              href={whatsappHref()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-transparent border border-secondary text-secondary px-16 py-7 wide-label !text-[11px] font-bold hover:bg-secondary hover:text-black transition-all duration-500 group"
            >
              <span className="material-symbols-outlined mr-4 text-xl group-hover:scale-110 transition-transform">chat_bubble</span>
              WhatsApp us
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center bg-transparent border border-white/10 text-white/60 px-16 py-7 wide-label !text-[11px] font-bold hover:border-white hover:text-white transition-all duration-500"
            >
              Email us
            </a>
          </div>
        </div>
      </section>

      {/* Concierge Section */}
      <section className="py-64 bg-background">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="wide-label text-secondary mb-10 block font-bold">PERSONALIZED GUIDANCE</span>
          <h2 className="font-headline text-6xl md:text-8xl text-primary mb-12 tight-headline">
            The Digital <span className="italic font-light serif opacity-60">Archivist</span>
          </h2>
          <p className="text-on-surface-variant text-xl font-light mb-20 leading-relaxed max-w-3xl mx-auto italic font-serif opacity-70">
            Our dedicated team is available to assist you with every aspect of your horological journey. From authentication to global delivery logistics.
          </p>
          <div className="flex justify-center">
            <div className="w-px h-32 bg-secondary/30"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
