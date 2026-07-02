// Site copy: UI strings, rules prose, glossary, edge cases and the
// example-set tables. All bilingual, matching rules-pl.md / rules-en.md verbatim.
import type { AbilityType, Bilingual } from "./characters";

export const ui = {
  title: { pl: "Mafia+", en: "Mafia+" },
  tagline: {
    pl: "Rozszerzona wersja klasycznej gry towarzysko-detektywistycznej.",
    en: "An extended take on a classic social deduction game.",
  },
  intro: {
    pl: "Rozszerzona wersja klasycznej gry towarzysko-detektywistycznej.",
    en: "An extended take on a classic social deduction game.",
  },
  nav: {
    characters: { pl: "Postacie", en: "Characters" },
    rules: { pl: "Zasady", en: "Rules" },
    setup: { pl: "Przykładowe Zestawy Kart Postaci", en: "Example Character Card Sets" },
    edgeCases: { pl: "Skrajne scenariusze", en: "Edge Cases" },
    downloads: { pl: "Materiały do pobrania", en: "Downloadable content" },
  },
  cardLabel: { pl: "Karta", en: "Card" },
  flipHint: { pl: "Kliknij, by obrócić", en: "Click to flip" },
  headings: {
    abilityKinds: { pl: "Rodzaje Umiejętności", en: "Types of Abilities" },
    checking: { pl: "Sprawdzanie Frakcji", en: "Faction Reveal" },
    glossary: { pl: "Słowniczek", en: "Glossary" },
  },
  exampleSets: {
    showMore: { pl: "Pokaż wszystkie zestawy", en: "Show all sets" },
    showLess: { pl: "Pokaż mniej", en: "Show fewer" },
  },
  footer: {
    pl: "Hobbystyczny projekt — autorska wersja Mafii rozwijana z przyjaciółmi przez lata.",
    en: "A hobby project — a homemade take on Mafia, refined with friends over the years.",
  },
} satisfies Record<string, Bilingual | Record<string, Bilingual>>;

// Home-page section rail: in-page anchors with concise labels for the header's
// contextual tier. Ids match the <section> ids on the index page.
export const sectionNav: { id: string; label: Bilingual }[] = [
  { id: "characters", label: ui.nav.characters },
  { id: "rules", label: ui.nav.rules },
  { id: "setup", label: { pl: "Przykładowe zestawy", en: "Example Sets" } },
  { id: "edge-cases", label: ui.nav.edgeCases },
];

// Downloads page copy.
export const downloadsCopy = {
  download: { pl: "Pobierz", en: "Download" },
  downloading: { pl: "Pobieranie…", en: "Downloading…" },
  fileLabels: {
    pl: { pl: "Zasady — wersja polska", en: "Rules — Polish version" },
    en: { pl: "Zasady — wersja angielska", en: "Rules — English version" },
  },
} satisfies Record<string, unknown>;

// ── Rules ──────────────────────────────────────────────────────
// A section is a sequence of paragraphs and bullet lists, optionally
// followed by a styled example call-out and footnotes.
export type RuleBlock = { p: Bilingual } | { list: Bilingual[] };

export interface RuleSection {
  id: string;
  heading: Bilingual;
  blocks: RuleBlock[];
  example?: Bilingual[];
  footnotes?: Bilingual[];
}

