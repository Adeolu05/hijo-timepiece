/** Storefront amounts are nominal NGN (Nigerian naira). */
export function formatNgn(amount: number): string {
  if (!Number.isFinite(amount)) return "₦0";
  const n = Math.max(0, amount);
  return `₦${n.toLocaleString("en-NG")}`;
}
