export const WATCH_BRANDS = [
  { value: "casio", label: "Casio" },
  { value: "citizen", label: "Citizen" },
  { value: "orient", label: "Orient" },
  { value: "seiko", label: "Seiko" },
  { value: "audemars-piguet", label: "Audemars Piguet" },
  { value: "breitling", label: "Breitling" },
  { value: "cartier", label: "Cartier" },
  { value: "fp-journe", label: "F.P. Journe" },
  { value: "franck-muller", label: "Franck Muller" },
  { value: "girard-perregaux", label: "Girard-Perregaux" },
  { value: "jacob-co", label: "Jacob & Co." },
  { value: "longines", label: "Longines" },
  { value: "omega", label: "Omega" },
  { value: "patek-philippe", label: "Patek Philippe" },
  { value: "richard-mille", label: "Richard Mille" },
  { value: "rolex", label: "Rolex" },
  { value: "tissot", label: "Tissot" },
  { value: "tudor", label: "Tudor" },
  { value: "vacheron-constantin", label: "Vacheron Constantin" },
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
