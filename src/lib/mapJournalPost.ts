import type {
  JournalBlock,
  JournalPost,
  SanityJournalBlockWire,
  SanityJournalDetail,
  SanityJournalListItem,
} from "./journalTypes";
import { normalizeJournalPublishedAt } from "./journalPublishedAt";

function mapBodyBlock(row: SanityJournalBlockWire | null | undefined): JournalBlock | null {
  if (!row || !row._type) return null;
  const key = row._key;
  switch (row._type) {
    case "journalFigure": {
      const url = typeof row.imageUrl === "string" ? row.imageUrl.trim() : "";
      if (!url) return null;
      const cap = row.caption?.trim();
      return { kind: "figure", key, imageUrl: url, caption: cap || undefined };
    }
    case "journalVideo": {
      const url = typeof row.url === "string" ? row.url.trim() : "";
      if (!url) return null;
      const cap = row.caption?.trim();
      return { kind: "video", key, url, caption: cap || undefined };
    }
    case "journalText": {
      const text = typeof row.text === "string" ? row.text.trim() : "";
      if (!text) return null;
      return { kind: "text", key, text };
    }
    default:
      return null;
  }
}

export function mapSanityJournalListItem(row: SanityJournalListItem | null | undefined): JournalPost | null {
  if (!row) return null;
  const slug = row.slug?.trim();
  if (!slug) return null;
  const title = (row.title ?? "").trim() || "Untitled";
  const publishedAt = normalizeJournalPublishedAt(row.publishedAt);
  if (!publishedAt) return null;
  const excerpt = (row.excerpt ?? "").trim();
  const cover =
    typeof row.coverImage === "string" && row.coverImage.trim().length > 0 ? row.coverImage.trim() : undefined;
  return {
    slug,
    title,
    publishedAt,
    excerpt: excerpt || `Journal · ${title}`,
    coverImage: cover,
    body: [],
  };
}

export function mapSanityJournalDetail(row: SanityJournalDetail | null | undefined): JournalPost | null {
  const base = mapSanityJournalListItem(row);
  if (!base || !row) return base;
  const rawBlocks = row.body ?? [];
  const body: JournalBlock[] = [];
  for (const b of rawBlocks) {
    const mapped = mapBodyBlock(b);
    if (mapped) body.push(mapped);
  }
  return { ...base, body };
}
