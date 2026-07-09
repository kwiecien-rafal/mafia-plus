// Build-time manifest for the downloadable rulebooks. Every file is rendered
// from the canonical data (PDF via rulebook-pdf.ts, Markdown via rulebook.ts),
// so the served downloads, the committed rules-*.md and the on-page content can
// never drift apart. Rendered once here at build; the /downloads endpoints and
// the downloads page both read the bytes back out of this manifest.
import type { Lang } from "./characters";
import { serialize } from "./rulebook";
import { serializePdf } from "./rulebook-pdf";

export type DownloadFormat = "pdf" | "md";

export interface DownloadFile {
  /** Path the asset is served from. */
  href: string;
  /** Filename suggested to the browser. */
  filename: string;
  lang: Lang;
  format: DownloadFormat;
  contentType: string;
  data: ArrayBuffer;
  bytes: number;
}

const contentType: Record<DownloadFormat, string> = {
  pdf: "application/pdf",
  md: "text/markdown; charset=utf-8",
};

// A standalone ArrayBuffer copy — the plain BodyInit the Response constructor
// takes, without the Buffer/Uint8Array generic-variance friction across TS libs.
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function build(lang: Lang, format: DownloadFormat): Promise<DownloadFile> {
  const filename = `mafia-plus-rules-${lang}.${format}`;
  const bytes = format === "pdf" ? await serializePdf(lang) : Buffer.from(serialize(lang), "utf8");
  return {
    href: `/downloads/${filename}`,
    filename,
    lang,
    format,
    contentType: contentType[format],
    data: toArrayBuffer(bytes),
    bytes: bytes.byteLength,
  };
}

export const downloadFiles: DownloadFile[] = await Promise.all([
  build("pl", "pdf"),
  build("pl", "md"),
  build("en", "pdf"),
  build("en", "md"),
]);

export const downloadByFilename = new Map(downloadFiles.map((f) => [f.filename, f] as const));
