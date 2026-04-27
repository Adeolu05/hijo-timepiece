const SITE_URL = "https://www.hijoluxwatches.com";
const SITE_NAME = "Hijo Multiservice Timepieces";
const DEFAULT_IMAGE = `${SITE_URL}/hijo-lux-logo.png`;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function truncate(value, max = 180) {
  const s = String(value ?? "").trim();
  if (!s) return "";
  return s.length > max ? `${s.slice(0, max - 1)}...` : s;
}

function resolveProjectId() {
  return process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "";
}

function resolveDataset() {
  return process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production";
}

async function fetchWatchBySlug(slug) {
  const projectId = resolveProjectId();
  const dataset = resolveDataset();
  if (!projectId || !dataset || !slug) return null;

  const query = '*[_type == "watch" && slug.current == $slug][0]{name,collection,description,"image": image.asset->url}';
  const url =
    `https://${projectId}.apicdn.sanity.io/v2023-05-03/data/query/${encodeURIComponent(dataset)}` +
    `?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(slug)}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.result ?? null;
}

function buildHtml({ slug, title, description, image }) {
  const pageUrl = `${SITE_URL}/product/${encodeURIComponent(slug)}`;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image || DEFAULT_IMAGE);
  const safePageUrl = escapeHtml(pageUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <link rel="canonical" href="${safePageUrl}" />
    <meta name="description" content="${safeDescription}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
  </head>
  <body>
    <script>window.location.replace(${JSON.stringify(pageUrl)});</script>
    <noscript><meta http-equiv="refresh" content="0;url=${safePageUrl}" /></noscript>
  </body>
</html>`;
}

export default async function handler(req, res) {
  const slugParam = req.query?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  if (!slug || typeof slug !== "string") {
    res.status(400).setHeader("Content-Type", "text/plain; charset=utf-8").send("Missing product slug");
    return;
  }

  let title = `${SITE_NAME} | Authentic Luxury Timepieces`;
  let description =
    "Discover authentic luxury, vintage, and modern watches from Hijo Multiservice Timepieces.";
  let image = DEFAULT_IMAGE;

  try {
    const watch = await fetchWatchBySlug(slug);
    if (watch) {
      const watchName = String(watch.name || "").trim();
      const collection = String(watch.collection || "").trim();
      if (watchName) {
        title = collection
          ? `${watchName} | ${collection} | ${SITE_NAME}`
          : `${watchName} | ${SITE_NAME}`;
      }
      const watchDescription = truncate(watch.description || "", 180);
      if (watchDescription) description = watchDescription;
      if (watch.image && String(watch.image).trim()) image = String(watch.image).trim();
    }
  } catch (_error) {
    // Fallback to generic tags if Sanity fetch fails.
  }

  const html = buildHtml({ slug, title, description, image });
  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8")
    .setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400")
    .send(html);
}
