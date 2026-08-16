import type { Watch } from "../data/watches";
import type {
  ApplyFailReason,
  ApplyResult,
  CartQuote,
  CartQuoteLine,
  DiscountCode,
} from "./discountTypes";

interface DiscountableCartItem {
  watch: Watch;
  quantity: number;
}

const APPLY_MESSAGES: Record<ApplyFailReason, string> = {
  empty: "Enter a discount code.",
  not_found: "This code is not valid.",
  paused: "This offer is not available.",
  not_started: "This offer has not started yet.",
  expired: "This offer has ended.",
  no_eligible_items: "This code does not apply to the timepieces in your cart.",
  invalid_offer: "This offer cannot be applied.",
};

export function normalizeDiscountCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function applyFailMessage(reason: ApplyFailReason): string {
  return APPLY_MESSAGES[reason];
}

export function findDiscountCode(codes: DiscountCode[], raw: string): DiscountCode | undefined {
  const code = normalizeDiscountCode(raw);
  if (!code) return undefined;
  return codes.find((item) => item.code === code);
}

export function evaluateDiscountWindow(
  code: DiscountCode,
  now = Date.now(),
): ApplyFailReason | null {
  if (code.status !== "active") return "paused";
  const from = Date.parse(code.validFrom);
  const until = Date.parse(code.validUntil);
  if (!Number.isFinite(from) || !Number.isFinite(until)) return "invalid_offer";
  if (now < from) return "not_started";
  if (now > until) return "expired";
  if (
    code.discountType === "percent" &&
    (code.percentOff == null || code.percentOff <= 0 || code.percentOff > 100)
  ) {
    return "invalid_offer";
  }
  if (code.discountType === "amount" && (code.amountOffNgn == null || code.amountOffNgn <= 0)) {
    return "invalid_offer";
  }
  return null;
}

export function isWatchEligible(watch: Pick<Watch, "id" | "brand">, code: DiscountCode): boolean {
  if (code.excludedWatchSlugs.includes(watch.id)) return false;
  if (code.scope === "all") return true;
  if (code.scope === "brands") {
    return Boolean(watch.brand && code.eligibleBrands.includes(watch.brand));
  }
  if (code.scope === "watches") {
    return code.eligibleWatchSlugs.includes(watch.id);
  }
  return false;
}

export function hydrateCartItems(items: DiscountableCartItem[], catalog: Watch[]): DiscountableCartItem[] {
  if (catalog.length === 0) return items;
  const byId = new Map(catalog.map((watch) => [watch.id, watch]));
  return items.map((item) => {
    const live = byId.get(item.watch.id);
    return live ? { ...item, watch: live } : item;
  });
}

function emptyQuote(items: DiscountableCartItem[]): CartQuote {
  const lines = items.map((item) => lineFromItem(item, false, item.watch.price * item.quantity));
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  return {
    subtotal,
    savings: 0,
    total: subtotal,
    applied: null,
    lines,
    eligibleCount: 0,
  };
}

function lineFromItem(
  item: DiscountableCartItem,
  eligible: boolean,
  discountedLineTotal: number,
): CartQuoteLine {
  const lineTotal = item.watch.price * item.quantity;
  return {
    watchId: item.watch.id,
    name: item.watch.name,
    collection: item.watch.collection,
    quantity: item.quantity,
    unitPrice: item.watch.price,
    lineTotal,
    discountedLineTotal,
    eligible,
  };
}

function percentLineSavings(lineTotal: number, percent: number): number {
  if (lineTotal <= 0 || percent <= 0) return 0;
  return Math.min(lineTotal, Math.round((lineTotal * percent) / 100));
}

