import { Link } from "react-router-dom";
import {
  SITE_NAME_FULL,
  EMAIL,
  whatsappHref,
  SITE_PUBLIC_BRAND,
} from "../constants/site";
import { JsonLd } from "../components/JsonLd";

export const FAQ_ENTRIES: { question: string; answer: string }[] = [
  {
    question: "Do you sell authentic luxury watches and wristwatches?",
    answer:
      "Yes. We focus on genuine luxury wristwatches, vintage and contemporary timepieces, and designer watches sourced through trusted suppliers. Transparency and authenticity are central to every sale.",
  },
  {
    question: "Where are you located and do you ship outside Nigeria?",
    answer:
      "We are based in Dubai and our partnered service center in Lagos, Nigeria. We work with collectors and buyers domestically and ship internationally wherever logistics allow; enquire for your country.",
  },
  {
    question: "How do I contact Hijo for a watch enquiry or purchase?",
    answer:
      `Use WhatsApp or email (${EMAIL}) for the fastest replies. Every product page has a WhatsApp enquiry option with a direct link. You may also DM us on Instagram @hijoluxwatches.`,
  },
  {
    question: "Can I browse wristwatches and prices on your website?",
    answer:
      "Yes. Use the curated shop to browse collections, filters, search by name or line, and see transparent pricing in NGN. Add items to your collection and continue on WhatsApp for payment and delivery.",
  },
  {
    question: "Do you accept trade-ins or pre-owned watches?",
    answer:
      "We offer trade-in and resale-related services where inventory and condition allow. Message us with reference photos and details for a case-by-case assessment.",
  },
];

function faqPageJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ENTRIES.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function Faq() {
  return (
    <>
      <JsonLd data={faqPageJsonLd()} />
      <div className="min-h-screen bg-background pt-8 pb-24 md:pt-12 md:pb-32">
        <div className="max-w-[820px] mx-auto px-4 sm:px-12">
          <nav className="flex wide-label !text-[8px] text-on-surface-variant/40 mb-12">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-4 opacity-30">/</span>
            <span className="text-primary font-bold">FAQ</span>
          </nav>

          <p className="wide-label text-secondary mb-4 font-bold tracking-[0.35em]">
            {SITE_PUBLIC_BRAND.toUpperCase()}
          </p>
          <h1 className="font-headline text-4xl md:text-6xl text-primary mb-5 tight-headline">
            Questions about <span className="italic font-light serif opacity-60">watches & orders</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-14 max-w-2xl">
            Quick answers for people searching for {SITE_PUBLIC_BRAND}, luxury wristwatches in Nigeria, and how to
            buy from {SITE_NAME_FULL}.
          </p>

          <div className="space-y-12">
            {FAQ_ENTRIES.map((item) => (
              <section key={item.question} className="border-b border-outline-variant/15 pb-12 last:border-0">
                <h2 className="font-headline text-xl md:text-2xl text-primary mb-4 leading-snug">{item.question}</h2>
                <p className="text-on-surface-variant font-light leading-relaxed text-base md:text-lg">{item.answer}</p>
              </section>
            ))}
          </div>

          <p className="mt-16 text-on-surface-variant/70 text-sm font-light">
            Still stuck?{" "}
            <a href={whatsappHref()} className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
