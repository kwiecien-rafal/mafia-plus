// Build-time search haystacks. Each searchable card carries a data-search
// attribute assembled here from the structured content, so the client filter
// (see SearchBar.astro) is a plain substring check over pre-normalized text
// covering both languages.
import type { Bilingual, Character } from "./characters";
import { abilityTypeLabels, cardRank, cardSuit, factions } from "./characters";
import { fold } from "./fold";

// Typeable stand-ins for the card glyphs, so "2h", "kiery" or "ace spades"
// work without a way to type ♥. The outline variants cover pasted ♡-style text.
const suitWords: Record<string, string> = {
  "♥": "♡ h hearts kiery",
  "♦": "♢ d diamonds karo",
  "♠": "♤ s spades piki",
  "♣": "♧ c clubs trefle",
};

const rankWords: Record<string, string> = {
  A: "ace as",
  K: "king krol",
  Q: "queen dama",
  J: "jack walet",
};

// "A♠ / K♠" → per card: the raw token, the "as"/"ks" shorthand, and the rank
// and suit words in both languages.
function cardAliases(field: string): string {
  return field
    .split("/")
    .map((c) => c.trim())
    .map((c) => {
      const rank = cardRank(c);
      const suits = suitWords[cardSuit(c)] ?? cardSuit(c);
      const initial = suits.split(" ")[1] ?? "";
      return [c, rank + initial, rankWords[rank] ?? "", suits].join(" ");
    })
    .join(" ");
}

function compact(bits: string[]): string {
  return fold(bits.join(" "))
    .replace(/[*_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function characterHaystack(c: Character): string {
  const faction = factions[c.faction];
  return compact([
    c.name.pl,
    c.name.en,
    c.id.replace(/_/g, " "),
    c.ability.pl,
    c.ability.en,
    c.flavor.pl,
    c.flavor.en,
    c.note?.pl ?? "",
    c.note?.en ?? "",
    c.faction,
    faction.name.pl,
    faction.name.en,
    faction.suit,
    ...(c.cards ?? [c.card]).map(cardAliases),
    ...c.abilityTypes.map((t) => `${abilityTypeLabels[t].pl} ${abilityTypeLabels[t].en}`),
  ]);
}

// Tagged characters fold their names (and space-separated ids) into the
// haystack, so a Q/A that says "Kolejarza" still matches "kolejarz".
export function edgeCaseHaystack(
  qa: { q: Bilingual; a: Bilingual; characters?: string[] },
  byId: Map<string, Character>,
): string {
  const names = (qa.characters ?? []).flatMap((id) => {
    const c = byId.get(id);
    return c ? [id.replace(/_/g, " "), c.name.pl, c.name.en] : [id.replace(/_/g, " ")];
  });
  return compact([qa.q.pl, qa.q.en, qa.a.pl, qa.a.en, ...names]);
}
