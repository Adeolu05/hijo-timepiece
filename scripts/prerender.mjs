#!/usr/bin/env node
/**
 * Post-build: capture fully rendered HTML for key SPA routes so crawlers (and GSC)
 * receive real titles, meta, and body content — not an empty shell before JS.
 *
 * Requires Chromium: `scripts/build.mjs` runs `playwright install chromium` first.
 * Skip: SKIP_PRERENDER=1
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      const p = typeof addr === "object" && addr ? addr.port : 4179;
      srv.close(() => resolve(p));
    });
  });
}

let PREVIEW_PORT = 4179;
let BASE = `http://127.0.0.1:${PREVIEW_PORT}`;

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

export async function runPrerender() {
  if (process.env.SKIP_PRERENDER === "1") {
    console.log("[prerender] SKIP_PRERENDER=1 — skipping.");
    return;
  }

  PREVIEW_PORT = await getFreePort();
  BASE = `http://127.0.0.1:${PREVIEW_PORT}`;
  console.log("[prerender] preview port", PREVIEW_PORT);

  if (!fs.existsSync(path.join(dist, "index.html"))) {
    throw new Error("[prerender] dist/index.html missing. Run vite build first.");
  }

  if (!process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS) {
    process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "1";
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (e) {
    console.error(
      "[prerender] Playwright not installed: npm i playwright && npx playwright install chromium",
    );
    throw e;
  }

  const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
  if (!fs.existsSync(viteCli)) {
    throw new Error(`[prerender] vite CLI not found at ${viteCli}`);
  }

  /**
   * Must not leave stdout on "pipe" without draining — Vite can log enough to block the
   * child when the buffer fills (~64KB), which breaks prerender on CI (e.g. Vercel).
   */
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
    { cwd: root, stdio: "inherit", env: { ...process.env } },
  );

  try {
    await waitForHttpOk(`${BASE}/`);
  } catch (e) {
    try {
      proc.kill("SIGTERM");
    } catch {
      /* ignore */
    }
    throw e;
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) AppleWebKit/537.36",
  });

  try {
    for (const { path: routePath, out } of ROUTES) {
      const page = await context.newPage();
      const url = `${BASE}${routePath === "/" ? "/" : routePath}`;
      /**
       * Do not use "networkidle" — SPAs + Sanity often keep connections open, so it never settles.
       */
      await page.goto(url, { waitUntil: "load", timeout: 90_000 });
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

function isPrimaryScript() {
  const a = process.argv[1];
  if (!a) return false;
  return path.resolve(a) === path.resolve(fileURLToPath(import.meta.url));
}

if (isPrimaryScript()) {
  runPrerender().catch((err) => {
    console.error("[prerender] failed:", err);
    process.exit(1);
  });
}
