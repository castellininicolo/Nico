import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the personal landing page", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<html lang="it">/i);
  assert.match(html, /Nicolò Castellini/);
  assert.match(html, /Idee complesse/);
  assert.match(html, /Cosa faccio/);
  assert.match(html, /COMPOSITION SYSTEM/);
  assert.match(html, /CALIBRATE/);
  assert.match(html, /type="range"/);
  assert.match(html, /CALIBRA \/ 03/);
  assert.match(html, /name="theme-color" content="#0b0b0d"/i);
  assert.match(html, /apple-touch-icon\.png/);
  assert.doesNotMatch(html, /Ricomponi figura|IDEA REACTOR/);
  assert.doesNotMatch(html, /about-scanline|principles-tape|THINK · MAKE/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