export const ruleSections: RuleSection[] = [
  {
    id: "goal",
    heading: { pl: "Cel gry", en: "Objective" },
    blocks: [
      {
        p: {
          pl: "Gracze wcielają się w tajemnicze Postacie należące do jednej z trzech Frakcji. W każdej rozgrywce obowiązkowo występują dwie Podstawowe Frakcje:",
          en: "Players take on mysterious characters belonging to one of three Factions. Every game always features two Core Factions:",
        },
      },
      {
        list: [
          {
            pl: "Miasto – uczciwi ludzie próbujący przetrwać i zarazem wyplenić całe plugastwo tej betonowej dżungli – Mafię.",
            en: "City – honest folk trying to survive while rooting out all the filth festering in this concrete jungle: the Mafia.",
          },
          {
            pl: "Mafia – działający w ukryciu gangsterzy, starający się sprzątnąć wszystkich zagrażających im osobników z Miasta.",
            en: "Mafia – gangsters working from the shadows, looking to whack anyone from the City who gets in their way.",
          },
        ],
      },
      {
        p: {
          pl: "Opcjonalnie, dla bardziej zaawansowanych graczy, istnieje możliwość gry z trzecią, Dodatkową Frakcją:",
          en: "Optionally, for more advanced players, you can play with a third, Additional Faction:",
        },
      },
      {
        list: [
          {
            pl: "Syndykat – tajemnicza organizacja grająca na własnych zasadach. Nie dbają o żadną stronę konfliktu i wygrywają niezależnie od reszty, jeżeli przetrwają do końca gry.",
            en: "Syndicate – a shadowy organization that plays by its own rules. They care nothing for either side of the conflict and win independently of everyone else, as long as they survive to the end of the game.",
          },
        ],
      },
      {
        p: {
          pl: "Celem Miasta jest eliminacja Mafii, a celem Mafii – eliminacja Miasta. Syndykat… no cóż, dobrze się bawi i wygrywa, jeżeli przetrwa do końca gry. Gra kończy się w momencie, gdy wszyscy gracze jednej z Podstawowych Frakcji zostaną wyeliminowani.",
          en: "The City's goal is to eliminate the Mafia, and the Mafia's goal is to eliminate the City. The Syndicate… well, it just has a good time and wins if it survives to the end of the game. The game ends the moment every player of one of the Core Factions has been eliminated.",
        },
      },
    ],
  },
  {
    id: "setup",
    heading: { pl: "Przygotowanie do gry", en: "Game Setup" },
    blocks: [
      {
        p: {
          pl: "Gra wymaga jednej osoby, która poprowadzi rozgrywkę – Mistrza Gry (MG). Początkowo, należy wspólnie wybrać tyle Kart Postaci, ile jest graczy, nie wliczając MG (patrz niżej: Zestawy Postaci). MG tasuje wybrane Karty Postaci i rozdaje je po jednej każdemu graczowi. !Uwaga: potajemnie, nikt nie może zobaczyć cudzej karty.",
          en: "The game needs one person to run it – the Game Master (GM). To begin, the group together picks as many Character Cards as there are players, not counting the GM (see below: Character Sets). The GM shuffles the chosen Character Cards and deals one to each player. !Note: do this in secret — no one may see anyone else's card.",
        },
      },
      {
        p: {
          pl: "W puli wszystkich dostępnych Postaci większość jest unikalnych, które posiadają specjalne umiejętności. Istnieją również Postacie bez żadnych umiejętności, a tych natomiast może być równocześnie kilka w danej rozgrywce.",
          en: "Nearly all Characters in the full pool are unique and have special abilities. There are also Characters with no abilities at all, and several of those may appear in the same game at once.",
        },
      },
    ],
  },
  {
    id: "night",
    heading: { pl: "Noc", en: "Night" },
    blocks: [
      {
        p: {
          pl: "Gra rozpoczyna się od tzw. Nocy Zerowej – nikt wtedy nie ginie, ani nawet nie rozmawia. Ta Noc służy wyłącznie do tego, by gracze z Mafii poznali się nawzajem, oraz by Postacie z umiejętnościami startowymi skorzystali z nich.",
          en: "The game opens with the so-called Night Zero – no one dies, and no one even speaks. This Night serves two purposes: to let the Mafia players get to know one another, and to let Characters with opening abilities use them.",
        },
      },
      {
        p: {
          pl: "MG wydaje polecenie, by wszyscy zasnęli, a następnie nakazuje wybudzić się Mafii. Mafia po cichu się wykonuje polecenie, oraz rozglądając się, poznaje pozostałych członków – MG również wskazuje, kto jest Szefem Mafii (to ważne, bo to właśnie osoba z tą Postacią podejmuje ostateczne decyzje związane z Mafią).",
          en: "The GM orders everyone to fall asleep, then calls the Mafia to wake. The Mafia quietly comply and, looking around, learn who the other members are – the GM also points out who the Mafia Boss is (this matters, because the player on that Character makes the final Mafia decisions).",
        },
      },
      {
        p: {
          pl: "Następnie MG wybudza Postacie z umiejętnościami startowymi, po jednej naraz, by z nich skorzystały.",
          en: "Next, the GM wakes the Characters with opening abilities, one at a time, so they can use them.",
        },
      },
      {
        p: {
          pl: "W każdą kolejną Noc MG wybudza Mafię, która wybiera jednego gracza do wyeliminowania z gry, a później kolejno wszystkie Postacie z umiejętnościami nocnymi są pojedynczo wybudzane. Wszelkie akcje nocne muszą być wykonywane po cichu i sygnalizowane ruchem ręki lub głową.",
          en: "On every following Night, the GM wakes the Mafia, who choose one player to eliminate from the game, and then, one by one, every character with a Night ability gets woken up. All night actions must be carried out silently and signaled with a hand gesture or a head nod.",
        },
      },
    ],
    example: [
      { pl: "Jest Noc, wszyscy śpią", en: "It's Night, everyone is asleep" },
      {
        pl: "MG: „Budzi się Lekarz, i wybiera osobę do leczenia.”",
        en: "GM: \"The Doctor wakes and chooses someone to heal.\"",
      },
      {
        pl: "Lekarz otwiera oczy, a następnie po cichu wskazuje kogoś ręką",
        en: "The Doctor opens their eyes, then silently points at someone with their hand",
      },
      {
        pl: "MG: „Dziękuję. Ta osoba może dzisiaj spać spokojnie. Lekarz idzie spać.”",
        en: "GM: \"Thank you. That person can sleep soundly tonight. The Doctor goes back to sleep.\"",
      },
      { pl: "Lekarz zamyka oczy", en: "The Doctor closes their eyes" },
    ],
  },
  {
    id: "day",
    heading: { pl: "Dzień", en: "Day" },
    blocks: [
      {
        p: {
          pl: "Pierwszy Dzień, następujący zaraz po Nocy Zerowej, rozpoczyna się od ogłoszenia statystyk początkowych przez MG.",
          en: "The first Day, coming right after Night Zero, begins with the GM announcing the starting stats.",
        },
      },
      {
        p: {
          pl: "W każdy kolejny Dzień, pierwszą rzeczą jaką komunikuje MG, to kto został wyeliminowany Nocą. Następnie ogłaszane są aktualne statystyki. Podczas Dnia, w jakimkolwiek momencie, każdy może się zapytać MG, jakie są obecne statystyki, lub jakie były statystyki początkowe.",
          en: "On every following Day, the first thing the GM reports is who was eliminated during the Night. The current stats are then announced. At any point during the Day, anyone may ask the GM what the current stats are, or what the starting stats were.",
        },
      },
      {
        p: {
          pl: "Podczas Dnia gracze rozmawiają, ustalają kto jest podejrzany i rzucają oskarżenia. Na sam koniec Dnia następuje wspólne głosowanie. Dzień również kończy się natychmiast, w momencie w którym ktokolwiek, w jakikolwiek sposób, zostanie wyeliminowany.",
          en: "During the Day, players talk, work out who's suspicious, and throw out accusations. At the very end of the Day comes a group vote. The Day also ends immediately the moment anyone, in any way whatsoever, is eliminated.",
        },
      },
    ],
  },
  {
    id: "voting",
    heading: { pl: "Głosowanie", en: "Voting" },
    blocks: [
      {
        p: {
          pl: "Głosowanie musi nastąpić na koniec każdego Dnia. Jest to jedyny sposób, niezwiązany z umiejętnościami Postaci, w jaki Miasto może kogoś wyeliminować. Każdy może oskarżyć kogoś jako podejrzanego, w celu sprawdzenia bądź eliminacji. Oskarżony ma prawo się bronić. MG decyduje o zakończeniu obrad i rozpoczęciu głosowania. Głosowanie jest jawne* – MG pyta po kolei każdego gracza, na kogo pragną oddać głos. W momencie, gdy większość głosów wskaże jedną osobę – zostaje ona wyeliminowana. W przypadku remisu, MG prosi graczy o ponowną debatę, potencjalnie zawężając listę oskarżonych.",
          en: "Voting must take place at the end of each Day. It is the only way, unrelated to any character's abilities, for the City to eliminate someone. Anyone may accuse someone as a suspect, either to reveal or to eliminate them. The accused have the right to defend themselves. The GM decides when the discussion ends and the vote begins. Voting is open* – the GM asks each player who they wish to cast their vote for. In the case of majority of votes landing on one person, that person is eliminated. In the event of a tie, the GM asks the players to debate again, potentially narrowing down the list of the accused.",
        },
      },
      {
        p: {
          pl: "Istnieje również możliwość przeprowadzenia głosowania o sprawdzenie, zamiast eliminacji – ale tylko Jeżeli MG na to pozwoli, wedle jego uznania**. Przykładowa sytuacja, kiedy warto, by MG zaproponował przeprowadzenie głosowania o sprawdzenie, to pierwszy Dzień, gdy gracze jeszcze nie są do końca niczego pewni, lub po nastąpieniu remisu w zwykłym głosowaniu.",
          en: "It's also possible to hold a vote to reveal instead of to eliminate – but only if the GM allows it, at their discretion**. A good example of when the GM might suggest a vote to investigate is the first Day, when players aren't yet sure of anything, or after a tie in a regular vote.",
        },
      },
    ],
    footnotes: [
      {
        pl: "* Można również przeprowadzić głosowanie niejawne, na przykład przy użyciu kartek i długopisów.",
        en: "* You can also hold a secret vote, for example using slips of paper and pens.",
      },
      {
        pl: "** Ironią jest fakt, iż aby wspólnie zdecydować o zmianie sposobu głosowania, jest przeprowadzenie… głosowania.",
        en: "** The irony, of course, is that to collectively decide on changing the voting method, you have to hold… a vote.",
      },
    ],
  },
];

