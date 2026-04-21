/**
 * Hides weak or test CMS values from storefront labels (collection lines, etc.).
 * Returns null when the string should not be shown.
 */
export function displayMerchandisingLabel(raw: string | undefined | null): string | null {
  if (raw == null) return null;
  const t = raw.trim();
  if (t.length < 2) return null;
  const l = t.toLowerCase();
  const blocked = [
    "test",
    "placeholder",
    "lorem",
    "rich peeps",
    "asdf",
    "sample collection",
    "sample",
    "xxx",
    "untitled collection",
    "todo",
  ];
  if (blocked.some((b) => l.includes(b))) return null;
  return t;
}
