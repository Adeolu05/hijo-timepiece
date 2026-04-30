import type { WatchCondition } from "../data/watches";

const LABELS: Record<WatchCondition, string> = {
  unworn: "Unworn",
  excellent: "Excellent",
  "very-good": "Very good",
  good: "Good",
  fair: "Fair",
};

export function formatWatchCondition(key: WatchCondition): string {
  return LABELS[key] ?? key;
}
