// Build-time manifest for the downloadable rulebooks. Both files are rendered
// from the canonical data (see rulebook.ts), so the served downloads, the
// committed rules-*.md and the on-page content can never drift apart.
import type { Lang } from "./characters";
import { serialize } from "./rulebook";

export interface DownloadFile {
  /** Path the asset is served from. */
  href: string;
  /** Filename suggested to the browser. */
  filename: string;
  lang: Lang;
  raw: string;
  bytes: number;
}

function build(lang: Lang, filename: string): DownloadFile {
  const raw = serialize(lang);
  return {
    href: `/downloads/${filename}`,
    filename,
    lang,
    raw,
    bytes: Buffer.byteLength(raw, "utf8"),
  };
}

export const downloadFiles: DownloadFile[] = [
  build("pl", "mafia-plus-rules-pl.md"),
  build("en", "mafia-plus-rules-en.md"),
];

export const downloadByFilename = new Map(downloadFiles.map((f) => [f.filename, f] as const));
