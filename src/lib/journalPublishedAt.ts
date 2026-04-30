/** Flexible publication value from Sanity: YYYY, YYYY-MM, YYYY-MM-DD, or legacy ISO datetime. */

const FLEX_DATE = /^\d{4}(-\d{2})?(-\d{2})?$/;

export function normalizeJournalPublishedAt(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (s.includes("T")) return s.slice(0, 10);
  if (FLEX_DATE.test(s)) return s;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return s;
}

/** Display label for index / article byline. */
export function formatJournalPublishedDisplay(value: string): string {
  const v = value.trim();
  if (/^\d{4}$/.test(v)) return v;
  if (/^\d{4}-\d{2}$/.test(v)) {
    const [y, m] = v.split("-");
    const mo = new Date(Number(y), Number(m) - 1, 1);
    if (Number.isNaN(mo.getTime())) return v;
    return mo.toLocaleDateString("en-NG", { year: "numeric", month: "long" });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(`${v}T12:00:00`);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
  }
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
  }
  return v;
}

/** Best-effort ISO 8601 date for JSON-LD `datePublished`. */
export function journalPublishedAtForJsonLd(value: string): string {
  const v = value.trim();
  if (/^\d{4}$/.test(v)) return `${v}-01-01`;
  if (/^\d{4}-\d{2}$/.test(v)) return `${v}-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return v;
}
