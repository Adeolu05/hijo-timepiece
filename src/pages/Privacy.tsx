import { Link } from "react-router-dom";
import { SITE_NAME_FULL } from "../constants/site";

export function Privacy() {
  return (
    <div className="min-h-screen bg-background pt-48 pb-32">
      <div className="max-w-[720px] mx-auto px-4 sm:px-12">
        <nav className="flex wide-label !text-[8px] text-on-surface-variant/40 mb-12">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-4 opacity-30">/</span>
          <span className="text-primary font-bold">Privacy</span>
        </nav>
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-12 tight-headline">Privacy policy</h1>
        <div className="text-on-surface-variant font-light space-y-6 text-base leading-relaxed">
          <p>
            {SITE_NAME_FULL} (“we”, “us”) respects your privacy. This page describes how we handle
            information when you use our website, contact us, or place an inquiry (including via
            WhatsApp or email).
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">Information we collect</h2>
          <p>
            When you contact us or complete a cart checkout message, you may provide your name, phone
            number, email address, and order notes. We use this information only to respond to your
            inquiry and complete your request.
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">How we use information</h2>
          <p>
            We use contact and order details to communicate about watches, pricing, authenticity,
            shipping, and payment. We do not sell your personal data to third parties.
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">Third-party services</h2>
          <p>
            Our site may use hosting, analytics, or messaging tools (for example WhatsApp or email
            providers). Those services have their own privacy policies governing data they process on
            their platforms.
          </p>
          <h2 className="font-headline text-2xl text-primary mt-10 mb-4">Contact</h2>
          <p>
            For privacy-related questions, email us at the address shown on our{" "}
            <Link to="/about" className="text-secondary hover:text-primary underline underline-offset-4">
              About
            </Link>{" "}
            page.
          </p>
          <p className="text-sm text-on-surface-variant/60 pt-8">
            Last updated {new Date().getFullYear()}. This policy is a general template and should be
            reviewed by qualified counsel for your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
