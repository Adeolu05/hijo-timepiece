export const WATCH_BRANDS = [
  { value: "casio", label: "Casio" },
  { value: "citizen", label: "Citizen" },
  { value: "orient", label: "Orient" },
  { value: "seiko", label: "Seiko" },
  { value: "other", label: "Other" },
] as const;

export type WatchBrand = (typeof WATCH_BRANDS)[number]["value"];

const BRAND_VALUES = new Set<string>(WATCH_BRANDS.map((item) => item.value));

export function isWatchBrand(value: string): value is WatchBrand {
  return BRAND_VALUES.has(value);
}

export function watchBrandLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return WATCH_BRANDS.find((item) => item.value === value)?.label;
}
