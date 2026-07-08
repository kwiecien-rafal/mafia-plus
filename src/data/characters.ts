// Roster types, faction styling and card helpers. All player-facing content is
// authored under src/content and loaded here (see src/data/load.ts); this file
// keeps only structure — the Tailwind style tokens, card logic and the types.
import { loadCharacters, loadFactionContent, loadAbilityTypes } from "./load";

export type Faction = "city" | "mafia" | "syndicate";

export type Lang = "pl" | "en";

export type AbilityType =
  | "start" // used once, on the Zeroth Night
  | "night"
  | "day"
  | "oneTime"
  | "voting"
  | "checking" // relates to revealing a faction
  | "posthumous" // fires on the owner's death
  | "none";

export interface Bilingual {
  pl: string;
  en: string;
}

export interface Character {
  id: string;
  faction: Faction;
  card: string;
  cards?: string[]; // commoners span several cards
  centerCard?: string; // large rank+suit shown in the card's center; defaults to `card`
  abilityTypes: AbilityType[];
  name: Bilingual;
  ability: Bilingual;
  flavor: Bilingual;
  note?: Bilingual;
  situational?: boolean; // optional/variant pick; listed after the core roster
}

// Tailwind class strings are spelled out in full so the scanner keeps them.
export interface FactionStyle {
  text: string;
  border: string;
  ring: string;
  dot: string;
}

export interface FactionInfo {
  name: Bilingual;
  suit: string;
  blurb: Bilingual;
  style: FactionStyle;
}

// Tailwind class strings are spelled out in full so the scanner keeps them; the
// colors they reference live in src/styles/global.css. Everything else about a
// faction (name, suit, blurb) is content, loaded from src/content/factions.yaml.
const factionStyles: Record<Faction, FactionStyle> = {
  city: { text: "text-city", border: "border-city/40", ring: "hover:border-city/80", dot: "bg-city" },
  mafia: { text: "text-mafia", border: "border-mafia/30", ring: "hover:border-mafia/70", dot: "bg-mafia" },
  syndicate: { text: "text-syndicate", border: "border-syndicate/40", ring: "hover:border-syndicate/80", dot: "bg-syndicate" },
};

const factionContent = loadFactionContent();

export const factionOrder = Object.keys(factionContent) as Faction[];

export const factions = Object.fromEntries(
  factionOrder.map((f) => [f, { ...factionContent[f], style: factionStyles[f] }]),
) as Record<Faction, FactionInfo>;

export const abilityTypeLabels = Object.fromEntries(
  loadAbilityTypes().map((t) => [t.key, t.label]),
) as Record<AbilityType, Bilingual>;

export const characters: Character[] = loadCharacters();

// A card string is a rank followed by a single suit glyph, e.g. "10♥".
export const cardRank = (card: string) => card.slice(0, -1);
export const cardSuit = (card: string) => card.slice(-1);

const rankOrder = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const suitOrder = ["♥", "♦", "♠", "♣"];

// Ranks/suits outside these lists (e.g. the dual-card Blackmailing Boss) sort last.
const orderIndex = (order: string[], value: string) => {
  const i = order.indexOf(value);
  return i === -1 ? order.length : i;
};

// Sorts a hand: situational picks last, then rank Ace→2, hearts before diamonds
// before spades before clubs. Multi-card characters share the "unknown" rank/suit
// bucket, so we settle remaining ties on the center card and finally the id — a
// total order that renders the roster identically regardless of file load order.
export function compareByCard(a: Character, b: Character) {
  if (!!a.situational !== !!b.situational) return a.situational ? 1 : -1;
  const byCard = compareCards(a.card, b.card);
  if (byCard) return byCard;
  const byCenter = compareCards(a.centerCard ?? a.card, b.centerCard ?? b.card);
  if (byCenter) return byCenter;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function compareCards(a: string, b: string) {
  return (
    orderIndex(rankOrder, cardRank(a)) - orderIndex(rankOrder, cardRank(b)) ||
    orderIndex(suitOrder, cardSuit(a)) - orderIndex(suitOrder, cardSuit(b))
  );
}
