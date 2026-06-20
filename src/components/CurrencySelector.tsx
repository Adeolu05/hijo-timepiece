import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import {
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "../constants/currencies";
import { useCurrencyStore } from "../store/currencyStore";

type CurrencyPickerVariant = "header" | "inline" | "subtle";

interface CurrencyPickerProps {
  className?: string;
  variant?: CurrencyPickerVariant;
}

const variantButtonClass: Record<CurrencyPickerVariant, string> = {
  header:
    "text-white/85 hover:text-white border-white/25 hover:border-white/45 bg-white/[0.04] hover:bg-white/[0.08]",
  inline:
    "text-on-surface-variant/75 hover:text-secondary border-outline-variant/30 hover:border-secondary/45 bg-background/80",
  subtle:
    "text-on-surface-variant/60 hover:text-secondary border-transparent hover:border-outline-variant/30 bg-transparent",
};

function stopLinkNavigation(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function CurrencyMenu({
  currency,
  onSelect,
  className = "",
}: {
  currency: SupportedCurrency;
  onSelect: (code: SupportedCurrency) => void;
  className?: string;
}) {
  return (
    <ul
      role="listbox"
      aria-label="Select display currency"
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-[70] min-w-[5.25rem] max-h-[14rem] overflow-y-auto bg-background border border-outline-variant/30 shadow-[0_12px_32px_rgba(0,0,0,0.12)] py-1 ${className}`.trim()}
      onClick={stopLinkNavigation}
      onMouseDown={stopLinkNavigation}
    >
      {SUPPORTED_CURRENCIES.map((code) => (
        <li key={code} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={code === currency}
            onClick={(event) => {
              stopLinkNavigation(event);
              onSelect(code);
            }}
            className={[
              "w-full text-left px-3 py-2 text-[10px] tracking-[0.14em] uppercase transition-colors",
              code === currency
                ? "text-secondary font-bold bg-secondary/5"
                : "text-primary hover:bg-surface-container-low",
            ].join(" ")}
          >
            {code}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function PriceCurrencyPicker({
  className = "",
  variant = "inline",
}: CurrencyPickerProps) {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (code: SupportedCurrency) => {
    setCurrency(code);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-flex shrink-0 ${className}`.trim()}
      onClick={stopLinkNavigation}
      onMouseDown={stopLinkNavigation}
    >
      <button
        type="button"
        onClick={(event) => {
          stopLinkNavigation(event);
          setOpen((value) => !value);
        }}
        className={[
          "inline-flex items-center gap-0.5 rounded-sm border px-1.5 py-0.5 cursor-pointer transition-colors outline-none focus-visible:ring-1 focus-visible:ring-secondary/60",
          variant === "header"
            ? "text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-semibold"
            : "text-[10px] tracking-[0.12em] uppercase font-semibold",
          variantButtonClass[variant],
        ].join(" ")}
        aria-label={`Display currency: ${currency}. Press to change`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {currency}
        <span
          className={[
            "material-symbols-outlined font-light leading-none transition-transform duration-200",
            variant === "header" ? "text-[13px]" : "text-[12px]",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden
        >
          expand_more
        </span>
      </button>
      {open ? (
        <CurrencyMenu currency={currency} onSelect={handleSelect} />
      ) : null}
    </div>
  );
}

/** Header utility bar currency control. */
export function CurrencySelector({ className = "" }: { className?: string }) {
  return <PriceCurrencyPicker className={className} variant="header" />;
}

export function RatesUnavailableNotice() {
  const show = useCurrencyStore((state) => state.showRatesUnavailableNotice);
  const dismiss = useCurrencyStore((state) => state.dismissRatesNotice);

  if (!show) return null;

  return (
    <div className="bg-secondary/10 border-b border-secondary/20 text-[10px] tracking-[0.08em] text-primary text-center px-4 py-2">
      Exchange rates unavailable — showing NGN.{" "}
      <button
        type="button"
        onClick={dismiss}
        className="underline underline-offset-2 hover:text-secondary transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
}
