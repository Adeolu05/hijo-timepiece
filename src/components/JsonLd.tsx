type JsonLdProps = {
  data: object;
};

/** Injects JSON-LD into the DOM for crawlers and rich results (Product, FAQs, breadcrumbs, …). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
