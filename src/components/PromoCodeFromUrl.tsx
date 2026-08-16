import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDiscountStore } from "../store/discountStore";
import { useProductStore } from "../store/productStore";

/** Captures `?code=` from flyer/social links and warms catalog + discount data. */
export function PromoCodeFromUrl() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturePendingCode = useDiscountStore((state) => state.capturePendingCode);
  const fetchCodes = useDiscountStore((state) => state.fetchCodes);
  const fetchWatches = useProductStore((state) => state.fetchWatches);

  useEffect(() => {
    void fetchCodes();
    void fetchWatches();
  }, [fetchCodes, fetchWatches]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("code");
    if (!raw?.trim()) return;
    capturePendingCode(raw);
    params.delete("code");
    const search = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : "",
        hash: location.hash,
      },
      { replace: true },
    );
  }, [capturePendingCode, location.hash, location.pathname, location.search, navigate]);

  return null;
}
