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

// Per-card crop nudges for portraits that aren't dead-center in their file.
// The square art covers a taller frame, so it fills the height and spills over
// the sides: `x` slides that horizontal crop freely. There's no vertical spill
// to slide into, so `zoom` (>1) crops a little off the top and bottom to make
// some, and `y` then shifts within it. Omit a card to leave it centered.
export interface ArtAdjust {
  x?: string; // horizontal crop, e.g. "42%"
  y?: string; // vertical slide, e.g. "-8%" (needs zoom > 1 to have room)
  zoom?: number; // e.g. 1.15
}

export const characterArtPosition: Record<string, ArtAdjust> = {
  loose_cannon: { x: "45%", y: "5%" },
  doctor: { x: "42%", y: "7%" },
  railwayman: { y: "4%" },
  lady_of_the_night: { x: "40%", y: "4%" },
  detective: { y: "5%" },
  gun_shop_owner: { x: "62%", y: "3%" },
  saint: { x: "46%", y: "9%" },
  bodyguard: { x: "53%", y: "12%" },
  poor_bloody_infantry: { x: "46%", y: "5%" },
  chairman: { x: "46%", y: "5%" },
  citizen: { x: "48%", y: "5%" },
  mafia_boss: { y: "4%" },
  blackmailer: { x: "42%", y: "3%" },
  coquette: { x: "45%", y: "4%" },
  janitor: { x: "45%", y: "5%" },
  mafioso: { y: "10%" },
  blackmailer_boss: { x: "42%", y: "3%" },
  angel_of_death: { x: "42%", y: "3%" },
  mayor: { x: "32%", y: "3%" },
  chairmans_daughter: { x: "33%", y: "13%" },
  bomber: { x: "59%", y: "1%" },
  bomber_plus: { x: "59%", y: "1%" },
  bartender: { x: "59%", y: "8%" },
};
