// Single source of truth for the roster. Every player-facing string is
// authored here in both Polish (source) and English, matching the wording
// of rules-pl.md / rules-en.md verbatim.

export type Faction = "city" | "mafia" | "syndicate";

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
}

// Tailwind class strings are spelled out in full so the scanner keeps them.
export interface FactionStyle {
  text: string;
  border: string;
  ring: string;
  dot: string;
}

export const factions: Record<
  Faction,
  { name: Bilingual; suit: string; blurb: Bilingual; style: FactionStyle }
> = {
  city: {
    suit: "♥♦",
    name: { pl: "Miasto", en: "City" },
    blurb: {
      pl: "Uczciwi ludzie próbujący przetrwać i zarazem wyplenić całe plugastwo tej betonowej dżungli – Mafię.",
      en: "Honest folk trying to survive while rooting out all the filth festering in this concrete jungle: the Mafia.",
    },
    style: { text: "text-city", border: "border-city/40", ring: "hover:border-city/80", dot: "bg-city" },
  },
  mafia: {
    suit: "♠",
    name: { pl: "Mafia", en: "Mafia" },
    blurb: {
      pl: "Działający w ukryciu gangsterzy, starający się sprzątnąć wszystkich zagrażających im osobników z Miasta.",
      en: "Gangsters working from the shadows, looking to whack anyone from the City who gets in their way.",
    },
    style: { text: "text-mafia", border: "border-mafia/30", ring: "hover:border-mafia/70", dot: "bg-mafia" },
  },
  syndicate: {
    suit: "♣",
    name: { pl: "Syndykat", en: "Syndicate" },
    blurb: {
      pl: "Tajemnicza organizacja grająca na własnych zasadach. Nie dbają o żadną stronę konfliktu i wygrywają niezależnie od reszty, jeżeli przetrwają do końca gry.",
      en: "A shadowy organization that plays by its own rules. They care nothing for either side of the conflict and win independently of everyone else, as long as they survive to the end of the game.",
    },
    style: { text: "text-syndicate", border: "border-syndicate/40", ring: "hover:border-syndicate/80", dot: "bg-syndicate" },
  },
};

export const abilityTypeLabels: Record<AbilityType, Bilingual> = {
  start: { pl: "Startowa", en: "Opening" },
  night: { pl: "Nocna", en: "Night" },
  day: { pl: "Dzienna", en: "Day" },
  oneTime: { pl: "Jednorazowa", en: "Single-Use" },
  voting: { pl: "Głosująca", en: "Voting" },
  checking: { pl: "Sprawdzania", en: "Reveal" },
  posthumous: { pl: "Pośmiertna", en: "Posthumous" },
  none: { pl: "Brak umiejętności", en: "No Ability" },
};