function allocateAmountSavings(eligibleTotals: number[], amountOff: number): number[] {
  const eligibleSubtotal = eligibleTotals.reduce((sum, value) => sum + value, 0);
  const savings = Math.min(amountOff, eligibleSubtotal);
  if (savings <= 0 || eligibleSubtotal <= 0) return eligibleTotals.map(() => 0);

  const allocated = eligibleTotals.map((lineTotal) =>
    Math.min(lineTotal, Math.round((savings * lineTotal) / eligibleSubtotal)),
  );
  const drift = savings - allocated.reduce((sum, value) => sum + value, 0);
  if (drift !== 0 && allocated.length > 0) {
    const last = allocated.length - 1;
    allocated[last] = Math.min(eligibleTotals[last], Math.max(0, allocated[last] + drift));
  }
  return allocated;
}

export function buildCartQuote(items: DiscountableCartItem[], code: DiscountCode | null): CartQuote {
  if (!code) return emptyQuote(items);

  const eligibility = items.map((item) => isWatchEligible(item.watch, code));
  const eligibleCount = eligibility.filter(Boolean).length;

  let lineSavings: number[];
  if (code.discountType === "percent") {
    const percent = code.percentOff ?? 0;
    lineSavings = items.map((item, index) =>
      eligibility[index] ? percentLineSavings(item.watch.price * item.quantity, percent) : 0,
    );
  } else {
    const eligibleTotals = items
      .map((item, index) => (eligibility[index] ? item.watch.price * item.quantity : 0))
      .filter((_, index) => eligibility[index]);
    const allocated = allocateAmountSavings(eligibleTotals, code.amountOffNgn ?? 0);
    let eligibleIndex = 0;
    lineSavings = eligibility.map((eligible) => {
      if (!eligible) return 0;
      const value = allocated[eligibleIndex] ?? 0;
      eligibleIndex += 1;
      return value;
    });
  }

  const lines = items.map((item, index) => {
    const lineTotal = item.watch.price * item.quantity;
    return lineFromItem(item, eligibility[index], lineTotal - lineSavings[index]);
  });
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const savings = lineSavings.reduce((sum, value) => sum + value, 0);

  return {
    subtotal,
    savings,
    total: Math.max(0, subtotal - savings),
    applied: code,
    lines,
    eligibleCount,
  };
}

export function applyDiscountCode(
  raw: string,
  codes: DiscountCode[],
  items: DiscountableCartItem[],
  catalog: Watch[],
  now = Date.now(),
): ApplyResult {
  const hydrated = hydrateCartItems(items, catalog);
  const base = emptyQuote(hydrated);
  const normalized = normalizeDiscountCode(raw);

  if (!normalized) {
    return { ok: false, reason: "empty", message: APPLY_MESSAGES.empty, quote: base };
  }

  const found = findDiscountCode(codes, normalized);
  if (!found) {
    return { ok: false, reason: "not_found", message: APPLY_MESSAGES.not_found, quote: base };
  }

  const windowFail = evaluateDiscountWindow(found, now);
  if (windowFail) {
    return { ok: false, reason: windowFail, message: APPLY_MESSAGES[windowFail], quote: base };
  }

  const quote = buildCartQuote(hydrated, found);
  if (quote.eligibleCount === 0 || quote.savings <= 0) {
    return {
      ok: false,
      reason: "no_eligible_items",
      message: APPLY_MESSAGES.no_eligible_items,
      quote: base,
    };
  }

  return { ok: true, quote: { ...quote, applied: found } };
}

export function isFailedApply(
  result: ApplyResult,
): result is Extract<ApplyResult, { ok: false }> {
  return result.ok === false;
}

export function quoteForAppliedCode(
  appliedCode: string | null,
  codes: DiscountCode[],
  items: DiscountableCartItem[],
  catalog: Watch[],
  now = Date.now(),
): CartQuote {
  const hydrated = hydrateCartItems(items, catalog);
  if (!appliedCode) return emptyQuote(hydrated);
  const result = applyDiscountCode(appliedCode, codes, hydrated, catalog, now);
  return result.ok ? result.quote : emptyQuote(hydrated);
}
