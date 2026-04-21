import {
  BRAND_CERTIFICATE_PDF_URL,
  BRAND_CERTIFICATE_PREVIEW_URL,
} from "../constants/site";

/**
 * Certificate trust block: real certificate preview image (not an embedded PDF viewer) linking to the PDF.
 */
export function BrandCertificateTrust() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
      <div className="lg:col-span-6 text-center lg:text-left">
        <span className="wide-label text-secondary mb-3 md:mb-4 block font-bold tracking-[0.32em]">
          Brand registration
        </span>
        <h2 className="font-headline text-[2rem] min-[400px]:text-4xl md:text-5xl text-primary mb-3 md:mb-4 tight-headline leading-[0.95]">
          A Registered Brand <br />
          <span className="italic font-light serif opacity-60">You Can Trust</span>
        </h2>
        <p className="font-noto text-on-surface-variant/88 text-[0.9375rem] md:text-[1rem] leading-[1.55] max-w-xl mx-auto lg:mx-0">
          Formally registered and accountable, so you can buy with confidence. Review our official certificate
          anytime; transparency you can verify before you decide.
        </p>
      </div>

      <div className="lg:col-span-6 flex justify-center lg:justify-end">
        <a
          href={BRAND_CERTIFICATE_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View brand registration certificate (PDF opens in a new tab)"
          className="group block w-full max-w-[min(100%,20.5rem)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/60 active:scale-[0.995] transition-transform duration-150"
        >
          <div className="relative luxury-shadow rounded-[2px] border border-outline-variant/35 bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.92),0_2px_8px_rgba(0,0,0,0.05)] aspect-[210/297] max-h-[28rem] w-full overflow-hidden transition-[border-color,box-shadow] duration-500 group-hover:border-secondary/45 group-hover:shadow-lg">
            <div className="absolute left-2 right-2 top-2 bottom-[3.625rem] overflow-hidden rounded-[1px] bg-[#ecebe8] ring-1 ring-inset ring-black/[0.05]">
              <img
                src={BRAND_CERTIFICATE_PREVIEW_URL}
                alt="Corporate Affairs Commission certificate of registration for Hijo Lux Watches Multi Services"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain object-top p-2 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />
            </div>

            <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 border-t border-secondary/25 bg-primary/[0.04] py-3.5 transition-colors duration-500 group-hover:bg-secondary/12 group-hover:border-secondary/35">
              <span className="wide-label text-primary text-center font-bold tracking-[0.26em] group-hover:text-primary transition-colors">
                View certificate
              </span>
              <span
                className="material-symbols-outlined text-secondary text-lg font-light group-hover:translate-x-0.5 transition-transform duration-500"
                aria-hidden
              >
                open_in_new
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
