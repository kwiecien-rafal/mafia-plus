# Content and its the source of truth

Everything a human reads in the game is authored here as plain Markdown/YAML.
`src/data/load.ts` parses these files at build time into the shapes the site and
the downloadable rulebook consume, so this folder is the only place you edit
prose. After any change, run `npm run generate` to refresh `rules-{pl,en}.md`
(CI fails if you forget).

Bold, italic, underline and escaped literals work everywhere text appears:
`**bold**`, `*italic*`, `<u>underline</u>`, `\*` / `\_` for a literal asterisk
or underscore. Keep both languages saying the same thing. The download and the
on-page toggle read from the same strings.

## `characters/` - one file per character

Filename is the id (`doctor.md`); example sets reference it. All fields live in
the frontmatter:

```md
---
faction: city            # city | mafia | syndicate
card: K♥                 # rank + suit; drives sorting and the card corner
abilityTypes: [night]    # start | night | day | oneTime | voting | checking | posthumous | none
name:  { pl: Lekarz, en: Doctor }
ability:
  pl: "**Każdej Nocy** Lekarz wybiera **jedną osobę** do leczenia…"
  en: "**Every Night** the **Doctor** chooses **one person** to heal…"
flavor: { pl: Niech śpią spokojnie…, en: Let them sleep soundly… }
---
```

Optional: `cards` (multiple printed cards), `centerCard` (large rank shown in the
art), `note` (footnote line, bilingual), and `situational: true` to list an
optional/variant pick after the rest of its faction (page grid and rulebook
alike). To add a character, drop in a new file and, if it belongs in a lineup,
reference its id from an example set in `example-sets.yaml`.

## `rules/` — one Markdown file per section per language

Named `{id}.{pl,en}.md`. The body is ordinary Markdown prose; blank lines
separate blocks, and a run of `- ` lines becomes a bullet list. The two language
files for a section **must have the same block structure** (same number of
paragraphs and lists in the same order) — the loader zips them and errors loudly
if they diverge. Optional call-outs go in the frontmatter:

```md
---
heading: Night
example:                 # rendered as the styled "Example:" box
  - "*It's Night, everyone is asleep*"
  - '**GM**: "The Doctor wakes…"'
footnotes:               # small print under the section
  - "\\**You can also hold a secret vote.*"
---
The game opens with **Night Zero** – no one dies…

- a bullet, if the section needs one
```

Section order in the rulebook is fixed in `src/data/rulebook.ts` (which section
goes where), so filenames need no number prefix.

## `glossary.yaml` / `edge-cases.yaml` — bilingual lists

Short paired entries, in display order:

```yaml
# glossary.yaml
- term: { pl: eliminacja, en: elimination }
  def:  { pl: usunięcie gracza z gry…, en: removing a player from the game… }

# edge-cases.yaml
- q: { pl: Czy Lekarz może leczyć sam siebie?, en: Can the Doctor heal themselves? }
  a: { pl: TAK., en: YES. }
```

## The rest of the copy

- **`factions.yaml`** — each faction's `suit`, bilingual `name` and `blurb`.
- **`ability-types.yaml`** — ordered list of ability types; each has a `label`
  (the card badge) and a `desc` (its line in the "Types of Abilities" list).
- **`reveal.yaml`** — the faction-reveal `intro` and the thumb-`gestures` legend.
- **`example-sets.yaml`** — the lineup table. A slot is a bare character id, or a
  variant object: `{ oneOf: [...] }`, `{ anyOf: [...], pick: N }`, or
  `{ id: citizen, count: 2 }`. `headers` and `poolPhrases` hold the table copy.
- **`ui.yaml`** — every interface string: nav, headings, buttons, footer, the
  section rail and the downloads-page labels.

```yaml
# example-sets.yaml (one set)
- players: 8
  stats: "5-2-1"
  city: [doctor, detective, lady_of_the_night, loose_cannon, { oneOf: [poor_bloody_infantry, gun_shop_owner] }]
  mafia: [blackmailing_boss, coquette]
  syndicate: [{ anyOf: [bartender, mayor, bomber, chairmans_daughter], pick: 1 }]
```
