import type { APIRoute } from "astro";
import { downloadByFilename } from "../../data/downloads";

const file = downloadByFilename.get("mafia-plus-rules-pl.pdf")!;

export const GET: APIRoute = () =>
  new Response(file.data, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    },
  });
