import type { APIRoute } from "astro";
import { downloadByFilename } from "../../data/downloads";

const file = downloadByFilename.get("mafia-plus-rules-pl.md")!;

export const GET: APIRoute = () =>
  new Response(file.raw, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    },
  });
