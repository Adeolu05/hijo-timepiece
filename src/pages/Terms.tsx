import { Link } from "react-router-dom";
import { SITE_NAME_FULL } from "../constants/site";

export function Terms() {
  return (
    <div className="min-h-screen bg-background pt-48 pb-32">
      <div className="max-w-[720px] mx-auto px-4 sm:px-12">
        <nav className="flex wide-label !text-[8px] text-on-surface-variant/40 mb-12">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-4 opacity-30">/</span>
          <span className="text-primary font-bold">Terms</span>
        </nav>
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-12 tight-headline">Terms of sale</h1>
        <div className="text-on-surface-variant font-light space-y-6 text-base leading-relaxed">
          <p>
            These terms govern inquiries and purchases arranged through {SITE_NAME_FULL}. By contacting
            us or confirming an order, you agree to the practices described here.
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">Authenticity</h2>
          <p>
            We stand behind the authenticity of the timepieces we offer. Specific warranties,
            return windows, and authentication documentation will be confirmed with you before
            payment, in writing where appropriate.
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">Pricing &amp; availability</h2>
          <p>
            Prices and availability may change until an order is confirmed. Final price, taxes,
            duties, shipping, and payment method are agreed with you directly before completion.
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">Shipping &amp; risk</h2>
          <p>
            Shipping terms, insurance, and transfer of risk are agreed per transaction. International
            shipments may be subject to customs duties and import regulations in your country.
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">Limitation</h2>
          <p>
            Our liability is limited to the maximum extent permitted by applicable law. Nothing here
            excludes rights that cannot legally be waived.
          </p>
          <p className="text-sm text-on-surface-variant/60 pt-8">
            Last updated {new Date().getFullYear()}. These terms are a template for your business —
            have them reviewed by a lawyer before relying on them commercially.
          </p>
        </div>
      </div>
    </div>
  );
}
