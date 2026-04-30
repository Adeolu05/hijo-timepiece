/** GROQ row for journal list. */
export interface SanityJournalListItem {
  slug?: string | null;
  title?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
}

/** Single block from GROQ body[]. */
export interface SanityJournalBlockWire {
  _key?: string;
  _type?: string | null;
  caption?: string | null;
  url?: string | null;
  text?: string | null;
  imageUrl?: string | null;
}

export interface SanityJournalDetail extends SanityJournalListItem {
  body?: SanityJournalBlockWire[] | null;
}

export type JournalBlock =
  | { kind: "figure"; key?: string; imageUrl: string; caption?: string }
  | { kind: "video"; key?: string; url: string; caption?: string }
  | { kind: "text"; key?: string; text: string };

/** Normalized post for the storefront. */
export interface JournalPost {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  coverImage?: string;
  body: JournalBlock[];
}