// ── Ability kinds ─────────────────────────────────────────────
// Mirrors the markdown "Types of Abilities" list. The trailing "none"
// entry is label-only, so its description is intentionally empty.
export const abilityKinds: { key: AbilityType; desc: Bilingual }[] = [
  { key: "start", desc: { pl: "aktywowana tylko raz, podczas Nocy Zerowej.", en: "activated only once, during Night Zero." } },
  { key: "night", desc: { pl: "może być aktywowana wyłącznie w trakcie Nocy.", en: "can only be activated during the Night." } },
  { key: "day", desc: { pl: "może być aktywowana wyłącznie w trakcie Dnia.", en: "can only be activated during the Day." } },
  { key: "oneTime", desc: { pl: "można z niej skorzystać tylko raz w całej grze.", en: "can be used only once per game." } },
  { key: "voting", desc: { pl: "wpływa na głosowanie.", en: "affects the vote." } },
  { key: "checking", desc: { pl: "ma związek ze sprawdzaniem.", en: "related to revealing." } },
  { key: "posthumous", desc: { pl: "aktywuje się sama, w chwili śmierci jej właściciela.", en: "triggers on its own the moment its owner dies." } },
  { key: "none", desc: { pl: "", en: "" } },
];

// ── Faction-check gestures ────────────────────────────────────
export const checkGestures: { emoji: string; label: Bilingual }[] = [
  { emoji: "👍", label: { pl: "kciuk w górę oznacza przynależność tej osoby do Miasta,", en: "thumbs up means that the given person belongs to the City," } },
  { emoji: "👉", label: { pl: "kciuk w bok oznacza przynależność tej osoby do Syndykatu,", en: "thumb sideways means that the given person belongs to the Syndicate," } },
  { emoji: "👎", label: { pl: "kciuk w dół oznacza przynależność tej osoby do Mafii.", en: "thumbs down means that the given person belongs to the Mafia." } },
];
export const checkGestureIntro: Bilingual = {
  pl: "Gdy w jakikolwiek sposób sprawdzana jest kogoś przynależność do Frakcji, MG pokaże wynik sprawdzenia za pomocą gestu kciukiem, niczym Cezar w starożytnym Rzymie:",
  en: "Whenever someone's Faction is revealed in any way, the GM shows the reveals the Faction with a thumb gesture, just like Caesar in ancient Rome would:",
};

