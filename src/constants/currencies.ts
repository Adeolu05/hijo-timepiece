export const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR", "CAD", "AUD", "AED"] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: SupportedCurrency = "NGN";
export const BASE_CURRENCY: SupportedCurrency = "NGN";

const REGION_TO_CURRENCY: Record<string, SupportedCurrency> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  AE: "AED",
  AT: "EUR",
  BE: "EUR",
  CY: "EUR",
  DE: "EUR",
  EE: "EUR",
  ES: "EUR",
  FI: "EUR",
  FR: "EUR",
  GR: "EUR",
  HR: "EUR",
  IE: "EUR",
  IT: "EUR",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  MT: "EUR",
  NL: "EUR",
  PT: "EUR",
  SI: "EUR",
  SK: "EUR",
};

const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "de-DE",
  CAD: "en-CA",
  AUD: "en-AU",
  AED: "en-AE",
};

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export function localeForCurrency(currency: SupportedCurrency): string {
  return CURRENCY_LOCALES[currency];
}

export function detectCurrencyFromNavigator(): SupportedCurrency {
  if (typeof navigator === "undefined") return DEFAULT_CURRENCY;

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const lang of languages) {
    const region = lang.split("-")[1]?.toUpperCase();
    if (region && region in REGION_TO_CURRENCY) {
      return REGION_TO_CURRENCY[region];
    }
  }

  return "USD";
}
