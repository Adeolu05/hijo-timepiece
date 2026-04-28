#!/usr/bin/env node
/**
 * Production build: Vite → Playwright Chromium → prerender.
 * Sets PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS for Vercel/Linux CI (no cross-env / npx required).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

process.chdir(root);
process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS ??= "1";

const node = process.execPath;

function runNode(scriptRel, args) {
  const script = path.join(root, scriptRel);
  if (!fs.existsSync(script)) {
    console.error(`[build] missing: ${script}`);
    process.exit(1);
  }
  execFileSync(node, [script, ...args], { stdio: "inherit", cwd: root, env: process.env });
}

runNode("node_modules/vite/bin/vite.js", ["build"]);
runNode("node_modules/playwright/cli.js", ["install", "chromium"]);
runNode("scripts/prerender.mjs", []);