// ── Glossary ──────────────────────────────────────────────────
export const glossary: { term: Bilingual; def: Bilingual }[] = [
  {
    term: { pl: "eliminacja", en: "elimination" },
    def: { pl: "usunięcie gracza z gry. Po eliminacji danego gracza, nie może się on odzywać do końca gry.", en: "removing a player from the game. Once eliminated, a player may not speak for the rest of the game." },
  },
  {
    term: { pl: "statystyki", en: "stats" },
    def: { pl: "liczebność obecnie żyjących graczy w każdej z Frakcji. Przykładowo, Jeżeli w grze w danym momencie żyje 6 osób z Miasta, 2 osoby z Mafii i 3 osoby z Syndykatu, statystyki będą brzmieć „6-2-3”.", en: "the number of players currently alive in each Faction. For example, if at a given moment 6 people from the City, 2 from the Mafia, and 3 from the Syndicate are alive, the stats read \"6-2-3\"." },
  },
  {
    term: { pl: "statystyki początkowe", en: "starting stats" },
    def: { pl: "liczebność Frakcji na początku gry.", en: "the size of each Faction at the start of the game." },
  },
  {
    term: { pl: "spanie / zasypianie", en: "sleeping / falling asleep" },
    def: { pl: "mowa jest o spaniu, gdy gracz ma zamknięte oczy. Zasypianie to zamknięcie oczu, dopóki MG nie oznajmi, że można je otworzyć.", en: "we speak of sleeping when a player has their eyes closed. Falling asleep means closing your eyes until the GM announces they may be opened." },
  },
  {
    term: { pl: "wybudzanie", en: "waking" },
    def: { pl: "otworzenie oczu na polecenie MG.", en: "opening your eyes on the GM's command." },
  },
  {
    term: { pl: "głosowanie", en: "voting" },
    def: { pl: "następuje na koniec każdego Dnia. Gdy MG ogłosi, że zaczyna się głosowanie, każdy może wytypować oskarżonego, który według niego powinien pójść na szafot.", en: "takes place at the end of every Day. When the GM announces that voting begins, anyone may name an accused they believe should walk the plank." },
  },
  {
    term: { pl: "oskarżenie", en: "accusation" },
    def: { pl: "wytypowanie kogoś w trakcie głosowania jako podejrzanego.", en: "naming someone as a suspect during voting." },
  },
  {
    term: { pl: "sprawdzenie", en: "revealing" },
    def: { pl: "akcja ujawnienia przez MG kogoś przynależności do Frakcji.", en: "the act of the GM revealing someone's Faction." },
  },
];

