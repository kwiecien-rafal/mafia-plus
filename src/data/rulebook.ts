// Renders the canonical bilingual data to a full markdown rulebook — the exact
// document served as the /downloads/*.md files and written to rules-{pl,en}.md.
// Because both the website and this serializer read the same authored content
// (src/content, via load.ts), the on-page rules and the downloadable rulebook
// can never drift. Prose fields carry inline markdown verbatim (see inline.ts);
// this module only assembles block structure — headings, lists, the example
// table and hard breaks.
import type { Lang } from "./characters";
import {
  characters,
  factions,
  factionOrder,
  abilityTypeLabels,
  compareByCard,
  cardRank,
  cardSuit,
} from "./characters";
import {
  ui,
  ruleSections,
  closingNotes,
  abilityKinds,
  checkGestures,
  checkGestureIntro,
  glossary,
  edgeCases,
  exampleSets,
  exampleSetsHeaders,
  exampleSetPoolPhrase,
  type RuleBlock,
  type RuleSection,
  type LineupItem,
} from "./content";

const nameById = new Map(characters.map((c) => [c.id, c] as const));
const ruleById = new Map(ruleSections.map((s) => [s.id, s] as const));

// Two trailing spaces before a newline is a markdown hard line break.
const HARD_BREAK = "  \n";

function blocks(list: RuleBlock[], lang: Lang): string {
  return list
    .map((b) =>
      "list" in b ? b.list.map((li) => `- ${li[lang]}`).join("\n") : b.p[lang],
    )
    .join("\n\n");
}

function ruleSection(id: string, lang: Lang): string {
  const section = ruleById.get(id) as RuleSection;
  const parts = [`## ${section.heading[lang]}`, blocks(section.blocks, lang)];

  if (section.example) {
    const lines = section.example.map((l) => l[lang]).join(HARD_BREAK);
    parts.push(`${ui.exampleLabel[lang]}\n\n${lines}`);
  }
  if (section.footnotes) {
    parts.push(section.footnotes.map((f) => f[lang]).join("\n\n"));
  }
  return parts.join("\n\n");
}

function abilityKindsSection(lang: Lang): string {
  const items = abilityKinds.map((k) => {
    const label = abilityTypeLabels[k.key][lang];
    return k.desc[lang] ? `- **${label}** – ${k.desc[lang]}` : `- **${label}**`;
  });
  return `## ${ui.headings.abilityKinds[lang]}\n\n${items.join("\n")}`;
}

function glossarySection(lang: Lang): string {
  const items = glossary.map((g) => `- **${g.term[lang]}** – ${g.def[lang]}`);
  return `## ${ui.headings.glossary[lang]}\n\n${items.join("\n")}`;
}

function factionRevealSection(lang: Lang): string {
  const items = checkGestures.map((g) => `- ${g.label[lang]}`);
  return `## ${ui.headings.checking[lang]}\n\n${checkGestureIntro[lang]}\n\n${items.join("\n")}`;
}

function charactersSection(lang: Lang): string {
  const groups = factionOrder.map((f) => {
    const faction = factions[f];
    const roster = characters
      .filter((c) => c.faction === f)
      .sort(compareByCard)
      .map((c) => {
        // Blackmailing Boss carries a footnote marker on its name and the note
        // itself as a trailing italic line — mirrors the source rulebook.
        const marker = c.note ? "*" : "";
        const parts = [`#### (${c.card}) ${c.name[lang]}${marker}`, c.ability[lang], `*${c.flavor[lang]}*`];
        if (c.note) parts.push(`\\**${c.note[lang]}*`);
        return parts.join("\n\n");
      })
      .join("\n\n");
    return `### ${faction.suit} ${faction.name[lang]}\n\n${roster}`;
  });
  return `## ${ui.nav.characters[lang]}\n\n${groups.join("\n\n")}`;
}

// Phrases a lineup slot exactly as the rulebook table does: "Name x2", either-or
// slots joined by " / ", and a multi-pick pool on its own line under a lead-in
// (prefixed with "+" when it trails a fixed character). Mirrors index.astro.
function lineupItem(item: LineupItem, isFirst: boolean, lang: Lang): string {
  const nm = (id: string) => nameById.get(id)?.name[lang] ?? id;
  if ("count" in item) return `${nm(item.id)} x${item.count}`;
  if ("oneOf" in item) return item.oneOf.map(nm).join(" / ");
  if ("anyOf" in item) {
    const list = item.anyOf.map(nm).join(" / ");
    if (item.pick === 1) return list;
    const lead = exampleSetPoolPhrase[item.pick]?.[lang] ?? "";
    return `${isFirst ? "" : "+"}${lead}\n${list}`;
  }
  return nm(item.id);
}

function lineupCell(items: LineupItem[], lang: Lang): string {
  if (items.length === 0) return "—";
  return items
    .map((it, i) => lineupItem(it, i === 0, lang))
    .join("\n")
    .replaceAll("\n", "<br />");
}

function exampleSetsSection(lang: Lang): string {
  const head = [
    exampleSetsHeaders.players[lang],
    exampleSetsHeaders.stats[lang],
    factions.city.name[lang],
    factions.mafia.name[lang],
    factions.syndicate.name[lang],
  ];
  const rows = exampleSets.map((s) =>
    `| ${[
      String(s.players),
      s.stats,
      lineupCell(s.city, lang),
      lineupCell(s.mafia, lang),
      lineupCell(s.syndicate, lang),
    ].join(" | ")} |`,
  );
  const table = [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows,
  ].join("\n");
  return `## ${ui.nav.setup[lang]}\n\n${table}`;
}

function edgeCasesSection(lang: Lang): string {
  const items = edgeCases.map((e) => `- ${e.q[lang]} - ${e.a[lang]}`);
  return `## ${ui.nav.edgeCases[lang]}\n\n${items.join("\n")}`;
}

export function serialize(lang: Lang): string {
  const sections = [
    "# MAFIA+",
    ruleSection("goal", lang),
    ruleSection("setup", lang),
    abilityKindsSection(lang),
    glossarySection(lang),
    ruleSection("night", lang),
    ruleSection("day", lang),
    ruleSection("voting", lang),
    factionRevealSection(lang),
  ];
  if (closingNotes.length) {
    sections.push(`## ${ui.headings.closingNotes[lang]}\n\n${blocks(closingNotes, lang)}`);
  }
  sections.push(
    charactersSection(lang),
    exampleSetsSection(lang),
    edgeCasesSection(lang),
  );
  return sections.join("\n\n") + "\n";
}
