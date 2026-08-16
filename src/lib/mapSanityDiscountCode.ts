import { isWatchBrand, type WatchBrand } from "../constants/watchBrands";
import type { DiscountCode, DiscountScope, DiscountStatus, DiscountType, SanityDiscountCodeDocument } from "./discountTypes";

function nonEmptyStrings(values: (string | null | undefined)[] | null | undefined): string[] {
  if (!values?.length) return [];
  return values.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function mapDiscountType(raw: string | null | undefined): DiscountType | undefined {
  return raw === "percent" || raw === "amount" ? raw : undefined;
}

function mapScope(raw: string | null | undefined): DiscountScope | undefined {
  return raw === "all" || raw === "brands" || raw === "watches" ? raw : undefined;
}

function mapStatus(raw: string | null | undefined): DiscountStatus {
  return raw === "paused" ? "paused" : "active";
}

function mapBrands(values: (string | null)[] | null | undefined): WatchBrand[] {
  const seen = new Set<WatchBrand>();
  for (const value of values ?? []) {
    const normalized = value?.trim().toLowerCase();
    if (normalized && isWatchBrand(normalized)) seen.add(normalized);
  }
  return Array.from(seen);
}

/**
 * Maps a Sanity discount-code row. Returns null when the campaign cannot be applied
 * (missing code, dates, or offer amount).
 */
export function mapSanityDocumentToDiscountCode(doc: SanityDiscountCodeDocument): DiscountCode | null {
  const code = doc.code?.trim().toUpperCase().replace(/\s+/g, "") ?? "";
  if (!/^[A-Z0-9]{3,24}$/.test(code)) return null;

  const discountType = mapDiscountType(doc.discountType);
  const scope = mapScope(doc.scope);
  const validFrom = doc.validFrom?.trim() ?? "";
  const validUntil = doc.validUntil?.trim() ?? "";
  if (!discountType || !scope || !validFrom || !validUntil) return null;
  if (!Number.isFinite(Date.parse(validFrom)) || !Number.isFinite(Date.parse(validUntil))) return null;

  const mapped: DiscountCode = {
    code,
    title: (doc.title ?? "").trim() || code,
    discountType,
    status: mapStatus(doc.status),
    validFrom,
    validUntil,
    scope,
    eligibleBrands: mapBrands(doc.eligibleBrands),
    eligibleWatchSlugs: nonEmptyStrings(doc.eligibleWatchSlugs),
    excludedWatchSlugs: nonEmptyStrings(doc.excludedWatchSlugs),
  };

  if (discountType === "percent") {
    const percent =
      typeof doc.percentOff === "number" && Number.isFinite(doc.percentOff) ? doc.percentOff : undefined;
    if (percent == null || percent <= 0 || percent > 100) return null;
    mapped.percentOff = percent;
  } else {
    const amount =
      typeof doc.amountOffNgn === "number" && Number.isFinite(doc.amountOffNgn) ? doc.amountOffNgn : undefined;
    if (amount == null || amount <= 0) return null;
    mapped.amountOffNgn = amount;
  }

  const note = doc.storefrontNote?.trim();
  if (note) mapped.storefrontNote = note;

  if (scope === "brands" && mapped.eligibleBrands.length === 0) return null;
  if (scope === "watches" && mapped.eligibleWatchSlugs.length === 0) return null;

  return mapped;
}

export function mapSanityDocumentsToDiscountCodes(docs: SanityDiscountCodeDocument[]): DiscountCode[] {
  const byCode = new Map<string, DiscountCode>();
  for (const doc of docs) {
    const mapped = mapSanityDocumentToDiscountCode(doc);
    if (mapped && !byCode.has(mapped.code)) byCode.set(mapped.code, mapped);
  }
  return Array.from(byCode.values());
}
