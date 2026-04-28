#!/usr/bin/env node
/**
 * Production build.
 *
 * Full prerender (Playwright + Chromium) is **skipped on Vercel by default**: headless Chromium
 * is flaky in Vercel build sandboxes. The live site still runs as a normal SPA with client-side SEO.
 *
 * - **Local / other CI:** runs `vite build` → `playwright install chromium` → static HTML for key routes.
 * - **Vercel:** `vite build` only, unless you set `PRERENDER_ON_VERCEL=1` (may still fail; use at your own risk).
 * - **Force skip anywhere:** `SKIP_PRERENDER=1`
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

process.chdir(root);
process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS ??= "1";

function runNode(scriptRel, args) {
  const script = path.join(root, scriptRel);
  if (!fs.existsSync(script)) {
    console.error(`[build] missing: ${script}`);
    process.exit(1);
  }
  execFileSync(process.execPath, [script, ...args], {
    stdio: "inherit",
    cwd: root,
    env: process.env,
  });
}

runNode("node_modules/vite/bin/vite.js", ["build"]);

const skipExplicit = process.env.SKIP_PRERENDER === "1";
const skipVercelDefault =
  process.env.VERCEL === "1" &&
  process.env.PRERENDER_ON_VERCEL !== "1";

if (skipExplicit) {
  console.log("[build] SKIP_PRERENDER=1 — omitting Playwright install and prerender.");
} else if (skipVercelDefault) {
  console.log(
    "[build] Vercel: skipping Playwright prerender (set PRERENDER_ON_VERCEL=1 to opt in — often unstable here). SPA output is unchanged.",
  );
} else {
  runNode("node_modules/playwright/cli.js", ["install", "chromium"]);
  const { runPrerender } = await import("./prerender.mjs");
  await runPrerender();
}
