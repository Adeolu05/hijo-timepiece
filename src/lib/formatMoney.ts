import {
  BASE_CURRENCY,
  localeForCurrency,
  type SupportedCurrency,
} from "../constants/currencies";

function fractionDigitsFor(currency: SupportedCurrency): number {
  switch (currency) {
    case "NGN":
    case "AED":
      return 0;
    case "USD":
    case "GBP":
    case "EUR":
    case "CAD":
    case "AUD":
      return 2;
    default: {
      const _exhaustive: never = currency;
      return _exhaustive;
    }
  }
}

export function convertFromNgn(ngnAmount: number, rate: number): number {
  if (!Number.isFinite(ngnAmount) || !Number.isFinite(rate)) return 0;
  return Math.max(0, ngnAmount) * rate;
}

export function roundForCurrency(amount: number, currency: SupportedCurrency): number {
  const digits = fractionDigitsFor(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) {
    return new Intl.NumberFormat(localeForCurrency(currency), {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigitsFor(currency),
      maximumFractionDigits: fractionDigitsFor(currency),
    }).format(0);
  }

  const rounded = roundForCurrency(Math.max(0, amount), currency);
  return new Intl.NumberFormat(localeForCurrency(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigitsFor(currency),
    maximumFractionDigits: fractionDigitsFor(currency),
  }).format(rounded);
}

export function formatNgnAmount(ngnAmount: number): string {
  return formatMoney(ngnAmount, BASE_CURRENCY);
}