export const characters: Character[] = [
  // ── CITY ─────────────────────────────────────────────────────
  {
    id: "doctor",
    faction: "city",
    card: "K♥",
    abilityTypes: ["night"],
    name: { pl: "Lekarz", en: "Doctor" },
    ability: {
      pl: "Każdej Nocy, Lekarz wybiera jedną osobę do leczenia. Jeżeli tej Nocy zostanie wybrana osoba zaatakowana przez Mafię, nie zginie. Lekarz może leczyć sam siebie. Leczeni nie wiedzą, że ktoś nad nimi czuwa.",
      en: "Every Night, the Doctor chooses one person to heal. If the person chosen that Night gets attacked by the Mafia, they won't die. The Doctor may heal themselves. Those who are healed don't know that someone is watching over them.",
    },
    flavor: { pl: "Niech śpią spokojnie…", en: "Let them sleep soundly…" },
  },
  {
    id: "detective",
    faction: "city",
    card: "10♥",
    abilityTypes: ["night", "checking"],
    name: { pl: "Detektyw", en: "Detective" },
    ability: {
      pl: "Każdej Nocy, Detektyw wybiera jedną osobę do sprawdzenia i dzięki cichemu śledztwu poznaje jej Frakcję. Podejrzani nie wiedzą, że byli sprawdzani.",
      en: "Every Night, the Detective chooses one person to reveal, and, through quiet detective work, learn their Faction. Suspects don't know they've been investigated.",
    },
    flavor: {
      pl: "Sam wybierz, komu ufać.",
      en: "Decide for yourself who to trust.",
    },
  },
  {
    id: "lady_of_the_night",
    faction: "city",
    card: "Q♥",
    abilityTypes: ["start", "checking"],
    name: { pl: "Panna Lekkich Obyczajów", en: "Lady of the Night" },
    ability: {
      pl: "Zerowej Nocy, Panna Lekkich Obyczajów wybiera jedną osobę do uwiedzenia. Wybrana osoba budzi się, a PLO widzi jej kartę postaci.",
      en: "On Night Zero, Lady of the Night chooses one person to seduce. The chosen person wakes up, and the LotN sees their character card.",
    },
    flavor: {
      pl: "Ciekawe, kto pierwszy zdradzi wasz sekret.",
      en: "I wonder who'll be the first to spill your secret.",
    },
  },
  {
    id: "loose_cannon",
    faction: "city",
    card: "A♦",
    abilityTypes: ["day", "oneTime"],
    name: { pl: "Świr", en: "Loose Cannon" },
    ability: {
      pl: "W ciągu Dnia, Świr może wstać, ogłosić się Świrem i zastrzelić jedną osobę. Dzień kończy się natychmiast po strzale, nieważne jaki będzie rezultat. Może to zrobić tylko raz.",
      en: "During the Day, the Loose Cannon may stand up, declare themselves the Loose Cannon, and gun down one person. The Day ends immediately after the shot, no matter the outcome. They can do this only once.",
    },
    flavor: { pl: "„Gotcha!”", en: "\"Gotcha!\"" },
  },
  {
    id: "poor_bloody_infantry",
    faction: "city",
    card: "7♥",
    abilityTypes: ["checking"],
    name: { pl: "Biedna Przeklęta Piechota", en: "Poor Bloody Infantry" },
    ability: {
      pl: "Gdy kiedykolwiek przynależność Biednej Przeklętej Piechoty do Frakcji jest sprawdzana, zostaje wykryta jako członek Mafii. W rzeczywistości, należy do Miasta.",
      en: "Whenever the Poor Bloody Infantry gets their Faction revealed, they come up as a member of the Mafia. In reality, they belong to the City.",
    },
    flavor: {
      pl: "„Z werbunku? Dawać papiery!” — i zanim się obejrzysz, już cię chcą wieszać.",
      en: "\"I's a war veteran! ... spare me a gold coin?\"",
    },
  },
  {
    id: "railwayman",
    faction: "city",
    card: "K♦",
    abilityTypes: ["night"],
    name: { pl: "Kolejarz", en: "Railwayman" },
    ability: {
      pl: "Każdej Nocy, Kolejarz wybiera jedną osobę do wywiezienia. Przez cały następny Dzień i Noc ta osoba jest poza miastem – nie może mówić, głosować, używać swojej umiejętności, ani zostać zaatakowana bądź sprawdzona. Każdy do pociągu może wsiąść tylko raz. Kolejarz nie może wywieźć sam siebie.",
      en: "Every Night, the Railwayman chooses one person to ship out of town. For the entire next Day and Night, that person is out of town – they cannot speak, vote, use their ability, or be attacked or investigated. Each person can board the train only once. The Railwayman cannot ship themselves out.",
    },
    flavor: {
      pl: "Kolejarz zatroszczy się o Pana…",
      en: "Railwayman will take good care of you…",
    },
  },
  {
    id: "bodyguard",
    faction: "city",
    card: "8♥",
    abilityTypes: ["start"],
    name: { pl: "Ochroniarz", en: "Bodyguard" },
    ability: {
      pl: "Zerowej Nocy, Ochroniarz wybiera jedną osobę do chronienia. Jeżeli kiedykolwiek miałaby zginąć z rąk śmiertelnika, Ochroniarz poświęca się, by ją ocalić.",
      en: "On Night Zero, the Bodyguard choose one person to protect. If that person would ever die at the hands of a mortal, the Bodyguard sacrifices themselves to save them.",
    },
    flavor: {
      pl: "W grobie zastanowisz się, czy było warto.",
      en: "You'll wonder whether it was worth it in your grave.",
    },
  },
  {
    id: "chairman",
    faction: "city",
    card: "6♥",
    abilityTypes: ["day", "voting", "oneTime"],
    name: { pl: "Prezes", en: "Chairman" },
    ability: {
      pl: "Tuż po głosowaniu, Prezes może wstać i ogłosić się Prezesem. Wyniki są natychmiast anulowane, a następnie Prezes ogłasza: ponowne głosowanie lub koniec Dnia. Jeżeli zostanie zarządzone głosowanie – Prezes również może wybrać efekt głosowania: sprawdzenie lub eliminacja. Może to wszystko zrobić tylko raz.",
      en: "Right after the vote, the Chairman may stand up and declare themselves as the Chairman. The vote results are immediately annulled, and the Chairman then declares either a re-vote or the end of the Day. If a re-vote is called – the Chairman may also choose its effect: reveal or elimination. They can do all of this only once.",
    },
    flavor: { pl: "Niech przekona ich złoto.", en: "Let gold do the talking." },
  },
  {
    id: "saint",
    faction: "city",
    card: "9♥",
    abilityTypes: ["posthumous"],
    name: { pl: "Święty", en: "Saint" },
    ability: {
      pl: "Posiada dwa życia. Pierwsza próba, by wyeliminować Świętego, nie zadziała.",
      en: "Has two lives. The first attempt to eliminate the Saint will fail.",
    },
    flavor: {
      pl: "Za drugim razem już nie licz na cud.",
      en: "The second time, don't count on a miracle.",
    },
  },
  {
    id: "gun_shop_owner",
    faction: "city",
    card: "10♦",
    abilityTypes: ["posthumous"],
    name: { pl: "Właściciel Sklepu z Bronią", en: "Gun Shop Owner" },
    ability: {
      pl: "Jeżeli Mafia zabije Właściciela w Nocy, mogą strzelić jeszcze raz.",
      en: "If the Mafia kills the Owner during the Night, they may shoot once more.",
    },
    flavor: {
      pl: "Zostawiłeś klucz pod wycieraczką.",
      en: "You left the key under the doormat.",
    },
  },
  {
    id: "citizen",
    faction: "city",
    card: "4♥ / 3♥ / 2♥",
    cards: ["4♥", "3♥", "2♥"],
    centerCard: "2♥",
    abilityTypes: ["none"],
    name: { pl: "Mieszczanin", en: "Citizen" },
    ability: { pl: "Brak specjalnych umiejętności.", en: "No special abilities." },
    flavor: {
      pl: "Ale hej — przynajmniej nie musisz kłamać.",
      en: "But hey — at least you don't have to lie.",
    },
  },

  // ── MAFIA ────────────────────────────────────────────────────
  {
    id: "mafia_boss",
    faction: "mafia",
    card: "A♠",
    abilityTypes: ["night"],
    name: { pl: "Szef Mafii", en: "Mafia Boss" },
    ability: {
      pl: "Szef Szefów. Jeżeli Mafia nie może się zdecydować, kogo zabić w Nocy, to Szef wydaje ostateczny wyrok.",
      en: "The Boss of all Bosses. If the Mafia can't agree on who to kill during the Night, the Mafia Boss passes the final death sentence.",
    },
    flavor: { pl: "Cisza zapada natychmiast.", en: "Silence falls at once." },
  },
  {
    id: "blackmailer",
    faction: "mafia",
    card: "K♠",
    abilityTypes: ["start"],
    name: { pl: "Szantażysta", en: "Blackmailer" },
    ability: {
      pl: "Zerowej Nocy, Szantażysta wybiera jedną osobę do szantażowania. Wybrana osoba poznaje tożsamość Szantażysty, i od teraz nie może działać przeciwko niemu do końca swojego marnego życia.",
      en: "On Night Zero, the Blackmailer chooses one person to blackmail. The chosen person learns the Blackmailer's identity and, from then on, cannot act against the Blackmailer for the rest of their sorry life.",
    },
    flavor: {
      pl: "Uśmiechnąłeś się tylko raz. To wystarczyło.",
      en: "You smiled just once. That was enough.",
    },
  },
  {
    id: "coquette",
    faction: "mafia",
    card: "Q♠",
    abilityTypes: ["checking"],
    name: { pl: "Kokietka", en: "Coquette" },
    ability: {
      pl: "Gdy ktokolwiek sprawdza, do jakiej Frakcji przynależy, zostaje wykryta jako członkini Miasta. W rzeczywistości, należy do Mafii.",
      en: "Whenever the Coquette gets her Faction revealed, she comes up as a member of the City. In reality, she belongs to the Mafia.",
    },
    flavor: {
      pl: "Urok czasem działa lepiej niż nóż.",
      en: "Charm often works better than a knife.",
    },
  },
  {
    id: "janitor",
    faction: "mafia",
    card: "J♠",
    abilityTypes: ["night", "oneTime"],
    name: { pl: "Woźny", en: "Janitor" },
    ability: {
      pl: "Podczas Nocnej zmiany w ratuszu, Woźny może zamieść brudy Mafii pod dywan. Przez cały następny Dzień nikt nie może poznać statystyk. Może to zrobić tylko raz.",
      en: "During the Night shift at the city hall, the Janitor can sweep the Mafia's dirt under the rug. For the entirety of the next Day, no one can learn the stats. They can do this only once.",
    },
    flavor: {
      pl: "Niektóre papiery po prostu znikają.",
      en: "Some papers simply vanish.",
    },
  },
  {
    id: "mafioso",
    faction: "mafia",
    card: "4♠ / 3♠ / 2♠",
    cards: ["4♠", "3♠", "2♠"],
    centerCard: "2♠",
    abilityTypes: ["none"],
    name: { pl: "Mafioso", en: "Mafioso" },
    ability: { pl: "Brak specjalnych umiejętności.", en: "No special abilities." },
    flavor: {
      pl: "Ale hej — wciąż możesz kogoś wrobić.",
      en: "But hey — you can still frame someone.",
    },
  },
  {
    id: "blackmailer_boss",
    faction: "mafia",
    card: "A♠ / K♠",
    cards: ["A♠ / K♠"],
    centerCard: "A♠",
    abilityTypes: ["start", "night"],
    name: { pl: "Szef Szantażysta", en: "Blackmailing Boss" },
    ability: {
      pl: "Zerowej Nocy wybiera jedną osobę do szantażowania. Wybrana osoba poznaje tożsamość Szantażysty, i od teraz nie może działać przeciwko niemu. Jeżeli Mafia nie może się zdecydować, kogo zabić w Nocy, to Szef wydaje ostateczny wyrok.",
      en: "On Night Zero, the Blackmailer Boss chooses one person to blackmail. The chosen person learns BB's identity and, from then on, cannot act against them. If the Mafia can't agree on who to kill during the Night, BB passes the final death sentence.",
    },
    flavor: { pl: "Nie daj się zabić.", en: "Just don't get yourself killed." },
    note: {
      pl: "połączenie Szefa Mafii i Szantażysty - użyteczna by lepiej zbalansować Frakcje - upewnij się, że w puli dostępnych Postaci nie ma równocześnie żadnej z tych dwóch Postaci i Szefa Szantażysty.",
      en: "a fusion of the Mafia Boss and the Blackmailer - useful for better Faction balance - make sure the pool of available characters doesn't include either of those two characters at the same time as the Blackmailing Boss.",
    },
  },

  // ── SYNDICATE ────────────────────────────────────────────────
  {
    id: "angel_of_death",
    faction: "syndicate",
    card: "A♣",
    abilityTypes: ["night"],
    name: { pl: "Anioł Śmierci", en: "Angel of Death" },
    ability: {
      pl: "Każdej Nocy Anioł Śmierci wybiera jedną osobę do naznaczenia. Osoba naznaczona po raz drugi umiera. Naznaczeni nie wiedzą, że...",
      en: "Every Night, the Angel of Death chooses one person to mark. A person marked for the second time dies. Those who were marked don't know that…",
    },
    flavor: {
      pl: "...Śmierć depcze im po piętach…",
      en: "…Death is treading on their heels…",
    },
  },
  {
    id: "bartender",
    faction: "syndicate",
    card: "8♣",
    abilityTypes: ["night", "oneTime"],
    name: { pl: "Barman", en: "Bartender" },
    ability: {
      pl: "Podczas Nocnej zmiany na barze, Barman może upić Mafię. Cel Mafii jest wtedy przesuwany o jedną osobę we wskazaną przez Barmana stronę. Tylko Barman wie, kiedy naprawdę dolewasz Mafii do kielicha. Może to zrobić tylko raz.",
      en: "During the Night shift behind the bar, the Bartender can get the Mafia drunk. The Mafia's target is then shifted by one person in the direction the Bartender chooses. Only the Bartender knows when Mafia's glass is actually topped up. They can do this only once.",
    },
    flavor: {
      pl: "Pić do lustra nie wypada - lepiej podejść do sąsiada.",
      en: "\"C'mon! Won't you drink with your neighbor?\"",
    },
  },
  {
    id: "mayor",
    faction: "syndicate",
    card: "K♣",
    abilityTypes: ["posthumous", "voting"],
    name: { pl: "Burmistrz", en: "Mayor" },
    ability: {
      pl: "Jeżeli głosowanie kończy się eliminacją Burmistrza, wszyscy, którzy na niego głosowali, również giną.",
      en: "If a vote ends with the Mayor's elimination, everyone who voted for the Mayor dies as well.",
    },
    flavor: {
      pl: "Tu nigdy nie chodziło o demokrację.",
      en: "It was never about democracy.",
    },
  },
  {
    id: "bomber",
    faction: "syndicate",
    card: "10♣",
    abilityTypes: ["posthumous"],
    name: { pl: "Terrorysta", en: "Bomber" },
    ability: {
      pl: "Jeżeli Terrorysta zginie, w jakikolwiek sposób, osoba siedząca po lewej stronie Terrorysty umiera razem z nim.",
      en: "If the Bomber dies, in any way whatsoever, the person sitting to the Bomber's left dies as well.",
    },
    flavor: { pl: "*Bum.*", en: "*Boom.*" },
  },
  {
    id: "bomber_plus",
    faction: "syndicate",
    card: "10♣",
    abilityTypes: ["posthumous"],
    name: { pl: "Terrorysta+", en: "Bomber+" },
    ability: {
      pl: "Jeżeli Terrorysta+ zginie, w jakikolwiek sposób, osoby siedzące po obydwu stronach Terrorysty umierają razem z nim.",
      en: "If the Bomber+ dies, in any way whatsoever, the people sitting on both sides of the Bomber die as well.",
    },
    flavor: { pl: "*BUM!*", en: "*BOOM!*" },
  },
  {
    id: "chairmans_daughter",
    faction: "syndicate",
    card: "Q♣",
    abilityTypes: ["day", "voting", "oneTime"],
    name: { pl: "Córcia Prezesa", en: "Chairman's Daughter" },
    ability: {
      pl: "Tuż po głosowaniu, może wstać i ogłosić się Córcią Prezesa. Jej głos liczy się wtedy podwójnie. Możesz to zrobić tylko raz.",
      en: "Right after the vote, she may stand up and declare herself as the Chairman's Daughter. Her vote then counts double. You can do this only once.",
    },
    flavor: {
      pl: "Nikt nie śmie Cię podważyć.",
      en: "No one dares to question you.",
    },
  },
];

export const factionOrder: Faction[] = ["city", "mafia", "syndicate"];

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

// Sorts a hand: rank Ace→2, hearts before diamonds before spades before clubs.
export function compareByCard(a: Character, b: Character) {
  return (
    orderIndex(rankOrder, cardRank(a.card)) - orderIndex(rankOrder, cardRank(b.card)) ||
    orderIndex(suitOrder, cardSuit(a.card)) - orderIndex(suitOrder, cardSuit(b.card))
  );
}