// ── Edge cases ────────────────────────────────────────────────
export const edgeCases: { q: Bilingual; a: Bilingual }[] = [
  {
    q: { pl: "Gdy Lekarz kogoś leczy, a ta osoba tej samej Nocy została naznaczona drugi raz przez Anioła Śmierci, czy ta osoba zostaje wyeliminowana?", en: "When the Doctor heals someone, but that same Night the person is marked for the second time by the Angel of Death, are they eliminated?" },
    a: { pl: "TAK.", en: "YES." },
  },
  { q: { pl: "Czy Lekarz może leczyć sam siebie?", en: "Can the Doctor heal themselves?" }, a: { pl: "TAK.", en: "YES." } },
  { q: { pl: "Czy Lekarz może leczyć tę samą osobę więcej niż jeden raz?", en: "Can the Doctor heal the same person more than once?" }, a: { pl: "TAK.", en: "YES." } },
  { q: { pl: "Czy Kolejarz może wywieźć sam siebie?", en: "Can the Railwayman ship themselves out of town?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Czy Detektyw może sprawdzić sam siebie?", en: "Can the Detective investigate themselves?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Czy Detektyw może sprawdzić osobę wywiezioną przez Kolejarza?", en: "Can the Detective investigate a person shipped out by the Railwayman?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Czy Ochroniarz może ochraniać sam siebie?", en: "Can the Bodyguard protect themselves?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Czy Świr może strzelić do siebie?", en: "Can the Loose Cannon shoot themselves?" }, a: { pl: "TAK. (po co? nie wiem, ale może)", en: "YES. (why? no idea, but they can)" } },
  { q: { pl: "Czy osoba szantażowana może zagłosować przeciw Szantażyście, Jeżeli głosowanie jest niejawne?", en: "Can a blackmailed person vote against the Blackmailer if the vote is secret?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Czy Szantażysta może szantażować sam siebie?", en: "Can the Blackmailer blackmail themselves?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Czy Panna Lekkich Obyczajów może Zerowej Nocy sprawdzić sama siebie?", en: "Can the Lady of the Night check herself on Night Zero?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Gdy Mafia strzeli w Nocy w Świętego, który wciąż ma dwa życia, a równocześnie jest leczony przez Lekarza, czy traci swoje pierwsze życie?", en: "When the Mafia shoots the Saint during the Night, while the Saint still has two lives and is being healed by the Doctor at the same time, do they lose their first life?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Gdy Mafia strzeli w Nocy w Świętego, który wciąż ma dwa życia, a równocześnie jest chroniony przez Ochroniarza, co się dzieje?", en: "When the Mafia shoots the Saint during the Night, while the Saint still has two lives and is being protected by the Bodyguard at the same time, what happens?" }, a: { pl: "OCHRONIARZ ZOSTAJE WYELIMINOWANY. ŚWIĘTY NIE TRACI ŻYCIA.", en: "THE BODYGUARD IS ELIMINATED. THE SAINT LOSES NO LIFE." } },
  { q: { pl: "Gdy Świr strzeli w Świętego, który wciąż ma dwa życia, a równocześnie jest chroniony przez Ochroniarza, co się dzieje?", en: "When the Loose Cannon shoots the Saint, who still has two lives, while being protected by the Bodyguard at the same time, what happens?" }, a: { pl: "OCHRONIARZ ZOSTAJE WYELIMINOWANY. ŚWIĘTY NIE TRACI ŻYCIA.", en: "THE BODYGUARD IS ELIMINATED. THE SAINT LOSES NO LIFE." } },
  { q: { pl: "Gdy Mafia strzeli w Nocy w kogoś, kto jest chroniony przez Ochroniarza, a Lekarz uleczył tej samej Nocy Ochroniarza, co się dzieje?", en: "When the Mafia shoots someone during the Night who is protected by the Bodyguard, and the Doctor healed the Bodyguard that same Night, what happens?" }, a: { pl: "NIKT NIE ZOSTAJE WYELIMINOWANY.", en: "NO ONE IS ELIMINATED." } },
  { q: { pl: "Gdy Mafia strzela do kogoś leczonego przez Lekarza, kto jest równocześnie chroniony przez Ochroniarza, co się dzieje?", en: "When the Mafia shoots someone being healed by the Doctor who is at the same time protected by the Bodyguard, what happens?" }, a: { pl: "NIKT NIE ZOSTAJE WYELIMINOWANY", en: "NO ONE IS ELIMINATED" } },
  { q: { pl: "Czy Anioł Śmierci może naznaczać sam siebie?", en: "Can the Angel of Death mark themselves?" }, a: { pl: "TAK. (po co? nie wiem, ale może)", en: "YES. (why? no idea, but they can)" } },
  { q: { pl: "Ile razy Anioł Śmierci musi naznaczyć Świętego, żeby został wyeliminowany?", en: "How many times must the Angel of Death mark the Saint for them to be eliminated?" }, a: { pl: "4", en: "4" } },
  { q: { pl: "Czy Ochroniarz ochrania przed drugim naznaczeniem Anioła Śmierci?", en: "Does the Bodyguard protect against the Angel of Death's second mark?" }, a: { pl: "NIE.", en: "NO." } },
  { q: { pl: "Gdy Barman przesunie kulę Mafii, a kula trafi na osobę wywiezioną przez Kolejarza, co się dzieje?", en: "When the Bartender shifts the Mafia's bullet and it lands on a person shipped out by the Railwayman, what happens?" }, a: { pl: "NIKT NIE ZOSTAJE WYELIMINOWANY.", en: "NO ONE IS ELIMINATED." } },
  { q: { pl: "Czy Ochroniarz chroni przed wysadzeniem się w powietrze Terrorysty?", en: "Does the Bodyguard protect against the Bomber blowing themselves up?" }, a: { pl: "TAK.", en: "YES." } },
  { q: { pl: "Prezes oraz Córcia Prezesa mogą użyć swojej umiejętności podczas, lub „tuż po” głosowaniu. Do konkretnie którego momentu te Postacie mogą użyć swoich umiejętności?", en: "The Chairman and Chairman's Daughter can use their ability during, or \"right after,\" the vote. Up to exactly which moment can these characters use their abilities?" }, a: { pl: "DOPÓKI MISTRZ GRY NIE WYKONA WYROKU", en: "UNTIL THE GAME MASTER CARRIES OUT THE SENTENCE" } },
  { q: { pl: "Jeżeli Terrorysta umrze, a obok siebie ma osobę wywiezioną przez Kolejarza, co się dzieje?", en: "If the Bomber dies and the person next to them has been shipped out by the Railwayman, what happens?" }, a: { pl: "NIKT NIE ZOSTAJE WYELIMINOWANY Z TEJ STRONY.", en: "NO ONE IS ELIMINATED ON THAT SIDE." } },
  { q: { pl: "Jeżeli Terrorysta umrze, a obok siebie ma osobę która już jest wyeliminowana, co się dzieje?", en: "If the Bomber dies and the person next to them is already eliminated, what happens?" }, a: { pl: "ZOSTAJE WYELIMINOWANA NAJBLIŻSZA ŻYJĄCA OSOBA Z TEJ STRONY", en: "THE NEAREST LIVING PERSON ON THAT SIDE IS ELIMINATED" } },
];

