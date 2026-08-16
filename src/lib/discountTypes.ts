import type { WatchBrand } from "../constants/watchBrands";

/** Raw rows returned by the discount-code GROQ projection. */
export interface SanityDiscountCodeDocument {
  code?: string | null;
  title?: string | null;
  discountType?: string | null;
  percentOff?: number | null;
  amountOffNgn?: number | null;
  status?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  scope?: string | null;
  eligibleBrands?: (string | null)[] | null;
  eligibleWatchSlugs?: (string | null)[] | null;
  excludedWatchSlugs?: (string | null)[] | null;
  storefrontNote?: string | null;
}

export type DiscountType = "percent" | "amount";
export type DiscountScope = "all" | "brands" | "watches";
export type DiscountStatus = "active" | "paused";

/** Normalized campaign used by the cart. Prices and savings are NGN. */
export interface DiscountCode {
  code: string;
  title: string;
  discountType: DiscountType;
  percentOff?: number;
  amountOffNgn?: number;
  status: DiscountStatus;
  validFrom: string;
  validUntil: string;
  scope: DiscountScope;
  eligibleBrands: WatchBrand[];
  eligibleWatchSlugs: string[];
  excludedWatchSlugs: string[];
  storefrontNote?: string;
}

export type ApplyFailReason =
  | "empty"
  | "not_found"
  | "paused"
  | "not_started"
  | "expired"
  | "no_eligible_items"
  | "invalid_offer";

export interface CartQuoteLine {
  watchId: string;
  name: string;
  collection: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discountedLineTotal: number;
  eligible: boolean;
}

export interface CartQuote {
  subtotal: number;
  savings: number;
  total: number;
  applied: DiscountCode | null;
  lines: CartQuoteLine[];
  eligibleCount: number;
}

export type ApplyResult =
  | { ok: true; quote: CartQuote & { applied: DiscountCode } }
  | { ok: false; reason: ApplyFailReason; message: string; quote: CartQuote };
