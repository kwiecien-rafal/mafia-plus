import type { ImageMetadata } from "astro";

// Drop a file named after a character id (e.g. mafia_boss.png) into
// src/assets/characters/ and its portrait shows up on that card. Anything
// without a file falls back to the rank+suit glyph, so the roster renders
// whether or not every drawing exists yet.
const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/characters/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

export const characterArt: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [
    path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    mod.default,
  ]),
);
