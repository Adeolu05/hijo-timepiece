import { formatNgnAmount } from "./formatMoney";

/** Storefront amounts are nominal NGN (Nigerian naira). */
export function formatNgn(amount: number): string {
  return formatNgnAmount(amount);
}
