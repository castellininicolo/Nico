import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the personal landing page", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<html lang="it">/i);
  assert.match(html, /Nicolò Castellini/);
  assert.match(html, /Idee complesse/);
  assert.match(html, /Cosa faccio/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
