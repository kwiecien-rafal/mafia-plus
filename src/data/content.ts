// Structure and typed views over the authored content. All bilingual copy —
// UI strings, rule sections, ability/gesture legends, example sets, glossary and
// edge cases — is authored under src/content and loaded here (see src/data/load.ts);
// this module only declares the shapes and derives the exports the app consumes.
import type { AbilityType, Bilingual } from "./characters";
import {
  loadUi,
  loadRuleSections,
  loadGlossary,
  loadEdgeCases,
  loadAbilityTypes,
  loadReveal,
  loadExampleSets,
} from "./load";

// ── UI copy ────────────────────────────────────────────────────
const uiFile = loadUi();

export const ui = uiFile;
export const sectionNav = uiFile.sectionNav;
export const downloadsCopy = uiFile.downloadsCopy;

// ── Rules ──────────────────────────────────────────────────────
// A section is a sequence of paragraphs and bullet lists, optionally
// followed by a styled example call-out and footnotes.
export type RuleBlock = { p: Bilingual } | { list: Bilingual[] };

export interface RuleSection {
  id: string;
  heading: Bilingual;
  blocks: RuleBlock[];
  example?: Bilingual[];
  footnotes?: Bilingual[];
}

export const ruleSections: RuleSection[] = loadRuleSections();

// Free-form notes rendered after the "Faction Reveal" section in the generated
// rulebook. Empty for now; add blocks here and they surface in the download.
export const closingNotes: RuleBlock[] = [];

// ── Ability kinds ─────────────────────────────────────────────
// The "Types of Abilities" list pairs each ability type's label with a
// description; the label doubles as the card badge (see abilityTypeLabels).
export const abilityKinds: { key: AbilityType; desc: Bilingual }[] = loadAbilityTypes().map(
  ({ key, desc }) => ({ key, desc }),
);

// ── Faction-check gestures ────────────────────────────────────
const reveal = loadReveal();
export const checkGestures = reveal.gestures;
export const checkGestureIntro: Bilingual = reveal.intro;

// ── Glossary & edge cases ─────────────────────────────────────
export const glossary: { term: Bilingual; def: Bilingual }[] = loadGlossary();
export const edgeCases: { q: Bilingual; a: Bilingual }[] = loadEdgeCases();

// ── Example character sets ─────────────────────────────────────
// Each lineup slot references character ids so names stay bilingual.
export type LineupItem =
  | { id: string } //                     a fixed character
  | { id: string; count: number } //      N copies of a character
  | { oneOf: string[] } //                a single slot, either-or
  | { anyOf: string[]; pick: number }; // pick N of these for the faction

export interface ExampleSet {
  players: number;
  stats: string;
  city: LineupItem[];
  mafia: LineupItem[];
  syndicate: LineupItem[];
}

const exampleSetsFile = loadExampleSets();
export const exampleSets: ExampleSet[] = exampleSetsFile.sets;
export const exampleSetsHeaders = exampleSetsFile.headers;

// Wording used in the table when a faction draws several characters from a pool.
export const exampleSetPoolPhrase: Record<number, Bilingual> = exampleSetsFile.poolPhrases;
