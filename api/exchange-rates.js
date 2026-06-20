const SUPPORTED = ["NGN", "USD", "GBP", "EUR", "CAD", "AUD", "AED"];
const UPSTREAM_URL = "https://open.er-api.com/v6/latest/NGN";
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

/** @type {{ base: string, rates: Record<string, number>, fetchedAt: string } | null} */
let lastGoodPayload = null;

function filterRates(allRates) {
  const rates = { NGN: 1 };
  for (const code of SUPPORTED) {
    if (code === "NGN") continue;
    const rate = allRates?.[code];
    if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) {
      rates[code] = rate;
    }
  }
  return rates;
}

function hasAllSupportedRates(rates) {
  return SUPPORTED.every((code) => typeof rates[code] === "number" && rates[code] > 0);
}

function sendJson(res, status, payload) {
  res
    .status(status)
    .setHeader("Content-Type", "application/json; charset=utf-8")
    .setHeader("Cache-Control", CACHE_CONTROL)
    .json(payload);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const upstream = await fetch(UPSTREAM_URL, {
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      throw new Error(`Upstream HTTP ${upstream.status}`);
    }

    const data = await upstream.json();
    if (data?.result !== "success" || typeof data?.rates !== "object") {
      throw new Error("Invalid upstream payload");
    }

    const rates = filterRates(data.rates);
    if (!hasAllSupportedRates(rates)) {
      throw new Error("Incomplete rates from upstream");
    }

    const payload = {
      base: "NGN",
      rates,
      fetchedAt: new Date().toISOString(),
    };

    lastGoodPayload = payload;
    sendJson(res, 200, payload);
  } catch (error) {
    if (lastGoodPayload) {
      sendJson(res, 200, {
        ...lastGoodPayload,
        stale: true,
        error: String(error?.message || error),
      });
      return;
    }

    sendJson(res, 503, {
      error: "Exchange rates unavailable",
      message: String(error?.message || error),
    });
  }
}
