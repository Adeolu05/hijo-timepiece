/**
 * Raw rows returned by GROQ before mapping to {@link Watch}.
 * All fields optional/nullable at the wire; normalize in mapSanityDocumentToWatch.
 */
export interface SanityWatchDocument {
  slug?: string | null;
  name?: string | null;
  collection?: string | null;
  category?: string | null;
  price?: number | null;
  image?: string | null;
  description?: string | null;
  specs?: {
    movement?: string | null;
    dial?: string | null;
    case?: string | null;
    powerReserve?: string | null;
    waterResistance?: string | null;
    strapOrBracelet?: string | null;
  } | null;
  images?: (string | null | undefined)[] | null;
  featured?: boolean | null;
  isNewArrival?: boolean | null;
  isLimitedEdition?: boolean | null;
  /** Customer-facing availability (preferred). */
  availability?: string | null;
  /** Optional internal order cap. */
  stockQuantity?: number | null;
  /** @deprecated Legacy field; still read for old documents and mapper fallbacks. */
  stock?: number | null;
}
