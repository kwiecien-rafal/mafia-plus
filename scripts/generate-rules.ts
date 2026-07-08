// Writes the canonical rulebooks to rules-{pl,en}.md at the repo root from the
// bilingual data (see src/data/rulebook.ts). Run with `npm run generate` after
// editing the data; CI regenerates and fails the build if the committed files
// drift from the source.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { serialize } from "../src/data/rulebook";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const targets = [
  { lang: "pl", file: "rules-pl.md" },
  { lang: "en", file: "rules-en.md" },
] as const;

for (const { lang, file } of targets) {
  writeFileSync(join(root, file), serialize(lang), "utf8");
  console.log(`generated ${file}`);
}
