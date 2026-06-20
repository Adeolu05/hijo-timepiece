import { useCallback } from "react";
import {
  BASE_CURRENCY,
  type SupportedCurrency,
} from "../constants/currencies";
import {
  convertFromNgn,
  formatMoney,
  formatNgnAmount,
} from "../lib/formatMoney";
import {
  getRateForCurrency,
  useCurrencyStore,
} from "../store/currencyStore";

export function usePriceDisplay() {
  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);
  const status = useCurrencyStore((state) => state.status);

  const effectiveCurrency: SupportedCurrency =
    currency === BASE_CURRENCY || getRateForCurrency(rates, currency) != null
      ? currency
      : BASE_CURRENCY;

  const rate = getRateForCurrency(rates, effectiveCurrency);
  const isReady =
    effectiveCurrency === BASE_CURRENCY ||
    (status === "ready" && rate != null) ||
    (status === "loading" && rate != null);

  const toDisplayAmount = useCallback(
    (ngnAmount: number): number => {
      if (effectiveCurrency === BASE_CURRENCY || rate == null) {
        return ngnAmount;
      }
      return convertFromNgn(ngnAmount, rate);
    },
    [effectiveCurrency, rate],
  );

  const formatPrice = useCallback(
    (ngnAmount: number): string => {
      if (effectiveCurrency === BASE_CURRENCY || rate == null) {
        return formatNgnAmount(ngnAmount);
      }
      return formatMoney(toDisplayAmount(ngnAmount), effectiveCurrency);
    },
    [effectiveCurrency, rate, toDisplayAmount],
  );

  const formatPriceWithCode = useCallback(
    (ngnAmount: number): { formatted: string; code: SupportedCurrency } => ({
      formatted: formatPrice(ngnAmount),
      code: effectiveCurrency,
    }),
    [effectiveCurrency, formatPrice],
  );

  const formatCheckoutLine = useCallback(
    (ngnAmount: number): string => {
      const ngnFormatted = formatNgnAmount(ngnAmount);

      if (effectiveCurrency === BASE_CURRENCY) {
        return `${ngnFormatted} NGN`;
      }

      const converted = formatPrice(ngnAmount);
      return `${converted} (${ngnFormatted} NGN)`;
    },
    [effectiveCurrency, formatPrice],
  );

  return {
    currency: effectiveCurrency,
    formatPrice,
    formatPriceWithCode,
    formatCheckoutLine,
    isReady,
  };
}
