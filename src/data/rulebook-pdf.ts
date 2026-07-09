// Renders the canonical bilingual data to a print-ready PDF rulebook — the twin
// of rulebook.ts's markdown serializer. Both read the same source (characters.ts
// + content.ts), so the PDF, the markdown download and the on-page rules can
// never drift. The document is deliberately light (dark ink on white) for legible
// printing, translating the site's dark faction palette to print-safe tints.
// Runs only at build time (Astro pre-renders the /downloads endpoints), so it
// stays on node fs + pdfmake's server printer.
import PdfPrinter from "pdfmake";
import type { Content, TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import { join } from "node:path";
import type { Bilingual, Faction, Lang } from "./characters";
import {
  characters,
  factions,
  factionOrder,
  abilityTypeLabels,
  compareByCard,
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
import { inlineToRuns } from "./inline";

const fontsDir = join(process.cwd(), "src", "assets", "fonts");
const printer = new PdfPrinter({
  DejaVu: {
    normal: join(fontsDir, "DejaVuSans.ttf"),
    bold: join(fontsDir, "DejaVuSans-Bold.ttf"),
    italics: join(fontsDir, "DejaVuSans-Oblique.ttf"),
    bolditalics: join(fontsDir, "DejaVuSans-BoldOblique.ttf"),
  },
});

// A4 minus the horizontal page margins — the drawing width for full-bleed rules.
const MARGIN = 54;
const CONTENT_W = 595.28 - MARGIN * 2;

const gold = "#b8901f";
const ink = "#23252e";
const muted = "#6f6a5d";
const rule = "#ddd6c5";
// Faction colours retuned for a white page (the site's tints are set for dark).
const factionColor: Record<Faction, string> = {
  city: "#b23142",
  mafia: "#24405f",
  syndicate: "#1c6e4a",
};

const nameById = new Map(characters.map((c) => [c.id, c] as const));
const ruleById = new Map(ruleSections.map((s) => [s.id, s] as const));

function heading(text: string, pageBreak?: "before"): Content[] {
  return [
    { text, style: "h2", pageBreak, margin: [0, 20, 0, 5] },
    { canvas: [{ type: "line", x1: 0, y1: 0, x2: CONTENT_W, y2: 0, lineWidth: 0.8, lineColor: gold }], margin: [0, 0, 0, 9] },
  ];
}

function paragraph(text: string): Content {
  return { text: inlineToRuns(text), margin: [0, 0, 0, 6] };
}

function bulletList(items: string[]): Content {
  return { ul: items.map((i) => ({ text: inlineToRuns(i) })), margin: [0, 1, 0, 8] };
}

function blocks(list: RuleBlock[], lang: Lang): Content[] {
  return list.map((b) => ("list" in b ? bulletList(b.list.map((li) => li[lang])) : paragraph(b.p[lang])));
}

function exampleBox(lines: Bilingual[], lang: Lang): Content {
  const cell: TableCell = {
    fillColor: "#f6f1e2",
    margin: [10, 8, 10, 8],
    stack: [
      { text: ui.exampleLabel[lang], bold: true, color: gold, margin: [0, 0, 0, 3] },
      ...lines.map((l): Content => ({ text: inlineToRuns(l[lang]), margin: [0, 1, 0, 0] })),
    ],
  };
  return {
    table: { widths: ["*"], body: [[cell]] },
    layout: "noBorders",
    margin: [0, 2, 0, 10],
  };
}

function ruleSection(id: string, lang: Lang): Content[] {
  const section = ruleById.get(id) as RuleSection;
  const out: Content[] = [...heading(section.heading[lang]), ...blocks(section.blocks, lang)];
  if (section.example) out.push(exampleBox(section.example, lang));
  if (section.footnotes) {
    out.push(...section.footnotes.map((f) => ({ text: inlineToRuns(f[lang]), style: "note", margin: [0, 2, 0, 0] } as Content)));
  }
  return out;
}

function abilityKindsSection(lang: Lang): Content[] {
  const items = abilityKinds.map((k): Content => {
    const label = abilityTypeLabels[k.key][lang];
    return { text: k.desc[lang] ? [{ text: label, bold: true }, " – ", ...inlineToRuns(k.desc[lang])] : [{ text: label, bold: true }] };
  });
  return [...heading(ui.headings.abilityKinds[lang]), { ul: items, margin: [0, 1, 0, 8] }];
}

function glossarySection(lang: Lang): Content[] {
  const items = glossary.map((g): Content => ({ text: [{ text: g.term[lang], bold: true }, " – ", ...inlineToRuns(g.def[lang])] }));
  return [...heading(ui.headings.glossary[lang]), { ul: items, margin: [0, 1, 0, 8] }];
}

function factionRevealSection(lang: Lang): Content[] {
  return [
    ...heading(ui.headings.checking[lang]),
    paragraph(checkGestureIntro[lang]),
    bulletList(checkGestures.map((g) => g.label[lang])),
  ];
}

// One character as a single unbreakable block, so a page break can never split
// its name from the ability, flavour and footnote beneath it.
function characterEntry(id: string, lang: Lang): Content {
  const c = nameById.get(id)!;
  const marker = c.note ? "*" : "";
  const stack: Content[] = [
    { text: [{ text: `(${c.card}) `, color: muted }, { text: `${c.name[lang]}${marker}`, bold: true, color: ink }] },
    { text: inlineToRuns(c.ability[lang]), margin: [0, 2, 0, 0] },
    { text: inlineToRuns(c.flavor[lang]), italics: true, color: muted, margin: [0, 2, 0, 0] },
  ];
  if (c.note) stack.push({ text: [{ text: "* ", bold: true }, { text: c.note[lang], italics: true }], style: "note", margin: [0, 2, 0, 0] });
  return { stack, unbreakable: true, margin: [0, 9, 0, 0] };
}

function charactersSection(lang: Lang): Content[] {
  const out: Content[] = heading(ui.nav.characters[lang], "before");
  for (const f of factionOrder) {
    const roster = characters.filter((c) => c.faction === f).sort(compareByCard);
    const factionHead: Content = { text: `${factions[f].suit} ${factions[f].name[lang]}`, style: "h3", color: factionColor[f], margin: [0, 14, 0, 2] };
    // Bind the faction heading to its first character so it never sits alone at a page foot.
    out.push({ stack: [factionHead, characterEntry(roster[0].id, lang)], unbreakable: true });
    for (const c of roster.slice(1)) out.push(characterEntry(c.id, lang));
  }
  return out;
}

// Mirrors rulebook.ts's lineup phrasing, but stacks slots with newlines instead
// of <br /> — pdfmake honours "\n" as a line break inside a cell.
function lineupCell(items: LineupItem[], lang: Lang): string {
  if (items.length === 0) return "—";
  const nm = (id: string) => nameById.get(id)?.name[lang] ?? id;
  return items
    .map((item, i) => {
      if ("count" in item) return `${nm(item.id)} ×${item.count}`;
      if ("oneOf" in item) return item.oneOf.map(nm).join(" / ");
      if ("anyOf" in item) {
        const list = item.anyOf.map(nm).join(" / ");
        if (item.pick === 1) return list;
        const lead = exampleSetPoolPhrase[item.pick]?.[lang] ?? "";
        return `${i === 0 ? "" : "+ "}${lead}\n${list}`;
      }
      return nm(item.id);
    })
    .join("\n");
}

function exampleSetsSection(lang: Lang): Content[] {
  const header = [
    exampleSetsHeaders.players[lang],
    exampleSetsHeaders.stats[lang],
    factions.city.name[lang],
    factions.mafia.name[lang],
    factions.syndicate.name[lang],
  ].map((label, i) => ({ text: label, bold: true, color: i < 2 ? ink : factionColor[factionOrder[i - 2]], fontSize: 9.5 }));

  const rows = exampleSets.map((s) => [
    { text: String(s.players), alignment: "center" as const },
    { text: s.stats, alignment: "center" as const },
    lineupCell(s.city, lang),
    lineupCell(s.mafia, lang),
    lineupCell(s.syndicate, lang),
  ]);

  return [
    ...heading(ui.nav.setup[lang], "before"),
    {
      fontSize: 9.5,
      table: { headerRows: 1, widths: ["auto", "auto", "*", "*", "*"], body: [header, ...rows] },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.8 : 0.4),
        vLineWidth: () => 0,
        hLineColor: () => rule,
        paddingTop: () => 5,
        paddingBottom: () => 5,
        paddingLeft: () => 7,
        paddingRight: () => 7,
        fillColor: (i) => (i === 0 ? "#f3ecd8" : i % 2 === 0 ? "#faf7ef" : null),
      },
    },
  ];
}

