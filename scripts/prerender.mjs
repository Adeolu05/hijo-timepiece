#!/usr/bin/env node
/**
 * Post-build: capture fully rendered HTML for key SPA routes so crawlers (and GSC)
 * receive real titles, meta, and body content — not an empty shell before JS.
 *
 * Requires Chromium: the npm `build` script runs `npx playwright install chromium` before this step.
 * Local one-off: `npx playwright install chromium` (browsers land under your user cache).
 * Skip prerender only if needed: SKIP_PRERENDER=1 npm run build
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

const PREVIEW_PORT = 4179;
const BASE = `http://127.0.0.1:${PREVIEW_PORT}`;

const ROUTES = [
  { path: "/", out: "index.html" },
  { path: "/shop", out: "shop/index.html" },
  { path: "/faq", out: "faq/index.html" },
  { path: "/about", out: "about/index.html" },
];

async function waitForHttpOk(url, maxAttempts = 90) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Preview did not respond at ${url}`);
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (process.env.SKIP_PRERENDER === "1") {
    console.log("[prerender] SKIP_PRERENDER=1 — skipping.");
    return;
  }

  if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error("[prerender] dist/index.html missing. Run vite build first.");
    process.exit(1);
  }

  /** Vercel / Docker: Linux build images often fail Playwright’s apt-based host-deps check without this. */
  if (!process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS) {
    process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "1";
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (e) {
    console.warn(
      "[prerender] Playwright not installed: npm i -D playwright && npx playwright install chromium",
    );
    console.warn(e);
    process.exit(1);
  }

  const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
  if (!fs.existsSync(viteCli)) {
    console.error("[prerender] vite CLI not found at", viteCli);
    process.exit(1);
  }

  const proc = spawn(
    process.execPath,
    [
      viteCli,
      "preview",
      "--port",
      String(PREVIEW_PORT),
      "--strictPort",
      "--host",
      "127.0.0.1",
    ],
    { cwd: root, stdio: "pipe", env: { ...process.env } },
  );

  let stderr = "";
  proc.stderr?.on("data", (d) => {
    stderr += String(d);
  });

  try {
    await waitForHttpOk(`${BASE}/`);
  } catch (e) {
    proc.kill("SIGTERM");
    console.error("[prerender] Preview server failed to start.\n", stderr);
    throw e;
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) AppleWebKit/537.36",
  });

  try {
    for (const { path: routePath, out } of ROUTES) {
      const page = await context.newPage();
      const url = `${BASE}${routePath === "/" ? "/" : routePath}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
      await page.waitForSelector("main h1", { timeout: 60_000 });
      await sleep(600);
      const html = await page.content();
      await page.close();

      const outPath = path.join(dist, out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, "utf8");
      console.log(`[prerender] wrote ${out} (${html.length} bytes)`);
    }
  } finally {
    await browser.close();
    try {
      proc.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  }
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
