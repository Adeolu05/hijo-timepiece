import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BASE_CURRENCY,
  DEFAULT_CURRENCY,
  detectCurrencyFromNavigator,
  isSupportedCurrency,
  type SupportedCurrency,
} from "../constants/currencies";

export type CurrencyStatus = "idle" | "loading" | "ready" | "error";

export type ExchangeRates = Partial<Record<SupportedCurrency, number>>;

interface ExchangeRatesResponse {
  base: string;
  rates: ExchangeRates;
  fetchedAt: string;
  stale?: boolean;
  error?: string;
}

interface CurrencyState {
  currency: SupportedCurrency;
  rates: ExchangeRates;
  fetchedAt: string | null;
  status: CurrencyStatus;
  userHasSetCurrency: boolean;
  showRatesUnavailableNotice: boolean;
  setCurrency: (currency: SupportedCurrency) => void;
  fetchRates: (options?: { force?: boolean }) => Promise<void>;
  initCurrency: () => Promise<void>;
  dismissRatesNotice: () => void;
}

const REFRESH_MS = 30 * 60 * 1000;
const SUPPORTED_CODES = ["NGN", "USD", "GBP", "EUR", "CAD", "AUD", "AED"] as const;

function parseUpstreamRates(allRates: Record<string, unknown>): ExchangeRates {
  const rates: ExchangeRates = { NGN: 1 };
  for (const code of SUPPORTED_CODES) {
    if (code === "NGN") continue;
    const rate = allRates[code];
    if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) {
      rates[code] = rate;
    }
  }
  return rates;
}

function hasCompleteRates(rates: ExchangeRates): boolean {
  return SUPPORTED_CODES.every(
    (code) => typeof rates[code] === "number" && (rates[code] as number) > 0,
  );
}

async function fetchExchangeRatesPayload(): Promise<ExchangeRatesResponse> {
  try {
    const response = await fetch("/api/exchange-rates");
    if (response.ok) {
      const data = (await response.json()) as ExchangeRatesResponse;
      if (data?.rates && hasCompleteRates({ NGN: 1, ...data.rates })) {
        return data;
      }
    }
  } catch {
    // Fall through to direct upstream fetch (local Vite dev without API routes).
  }

  const upstream = await fetch("https://open.er-api.com/v6/latest/NGN");
  if (!upstream.ok) {
    throw new Error(`Upstream HTTP ${upstream.status}`);
  }

  const data = (await upstream.json()) as {
    result?: string;
    rates?: Record<string, unknown>;
  };

  if (data?.result !== "success" || typeof data.rates !== "object") {
    throw new Error("Invalid upstream payload");
  }

  const rates = parseUpstreamRates(data.rates);
  if (!hasCompleteRates(rates)) {
    throw new Error("Incomplete rates from upstream");
  }

  return {
    base: "NGN",
    rates,
    fetchedAt: new Date().toISOString(),
  };
}

function isFresh(fetchedAt: string | null): boolean {
  if (!fetchedAt) return false;
  const ts = Date.parse(fetchedAt);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < REFRESH_MS;
}

function hasRatesForCurrency(
  rates: ExchangeRates,
  currency: SupportedCurrency,
): boolean {
  if (currency === BASE_CURRENCY) return true;
  const rate = rates[currency];
  return typeof rate === "number" && Number.isFinite(rate) && rate > 0;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: DEFAULT_CURRENCY,
      rates: { NGN: 1 },
      fetchedAt: null,
      status: "idle",
      userHasSetCurrency: false,
      showRatesUnavailableNotice: false,

      setCurrency: (currency) => {
        set({
          currency,
          userHasSetCurrency: true,
          showRatesUnavailableNotice: false,
        });
        void get().fetchRates();
      },

      fetchRates: async ({ force = false } = {}) => {
        const { fetchedAt, status } = get();
        if (!force && isFresh(fetchedAt) && status === "ready") {
          return;
        }

        set({ status: "loading" });

        try {
          const data = await fetchExchangeRatesPayload();

          set({
            rates: { NGN: 1, ...data.rates },
            fetchedAt: data.fetchedAt ?? new Date().toISOString(),
            status: "ready",
            showRatesUnavailableNotice: false,
          });
        } catch {
          const { currency, rates, fetchedAt: previousFetchedAt } = get();
          const hasFallback = hasRatesForCurrency(rates, currency);

          set({
            status: hasFallback ? "ready" : "error",
            showRatesUnavailableNotice:
              currency !== BASE_CURRENCY && !hasFallback,
          });

          if (!previousFetchedAt && !hasFallback) {
            set({ fetchedAt: null });
          }
        }
      },

      initCurrency: async () => {
        const { userHasSetCurrency, currency } = get();

        if (!userHasSetCurrency) {
          const detected = detectCurrencyFromNavigator();
          if (detected !== currency) {
            set({ currency: detected });
          }
        }

        await get().fetchRates();
      },

      dismissRatesNotice: () => {
        set({ showRatesUnavailableNotice: false });
      },
    }),
    {
      name: "hijo-lux-currency-v1",
      partialize: (state) => ({
        currency: state.currency,
        rates: state.rates,
        fetchedAt: state.fetchedAt,
        userHasSetCurrency: state.userHasSetCurrency,
      }),
      merge: (persisted, current) => {
        const merged = {
          ...current,
          ...(persisted as Partial<CurrencyState> | undefined),
        };

        if (
          typeof merged.currency === "string" &&
          !isSupportedCurrency(merged.currency)
        ) {
          merged.currency = DEFAULT_CURRENCY;
        }

        merged.rates = {
          NGN: 1,
          ...(merged.rates ?? {}),
        };

        return merged;
      },
    },
  ),
);

export function getRateForCurrency(
  rates: ExchangeRates,
  currency: SupportedCurrency,
): number | null {
  if (currency === BASE_CURRENCY) return 1;
  const rate = rates[currency];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
    return null;
  }
  return rate;
}
