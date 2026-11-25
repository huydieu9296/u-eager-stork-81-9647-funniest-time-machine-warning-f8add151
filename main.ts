import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Funniest Time Machine Warning — make.fun entrypoint.
// Reads entry.txt, writes the exact text to /output/entry.txt, and prints it.

const here = dirname(fileURLToPath(import.meta.url));
const outDir = "/output";
const outPath = join(outDir, "entry.txt");

// Prefer entry.txt beside this script; fall back to the working directory.
function readEntry(): string {
  for (const p of [join(here, "entry.txt"), join(process.cwd(), "entry.txt")]) {
    try {
      return readFileSync(p, "utf8").trim();
    } catch {
      // try the next candidate
    }
  }
  throw new Error("entry.txt not found beside main.ts or in the working directory");
}

const text = readEntry();
if (text.length < 1 || text.length > 120) {
  throw new Error(`entry text is ${text.length} chars; must be 1-120`);
}

try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, text, "utf8");
} catch (err) {
  console.error(`Warning: could not write ${outPath}:`, err);
}

console.log(text);
