// Inline-markdown renderer for the bilingual UI. The canonical content in
// characters.ts / content.ts carries a small, deliberately restricted subset of
// markdown — **bold**, *italic*, <u>underline</u>, and backslash-escaped literal
// asterisks/underscores. The same strings are passed through verbatim when the
// rulebook is serialized to markdown, so the page and the download can never
// disagree. Bold and italic never nest, which keeps this a two-pass replace
// rather than a full parser.

const HTML_ESCAPE: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

// Private-use sentinels: park escaped literals here so the emphasis pass can't
// mistake them for delimiters, then restore them afterwards.
const LITERAL_STAR = String.fromCodePoint(0xe000);
const LITERAL_UNDERSCORE = String.fromCodePoint(0xe001);

export function inlineToHtml(source: string): string {
  const parked = source
    .replaceAll("\\*", LITERAL_STAR)
    .replaceAll("\\_", LITERAL_UNDERSCORE);

  // Escape everything, then re-admit the one whitelisted inline tag.
  const escaped = parked
    .replace(/[&<>]/g, (c) => HTML_ESCAPE[c])
    .replaceAll("&lt;u&gt;", "<u>")
    .replaceAll("&lt;/u&gt;", "</u>");

  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replaceAll(LITERAL_STAR, "*")
    .replaceAll(LITERAL_UNDERSCORE, "_");
}

// The same inline subset rendered as pdfmake text runs (see rulebook-pdf.ts).
// Emphasis leaves are flat; underline recurses so <u> can still carry emphasis.
export interface InlineRun {
  text: string;
  bold?: boolean;
  italics?: boolean;
  decoration?: "underline";
}

const INLINE_TOKEN = /<u>(.+?)<\/u>|\*\*(.+?)\*\*|\*(.+?)\*/g;

function restore(text: string): string {
  return text.replaceAll(LITERAL_STAR, "*").replaceAll(LITERAL_UNDERSCORE, "_");
}

function toRuns(source: string, base: Omit<InlineRun, "text">): InlineRun[] {
  const runs: InlineRun[] = [];
  let last = 0;
  for (const m of source.matchAll(INLINE_TOKEN)) {
    if (m.index > last) runs.push({ ...base, text: restore(source.slice(last, m.index)) });
    if (m[1] !== undefined) runs.push(...toRuns(m[1], { ...base, decoration: "underline" }));
    else if (m[2] !== undefined) runs.push({ ...base, text: restore(m[2]), bold: true });
    else runs.push({ ...base, text: restore(m[3]), italics: true });
    last = m.index + m[0].length;
  }
  if (last < source.length) runs.push({ ...base, text: restore(source.slice(last)) });
  return runs;
}

export function inlineToRuns(source: string): InlineRun[] {
  const parked = source.replaceAll("\\*", LITERAL_STAR).replaceAll("\\_", LITERAL_UNDERSCORE);
  const runs = toRuns(parked, {});
  return runs.length ? runs : [{ text: "" }];
}
