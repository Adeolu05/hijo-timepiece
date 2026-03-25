import { Link } from "react-router-dom";
import {
  SITE_NAME_FULL,
  EMAIL,
  PHONE_NG_DISPLAY,
  PHONE_AE_DISPLAY,
  LOCATION_LINE,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  whatsappHref,
} from "../constants/site";

const offerItems = [
  "Authentic luxury and designer watches",
  "Pre-owned and brand-new timepieces",
  "Trade-in and resale options",
  "Worldwide shipping",
  "Secure transactions and buyer protection",
];

const whyItems = [
  "Verified authenticity guarantee",
  "Transparent pricing",
  "Reliable customer service",
  "Wide selection of rare and popular models",
];

export function About() {
  return (
    <div className="min-h-screen bg-background pt-48 pb-32">
      <div className="max-w-[900px] mx-auto px-4 sm:px-12">
        <nav className="flex wide-label !text-[8px] text-on-surface-variant/40 mb-16">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-4 opacity-30">/</span>
          <span className="text-primary font-bold">About Us</span>
        </nav>

        <p className="wide-label text-secondary mb-6 font-bold tracking-[0.35em]">
          {SITE_NAME_FULL.toUpperCase()}
        </p>
        <h1 className="font-headline text-5xl md:text-7xl text-primary mb-16 tight-headline">
          About <span className="italic font-light serif opacity-60">Us</span>
        </h1>

        <section className="mb-20">
          <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed font-light">
            We are a trusted watch dealer specializing in authentic luxury, vintage, and modern
            timepieces. Our mission is to provide customers with genuine, high-quality watches at
            competitive prices, backed by honesty and professionalism.
          </p>
        </section>

        <section className="mb-20">
          <h2 className="font-headline text-3xl md:text-4xl text-primary mb-10 tight-headline">
            What We <span className="italic font-light serif opacity-60">Offer</span>
          </h2>
          <ul className="space-y-5 text-on-surface-variant text-base md:text-lg font-light border-l-2 border-secondary/30 pl-8">
            {offerItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-20">
          <h2 className="font-headline text-3xl md:text-4xl text-primary mb-10 tight-headline">
            Why Choose <span className="italic font-light serif opacity-60">Us</span>
          </h2>
          <ul className="space-y-5 text-on-surface-variant text-base md:text-lg font-light border-l-2 border-secondary/30 pl-8">
            {whyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-16 p-10 md:p-14 bg-surface-container-low/80 border border-outline-variant/15 luxury-shadow">
          <h2 className="wide-label text-secondary mb-10 font-bold tracking-[0.35em]">
            CONTACT
          </h2>
          <dl className="space-y-8 text-on-surface-variant font-light">
            <div>
              <dt className="wide-label !text-[9px] text-on-surface-variant/50 mb-2 font-bold">
                Location
              </dt>
              <dd className="text-lg text-primary">{LOCATION_LINE}</dd>
            </div>
            <div>
              <dt className="wide-label !text-[9px] text-on-surface-variant/50 mb-2 font-bold">
                Phone
              </dt>
              <dd className="space-y-2">
                <a
                  href="tel:+2348130634066"
                  className="block text-lg text-primary hover:text-secondary transition-colors"
                >
                  {PHONE_NG_DISPLAY}
                </a>
                <a
                  href="tel:+971522326519"
                  className="block text-lg text-primary hover:text-secondary transition-colors"
                >
                  {PHONE_AE_DISPLAY}
                </a>
              </dd>
            </div>
            <div>
              <dt className="wide-label !text-[9px] text-on-surface-variant/50 mb-2 font-bold">
                Email
              </dt>
              <dd>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-lg text-primary hover:text-secondary transition-colors lowercase"
                >
                  {EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="wide-label !text-[9px] text-on-surface-variant/50 mb-2 font-bold">
                WhatsApp & Instagram
              </dt>
              <dd className="flex flex-col sm:flex-row sm:items-center gap-6">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wide-label !text-[10px] text-secondary font-bold hover:text-primary transition-colors border-b border-secondary/40 pb-1"
                >
                  WhatsApp
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wide-label !text-[10px] text-secondary font-bold hover:text-primary transition-colors border-b border-secondary/40 pb-1"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-block bg-primary text-white px-12 py-5 wide-label !text-[10px] font-bold hover:bg-secondary transition-all duration-500"
          >
            View Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