// ── Example character sets ─────────────────────────────────────
// Each lineup slot references character ids so names stay bilingual.
export type LineupItem =
  | { id: string } //                     a fixed character
  | { id: string; count: number } //      N copies of a character
  | { oneOf: string[] } //                a single slot, either-or
  | { anyOf: string[]; pick: number }; // pick N of these for the faction

export interface ExampleSet {
  players: number;
  stats: string;
  city: LineupItem[];
  mafia: LineupItem[];
  syndicate: LineupItem[];
}

const anySyndicate = ["bartender", "mayor", "bomber", "chairmans_daughter"];

export const exampleSets: ExampleSet[] = [
  {
    players: 6, stats: "4-2-0",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "poor_bloody_infantry" }],
    mafia: [{ id: "mafia_boss" }, { id: "coquette" }],
    syndicate: [],
  },
  {
    players: 7, stats: "4-2-1",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }],
    mafia: [{ id: "mafia_boss" }, { id: "coquette" }],
    syndicate: [{ anyOf: anySyndicate, pick: 1 }],
  },
  {
    players: 8, stats: "5-2-1",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }],
    mafia: [{ id: "blackmailer_boss" }, { id: "coquette" }],
    syndicate: [{ anyOf: anySyndicate, pick: 1 }],
  },
  {
    players: 9, stats: "5-2-2",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }],
    mafia: [{ id: "mafia_boss" }, { id: "coquette" }],
    syndicate: [{ anyOf: anySyndicate, pick: 2 }],
  },
  {
    players: 10, stats: "5-3-2",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { id: "saint" }],
    mafia: [{ id: "mafia_boss" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ anyOf: anySyndicate, pick: 2 }],
  },
  {
    players: 11, stats: "6-3-2",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { oneOf: ["railwayman", "chairman"] }],
    mafia: [{ id: "mafia_boss" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { anyOf: ["angel_of_death", "mayor", "bomber", "chairmans_daughter"], pick: 1 }],
  },
  {
    players: 12, stats: "6-3-3",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { oneOf: ["railwayman", "chairman"] }],
    mafia: [{ id: "mafia_boss" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { anyOf: ["angel_of_death", "mayor", "bomber", "chairmans_daughter"], pick: 2 }],
  },
  {
    players: 13, stats: "7-3-3",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { oneOf: ["railwayman", "chairman"] }, { id: "bodyguard" }],
    mafia: [{ id: "blackmailer_boss" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { anyOf: ["mayor", "bomber", "chairmans_daughter"], pick: 1 }],
  },
  {
    players: 14, stats: "7-3-4",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { oneOf: ["railwayman", "chairman"] }, { id: "bodyguard" }],
    mafia: [{ id: "blackmailer_boss" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { anyOf: ["mayor", "chairmans_daughter"], pick: 1 }],
  },
  {
    players: 15, stats: "8-3-4",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { id: "railwayman" }, { id: "chairman" }, { id: "bodyguard" }],
    mafia: [{ id: "blackmailer_boss" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { anyOf: ["mayor", "chairmans_daughter"], pick: 1 }],
  },
  {
    players: 16, stats: "8-4-4",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { id: "railwayman" }, { id: "chairman" }, { id: "saint" }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { anyOf: ["mayor", "chairmans_daughter"], pick: 1 }],
  },
  {
    players: 17, stats: "9-4-4",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { id: "railwayman" }, { id: "chairman" }, { id: "saint" }, { id: "bodyguard" }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { anyOf: ["mayor", "chairmans_daughter"], pick: 1 }],
  },
  {
    players: 18, stats: "9-4-5",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { oneOf: ["poor_bloody_infantry", "gun_shop_owner"] }, { id: "railwayman" }, { id: "chairman" }, { id: "saint" }, { id: "bodyguard" }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { id: "mayor" }, { id: "chairmans_daughter" }],
  },
  {
    players: 19, stats: "10-4-5",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { id: "poor_bloody_infantry" }, { id: "gun_shop_owner" }, { id: "railwayman" }, { id: "chairman" }, { id: "saint" }, { id: "bodyguard" }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { id: "mayor" }, { id: "chairmans_daughter" }],
  },
  {
    players: 20, stats: "10-5-5",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { id: "poor_bloody_infantry" }, { id: "gun_shop_owner" }, { id: "railwayman" }, { id: "chairman" }, { id: "bodyguard" }, { id: "citizen" }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }, { id: "mafioso" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { id: "mayor" }, { id: "chairmans_daughter" }],
  },
  {
    players: 21, stats: "11-5-5",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { id: "poor_bloody_infantry" }, { id: "gun_shop_owner" }, { id: "railwayman" }, { id: "chairman" }, { id: "bodyguard" }, { id: "citizen", count: 2 }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }, { id: "mafioso" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { id: "mayor" }, { id: "chairmans_daughter" }],
  },
  {
    players: 22, stats: "12-5-5",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { id: "poor_bloody_infantry" }, { id: "gun_shop_owner" }, { id: "railwayman" }, { id: "chairman" }, { id: "bodyguard" }, { id: "citizen", count: 3 }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }, { id: "mafioso" }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { id: "mayor" }, { id: "chairmans_daughter" }],
  },
  {
    players: 23, stats: "12-6-5",
    city: [{ id: "doctor" }, { id: "detective" }, { id: "lady_of_the_night" }, { id: "loose_cannon" }, { id: "poor_bloody_infantry" }, { id: "gun_shop_owner" }, { id: "railwayman" }, { id: "chairman" }, { id: "bodyguard" }, { id: "citizen", count: 3 }],
    mafia: [{ id: "mafia_boss" }, { id: "blackmailer" }, { id: "coquette" }, { id: "janitor" }, { id: "mafioso", count: 2 }],
    syndicate: [{ id: "bartender" }, { id: "angel_of_death" }, { id: "bomber_plus" }, { id: "mayor" }, { id: "chairmans_daughter" }],
  },
];

export const exampleSetsHeaders = {
  players: { pl: "Gracze", en: "Players" },
  stats: { pl: "Statystyki", en: "Stats" },
};

// Wording used in the table when a faction draws several characters from a pool.
export const exampleSetPoolPhrase: Record<number, Bilingual> = {
  2: { pl: "Dwie postacie z puli:", en: "Two characters from the pool:" },
};
