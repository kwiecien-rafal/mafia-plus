// Build-time manifest for the downloadable rulebooks. The canonical files
// live at the repo root; reading them here keeps a single source of truth so
// the served downloads never drift from the on-page content.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface DownloadFile {
  /** Path the asset is served from. */
  href: string;
  /** Filename suggested to the browser. */
  filename: string;
  lang: "pl" | "en";
  raw: string;
  bytes: number;
}

function load(source: string, filename: string, lang: "pl" | "en"): DownloadFile {
  const raw = readFileSync(join(process.cwd(), source), "utf8");
  return {
    href: `/downloads/${filename}`,
    filename,
    lang,
    raw,
    bytes: Buffer.byteLength(raw, "utf8"),
  };
}

export const downloadFiles: DownloadFile[] = [
  load("rules-pl.md", "mafia-plus-rules-pl.md", "pl"),
  load("rules-en.md", "mafia-plus-rules-en.md", "en"),
];

export const downloadByFilename = new Map(downloadFiles.map((f) => [f.filename, f] as const));
