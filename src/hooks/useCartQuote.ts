import { useMemo } from "react";
import { quoteForAppliedCode } from "../lib/discountCodes";
import type { CartQuote } from "../lib/discountTypes";
import { useCartStore } from "../store/cartStore";
import { useDiscountStore } from "../store/discountStore";
import { useProductStore } from "../store/productStore";

export function useCartQuote(): CartQuote {
  const items = useCartStore((state) => state.items);
  const appliedCode = useCartStore((state) => state.appliedCode);
  const codes = useDiscountStore((state) => state.codes);
  const watches = useProductStore((state) => state.watches);

  return useMemo(
    () => quoteForAppliedCode(appliedCode, codes, items, watches),
    [appliedCode, codes, items, watches],
  );
}
