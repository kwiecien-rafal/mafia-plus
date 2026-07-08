// Build-time content loading. The canonical prose lives as human-authored files
// under src/content (see src/content/README.md); this module parses them into the
// same shapes the site and the rulebook serializer consume, so nothing downstream
// knows the content moved out of TypeScript. Runs under both Astro's build and the
// `tsx` generate script, so it stays on node fs + a cwd-relative content root.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { AbilityType, Bilingual, Character, Faction, Lang } from "./characters";
import type { ExampleSet, LineupItem, RuleBlock, RuleSection } from "./content";

const LANGS: Lang[] = ["pl", "en"];
const contentDir = join(process.cwd(), "src", "content");

interface Frontmatter {
  data: Record<string, any>;
  body: string;
}

function readFrontmatter(path: string): Frontmatter {
  const raw = readFileSync(path, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  return { data: parseYaml(match[1]) ?? {}, body: match[2] };
}

function mdFiles(dir: string): string[] {
  return readdirSync(join(contentDir, dir)).filter((f) => f.endsWith(".md"));
}

// ── Characters ────────────────────────────────────────────────
export function loadCharacters(): Character[] {
  return mdFiles("characters")
    .sort()
    .map((file) => {
      const { data } = readFrontmatter(join(contentDir, "characters", file));
      return { id: file.replace(/\.md$/, ""), ...data } as Character;
    });
}

// ── Rule sections ─────────────────────────────────────────────
// Each section is authored as one markdown file per language ({id}.{lang}.md).
// The body carries the prose as plain markdown; the block structure is recovered
// by splitting on blank lines, and the two languages are zipped back together.
type Token = { kind: "p"; text: string } | { kind: "list"; items: string[] };

function tokenize(body: string): Token[] {
  return body
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((chunk) => {
      const lines = chunk.split(/\r?\n/).map((l) => l.replace(/\s+$/, ""));
      if (lines.every((l) => l.startsWith("- "))) {
        return { kind: "list", items: lines.map((l) => l.slice(2)) };
      }
      return { kind: "p", text: lines.join(" ") };
    });
}

function bilingual(pl: string, en: string): Bilingual {
  return { pl, en };
}

function zipList<T>(pl: T[] | undefined, en: T[] | undefined, id: string, what: string) {
  if (!pl || !en) return undefined;
  if (pl.length !== en.length) {
    throw new Error(`rule "${id}": ${what} length mismatch between pl and en`);
  }
  return pl.map((_, i) => [pl[i], en[i]] as const);
}

export function loadRuleSections(): RuleSection[] {
  const ids = [...new Set(mdFiles("rules").map((f) => f.replace(/\.(pl|en)\.md$/, "")))].sort();

  return ids.map((id) => {
    const parsed = Object.fromEntries(
      LANGS.map((lang) => [lang, readFrontmatter(join(contentDir, "rules", `${id}.${lang}.md`))]),
    ) as Record<Lang, Frontmatter>;

    const tokens = { pl: tokenize(parsed.pl.body), en: tokenize(parsed.en.body) };
    if (tokens.pl.length !== tokens.en.length) {
      throw new Error(`rule "${id}": block count differs between pl and en`);
    }

    const blocks: RuleBlock[] = tokens.pl.map((pl, i) => {
      const en = tokens.en[i];
      if (pl.kind !== en.kind) {
        throw new Error(`rule "${id}": block ${i} differs in kind between pl and en`);
      }
      if (pl.kind === "list" && en.kind === "list") {
        return { list: pl.items.map((item, j) => bilingual(item, en.items[j])) };
      }
      return { p: bilingual((pl as any).text, (en as any).text) };
    });

    const section: RuleSection = {
      id,
      heading: bilingual(parsed.pl.data.heading, parsed.en.data.heading),
      blocks,
    };

    const example = zipList<string>(parsed.pl.data.example, parsed.en.data.example, id, "example");
    if (example) section.example = example.map(([pl, en]) => bilingual(pl, en));

    const footnotes = zipList<string>(parsed.pl.data.footnotes, parsed.en.data.footnotes, id, "footnotes");
    if (footnotes) section.footnotes = footnotes.map(([pl, en]) => bilingual(pl, en));

    return section;
  });
}

// ── Glossary & edge cases (bilingual YAML lists) ──────────────
function loadYaml<T>(file: string): T {
  return parseYaml(readFileSync(join(contentDir, file), "utf8")) as T;
}

export function loadGlossary(): { term: Bilingual; def: Bilingual }[] {
  return loadYaml("glossary.yaml");
}

export function loadEdgeCases(): { q: Bilingual; a: Bilingual }[] {
  return loadYaml("edge-cases.yaml");
}

// ── Factions, ability types, gestures ─────────────────────────
export function loadFactionContent(): Record<Faction, { suit: string; name: Bilingual; blurb: Bilingual }> {
  return loadYaml("factions.yaml");
}

export function loadAbilityTypes(): { key: AbilityType; label: Bilingual; desc: Bilingual }[] {
  return loadYaml("ability-types.yaml");
}

export function loadReveal(): { intro: Bilingual; gestures: { emoji: string; label: Bilingual }[] } {
  return loadYaml("reveal.yaml");
}

// ── Example sets ──────────────────────────────────────────────
// A lineup slot is either a bare character id or one of the variant objects
// (oneOf / anyOf / a counted id); normalize the shorthand back to { id }.
export interface ExampleSetsFile {
  headers: { players: Bilingual; stats: Bilingual; playersUnit: Bilingual };
  poolPhrases: Record<number, Bilingual>;
  sets: ExampleSet[];
}

function toLineup(slots: (string | LineupItem)[]): LineupItem[] {
  return slots.map((slot) => (typeof slot === "string" ? { id: slot } : slot));
}

export function loadExampleSets(): ExampleSetsFile {
  const raw = loadYaml<{
    headers: ExampleSetsFile["headers"];
    poolPhrases: ExampleSetsFile["poolPhrases"];
    sets: (Omit<ExampleSet, "city" | "mafia" | "syndicate"> & {
      city: (string | LineupItem)[];
      mafia: (string | LineupItem)[];
      syndicate: (string | LineupItem)[];
    })[];
  }>("example-sets.yaml");
  return {
    headers: raw.headers,
    poolPhrases: raw.poolPhrases,
    sets: raw.sets.map((s) => ({
      players: s.players,
      stats: s.stats,
      city: toLineup(s.city),
      mafia: toLineup(s.mafia),
      syndicate: toLineup(s.syndicate),
    })),
  };
}

// ── UI copy ───────────────────────────────────────────────────
export interface UiFile {
  title: Bilingual;
  tagline: Bilingual;
  intro: Bilingual;
  nav: Record<"characters" | "rules" | "setup" | "edgeCases" | "downloads", Bilingual>;
  cardLabel: Bilingual;
  flipHint: Bilingual;
  exampleLabel: Bilingual;
  headings: Record<"abilityKinds" | "checking" | "glossary" | "closingNotes", Bilingual>;
  exampleSets: { showMore: Bilingual; showLess: Bilingual };
  footer: Bilingual;
  sectionNav: { id: string; label: Bilingual }[];
  downloadsCopy: {
    download: Bilingual;
    downloading: Bilingual;
    fileLabels: { pl: Bilingual; en: Bilingual };
  };
}

export function loadUi(): UiFile {
  return loadYaml("ui.yaml");
}