function edgeCasesSection(lang: Lang): Content[] {
  const items = edgeCases.map((e): Content => ({ text: [...inlineToRuns(e.q[lang]), " — ", ...inlineToRuns(e.a[lang])] }));
  return [...heading(ui.nav.edgeCases[lang]), { ul: items, margin: [0, 1, 0, 8] }];
}

function docDefinition(lang: Lang): TDocumentDefinitions {
  const content: Content[] = [
    { text: "MAFIA+", fontSize: 40, bold: true, color: gold, alignment: "center", characterSpacing: 2, margin: [0, 8, 0, 2] },
    { text: ui.tagline[lang], alignment: "center", italics: true, color: muted, margin: [0, 0, 0, 12] },
    { canvas: [{ type: "line", x1: 0, y1: 0, x2: CONTENT_W, y2: 0, lineWidth: 1.2, lineColor: gold }] },
    ...ruleSection("goal", lang),
    ...ruleSection("setup", lang),
    ...abilityKindsSection(lang),
    ...glossarySection(lang),
    ...ruleSection("night", lang),
    ...ruleSection("day", lang),
    ...ruleSection("voting", lang),
    ...factionRevealSection(lang),
  ];
  if (closingNotes.length) {
    content.push(...heading(ui.headings.closingNotes[lang]), ...blocks(closingNotes, lang));
  }
  content.push(...charactersSection(lang), ...exampleSetsSection(lang), ...edgeCasesSection(lang));

  return {
    pageSize: "A4",
    pageMargins: [MARGIN, 52, MARGIN, 54],
    defaultStyle: { font: "DejaVu", fontSize: 10.5, color: ink, lineHeight: 1.25 },
    styles: {
      h2: { fontSize: 16, bold: true, color: ink },
      h3: { fontSize: 13.5, bold: true },
      note: { fontSize: 9, color: muted },
    },
    content,
    footer: (page, total) => ({
      margin: [MARGIN, 0, MARGIN, 0],
      columns: [
        { text: "MAFIA+", fontSize: 8, color: muted },
        { text: `${page} / ${total}`, fontSize: 8, color: muted, alignment: "right" },
      ],
    }),
  };
}

export function serializePdf(lang: Lang): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const doc = printer.createPdfKitDocument(docDefinition(lang));
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}
